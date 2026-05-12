Param(
    [switch]$Install,
    [string]$Project = "sistema-homologacao",
    [switch]$Open
)

$root = Split-Path -Parent $MyInvocation.MyCommand.Definition
Push-Location $root

if (-not (Test-Path $Project)) {
    Write-Error "Projeto '$Project' não encontrado no diretório $root"
    Pop-Location
    exit 1
}

Push-Location $Project

if ($Install -or -not (Test-Path "node_modules")) {
    Write-Output "Instalando dependências em $Project..."
    npm install
}

$serveCmd = if ($Open) { 'npx ng serve --open' } else { 'npm start' }
Write-Output "Iniciando front: $serveCmd"

# Abre um novo PowerShell mantendo a janela aberta
Start-Process powershell -ArgumentList "-NoExit","-Command","$serveCmd" -WorkingDirectory $PWD

Pop-Location
Pop-Location
