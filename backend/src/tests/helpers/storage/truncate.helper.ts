import { sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import * as schema from '@/infrastructure/database/schema';

export const truncateAllTables = async (db: NodePgDatabase<typeof schema>): Promise<void> => {
  const tableSchema = db._.schema;
  if (!tableSchema) {
    throw new Error('No table schema found');
  }

  const queries = Object.values(tableSchema).map((table) => {
    return sql.raw(`TRUNCATE TABLE ${table.dbName};`);
  });

  await db.transaction(async (tx) => {
    await Promise.all(
      queries.map(async (query) => {
        if (query) {
          await tx.execute(query);
        }
      }),
    );
  });
};
