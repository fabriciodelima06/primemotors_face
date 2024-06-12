import { db } from "@/db/lowdb"
import { startStopCronTask } from "@/lib/cron.js"
import { createPostagem, loginAndGoToMarketplace } from "@/lib/puppeteer/puppeteer"
import { getDetails, getVeiculo } from "@/lib/scraper"
import { sleep } from "@/lib/utils"

export async function POST(req) {

   await db.read()

   // Verificar se a licenca está ativa
   const licenca = new Date(db.data.licenca)
   if (licenca < new Date()) {
      return Response.json(
         { message: 'Licença vencida' },
         { status: 401 }
      )
   }

   const { isActive } = await req.json()
   const veiculos = await getVeiculo()

   startStopCronTask(isActive, postarFace)

   postarFace(veiculos, db)

   db.data.isTasksActive = isActive
   db.write()

   return Response.json('ok')
}

const postarFace = async (veiculos, db) => {

   console.log('started at: ' + new Date())

   const posts = db.data.posts
   const config = db.data.config

   // fazer login no facebook e ir para o marketplace
   const { browser, page } = await loginAndGoToMarketplace(config)

   let index = 1
   for (const veiculo of veiculos) {

      try {

         // Verificar se já foi postado
         if (posts.filter(p => p.id === veiculo.id)[0]) continue

         // Pegar detalhes do veículo
         const { imgUrls, infos } = await getDetails(veiculo.url, veiculo.img)

         // Criar postagem no facebook
         await createPostagem(page, { ...veiculo, imgUrls, infos })

         const post = { ...veiculo, posted_at: new Date() }

         db.data.posts.push(post)
         db.write()

         index++
         if (index > process.env.max_posts_search) break
         sleep(process.env.time_in_second_between_posts)

         // Navega até o Marketplace
         await page.goto('https://www.facebook.com/marketplace/create/vehicle')

      } catch (error) {
         throw (error)
      }
   }

   browser.close()
}
