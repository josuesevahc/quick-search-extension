export function getProviderInitial(name: string): string {
  const trimmedName = name.trim();
  return trimmedName ? trimmedName[0].toLocaleUpperCase('en-US') : '?';
}
