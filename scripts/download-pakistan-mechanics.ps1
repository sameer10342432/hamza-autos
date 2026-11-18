$downloads = @(
  @{ url = 'https://live.staticflickr.com/7027/6783195063_d8988b10e3_b.jpg'; out = 'scripts/test_roadside_workshop_pak.jpg' },
  @{ url = 'https://live.staticflickr.com/8816/29204741966_4789349c95_b.jpg'; out = 'scripts/test_murad_khan.jpg' },
  @{ url = 'https://live.staticflickr.com/7362/11102437174_e908181a01_b.jpg'; out = 'scripts/test_daily_routine_mechanic.jpg' },
  @{ url = 'https://live.staticflickr.com/2811/10663208845_3ab2e82a93_b.jpg'; out = 'scripts/test_motorbike_mechanic_pak.jpg' },
  @{ url = 'https://live.staticflickr.com/3198/2291479307_fdfca6efc7_b.jpg'; out = 'scripts/test_rawalpindi_mechanic_hughes.jpg' },
  @{ url = 'https://live.staticflickr.com/7389/9514130397_ecbedcbbb1_b.jpg'; out = 'scripts/test_minar_e_pakistan.jpg' }
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
