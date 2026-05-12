# Guia de Instalação SQLite no Windows

Este guia explica como preparar o armazenamento local do sistema para testes, troca de máquina e migração de dados.

## 1. O que instalar

1. Instale o Node.js LTS no computador.
2. Opcional: instale o DB Browser for SQLite para visualizar o banco manualmente.
3. Se for usar o app desktop, mantenha também o Electron já configurado no projeto.

## 2. Onde os dados ficam

O sistema já usa SQLite local no backend.

- Banco principal: `sistema-homologacao/local-backend/data/homologacao.db`
- Schema versionado: `sistema-homologacao/local-backend/schema.sql`

## 3. Primeiro uso no computador do usuário

1. Copie a pasta `sistema-homologacao` para o computador do usuário.
2. Abra um terminal dentro da pasta `sistema-homologacao/local-backend`.
3. Execute:

```powershell
npm install
npm start
```

4. Na primeira execução, o arquivo `homologacao.db` será criado automaticamente em `local-backend/data/`.

## 4. Como conectar o DB Browser for SQLite

1. Abra o DB Browser for SQLite.
2. Clique em `Open Database`.
3. Selecione o arquivo `sistema-homologacao/local-backend/data/homologacao.db`.
4. Use a aba `Browse Data` para consultar as tabelas.

Se o banco ainda não existir, inicie o backend uma vez com `npm start` para ele ser criado.

## 5. Como guardar e levar os dados para outra máquina

Para mover os dados para outro computador, use um destes caminhos:

### Opção A: copiar o arquivo do banco

1. Pare o backend.
2. Copie `local-backend/data/homologacao.db`.
3. Na outra máquina, coloque esse arquivo no mesmo caminho.
4. Inicie o backend com `npm start`.

### Opção B: gerar backup SQL

1. No backend local, rode:

```powershell
npm run backup:sql
```

2. Copie o arquivo gerado em `local-backend/backups/`.
3. Na outra máquina, restaure com:

```powershell
npm run restore:sql -- caminho\do\arquivo.sql
```

## 6. Passo a passo para o computador do usuário

1. Instalar Node.js LTS.
2. Copiar a pasta do sistema para o PC.
3. Entrar em `sistema-homologacao/local-backend`.
4. Executar `npm install`.
5. Executar `npm start`.
6. Abrir o navegador ou o app desktop.
7. Se quiser migrar dados, copiar `homologacao.db` ou restaurar um `.sql`.

## 7. Checklist rápido de validação

1. O backend sobe sem erro.
2. O arquivo `homologacao.db` existe em `local-backend/data/`.
3. Os cards aparecem na tela.
4. Um card novo salva e permanece após reiniciar o backend.
5. O backup SQL é gerado com `npm run backup:sql`.

## 8. Observação importante

O sistema já mantém os dados em SQLite local. Isso significa que, para trocar de máquina ou juntar dados, o caminho mais seguro é copiar o banco `.db` ou usar o backup `.sql` gerado pelo backend.