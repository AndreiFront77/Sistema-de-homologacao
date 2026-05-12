# 🚀 Como criar o Desktop App - Guia Rápido

## 📌 Resumo
Você tem aqui a estrutura completa para transformar a aplicação web em um **App Desktop nativo do Windows** com:
- ✅ Ícone na barra do Windows
- ✅ Atalho na área de trabalho
- ✅ Menu de aplicação (Arquivo, Editar, etc)
- ✅ Backend SQLite integrado
- ✅ Dois formatos: Instalador + Portable

---

## ⚡ Início Rápido (5 minutos)

### Passo 1: Abrir PowerShell na pasta do projeto

```powershell
cd c:\Users\User\Desktop\System_Ind_Mod\sistema-homologacao
```

### Passo 2: Executar o script de build

```powershell
powershell -ExecutionPolicy Bypass -File build-desktop.ps1
```

**Escolha a opção 1** (Ambos os formatos)

### Passo 3: Aguardar (~2-5 minutos)
- ✅ Angular compila
- ✅ Electron Builder gera os executáveis

### Passo 4: Usar o app
- Abra `dist-electron/Sistema de Homologação-1.0.0.exe` (Instalador)
- Ou `Sistema de Homologação-1.0.0-portable.exe` (Portable)

---

## 🎨 Customizar o ícone (Importante)

1. **Criar/obter um ícone PNG** (256x256 ou maior)

2. **Converter para .ico** usando uma dessas ferramentas:
   - Online: https://icoconvert.com/
   - ImageMagick: `convert icon.png icon.ico`
   - Photoshop/Paint.NET

3. **Salvar em**: `assets/icon.ico`

4. **Fazer o build novamente**

---

## 🛠️ Desenvolvimento

Para testar a aplicação durante o desenvolvimento:

```powershell
powershell -ExecutionPolicy Bypass -File dev.ps1
```

Isso vai:
- Iniciar Angular em http://localhost:4200
- Abrir a janela Electron
- Conectar ao backend local em localhost:4000

---

## 📂 Estrutura criada

```
sistema-homologacao/
├── electron/
│   ├── main.js          ← Lógica do Electron
│   └── preload.js       ← Segurança do renderer
├── assets/
│   └── icon.ico         ← Seu ícone (criar!)
├── build-desktop.ps1    ← Script para compilar
├── dev.ps1              ← Script para desenvolvimento
├── DESKTOP_APP_GUIDE.md ← Guia completo
└── package.json         ← Configuração atualizada
```

---

## 🔧 Configurações principais

### Mudar tamanho da janela
Edite `electron/main.js`:
```javascript
width: 1400,    // Largura em pixels
height: 900,    // Altura em pixels
```

### Mudar nome do app
Edite `package.json`:
```json
"build": {
  "productName": "Seu Nome Aqui"
}
```

### Desabilitar DevTools
Edite `electron/main.js` e comente:
```javascript
// mainWindow.webContents.openDevTools();
```

---

## ✅ Próximos passos

- [ ] Criar `assets/icon.ico`
- [ ] Rodar `build-desktop.ps1`
- [ ] Testar o instalador
- [ ] Testar o portable
- [ ] Distribuir para usuários

---

## 🐛 Se der erro

**"electron-builder not found"**
```powershell
npm install --save-dev electron-builder concurrently wait-on
npm run desktop:build
```

**"Port 4200 already in use"**
```powershell
# Encerre o Angular anterior e tente novamente
npm run desktop:build
```

**"Assets/icon.ico not found"**
- Isso é aviso, não erro
- Leia ICON_README.md para criar um ícone
- O build vai funcionar sem ícone (fica padrão)

---

## 📞 Dicas finais

1. **Instalador**: Melhor para distribuição a usuários finais
2. **Portable**: Melhor para ambientes corporativos com restrições
3. **Backend**: Está integrado e inicia automaticamente
4. **Dados**: Ficam em SQLite `local-backend/data/homologacao.db`
5. **Backup**: Copie esse arquivo para fazer backup seguro

**Sucesso! 🎉**
