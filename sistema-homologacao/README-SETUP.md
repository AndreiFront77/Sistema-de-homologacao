Setup rápido (Windows)

Este repositório contém um script `setup-windows.ps1` que tenta instalar Node.js LTS e Git automaticamente (via `winget` ou `chocolatey`) e depois roda `npm install` e inicializa o repositório Git.

Passos:

1. Abra PowerShell como Administrador.
2. Navegue para a pasta do frontend:

```powershell
cd "C:\Users\admin\Desktop\System_Ind_Mod\sistema-homologacao"
```

3. Rode o script (com commit automático):

```powershell
Start-Process powershell -Verb runAs -ArgumentList '-NoProfile -ExecutionPolicy Bypass -File .\setup-windows.ps1 -AutoCommit'
```

4. Se o instalador automático não estiver disponível, instale manualmente:
- Node.js LTS: https://nodejs.org/
- Git for Windows: https://git-scm.com/

5. Após instalar manualmente, abra um novo PowerShell e execute:

```powershell
npm install
git init
git add .
git commit -m "chore: initial commit"
npm start
```

Observações:
- O script exige privilégios de Administrador para usar `winget`/`choco`.
- Caso o `npm` ou `git` não estejam disponíveis imediatamente, abra um novo terminal ou reinicie o PC.
