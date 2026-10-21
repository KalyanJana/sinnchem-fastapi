$ErrorActionPreference = "Stop"

$dataFile = Join-Path $PSScriptRoot "..\src\data.ts"
$outputDirectory = Join-Path $PSScriptRoot "..\public\img\products"
New-Item -ItemType Directory -Force -Path $outputDirectory | Out-Null
$source = Get-Content -Raw $dataFile
$productMatches = [regex]::Matches(
    $source,
    'name:\s*"([^"]+)"[\s\S]*?image:\s*`\$\{cloudinary\}/([^`]+)`'
)

if ($productMatches.Count -eq 0) {
    throw "No product image entries were found in src/data.ts."
}

$client = [System.Net.WebClient]::new()
$expectedFiles = [System.Collections.Generic.HashSet[string]]::new(
    [System.StringComparer]::OrdinalIgnoreCase
)
try {
    foreach ($match in $productMatches) {
        $name = $match.Groups[1].Value
        $relativeUrl = $match.Groups[2].Value
        $slug = [regex]::Replace($name.ToLowerInvariant(), "[^a-z0-9]+", "-").Trim("-")
        $extension = [System.IO.Path]::GetExtension(($relativeUrl -split "\?")[0])
        $destination = Join-Path $outputDirectory "$slug$extension"
        [void]$expectedFiles.Add("$slug$extension")
        $url = "https://res.cloudinary.com/dr5kay5i6/image/upload/$relativeUrl"
        $client.DownloadFile($url, $destination)

        Write-Output "Ready: $slug$extension"
    }

    Get-ChildItem $outputDirectory -File |
        Where-Object { -not $expectedFiles.Contains($_.Name) } |
        Remove-Item -Force
}
finally {
    $client.Dispose()
}

Write-Output "Prepared $($productMatches.Count) catalog images in frontend/public/img/products"
