@echo off
chcp 65001 > nul
cls
echo ====================================================================
echo     DAARA HIZBUT-TARQIYYAH - OUVERTURE SUR VOTRE TELEPHONE
echo ====================================================================
echo.
echo 1. Assurez-vous que votre telephone est connecte au MEME RESEAU WI-FI
echo    que cet ordinateur.
echo.
echo 2. Ouvrez le navigateur (Chrome, Safari, etc.) sur votre telephone
echo    et tapez l'adresse suivante :
echo.
echo    -----------------------------------------------------
echo        http://10.210.130.110:8080
echo    -----------------------------------------------------
echo.
echo    (Ou http://localhost:8080 sur cet ordinateur)
echo.
echo 3. Lancement du serveur en cours... (Laissez cette fenetre ouverte)
echo ====================================================================
echo.

where python >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    python -m http.server 8080
    goto end
)

where npx >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    npx -y serve -l 8080 .
    goto end
)

powershell -Command "Write-Host 'Demarrage avec PowerShell...'; Start-Process 'http://localhost:8080'; $listener = New-Object System.Net.HttpListener; $listener.Prefixes.Add('http://*:8080/'); $listener.Start(); Write-Host 'En ecoute...'"

:end
pause
