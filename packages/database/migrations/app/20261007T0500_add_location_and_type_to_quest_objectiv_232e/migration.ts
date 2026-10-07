#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/0c9f192ca04f9d1c41a7ea149b10444a188c7c66beaeffe532d7069f4d3e8a13/contract';
import startContract from '../../snapshots/0c9f192ca04f9d1c41a7ea149b10444a188c7c66beaeffe532d7069f4d3e8a13/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/7827d1dc9e4dce6715072c1b3fede402980f1b42dab12e0ad21e47fe5572f0bb/contract';
import endContract from '../../snapshots/7827d1dc9e4dce6715072c1b3fede402980f1b42dab12e0ad21e47fe5572f0bb/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, placeholder } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'QuestObjective',
        column: col('targetLocationId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'QuestObjective',
        column: col('type', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.dataTransform(endContract, 'backfill-QuestObjective-type', {
        check: () => placeholder('backfill-QuestObjective-type:check'),
        run: () => placeholder('backfill-QuestObjective-type:run'),
      }),
      this.setNotNull({ schema: 'public', table: 'QuestObjective', column: 'type' }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
