import { db } from "@/db/lowdb"

export async function GET() {
   await db.read()
   return Response.json(db.data.isTasksActive)
}