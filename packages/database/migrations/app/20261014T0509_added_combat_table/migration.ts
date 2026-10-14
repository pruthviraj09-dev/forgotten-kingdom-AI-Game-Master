#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/900cdb199045720c249aa61425706d0425370cc39861f848618058ba99a6823f/contract';
import startContract from '../../snapshots/900cdb199045720c249aa61425706d0425370cc39861f848618058ba99a6823f/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/dc110d4cb529e693d7dbeb330ddc8ed58bc394798d02e5bc02e9817596a30d82/contract';
import endContract from '../../snapshots/dc110d4cb529e693d7dbeb330ddc8ed58bc394798d02e5bc02e9817596a30d82/contract.json' with { type: 'json' };
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
        table: 'Combat',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('enemyId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('gameId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('active'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'Combat_status_check_61b97488',
            "\"status\" IN ('active', 'playerWon', 'enemyWon')",
          ),
        ],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Combat',
        index: 'Combat_enemyId_idx_693fc01e',
        columns: ['enemyId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Combat',
        index: 'Combat_gameId_idx_6cdb47f8',
        columns: ['gameId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Combat',
        index: 'Combat_gameId_status_idx_777eafd3',
        columns: ['gameId', 'status'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Combat',
        foreignKey: {
          name: 'Combat_gameId_fkey',
          columns: ['gameId'],
          references: { schema: 'public', table: 'Game', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Combat',
        foreignKey: {
          name: 'Combat_enemyId_fkey',
          columns: ['enemyId'],
          references: { schema: 'public', table: 'Enemy', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
