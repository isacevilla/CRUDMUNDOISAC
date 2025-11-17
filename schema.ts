import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Tabela de países
 * Armazena informações sobre países do mundo
 */
export const paises = mysqlTable("paises", {
  id: int("id").autoincrement().primaryKey(),
  nome: varchar("nome", { length: 255 }).notNull(),
  continente: varchar("continente", { length: 100 }).notNull(),
  populacao: int("populacao").notNull(),
  idioma: varchar("idioma", { length: 100 }).notNull(),
  bandeira: text("bandeira"), // URL da bandeira
  moeda: varchar("moeda", { length: 100 }), // Código da moeda
  capital: varchar("capital", { length: 255 }), // Nome da capital
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Pais = typeof paises.$inferSelect;
export type InsertPais = typeof paises.$inferInsert;

/**
 * Tabela de cidades
 * Armazena informações sobre cidades associadas a países
 */
export const cidades = mysqlTable("cidades", {
  id: int("id").autoincrement().primaryKey(),
  nome: varchar("nome", { length: 255 }).notNull(),
  populacao: int("populacao").notNull(),
  idPais: int("idPais").notNull().references(() => paises.id),
  latitude: varchar("latitude", { length: 50 }), // Para API de clima
  longitude: varchar("longitude", { length: 50 }), // Para API de clima
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Cidade = typeof cidades.$inferSelect;
export type InsertCidade = typeof cidades.$inferInsert;