#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/7827d1dc9e4dce6715072c1b3fede402980f1b42dab12e0ad21e47fe5572f0bb/contract';
import startContract from '../../snapshots/7827d1dc9e4dce6715072c1b3fede402980f1b42dab12e0ad21e47fe5572f0bb/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/900cdb199045720c249aa61425706d0425370cc39861f848618058ba99a6823f/contract';
import endContract from '../../snapshots/900cdb199045720c249aa61425706d0425370cc39861f848618058ba99a6823f/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'NPC',
        column: col('questObjectiveDescription', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'NPC',
        column: col('questObjectiveType', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'NPC',
        column: col('questOfferDescription', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'NPC',
        column: col('questOfferTitle', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'NPC',
        column: col('questTargetLocationId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
