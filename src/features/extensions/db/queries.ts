import { db } from '@/db/db'
import { extensions } from '@/db/schema'
import { Extension } from '@/features/extensions/db/schema'
import { eq } from 'drizzle-orm'

export async function getExtensions(): Promise<Extension[]> {
  return db.select().from(extensions)
}

export async function getExtensionById(id: number): Promise<Extension> {
  const extension = await db.select().from(extensions).where(eq(extensions.id, id)).limit(1)
  return extension[0]
}
