---
name: supabase-relationships
description: database.types.ts tables must include Relationships field for @supabase/postgrest-js v2.118+ compatibility
metadata:
  type: project
---

Each table in `database.types.ts` must have `Relationships: [];` field.

**Why:** `@supabase/postgrest-js` v2.118.0 `GenericTable` type requires `Relationships: GenericRelationship[]`. Without it, table types don't extend `GenericTable` and all insert/update/select operations resolve to `never`, causing TS2345 errors.

**How to apply:** When regenerating DB types or adding new tables, ensure every table block includes `Relationships: [];` (or the actual relationship definitions if foreign keys exist).
