#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/22f63f0bf7de112e0d669b09ab52a93e6d2ca6ccf851724fc9017bd61125bf28/contract';
import endContract from '../../snapshots/22f63f0bf7de112e0d669b09ab52a93e6d2ca6ccf851724fc9017bd61125bf28/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/c03707058409f4d65353001b6677bad4f2305462d9b46a931764513826eada8b/contract';
import startContract from '../../snapshots/c03707058409f4d65353001b6677bad4f2305462d9b46a931764513826eada8b/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, lit, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'Enemy',
        columns: [
          col('description', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('hp', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('locationId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('maxHp', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
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
      this.createTable({
        schema: 'public',
        table: 'InventoryItem',
        columns: [
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('itemId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('playerId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('quantity', 'int4', {
            notNull: true,
            default: lit(1),
            codecRef: { codecId: 'pg/int4@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Item',
        columns: [
          col('description', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('locationId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Location',
        columns: [
          col('description', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('gameId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'LocationConnection',
        columns: [
          col('fromLocationId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('toLocationId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'NPC',
        columns: [
          col('description', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('locationId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Player',
        columns: [
          col('gameId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('gold', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('hp', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('level', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('locationId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('maxHp', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.setDefault({
        schema: 'public',
        table: 'Game',
        column: 'updatedAt',
        defaultSql: 'DEFAULT (now())',
      }),
      this.addUnique({
        schema: 'public',
        table: 'InventoryItem',
        constraint: 'InventoryItem_playerId_itemId_key',
        columns: ['playerId', 'itemId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'LocationConnection',
        constraint: 'LocationConnection_fromLocationId_toLocationId_key',
        columns: ['fromLocationId', 'toLocationId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Player',
        constraint: 'Player_gameId_key',
        columns: ['gameId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Enemy',
        index: 'Enemy_locationId_idx_7aae3038',
        columns: ['locationId'],
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
      this.createIndex({
        schema: 'public',
        table: 'InventoryItem',
        index: 'InventoryItem_itemId_idx_41357140',
        columns: ['itemId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'InventoryItem',
        index: 'InventoryItem_playerId_idx_710cf1aa',
        columns: ['playerId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Item',
        index: 'Item_locationId_idx_7aae3038',
        columns: ['locationId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Location',
        index: 'Location_gameId_idx_6cdb47f8',
        columns: ['gameId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'LocationConnection',
        index: 'LocationConnection_fromLocationId_idx_b4e88e40',
        columns: ['fromLocationId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'LocationConnection',
        index: 'LocationConnection_toLocationId_idx_d9ceb078',
        columns: ['toLocationId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'NPC',
        index: 'NPC_locationId_idx_7aae3038',
        columns: ['locationId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Player',
        index: 'Player_locationId_idx_7aae3038',
        columns: ['locationId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Enemy',
        foreignKey: {
          name: 'Enemy_locationId_fkey',
          columns: ['locationId'],
          references: { schema: 'public', table: 'Location', columns: ['id'] },
        },
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
      this.addForeignKey({
        schema: 'public',
        table: 'InventoryItem',
        foreignKey: {
          name: 'InventoryItem_playerId_fkey',
          columns: ['playerId'],
          references: { schema: 'public', table: 'Player', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'InventoryItem',
        foreignKey: {
          name: 'InventoryItem_itemId_fkey',
          columns: ['itemId'],
          references: { schema: 'public', table: 'Item', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Item',
        foreignKey: {
          name: 'Item_locationId_fkey',
          columns: ['locationId'],
          references: { schema: 'public', table: 'Location', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Location',
        foreignKey: {
          name: 'Location_gameId_fkey',
          columns: ['gameId'],
          references: { schema: 'public', table: 'Game', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'LocationConnection',
        foreignKey: {
          name: 'LocationConnection_fromLocationId_fkey',
          columns: ['fromLocationId'],
          references: { schema: 'public', table: 'Location', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'LocationConnection',
        foreignKey: {
          name: 'LocationConnection_toLocationId_fkey',
          columns: ['toLocationId'],
          references: { schema: 'public', table: 'Location', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'NPC',
        foreignKey: {
          name: 'NPC_locationId_fkey',
          columns: ['locationId'],
          references: { schema: 'public', table: 'Location', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Player',
        foreignKey: {
          name: 'Player_gameId_fkey',
          columns: ['gameId'],
          references: { schema: 'public', table: 'Game', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Player',
        foreignKey: {
          name: 'Player_locationId_fkey',
          columns: ['locationId'],
          references: { schema: 'public', table: 'Location', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
