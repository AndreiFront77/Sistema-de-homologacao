# DEV Quickstart

Como iniciar o frontend de desenvolvimento rapidamente.

Passos rápidos:

- Abrir PowerShell na raiz do projeto
- Executar o script helper (recomendado):

```powershell
.\start-front.ps1
```

Opções:

- `-Install` : força execução de `npm install` antes de iniciar
- `-Open` : usa `npx ng serve --open` para abrir o navegador automaticamente
- `-Project "nome"` : especifica outro subprojeto (padrão: `sistema-homologacao`)

Exemplos:

```powershell
.\start-front.ps1 -Install
.\start-front.ps1 -Open
.\start-front.ps1 -Project "outro-front"
```

Comandos alternativos (manuais):

```powershell
cd sistema-homologacao
npm install
npm start
# ou
npx ng serve --open
```

Se quiser, posso também adicionar uma `task` do VS Code e scripts no `package.json` raiz.
