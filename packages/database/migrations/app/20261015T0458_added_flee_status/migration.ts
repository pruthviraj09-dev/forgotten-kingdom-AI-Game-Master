#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/3863c489945921be5263a75df2655c859f055310372ce3eff69c78fafc04b954/contract';
import endContract from '../../snapshots/3863c489945921be5263a75df2655c859f055310372ce3eff69c78fafc04b954/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/dc110d4cb529e693d7dbeb330ddc8ed58bc394798d02e5bc02e9817596a30d82/contract';
import startContract from '../../snapshots/dc110d4cb529e693d7dbeb330ddc8ed58bc394798d02e5bc02e9817596a30d82/contract.json' with { type: 'json' };
import { Migration, MigrationCLI } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropCheckConstraint({
        schema: 'public',
        table: 'Combat',
        constraint: 'Combat_status_check_61b97488',
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'Combat',
        constraint: 'Combat_status_check_ac1cbb2b',
        expression: "\"status\" IN ('active', 'playerWon', 'enemyWon', 'fled')",
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
