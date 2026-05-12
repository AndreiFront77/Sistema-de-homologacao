#!/usr/bin/env powershell

# Script de desenvolvimento: roda Angular + Electron simultaneamente

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║    Sistema de Homologação - Modo Desenvolvimento           ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan

Write-Host ""
Write-Host "Este script vai:" -ForegroundColor Yellow
Write-Host "1. Iniciar o Angular Dev Server (localhost:4200)" -ForegroundColor Gray
Write-Host "2. Aguardar até estar pronto" -ForegroundColor Gray
Write-Host "3. Iniciar a janela Electron" -ForegroundColor Gray
Write-Host "4. Carregar o backend local (localhost:4000)" -ForegroundColor Gray
Write-Host ""
Write-Host "Tecle Ctrl+C em ambos os terminais para encerrar" -ForegroundColor Yellow
Write-Host ""

# Verificar dependências
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "❌ npm não encontrado. Instale Node.js primeiro." -ForegroundColor Red
    exit 1
}

if (-not (Test-Path "package.json")) {
    Write-Host "❌ package.json não encontrado. Execute na raiz do projeto." -ForegroundColor Red
    exit 1
}

# Instalar dependências se não existirem
if (-not (Test-Path "node_modules")) {
    Write-Host "Instalando dependências..." -ForegroundColor Yellow
    npm install
}

# Usar concurrently para rodar ambos
Write-Host "Iniciando..." -ForegroundColor Green
npm run electron:dev
