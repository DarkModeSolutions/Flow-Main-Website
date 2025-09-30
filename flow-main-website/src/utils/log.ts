import { prisma } from "@/lib/db/prisma";

export async function log(action: string, log: string) {
  await prisma.logs.create({ data: { action, log: log } });
}
