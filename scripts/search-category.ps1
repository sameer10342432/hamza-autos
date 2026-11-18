param(
    [string]$Category = "Category:Motorcycles in Pakistan"
)

$wc = New-Object System.Net.WebClient
$wc.Headers.Add("User-Agent", "HamzaAutosApp/1.0 (info@hamzaautos.com)")

$encoded = [System.Uri]::EscapeDataString($Category)
$url = "https://en.wikipedia.org/w/api.php?action=query&list=categorymembers&cmtitle=$encoded&cmlimit=50&cmtype=file|subcat&format=json"

try {
    $res = $wc.DownloadString($url) | ConvertFrom-Json
    $members = $res.query.categorymembers
    Write-Host "Members of $Category ($($members.Count)):"
    foreach ($m in $members) {
        Write-Host "  - $($m.title)"
    }
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}
