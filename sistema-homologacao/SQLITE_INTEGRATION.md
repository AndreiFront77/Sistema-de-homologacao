# Sistema de Indicadores - SQLite Backend Integration Guide

## ✅ Completed

### Backend (SQLite)
- ✅ **db.js**: SQLite schema com 3 tabelas (cards, indicadores, indicador_bugs)
- ✅ **server.js**: Express API com 14 endpoints
- ✅ **Dependencies**: express, sqlite3, cors instalados

### Angular Service
- ✅ **indicador.service.ts**: TypeScript service com métodos para CRUD de indicadores e dashboard

---

## 📋 API Endpoints

### Cards (Businessmap)
```
POST   /api/cards/import           - Import cards do Businessmap
GET    /api/cards                  - Lista todos os cards
GET    /api/cards/:cardId          - Busca card específico
```

### Indicadores (CRUD)
```
POST   /api/indicadores             - Cria novo indicador
GET    /api/indicadores             - Lista todos os indicadores
GET    /api/indicadores/:id         - Busca indicador específico
PUT    /api/indicadores/:id         - Atualiza indicador
DELETE /api/indicadores/:id         - Deleta indicador
```

### Dashboard
```
GET    /api/dashboard/summary       - Resumo mensal de todos os indicadores
GET    /api/dashboard/mes/:mes/:ano - Indicadores de um mês/ano específico
```

---

## 🚀 Próximos Passos

### 1. **Iniciar o Backend** (Terminal)
```bash
cd c:\Users\User\Desktop\System_Ind_Mod\sistema-homologacao\local-backend
npm start
# Output: Local SQLite backend listening on http://localhost:4000
```

### 2. **Importar Dependências no app.module.ts**
```typescript
import { HttpClientModule } from '@angular/common/http';
import { IndicadorService } from './services/indicador.service';

@NgModule({
  declarations: [...],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,  // ← Adicionar
    ...
  ],
  providers: [IndicadorService],  // ← Adicionar
  bootstrap: [AppComponent]
})
export class AppModule {}
```

### 3. **Usar o Service em Componentes**

#### Exemplo: Salvar Indicador
```typescript
import { IndicadorService } from './services/indicador.service';

export class FormComponent {
  constructor(private indicadorService: IndicadorService) {}

  saveIndicador() {
    const novoDado = {
      card_id: '1391',
      fabrica: 'PLANTA SUL',
      cliente: 'BONTEMPO',
      componente: 'ARMARIO SUPERIOR',
      homologador: 'Andrei',
      status: 'CONCLUIDA',
      mes: 'JANEIRO',
      ano: 2026,
      data_inicio: '2026-01-01',
      data_conclusao: '2026-01-27',
      dias_uteis: 62,
      somatorio_bugs: 0,
      bugs: {
        icone: 0,
        descricao: 0,
        links: 0,
        // ... outros 16 campos
      }
    };

    this.indicadorService.createIndicador(novoDado).subscribe(
      (response) => {
        if (response.ok) {
          console.log('✅ Indicador salvo:', response.indicador);
        }
      },
      (error) => console.error('❌ Erro:', error)
    );
  }
}
```

#### Exemplo: Carregar Indicadores para Dashboard
```typescript
export class DashboardComponent {
  indicadores$ = this.indicadorService.indicadores$;

  constructor(private indicadorService: IndicadorService) {}

  loadMesAno(mes: string, ano: number) {
    this.indicadorService.getIndicadoresByMesAno(mes, ano).subscribe(
      (response) => {
        console.log(`Total: ${response.total}`);
        console.log(`Concluídos: ${response.concluidos}`);
        console.log(`Bugs: ${response.somaBugs}`);
      }
    );
  }
}
```

#### Exemplo: Carregar com localStorage fallback (Migração)
```typescript
export class AppComponent {
  constructor(private indicadorService: IndicadorService) {
    this.migrateLocalStorage();
  }

  async migrateLocalStorage() {
    const localData = localStorage.getItem('registros');
    if (localData) {
      const registros = JSON.parse(localData);
      console.log(`Migrando ${registros.length} registros...`);
      
      for (const reg of registros) {
        this.indicadorService.createIndicador(reg).subscribe();
      }
      
      localStorage.removeItem('registros');
      console.log('✅ Migração concluída!');
    }
  }
}
```

---

## 🗄️ Schema SQLite

### Tabela: `indicadores`
```sql
CREATE TABLE indicadores (
  id INTEGER PRIMARY KEY,
  card_id TEXT,
  fabrica TEXT,
  cliente TEXT,
  componente TEXT,
  nivel INTEGER,
  mod TEXT,
  homologador TEXT,
  status TEXT,
  mes TEXT,
  ano INTEGER,
  data_inicio DATE,
  data_conclusao DATE,
  dias_uteis INTEGER,
  somatorio_bugs INTEGER,
  observacoes TEXT,
  created_at DATETIME,
  updated_at DATETIME
)
```

### Tabela: `indicador_bugs` (19 campos de bugs)
```sql
CREATE TABLE indicador_bugs (
  indicador_id INTEGER,
  icone INTEGER,
  descricao INTEGER,
  links INTEGER,
  download INTEGER,
  deformacoes INTEGER,
  medidas INTEGER,
  etiqueta_proj_gab INTEGER,
  aplicacao INTEGER,
  cadastro INTEGER,
  des_cabecalho INTEGER,
  reg_configuracao INTEGER,
  ficha INTEGER,
  calculos_recursos INTEGER,
  furacao INTEGER,
  usinagem INTEGER,
  roteiro INTEGER,
  relatorio_pedido INTEGER,
  lista_pecas INTEGER,
  xml INTEGER
)
```

---

## 🔄 Fluxo de Dados

```
Frontend (Angular)
    ↓
IndicadorService (HttpClient)
    ↓
Express API (localhost:4000)
    ↓
SQLite Database (data/homologacao.db)
```

---

## 🚨 Troubleshooting

### Erro: "CORS error"
- ✅ CORS já está habilitado no server.js

### Erro: "Connection refused"
- Certifique-se que o backend está rodando: `npm start` na pasta local-backend

### Erro: "Table already exists"
- Banco SQLite é criado automaticamente na primeira execução
- Para resetar: delete `local-backend/data/homologacao.db`

### Erro no TypeScript
- Execute: `cd sistema-homologacao && npm install`
- Verifique se `HttpClientModule` está importado em `app.module.ts`

---

## 📊 Próximas Features

- [ ] Filtros no GET /api/indicadores (by cardId, fabrica, status, mes, ano)
- [ ] Paginação
- [ ] Export para CSV/Excel
- [ ] Autenticação/Login
- [ ] Validação de formulário avançada
- [ ] Upload de arquivos
- [ ] Notificações em tempo real (WebSocket)

---

## 📞 Referências

- **Backend Port**: 4000
- **Frontend Port**: 4200
- **Database File**: `c:\Users\User\Desktop\System_Ind_Mod\sistema-homologacao\local-backend\data\homologacao.db`
- **Service Location**: `c:\Users\User\Desktop\System_Ind_Mod\sistema-homologacao\src\app\services\indicador.service.ts`
