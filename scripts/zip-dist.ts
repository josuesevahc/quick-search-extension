import { mkdir, readdir, readFile, stat, writeFile } from 'fs/promises';
import { basename, join, relative } from 'path';

const distDir = join(process.cwd(), 'dist');
const packageJson = JSON.parse(await readFile(join(process.cwd(), 'package.json'), 'utf-8')) as {
  name: string;
  version: string;
};
const outputDir = join(process.cwd(), 'release');
const outputPath = join(outputDir, `${packageJson.name}-${packageJson.version}.zip`);

type ZipEntry = {
  relativePath: string;
  data: Buffer;
  crc32: number;
  offset: number;
};

const crcTable = new Uint32Array(256);
for (let index = 0; index < 256; index += 1) {
  let value = index;
  for (let bit = 0; bit < 8; bit += 1) {
    value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  }
  crcTable[index] = value >>> 0;
}

function crc32(data: Buffer): number {
  let crc = 0xffffffff;
  for (const byte of data) {
    crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function getDosTimestamp(date: Date): { time: number; date: number } {
  const year = Math.max(date.getFullYear(), 1980);
  return {
    time: (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2),
    date: ((year - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate(),
  };
}

async function collectFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory);
  const files = await Promise.all(
    entries.map(async entry => {
      const fullPath = join(directory, entry);
      const info = await stat(fullPath);
      return info.isDirectory() ? collectFiles(fullPath) : [fullPath];
    })
  );

  return files.flat();
}

function createLocalHeader(entry: ZipEntry, modifiedAt: Date): Buffer {
  const pathBuffer = Buffer.from(entry.relativePath);
  const { time, date } = getDosTimestamp(modifiedAt);
  const header = Buffer.alloc(30 + pathBuffer.length);

  header.writeUInt32LE(0x04034b50, 0);
  header.writeUInt16LE(20, 4);
  header.writeUInt16LE(0, 6);
  header.writeUInt16LE(0, 8);
  header.writeUInt16LE(time, 10);
  header.writeUInt16LE(date, 12);
  header.writeUInt32LE(entry.crc32, 14);
  header.writeUInt32LE(entry.data.length, 18);
  header.writeUInt32LE(entry.data.length, 22);
  header.writeUInt16LE(pathBuffer.length, 26);
  header.writeUInt16LE(0, 28);
  pathBuffer.copy(header, 30);

  return header;
}

function createCentralHeader(entry: ZipEntry, modifiedAt: Date): Buffer {
  const pathBuffer = Buffer.from(entry.relativePath);
  const { time, date } = getDosTimestamp(modifiedAt);
  const header = Buffer.alloc(46 + pathBuffer.length);

  header.writeUInt32LE(0x02014b50, 0);
  header.writeUInt16LE(20, 4);
  header.writeUInt16LE(20, 6);
  header.writeUInt16LE(0, 8);
  header.writeUInt16LE(0, 10);
  header.writeUInt16LE(time, 12);
  header.writeUInt16LE(date, 14);
  header.writeUInt32LE(entry.crc32, 16);
  header.writeUInt32LE(entry.data.length, 20);
  header.writeUInt32LE(entry.data.length, 24);
  header.writeUInt16LE(pathBuffer.length, 28);
  header.writeUInt16LE(0, 30);
  header.writeUInt16LE(0, 32);
  header.writeUInt16LE(0, 34);
  header.writeUInt16LE(0, 36);
  header.writeUInt32LE(0, 38);
  header.writeUInt32LE(entry.offset, 42);
  pathBuffer.copy(header, 46);

  return header;
}

function createEndRecord(entryCount: number, centralSize: number, centralOffset: number): Buffer {
  const record = Buffer.alloc(22);
  record.writeUInt32LE(0x06054b50, 0);
  record.writeUInt16LE(0, 4);
  record.writeUInt16LE(0, 6);
  record.writeUInt16LE(entryCount, 8);
  record.writeUInt16LE(entryCount, 10);
  record.writeUInt32LE(centralSize, 12);
  record.writeUInt32LE(centralOffset, 16);
  record.writeUInt16LE(0, 20);
  return record;
}

const distInfo = await stat(distDir).catch(() => null);
if (!distInfo?.isDirectory()) {
  throw new Error('dist directory not found. Run npm run build before npm run zip.');
}

const modifiedAt = new Date();
const files = await collectFiles(distDir);
const entries: ZipEntry[] = [];
const localParts: Buffer[] = [];
let offset = 0;

for (const file of files) {
  const data = await readFile(file);
  const entry: ZipEntry = {
    relativePath: relative(distDir, file).replaceAll('\\', '/'),
    data,
    crc32: crc32(data),
    offset,
  };
  const localHeader = createLocalHeader(entry, modifiedAt);
  localParts.push(localHeader, data);
  offset += localHeader.length + data.length;
  entries.push(entry);
}

const centralParts = entries.map(entry => createCentralHeader(entry, modifiedAt));
const centralSize = centralParts.reduce((total, part) => total + part.length, 0);
const endRecord = createEndRecord(entries.length, centralSize, offset);

await mkdir(outputDir, { recursive: true });
await writeFile(outputPath, Buffer.concat([...localParts, ...centralParts, endRecord]));

console.log(`Created ${relative(process.cwd(), outputPath)} from ${basename(distDir)}.`);
