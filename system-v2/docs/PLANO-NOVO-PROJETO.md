# Plano do Novo Projeto

Este documento vai ser escrito junto com o projeto.

## 1. Objetivo

Criar um software de homologacao local-first, com:

- app local por usuario para operar no dia a dia
- banco local em cada maquina
- sincronizacao para um dashboard web centralizado
- arquitetura leve, barata e facil de manter

## 2. Stack escolhida

- Frontend local: Angular
- App desktop/local: Electron
- Banco local: SQLite
- API do dashboard: Node.js com NestJS ou Express, a definir
- Dashboard web: Angular

## 3. Fluxo principal

1. Usuario entra no app local
2. Faz login
3. Cadastra uma homologacao
4. Salva no banco local
5. Sincroniza para a nuvem quando houver internet
6. Dashboard web mostra os dados consolidados

## 4. MVP inicial

- login
- cadastro de homologacao
- listagem de homologacoes
- edicao simples
- sincronizacao basica
- dashboard com indicadores principais

## 5. Regras do projeto

- aprender fazendo
- evoluir em passos pequenos
- manter o codigo simples no inicio
- nao trocar de stack no meio do caminho

## 6. Como vamos escrever este documento

Eu vou te guiar por seções curtas. Para cada parte, vamos responder:

- o que o sistema faz
- quem usa
- onde os dados ficam
- como sincroniza
- quais telas existem
- quais regras de negocio importam

## 7. Passo a passo para começar

### Passo 1

Definir o problema principal que o sistema resolve.

### Passo 2

Desenhar as telas minimas do app local.

### Passo 3

Criar o projeto Angular.

### Passo 4

Criar o primeiro formulario.

### Passo 5

Salvar dados localmente.

### Passo 6

Criar a sincronizacao.

### Passo 7

Criar o dashboard web.

## 8. Como vamos trabalhar com Git

### Conceitos basicos

- repository: a pasta versionada
- commit: uma foto do progresso
- branch: uma linha de trabalho separada
- merge: juntar trabalho de volta

### Fluxo que vamos usar

1. criar uma branch para cada etapa
2. fazer pequenas mudancas
3. verificar o resultado
4. salvar com commit
5. repetir

### Comandos que voce vai aprender

- `git init`
- `git status`
- `git add`
- `git commit`
- `git branch`
- `git checkout` ou `git switch`
- `git log`

## 9. Proxima escrita

Na proxima rodada, vamos preencher:

- publico alvo
- problema principal
- telas iniciais
- regras de negocio
- primeira entrega tecnica

## 10. Missao 1: Comeco do jogo

### Objetivo da missao

Entender o que vamos construir e criar a primeira base de trabalho sem medo de errar.

### Como vamos jogar

Pense em cada etapa como uma fase curta:

1. ler
2. escrever
3. salvar
4. testar
5. registrar no Git

### O que voce vai fazer agora

- escrever com suas palavras o problema que o software resolve
- definir quem vai usar
- listar o que o app local precisa ter no primeiro dia
- escolher o nome do projeto

### Regras da missao

- nada de tentar fazer tudo de uma vez
- cada passo precisa caber em poucos minutos
- se algo nao ficar perfeito, a gente ajusta depois

## 11. Missao 2: Git sem medo

### Objetivo da missao

Aprender a guardar o trabalho em pequenas etapas.

### Primeiro ritual

1. olhar o estado atual com `git status`
2. escolher o que mudou
3. preparar com `git add`
4. salvar com `git commit`

### Exemplo prático

```bash
git status
git add system-v2/docs/PLANO-NOVO-PROJETO.md
git commit -m "docs: inicia plano do novo projeto"
```

### O que voce precisa observar

- se o arquivo aparece como modificado ou novo
- se o commit representa uma ideia pequena
- se o historico fica facil de ler depois

## 12. Proxima jogada

Assim que voce me responder, eu vou te guiar para escrever a primeira parte real do documento:

- nome do projeto
- problema que ele resolve
- publico alvo
- primeira tela