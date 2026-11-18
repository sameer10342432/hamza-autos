param(
    [string[]]$FileTitles
)

$wc = New-Object System.Net.WebClient
$wc.Headers.Add("User-Agent", "HamzaAutosApp/1.0 (https://hamzaautos.com; info@hamzaautos.com)")

$titlesParam = ($FileTitles | ForEach-Object { [System.Uri]::EscapeDataString($_) }) -join "|"
$url = "https://en.wikipedia.org/w/api.php?action=query&titles=$titlesParam&prop=imageinfo&iiprop=url|size|extmetadata&format=json"

try {
    $res = $wc.DownloadString($url) | ConvertFrom-Json
    $pages = $res.query.pages
    foreach ($k in $pages.PSObject.Properties.Name) {
        $p = $pages.$k
        if ($p.imageinfo) {
            Write-Host "Title: $($p.title)"
            Write-Host "URL: $($p.imageinfo[0].url)"
            Write-Host "Dimensions: $($p.imageinfo[0].width)x$($p.imageinfo[0].height)"
            Write-Host "License: $($p.imageinfo[0].extmetadata.LicenseShortName.value)"
            Write-Host "---"
        }
    }
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}
