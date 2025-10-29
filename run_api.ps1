# Helper script to call backend endpoints and print JSON outputs
try {
  $h = Invoke-RestMethod -Uri 'http://localhost:4000/health' -Method Get -ErrorAction Stop
  Write-Host "HEALTH:"
  $h | ConvertTo-Json -Depth 5 | Write-Host

  $ts = (Get-Date).ToString('yyyyMMddHHmmss')
  $email = "test+$ts@example.com"
  $body = @{ name = 'Test User'; email = $email; password = 'password123' }
  Write-Host "Signing up with email: $email"
  $signup = Invoke-RestMethod -Uri 'http://localhost:4000/api/auth/signup' -Method Post -Body ($body | ConvertTo-Json) -ContentType 'application/json' -ErrorAction Stop
  Write-Host "SIGNUP:"
  $signup | ConvertTo-Json -Depth 5 | Write-Host

  $token = $signup.token
  Write-Host "TOKEN: $token"

  $wbody = @{ type = 'Cycling'; durationMinutes = 30; calories = 250 }
  $w = Invoke-RestMethod -Uri 'http://localhost:4000/api/workouts' -Method Post -Headers @{ Authorization = "Bearer $token" } -Body ($wbody | ConvertTo-Json) -ContentType 'application/json' -ErrorAction Stop
  Write-Host "CREATED WORKOUT:"
  $w | ConvertTo-Json -Depth 5 | Write-Host

  Write-Host "WORKOUTS LIST:"
  $list = Invoke-RestMethod -Uri 'http://localhost:4000/api/workouts' -Method Get -Headers @{ Authorization = "Bearer $token" } -ErrorAction Stop
  $list | ConvertTo-Json -Depth 5 | Write-Host
  Write-Host "WEEKLY STATS:"
  $wstats = Invoke-RestMethod -Uri 'http://localhost:4000/api/workouts/stats/weekly' -Method Get -Headers @{ Authorization = "Bearer $token" } -ErrorAction Stop
  $wstats | ConvertTo-Json -Depth 5 | Write-Host
  Write-Host "MONTHLY STATS:"
  $mstats = Invoke-RestMethod -Uri 'http://localhost:4000/api/workouts/stats/monthly' -Method Get -Headers @{ Authorization = "Bearer $token" } -ErrorAction Stop
  $mstats | ConvertTo-Json -Depth 5 | Write-Host
} catch {
  Write-Host "ERROR: $($_.Exception.Message)"
  if ($_.InvocationInfo) { Write-Host $_.InvocationInfo.PositionMessage }
  exit 1
}
