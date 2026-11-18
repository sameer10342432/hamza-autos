$downloads = @(
  @{ url = 'https://live.staticflickr.com/7426/10988940866_eb3e27e220_b.jpg'; out = 'scripts/test_islamabad_mechanics.jpg' },
  @{ url = 'https://live.staticflickr.com/3636/4559764568_18bf042e65_b.jpg'; out = 'scripts/test_tiring_needs_pakistan.jpg' },
  @{ url = 'https://live.staticflickr.com/2701/4073207260_a24848c6ea_b.jpg'; out = 'scripts/test_men_at_work_pakistan.jpg' },
  @{ url = 'https://live.staticflickr.com/8419/29238501865_71704f4cfe_b.jpg'; out = 'scripts/test_akhuwat_mechanic.jpg' },
  @{ url = 'https://live.staticflickr.com/5117/7157601024_9583fe4b15_b.jpg'; out = 'scripts/test_suzuki_gs150_pakistan.jpg' }
)
$wc = New-Object System.Net.WebClient
$wc.Headers.Add('User-Agent', 'Mozilla/5.0')
foreach ($d in $downloads) {
  try {
    $wc.DownloadFile($d.url, $d.out)
    $len = (Get-Item $d.out).Length
    Write-Host "Downloaded: $($d.out) ($len bytes)"
  } catch {
    Write-Host "Failed: $($d.out) $($_.Exception.Message)"
  }
}
