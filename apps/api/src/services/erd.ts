import { Parser } from 'node-sql-parser';

const parser = new Parser();

interface Column {
  name: string;
  type: string;
  nullable: boolean;
  primaryKey: boolean;
}

interface ForeignKey {
  column: string;
  referencesTable: string;
  referencesColumn: string;
}

interface Table {
  name: string;
  columns: Column[];
  foreignKeys: ForeignKey[];
}

// ─── Parse raw SQL into table definitions ────────────────────────────────────

export function parseSQLSchema(sql: string): Table[] {
  const tables: Table[] = [];

  // Split into individual CREATE TABLE statements
  const createTableRegex = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?[`"]?(\w+)[`"]?\s*\(([^;]+)\)/gis;

  let match;
  while ((match = createTableRegex.exec(sql)) !== null) {
    const tableName = match[1];
    const body = match[2];
    const columns: Column[] = [];
    const foreignKeys: ForeignKey[] = [];

    const lines = body.split('\n').map(l => l.trim()).filter(Boolean);

    for (const line of lines) {
      // Skip constraints that aren't columns or foreign keys
      if (line.startsWith('PRIMARY KEY') || line.startsWith('UNIQUE') || line.startsWith('INDEX') || line.startsWith('KEY ')) {
        continue;
      }

      // Foreign key detection
      const fkMatch = line.match(/FOREIGN\s+KEY\s*\(`?(\w+)`?\)\s*REFERENCES\s*`?(\w+)`?\s*\(`?(\w+)`?\)/i);
      if (fkMatch) {
        foreignKeys.push({
          column: fkMatch[1],
          referencesTable: fkMatch[2],
          referencesColumn: fkMatch[3],
        });
        continue;
      }

      // Column detection
      const colMatch = line.match(/^`?(\w+)`?\s+(\w+(?:\([^)]+\))?)/i);
      if (colMatch) {
        const colName = colMatch[1];
        const colType = colMatch[2].toUpperCase();

        // Skip SQL keywords that aren't column names
        if (['CONSTRAINT', 'CHECK', 'FOREIGN', 'PRIMARY', 'UNIQUE'].includes(colName.toUpperCase())) {
          continue;
        }

        columns.push({
          name: colName,
          type: colType,
          nullable: !line.toUpperCase().includes('NOT NULL'),
          primaryKey: line.toUpperCase().includes('PRIMARY KEY'),
        });
      }
    }

    tables.push({ name: tableName, columns, foreignKeys });
  }

  return tables;
}

// ─── Convert tables → Mermaid ERD string ────────────────────────────────────

export function generateMermaidERD(tables: Table[]): string {
  const lines: string[] = ['erDiagram'];

  // Table definitions
  for (const table of tables) {
    lines.push(`  ${table.name} {`);
    for (const col of table.columns) {
      const pk = col.primaryKey ? ' PK' : '';
      lines.push(`    ${col.type} ${col.name}${pk}`);
    }
    lines.push('  }');
  }

  // Relationships from foreign keys
  for (const table of tables) {
    for (const fk of table.foreignKeys) {
      lines.push(`  ${table.name} }o--|| ${fk.referencesTable} : "${fk.column}"`);
    }
  }

  return lines.join('\n');
}

// ─── Main entry point ────────────────────────────────────────────────────────

export function sqlToERD(sql: string): {
  tables: Table[];
  mermaidDiagram: string;
  tableCount: number;
} {
  const tables = parseSQLSchema(sql);
  const mermaidDiagram = generateMermaidERD(tables);
  return { tables, mermaidDiagram, tableCount: tables.length };
}
