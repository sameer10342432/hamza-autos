$downloads = @(
  @{ url = 'https://live.staticflickr.com/65535/49916968758_901ed7bd8d_b.jpg'; out = 'scripts/test_welding_mechanic.jpg' },
  @{ url = 'https://live.staticflickr.com/65535/49083555647_a881b779c7_b.jpg'; out = 'scripts/test_dehradun_garage.jpg' },
  @{ url = 'https://live.staticflickr.com/65535/49083536337_fab263bfc2_b.jpg'; out = 'scripts/test_joga_motors.jpg' },
  @{ url = 'https://live.staticflickr.com/5785/23524708693_414ece1ec8_b.jpg'; out = 'scripts/test_chennai_mechanic.jpg' },
  @{ url = 'https://live.staticflickr.com/5823/29249064914_d2a539d547_b.jpg'; out = 'scripts/test_fixing_bullet.jpg' },
  @{ url = 'https://live.staticflickr.com/65535/51609719480_cc38ff16e0_b.jpg'; out = 'scripts/test_shimla_repair.jpg' }
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
