#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/0c9f192ca04f9d1c41a7ea149b10444a188c7c66beaeffe532d7069f4d3e8a13/contract';
import endContract from '../../snapshots/0c9f192ca04f9d1c41a7ea149b10444a188c7c66beaeffe532d7069f4d3e8a13/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/9a76bf9c798050b67d63ffcf95e54fced54c48f302923b9a643e1534a2fdb10f/contract';
import startContract from '../../snapshots/9a76bf9c798050b67d63ffcf95e54fced54c48f302923b9a643e1534a2fdb10f/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, lit, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropCheckConstraint({
        schema: 'public',
        table: 'Quest',
        constraint: 'Quest_Status_check_e77e64a2',
      }),
      this.dropColumn({ schema: 'public', table: 'Quest', column: 'Status' }),
      this.createTable({
        schema: 'public',
        table: 'QuestObjective',
        columns: [
          col('completed', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('description', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('progress', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('questId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('target', 'int4', {
            notNull: true,
            default: lit(1),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addColumn({
        schema: 'public',
        table: 'Quest',
        column: col('status', 'text', {
          notNull: true,
          default: lit('active'),
          codecRef: { codecId: 'pg/text@1' },
        }),
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'Quest',
        constraint: 'Quest_status_check_87fdcf45',
        expression: "\"status\" IN ('active', 'completed')",
      }),
      this.createIndex({
        schema: 'public',
        table: 'Quest',
        index: 'Quest_gameId_status_idx_777eafd3',
        columns: ['gameId', 'status'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'QuestObjective',
        index: 'QuestObjective_questId_idx_516cf617',
        columns: ['questId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'QuestObjective',
        foreignKey: {
          name: 'QuestObjective_questId_fkey',
          columns: ['questId'],
          references: { schema: 'public', table: 'Quest', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
