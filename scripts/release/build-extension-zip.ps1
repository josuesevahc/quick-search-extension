param(
  [switch]$SkipChecks
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..")
$distRoot = Join-Path $repoRoot "dist"
$releaseRoot = Join-Path $repoRoot "release"
$manifestPath = Join-Path $distRoot "manifest.json"
$packagePath = Join-Path $repoRoot "package.json"
$stagingRoot = Join-Path $releaseRoot ".staging"

if (-not $SkipChecks) {
  & (Join-Path $PSScriptRoot "prepublish-check.ps1")
  if ($LASTEXITCODE -ne 0) {
    throw "Prepublish checks failed."
  }
}

if (-not (Test-Path -LiteralPath $manifestPath -PathType Leaf)) {
  throw "Missing manifest at expected package root: $manifestPath"
}
if (-not (Test-Path -LiteralPath $packagePath -PathType Leaf)) {
  throw "Missing package.json."
}

$packageJson = Get-Content -LiteralPath $packagePath -Raw | ConvertFrom-Json
$name = $packageJson.name
$version = $packageJson.version
if (-not $name -or -not $version) {
  throw "package.json must contain name and version."
}

$zipPath = Join-Path $releaseRoot "$name-$version.zip"
$forbiddenNames = @(
  ".git",
  "node_modules",
  "docs",
  "tests",
  "__tests__",
  ".vite",
  ".cache",
  "coverage",
  "playwright-report",
  "test-results"
)
$forbiddenExtensions = @(".env", ".pem", ".key", ".map", ".ts", ".tsx", ".md", ".log")
$forbiddenExact = @(
  "package.json",
  "package-lock.json",
  "tsconfig.json",
  "vite.config.ts",
  "vitest.config.ts",
  ".eslintrc.cjs",
  ".prettierrc.json"
)

New-Item -ItemType Directory -Force -Path $releaseRoot | Out-Null
if (Test-Path -LiteralPath $stagingRoot) {
  Remove-Item -LiteralPath $stagingRoot -Recurse -Force
}
New-Item -ItemType Directory -Force -Path $stagingRoot | Out-Null

$files = Get-ChildItem -LiteralPath $distRoot -Recurse -File -Force
foreach ($file in $files) {
  $relative = $file.FullName.Substring($distRoot.Length).TrimStart("\", "/")
  $parts = $relative -split "[\\/]+"

  foreach ($part in $parts) {
    if ($forbiddenNames -contains $part) {
      throw "Forbidden development path in dist: $relative"
    }
  }
  if ($forbiddenExact -contains $file.Name) {
    throw "Forbidden development file in dist: $relative"
  }
  if ($forbiddenExtensions -contains $file.Extension) {
    throw "Forbidden file extension in dist: $relative"
  }
  if ($file.Name -like ".env*") {
    throw "Forbidden environment file in dist: $relative"
  }

  $destination = Join-Path $stagingRoot $relative
  New-Item -ItemType Directory -Force -Path (Split-Path -Parent $destination) | Out-Null
  Copy-Item -LiteralPath $file.FullName -Destination $destination
}

if (-not (Test-Path -LiteralPath (Join-Path $stagingRoot "manifest.json") -PathType Leaf)) {
  throw "Staged package is missing manifest.json at the ZIP root."
}

if (Test-Path -LiteralPath $zipPath) {
  Remove-Item -LiteralPath $zipPath -Force
}

Compress-Archive -Path (Join-Path $stagingRoot "*") -DestinationPath $zipPath -Force
Remove-Item -LiteralPath $stagingRoot -Recurse -Force

Write-Host "Created $zipPath"
