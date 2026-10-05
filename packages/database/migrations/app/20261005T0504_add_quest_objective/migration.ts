#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/1ec54d959dc77a004790e1a23b963e720c72188721d42bb59c9c2888c5107d68/contract';
import endContract from '../../snapshots/1ec54d959dc77a004790e1a23b963e720c72188721d42bb59c9c2888c5107d68/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/9a76bf9c798050b67d63ffcf95e54fced54c48f302923b9a643e1534a2fdb10f/contract';
import startContract from '../../snapshots/9a76bf9c798050b67d63ffcf95e54fced54c48f302923b9a643e1534a2fdb10f/contract.json' with { type: 'json' };
import { Migration, MigrationCLI } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [];
  }
}

MigrationCLI.run(import.meta.url, M);
