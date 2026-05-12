# Sistema de Homologação - Desktop App

Guia completo para compilar e usar a versão desktop da aplicação.

## 📋 Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn
- Windows 10/11 (para criar o instalador)

## 🚀 Como usar

### 1. Instalar dependências

```powershell
cd c:\Users\User\Desktop\System_Ind_Mod\sistema-homologacao

# Instalar dependências do Electron
npm install

# Instalar dependências do backend local (se ainda não fez)
cd local-backend
npm install
cd ..
```

### 2. Gerar ícone (Opcional, mas recomendado)

Você precisa de um arquivo `icon.ico` em `assets/icon.ico`.

**Opção A: Usar ferramentas online**
- Vá para: https://icoconvert.com/
- Faça upload de uma imagem PNG (256x256 ou maior)
- Baixe o `.ico`
- Coloque em: `assets/icon.ico`

**Opção B: Criar um simples com PowerShell**
```powershell
# Copiar um ícone padrão do Windows (temporário, só para teste)
Copy-Item "C:\Windows\System32\imageres.dll" assets/icon.ico
```

### 3. Build do Desktop (Ambos os formatos)

```powershell
# Build AND gera instalador + portable
npm run desktop:build
```

Os executáveis ficarão em: `dist-electron/`
- `Sistema de Homologação-1.0.0.exe` (Instalador)
- `Sistema de Homologação-1.0.0-portable.exe` (Portable)

### 4. Testar em desenvolvimento

```powershell
# Terminal 1: Roda Angular em localhost:4200
npm start

# Terminal 2: Abre Electron conectado ao dev server
npm run electron:dev
```

## 📦 O que acontece ao rodar o app

1. **Backend local** inicia automaticamente (`localhost:4000`)
2. **Janela desktop** abre com a interface Angular
3. **Ícone na barra do Windows** está presente
4. **Atalho na Desktop** é criado (ao instalar)
5. **Menu do app** com Arquivo, Editar, Visualizar, Ajuda

## 💾 Dados e banco de dados

- Banco SQLite fica em: `local-backend/data/homologacao.db`
- Quando você desinstala, os dados permanecem em `AppData` (Windows)
- Para backup: copie o arquivo `.db`

## 🔧 Personalizações

### Mudar o tamanho da janela
Edite `electron/main.js`, linha `createWindow()`:
```javascript
mainWindow = new BrowserWindow({
  width: 1400,    // Largura
  height: 900,    // Altura
  minWidth: 1024,
  minHeight: 768
});
```

### Mudar nome da aplicação
Edite `package.json`:
```json
"build": {
  "productName": "Seu Nome Aqui"
}
```

### Desabilitar DevTools (em produção)
No `electron/main.js`, comente:
```javascript
if (isDevelopment) {
  mainWindow.webContents.openDevTools();
}
```

## 🐛 Troubleshooting

**"Backend failed to start"**
- Confirme que `local-backend/server.js` existe
- Rode manualmente: `cd local-backend && node server.js`

**"Cannot find module electron-is-dev"**
```powershell
npm install --save-dev electron-is-dev
```

**Porta 4000 já está em uso**
- Verifique se outro processo está usando
- No PowerShell: `Get-Process | Where-Object {$_.port -eq 4000}`

## 📝 Próximos passos

- [ ] Customizar ícone e cores
- [ ] Criar instalador com logo
- [ ] Adicionar atualizador automático
- [ ] Implementar crash reporter
- [ ] Gerar versão distribuível em cloud

## 📞 Suporte

Qualquer dúvida, confira os logs na console:
- Dev: `npm run electron:dev` (mostra tudo no terminal)
- Produção: Veja `%LOCALAPPDATA%\Sistema de Homologação\logs`
