# Check if ports are running

$errorCount = 0
$port5173 = $false
$port5000 = $false

try {
    $tcp5173 = Test-Connection -ComputerName localhost -Port 5173 -WarningAction SilentlyContinue
    if ($tcp5173) { $port5173 = $true }
} catch {
    $port5173 = $false
    $errorCount++
}

try {
    $tcp5000 = Test-Connection -ComputerName localhost -Port 5000 -WarningAction SilentlyContinue
    if ($tcp5000) { $port5000 = $true }
} catch {
    $port5000 = $false
    $errorCount++
}

Write-Host 'Port 5173 (Frontend): ' + (if ($port5173) { '✅ RUNNING' } else { '❌ NOT RUNNING' })
Write-Host 'Port 5000 (Backend): ' + (if ($port5000) { '✅ RUNNING' } else { '❌ NOT RUNNING' })
