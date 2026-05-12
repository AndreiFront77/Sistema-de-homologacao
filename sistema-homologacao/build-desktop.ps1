#!/usr/bin/env powershell

# Script para facilitar o build do app desktop

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║      Sistema de Homologação - Build Desktop App           ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan

# Verificar se está na pasta certa
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Erro: package.json não encontrado. Execute este script na raiz do projeto." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Passo 1: Instalando dependências..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao instalar dependências" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Passo 2: Instalando dependências do backend local..." -ForegroundColor Yellow
if (Test-Path "local-backend") {
    Push-Location local-backend
    npm install
    Pop-Location
}

Write-Host ""
Write-Host "Passo 3: Verificando ícone..." -ForegroundColor Yellow
if (-not (Test-Path "assets/icon.ico")) {
    Write-Host "⚠️  Aviso: icon.ico não encontrado em assets/" -ForegroundColor Yellow
    Write-Host "Leia ICON_README.md para saber como criar um ícone" -ForegroundColor Gray
    Write-Host ""
    $response = Read-Host "Deseja continuar sem ícone? (S/N)"
    if ($response -ne "S" -and $response -ne "s") {
        Write-Host "Abortado." -ForegroundColor Yellow
        exit 0
    }
} else {
    Write-Host "✅ Ícone encontrado" -ForegroundColor Green
}

Write-Host ""
Write-Host "Escolha o tipo de build:" -ForegroundColor Cyan
Write-Host "1) Ambos (Instalador + Portable)" -ForegroundColor White
Write-Host "2) Apenas Instalador" -ForegroundColor White
Write-Host "3) Apenas Portable" -ForegroundColor White

$choice = Read-Host "Sua escolha (1/2/3)"

Write-Host ""
Write-Host "Building..." -ForegroundColor Yellow

switch ($choice) {
    "1" {
        npm run desktop:build
    }
    "2" {
        npm run desktop:build:installer
    }
    "3" {
        npm run desktop:build:portable
    }
    default {
        Write-Host "❌ Opção inválida" -ForegroundColor Red
        exit 1
    }
}

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║              ✅ Build concluído com sucesso!              ║" -ForegroundColor Green
    Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green
    Write-Host ""
    Write-Host "Os executáveis estão em: dist-electron/" -ForegroundColor Green
    Write-Host ""
    Invoke-Item "dist-electron"
} else {
    Write-Host ""
    Write-Host "❌ Erro durante o build" -ForegroundColor Red
    exit 1
}
