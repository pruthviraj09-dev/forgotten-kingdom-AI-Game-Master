#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/22f63f0bf7de112e0d669b09ab52a93e6d2ca6ccf851724fc9017bd61125bf28/contract';
import startContract from '../../snapshots/22f63f0bf7de112e0d669b09ab52a93e6d2ca6ccf851724fc9017bd61125bf28/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/ad12065c348e9d089bb596092251988d047428671fbf0d29859e996a95173fc9/contract';
import endContract from '../../snapshots/ad12065c348e9d089bb596092251988d047428671fbf0d29859e996a95173fc9/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  lit,
  primaryKey,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'Quest',
        columns: [
          col('Status', 'text', {
            notNull: true,
            default: lit('inactive'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('description', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('gameId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('title', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression('Quest_Status_check_b03e166c', "\"Status\" IN ('active', 'inactive')"),
        ],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Quest',
        index: 'Quest_gameId_idx_6cdb47f8',
        columns: ['gameId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Quest',
        foreignKey: {
          name: 'Quest_gameId_fkey',
          columns: ['gameId'],
          references: { schema: 'public', table: 'Game', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
