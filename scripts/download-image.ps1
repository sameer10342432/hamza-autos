param(
    [string]$Url,
    [string]$OutPath
)

$wc = New-Object System.Net.WebClient
$wc.Headers.Add("User-Agent", "HamzaAutosApp/1.0 (info@hamzaautos.com)")
try {
    $wc.DownloadFile($Url, $OutPath)
    $fi = Get-Item $OutPath
    Write-Host "Success! Saved $OutPath ($($fi.Length) bytes)"
} catch {
    Write-Host "Download failed: $($_.Exception.Message)"
}
