Local SQLite backend for Sistema Homologacao

Quick start

1. Install dependencies

```bash
cd sistema-homologacao/local-backend
npm install
```

2. Run the server

```bash
npm start
```

Endpoints

- POST /import
  Body: { "cards": [ ... ] }
  Merges incoming cards into local SQLite DB (upsert by `card_id`).

- GET /cards
  Returns all stored cards.

Notes

- Database file is created at `local-backend/data/homologacao.db`.
- The schema is versioned in `local-backend/schema.sql`.
- This backend uses `sqlite3` and stores the real data on disk, so copying the `.db` file is the safest local backup.
- For a simple restore, keep both `homologacao.db` and `schema.sql` together.
- To generate a SQL backup file, run `npm run backup:sql`.
- To restore from a SQL file, run `npm run restore:sql -- caminho/do/arquivo.sql`.
