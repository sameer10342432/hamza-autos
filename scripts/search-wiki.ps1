$wc = New-Object System.Net.WebClient
$wc.Headers.Add("User-Agent", "Mozilla/5.0 HamzaAutos/1.0")

$titles = @("Honda CD70", "Honda CG125", "Yamaha YBR125", "Motorcycle", "Motorcycle maintenance", "Auto rickshaw")
foreach ($t in $titles) {
    $encoded = [System.Uri]::EscapeDataString($t)
    $url = "https://en.wikipedia.org/w/api.php?action=query&titles=$encoded&prop=images&format=json"
    try {
        $res = $wc.DownloadString($url) | ConvertFrom-Json
        $pages = $res.query.pages
        foreach ($k in $pages.PSObject.Properties.Name) {
            Write-Host "Page: $t"
            foreach ($img in $pages.$k.images) {
                Write-Host "  Image: $($img.title)"
            }
        }
    } catch {
        Write-Host "Error for ${t}: $($_.Exception.Message)"
    }
}
