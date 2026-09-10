# Script de démarrage pour l'accès téléphone Sama Daara
$Host.UI.RawUI.WindowTitle = "Sama Daara - Lancement pour Téléphone"
Clear-Host

Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host "          SAMA DAARA (HIZBUT-TARQIYYAH) - ACCES TELEPHONE           " -ForegroundColor Green
Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host ""

# Détection de l'adresse IP locale
$ip = (Get-NetIPAddress -AddressFamily IPv4 -Type Unicast | Where-Object IPAddress -notmatch '^(127|169\.254)' | Select-Object -First 1).IPAddress

if (-not $ip) {
    $ip = "10.71.231.110"
}

Write-Host "[1] Adresse IP locale détectée : " -NoNewline
Write-Host "$ip" -ForegroundColor Yellow
Write-Host ""
Write-Host "[2] POUR ACCÉDER SUR VOTRE TÉLÉPHONE :" -ForegroundColor Cyan
Write-Host "    1. Connectez votre téléphone au MEME réseau Wi-Fi que ce PC."
Write-Host "    2. Ouvrez le navigateur (Chrome, Safari...) et tapez :"
Write-Host ""
Write-Host "       http://$($ip):3000/" -ForegroundColor Green
Write-Host ""
Write-Host "    -> Ou scannez simplement le QR Code affiché sur la page !" -ForegroundColor Yellow
Write-Host ""

$indexHtmlPath = Join-Path $PSScriptRoot "index.html"
if (Test-Path $indexHtmlPath) {
    Write-Host "[3] Ouverture de la page avec le QR Code..." -ForegroundColor Gray
    Start-Process $indexHtmlPath
}

Write-Host ""
Write-Host "[4] Démarrage du serveur Vite (React)..." -ForegroundColor Cyan
Write-Host "    (Laissez cette fenêtre ouverte pendant que vous utilisez le site)" -ForegroundColor DarkGray
Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host ""

$appDir = Join-Path $PSScriptRoot "HT\hizbut-tarquillah"
Set-Location $appDir
npm run dev -- --host
