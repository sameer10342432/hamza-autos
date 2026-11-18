param (
    [string]$SearchQuery = "motorcycle mechanic"
)

$wc = New-Object System.Net.WebClient
$wc.Headers.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) HamzaAutosResearch/1.0")

$encoded = [System.Uri]::EscapeDataString($SearchQuery)
$url = "https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=$encoded&gsrnamespace=6&gsrlimit=15&prop=imageinfo&iiprop=url|size|extmetadata&format=json"

try {
    $res = $wc.DownloadString($url)
    $json = $res | ConvertFrom-Json
    if ($json.query -and $json.query.pages) {
        $props = $json.query.pages.PSObject.Properties
        foreach ($prop in $props) {
            $item = $prop.Value
            $info = $item.imageinfo[0]
            $license = $info.extmetadata.LicenseShortName.value
            $artist = $info.extmetadata.Artist.value -replace '<[^>]+>', ''
            $desc = $info.extmetadata.ImageDescription.value -replace '<[^>]+>', ''
            
            [PSCustomObject]@{
                Title = $item.title
                URL = $info.url
                Width = $info.width
                Height = $info.height
                License = $license
                Artist = $artist
                Description = ($desc.Substring(0, [System.Math]::Min(120, $desc.Length)))
            } | Format-List
        }
    } else {
        Write-Host "No pages found."
    }
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}
