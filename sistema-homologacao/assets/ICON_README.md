# Ícones para Aplicação Desktop

Para compilar a aplicação como desktop com ícone, você precisa de:

## 1. Icon.ico (Windows)
- Tamanho: 256x256 pixels ou maior
- Formato: .ico
- Localize em: `assets/icon.ico`

### Como criar um ícone:
Você pode:
- Usar ferramentas online como: https://icoconvert.com/
- Usar software como Paint.NET ou Photoshop
- Usar o comando ImageMagick: `convert icon.png -define icon:auto-resize=256,128,96,64,48,32,16 icon.ico`

## 2. Instalador (NSIS)
O Electron Builder cria automaticamente:
- **Instalador** (.exe): Com desinstalador, entrada no Menu Iniciar, atalho na Desktop
- **Portable** (.exe): Arquivo único, sem instalação

## Próximos passos:
1. Coloque seu ícone em `assets/icon.ico`
2. Execute: `npm run desktop:build` (ambos os formatos)
3. Ou use:
   - `npm run desktop:build:installer` (só instalador)
   - `npm run desktop:build:portable` (só portable)

Os executáveis estarão em: `dist-electron/`
