<#
setup-windows.ps1
Instala Node.js LTS e Git (via winget ou chocolatey) e executa `npm install`.
Execute este script como Administrador (Run as Administrator).

Usage:
  Start-Process powershell -Verb runAs -ArgumentList '-NoProfile -ExecutionPolicy Bypass -File .\setup-windows.ps1 -AutoCommit'
#>

[param(
    [switch]$AutoCommit
)]

function Is-Admin {
    $current = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($current)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

if (-not (Is-Admin)) {
    Write-Host "Por favor execute este script como Administrador." -ForegroundColor Yellow
    Write-Host "Abra PowerShell como administrador e rode:`nStart-Process powershell -Verb runAs -ArgumentList '-NoProfile -ExecutionPolicy Bypass -File .\setup-windows.ps1 -AutoCommit'`"
    exit 1
}

Write-Host "Iniciando setup do ambiente..." -ForegroundColor Cyan

$hasWinget = (Get-Command winget -ErrorAction SilentlyContinue) -ne $null
$hasChoco = (Get-Command choco -ErrorAction SilentlyContinue) -ne $null

$needNode = -not (Get-Command node -ErrorAction SilentlyContinue)
$needGit = -not (Get-Command git -ErrorAction SilentlyContinue)

if (-not $needNode -and -not $needGit) {
    Write-Host "Node e Git já estão instalados." -ForegroundColor Green
} else {
    if ($hasWinget) {
        Write-Host "Usando winget para instalar dependências..." -ForegroundColor Cyan
        if ($needNode) {
            Write-Host "Instalando Node.js LTS..."
            winget install --id OpenJS.NodeJS.LTS -e --accept-package-agreements --accept-source-agreements
        }
        if ($needGit) {
            Write-Host "Instalando Git..."
            winget install --id Git.Git -e --accept-package-agreements --accept-source-agreements
        }
    } elseif ($hasChoco) {
        Write-Host "Usando Chocolatey para instalar dependências..." -ForegroundColor Cyan
        if ($needNode) {
            choco install -y nodejs-lts
        }
        if ($needGit) {
            choco install -y git
        }
    } else {
        Write-Host "Nenhum instalador automático (winget / chocolatey) encontrado." -ForegroundColor Yellow
        Write-Host "Por favor instale manualmente Node.js LTS (https://nodejs.org/) e Git (https://git-scm.com/)."
        exit 1
    }
}

# Espera e verifica se node/git estão agora disponíveis
function Wait-ForCommand([string]$cmd, [int]$seconds=60) {
    $waited = 0
    while ($waited -lt $seconds) {
        if (Get-Command $cmd -ErrorAction SilentlyContinue) { return $true }
        Start-Sleep -Seconds 2
        $waited += 2
    }
    return $false
}

if ($needNode) {
    if (-not (Wait-ForCommand -cmd 'node' -seconds 60)) {
        Write-Host "Node não foi encontrado no PATH. Abra um novo terminal ou reinicie o PC e rode 'npm install' manualmente." -ForegroundColor Yellow
    }
}

if ($needGit) {
    if (-not (Wait-ForCommand -cmd 'git' -seconds 60)) {
        Write-Host "Git não foi encontrado no PATH. Abra um novo terminal ou reinicie o PC." -ForegroundColor Yellow
    }
}

if (Get-Command node -ErrorAction SilentlyContinue) {
    Write-Host "Executando npm install no diretório atual..." -ForegroundColor Cyan
    npm install
} else {
    Write-Host "Pulei 'npm install' porque Node não está disponível. Rode 'npm install' após reiniciar o terminal." -ForegroundColor Yellow
}

if (Get-Command git -ErrorAction SilentlyContinue) {
    if (-not (Test-Path .git)) {
        Write-Host "Inicializando repositório Git..." -ForegroundColor Cyan
        git init
        git add .
        if ($AutoCommit) {
            git commit -m "chore: initial commit"
            Write-Host "Commit inicial criado." -ForegroundColor Green
        } else {
            Write-Host "Repositório inicializado. Revise e rode 'git commit' quando desejar." -ForegroundColor Green
        }
    } else {
        Write-Host "Repositório Git já existe." -ForegroundColor Green
    }
} else {
    Write-Host "Pulei inicialização do Git porque git não está disponível." -ForegroundColor Yellow
}

Write-Host "Setup finalizado." -ForegroundColor Green
