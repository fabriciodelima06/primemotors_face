import { db } from "@/db/lowdb"
import { getVeiculo } from "@/lib/scraper"

export async function GET() {

   await db.read()

   const { show_browser, config } = db.data

   const veiculos = await getVeiculo()

   return Response.json({
      // licenca: new Date(licenca),
      // lastUpdate: new Date(lastUpdate),
      show_browser,
      config,
      // isTasksActive,
      veiculos
   })

}

export async function POST(req) {

   const data = await req.json()
   await db.read()

   db.data = {...db.data, ...data}
   db.write()

   return Response.json('ok')
}