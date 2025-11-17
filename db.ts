import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, paises, InsertPais, cidades, InsertCidade } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ Países ============

export async function getAllPaises() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(paises);
}

export async function getPaisById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(paises).where(eq(paises.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createPais(data: InsertPais) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(paises).values(data);
  return result;
}

export async function updatePais(id: number, data: Partial<InsertPais>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(paises).set(data).where(eq(paises.id, id));
  return await getPaisById(id);
}

export async function deletePais(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Verificar se há cidades associadas
  const cidadesAssociadas = await db.select().from(cidades).where(eq(cidades.idPais, id));
  if (cidadesAssociadas.length > 0) {
    throw new Error("Não é possível excluir um país com cidades associadas");
  }
  
  await db.delete(paises).where(eq(paises.id, id));
  return { success: true };
}

// ============ Cidades ============

export async function getAllCidades() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(cidades);
}

export async function getCidadesByPais(idPais: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(cidades).where(eq(cidades.idPais, idPais));
}

export async function getCidadeById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(cidades).where(eq(cidades.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createCidade(data: InsertCidade) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(cidades).values(data);
  return result;
}

export async function updateCidade(id: number, data: Partial<InsertCidade>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(cidades).set(data).where(eq(cidades.id, id));
  return await getCidadeById(id);
}

export async function deleteCidade(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(cidades).where(eq(cidades.id, id));
  return { success: true };
}
