import { db } from '@/db/db'
import { Extensions } from '@/db/schema'
import { Extension } from '@/features/extensions/db/schema'
import { eq } from 'drizzle-orm'

export async function getExtensions(): Promise<Extension[]> {
  return db.select().from(Extensions)
}

export async function getExtensionById(id: number): Promise<Extension> {
  const extension = await db.select().from(Extensions).where(eq(Extensions.id, id)).limit(1)
  return extension[0]
}
