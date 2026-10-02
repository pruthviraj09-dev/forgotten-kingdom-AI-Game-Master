#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/22f63f0bf7de112e0d669b09ab52a93e6d2ca6ccf851724fc9017bd61125bf28/contract';
import endContract from '../../snapshots/22f63f0bf7de112e0d669b09ab52a93e6d2ca6ccf851724fc9017bd61125bf28/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/785e450414db108c180e9fa5ca77c8d2cd3c267388cd1a1bd49add09528550d0/contract';
import startContract from '../../snapshots/785e450414db108c180e9fa5ca77c8d2cd3c267388cd1a1bd49add09528550d0/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'GameMessage',
        columns: [
          col('content', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('gameId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('role', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createIndex({
        schema: 'public',
        table: 'GameMessage',
        index: 'GameMessage_gameId_createdAt_idx_04c2aae6',
        columns: ['gameId', 'createdAt'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'GameMessage',
        index: 'GameMessage_gameId_idx_6cdb47f8',
        columns: ['gameId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'GameMessage',
        foreignKey: {
          name: 'GameMessage_gameId_fkey',
          columns: ['gameId'],
          references: { schema: 'public', table: 'Game', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
