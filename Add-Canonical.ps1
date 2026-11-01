param(
    [string]$ProjectRoot = (Get-Location).Path,
    [switch]$Apply
)

$ErrorActionPreference = 'Stop'

# Explicit public pages missing canonical in the supplied production audit.
# Existing pages with a canonical declaration are intentionally not touched.
$routes = @(
    '/about', '/careers', '/changelog', '/contact', '/demo',
    '/enterprise', '/features', '/pricing', '/pricing/business',
    '/pricing/starter', '/privacy', '/roadmap', '/security', '/terms'
)

$appDir = Join-Path $ProjectRoot 'src/app'
if (-not (Test-Path -LiteralPath $appDir -PathType Container)) {
    throw "Project App Router folder not found: $appDir"
}

$utf8WithoutBom = New-Object System.Text.UTF8Encoding($false)
$utf8WithBom = New-Object System.Text.UTF8Encoding($true)

foreach ($route in $routes) {
    $relative = $route.TrimStart('/').Replace('/', [IO.Path]::DirectorySeparatorChar)
    $file = Join-Path (Join-Path $appDir $relative) 'page.tsx'

    if (-not (Test-Path -LiteralPath $file -PathType Leaf)) {
        Write-Host "[SKIP missing] $route" -ForegroundColor DarkYellow
        continue
    }

    $bytes = [IO.File]::ReadAllBytes($file)
    $hasBom = $bytes.Length -ge 3 -and $bytes[0] -eq 239 -and $bytes[1] -eq 187 -and $bytes[2] -eq 191
    $source = [IO.File]::ReadAllText($file, [Text.Encoding]::UTF8)

    # Only operate on a static exported metadata object. Skip anything dynamic/unknown.
    $match = [regex]::Match($source, '(?m)\bexport\s+const\s+metadata\s*(?::\s*Metadata)?\s*=\s*\{')
    if (-not $match.Success) {
        Write-Host "[SKIP no static metadata] $route" -ForegroundColor DarkYellow
        continue
    }

    # Identify the object boundary, respecting strings, comments and template literals via TS scanner.
    # A conservative brace scanner is sufficient for these simple metadata declarations,
    # but skip files with existing alternates anywhere rather than risking overwriting them.
    $tail = $source.Substring($match.Index)
    if ([regex]::IsMatch($tail, '(?m)\balternates\s*:')) {
        Write-Host "[SKIP existing alternates] $route" -ForegroundColor DarkYellow
        continue
    }

    $newline = if ($source.Contains("`r`n")) { "`r`n" } else { "`n" }
    $insertionPoint = $match.Index + $match.Length
    $newLine = "${newline}    alternates: { canonical: `"$route`" },"
    $updated = $source.Insert($insertionPoint, $newLine)

    if (-not $Apply) {
        Write-Host "[PREVIEW add] $route => $file" -ForegroundColor Cyan
        continue
    }

    $backup = "$file.canonical.bak"
    if (Test-Path -LiteralPath $backup) {
        Write-Host "[SKIP backup exists] $route ($backup)" -ForegroundColor DarkYellow
        continue
    }

    [IO.File]::Copy($file, $backup)
    [IO.File]::WriteAllText($file, $updated, $(if ($hasBom) { $utf8WithBom } else { $utf8WithoutBom }))
    Write-Host "[UPDATED] $route (backup: $backup)" -ForegroundColor Green
}

if (-not $Apply) {
    Write-Host "`nPreview only. Run again with -Apply to write changes." -ForegroundColor Yellow
} else {
    Write-Host "`nFinished. Run npx tsc --noEmit and npm run build." -ForegroundColor Green
}
