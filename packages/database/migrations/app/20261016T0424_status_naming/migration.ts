#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/3863c489945921be5263a75df2655c859f055310372ce3eff69c78fafc04b954/contract';
import startContract from '../../snapshots/3863c489945921be5263a75df2655c859f055310372ce3eff69c78fafc04b954/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/f568b3e0bdfd00930b513dd443e588d8af42f3d69c082afef45461ee046896c5/contract';
import endContract from '../../snapshots/f568b3e0bdfd00930b513dd443e588d8af42f3d69c082afef45461ee046896c5/contract.json' with { type: 'json' };
import { Migration, MigrationCLI } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropCheckConstraint({
        schema: 'public',
        table: 'Combat',
        constraint: 'Combat_status_check_ac1cbb2b',
      }),
      this.setDefault({
        schema: 'public',
        table: 'Combat',
        column: 'status',
        defaultSql: "DEFAULT 'ACTIVE'",
        operationClass: 'widening',
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'Combat',
        constraint: 'Combat_status_check_cb67ca10',
        expression: "\"status\" IN ('ACTIVE', 'PLAYER_WON', 'ENEMY_WON', 'FLED')",
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
