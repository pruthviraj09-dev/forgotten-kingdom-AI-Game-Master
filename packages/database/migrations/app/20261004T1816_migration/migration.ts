#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/9a76bf9c798050b67d63ffcf95e54fced54c48f302923b9a643e1534a2fdb10f/contract';
import endContract from '../../snapshots/9a76bf9c798050b67d63ffcf95e54fced54c48f302923b9a643e1534a2fdb10f/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/ad12065c348e9d089bb596092251988d047428671fbf0d29859e996a95173fc9/contract';
import startContract from '../../snapshots/ad12065c348e9d089bb596092251988d047428671fbf0d29859e996a95173fc9/contract.json' with { type: 'json' };
import { Migration, MigrationCLI } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropCheckConstraint({
        schema: 'public',
        table: 'Quest',
        constraint: 'Quest_Status_check_b03e166c',
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'Quest',
        constraint: 'Quest_Status_check_e77e64a2',
        expression: "\"Status\" IN ('active', 'inactive', 'completed')",
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
