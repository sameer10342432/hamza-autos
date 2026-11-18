$hosts = @('upload.wikimedia.org', 'images.unsplash.com', 'images.pexels.com', 'pixabay.com', 'live.staticflickr.com', 'raw.githubusercontent.com', 'google.com', 'commons.wikimedia.org')
foreach ($h in $hosts) {
    try {
        $ip = [System.Net.Dns]::GetHostAddresses($h)
        Write-Host "$h -> $($ip[0].IPAddressToString)"
    } catch {
        Write-Host "$h -> FAILED: $($_.Exception.Message)"
    }
}
