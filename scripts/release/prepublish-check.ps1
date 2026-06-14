Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..")
$distRoot = Join-Path $repoRoot "dist"
$manifestPath = Join-Path $distRoot "manifest.json"

function Invoke-Step {
  param(
    [Parameter(Mandatory = $true)][string]$Name,
    [Parameter(Mandatory = $true)][scriptblock]$Command
  )

  Write-Host "==> $Name"
  & $Command
  if ($LASTEXITCODE -ne 0) {
    throw "$Name failed with exit code $LASTEXITCODE."
  }
}

function Assert-NoForbiddenFiles {
  param([Parameter(Mandatory = $true)][string]$Root)

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

  $items = Get-ChildItem -LiteralPath $Root -Recurse -Force
  foreach ($item in $items) {
    $relative = Resolve-Path -LiteralPath $item.FullName -Relative
    if ($forbiddenNames -contains $item.Name) {
      throw "Forbidden development path in package output: $relative"
    }
    if (-not $item.PSIsContainer) {
      if ($forbiddenExact -contains $item.Name) {
        throw "Forbidden development file in package output: $relative"
      }
      if ($forbiddenExtensions -contains $item.Extension) {
        throw "Forbidden file extension in package output: $relative"
      }
      if ($item.Name -like ".env*") {
        throw "Forbidden environment file in package output: $relative"
      }
    }
  }
}

function Assert-NoForbiddenContent {
  param([Parameter(Mandatory = $true)][string]$Root)

  $patterns = @(
    "eval\s*\(",
    "new\s+Function\s*\(",
    "Function\s*\(",
    "importScripts\s*\(",
    "document\.write\s*\(",
    "chrome_settings_overrides",
    "chrome_url_overrides",
    "BEGIN [A-Z ]*PRIVATE KEY",
    "client_secret",
    "api[_-]?key",
    "password\s*[:=]",
    "token\s*[:=]",
    "localhost",
    "127\.0\.0\.1",
    "file://"
  )

  $textFiles = Get-ChildItem -LiteralPath $Root -Recurse -File -Force |
    Where-Object { $_.Extension -in @(".json", ".js", ".html", ".css", ".svg") }

  foreach ($file in $textFiles) {
    $content = Get-Content -LiteralPath $file.FullName -Raw
    foreach ($pattern in $patterns) {
      if ($content -cmatch $pattern) {
        $relative = Resolve-Path -LiteralPath $file.FullName -Relative
        throw "Forbidden or review-sensitive pattern '$pattern' found in $relative"
      }
    }
  }
}

Invoke-Step "npm audit" { npm audit }
Invoke-Step "unit tests" { npm test }
Invoke-Step "lint" { npm run lint }
Invoke-Step "production build" { npm run build }

if (-not (Test-Path -LiteralPath $manifestPath -PathType Leaf)) {
  throw "Missing manifest at expected package root: $manifestPath"
}

$manifest = Get-Content -LiteralPath $manifestPath -Raw | ConvertFrom-Json
if ($manifest.manifest_version -ne 3) {
  throw "manifest.json must use Manifest V3."
}
if (-not $manifest.background.service_worker) {
  throw "manifest.json must declare a Manifest V3 service worker."
}
if ($manifest.host_permissions -and $manifest.host_permissions.Count -gt 0) {
  throw "host_permissions must remain empty for this release."
}
if ($manifest.permissions -contains "tabs") {
  throw "The tabs permission is not required by the current implementation."
}
if ($manifest.PSObject.Properties.Name -contains "chrome_settings_overrides") {
  throw "Do not include chrome_settings_overrides in the current release."
}
if ($manifest.PSObject.Properties.Name -contains "chrome_url_overrides") {
  throw "Do not include chrome_url_overrides in the current release."
}
if ($manifest.PSObject.Properties.Name -contains "content_security_policy") {
  $cspText = $manifest.content_security_policy | ConvertTo-Json -Compress
  if ($cspText -match "http:|https:|'unsafe-eval'|'unsafe-inline'") {
    throw "Manifest CSP contains values that are risky or incompatible with the release policy."
  }
}

Assert-NoForbiddenFiles -Root $distRoot
Assert-NoForbiddenContent -Root $distRoot

Write-Host "Prepublish checks passed."
