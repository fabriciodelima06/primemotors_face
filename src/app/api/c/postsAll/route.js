import { db } from "@/db/lowdb"
import { createPostagem, loginAndGoToMarketplace } from "@/lib/puppeteer"
import { getDetails, getVeiculo } from "@/lib/scraper"
import { sleep } from "@/lib/utils"

export async function POST(req) {

   await db.read()

   try {

      const posts = db.data.posts
      const config = db.data.config
      const showBrowser = db.data.show_browser

      const veiculos = await getVeiculo()
      const postsToSave = []

      // fazer login no facebook e ir para o marketplace
      const { browser, page } = await loginAndGoToMarketplace({ ...config, showBrowser })

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

            postsToSave.push(post)

            index++
            if (index > config.qtd_total_posts) break
            await sleep(config.time_in_second_between_posts)

            // Navega até o Marketplace
            await page.goto('https://www.facebook.com/marketplace/create/vehicle')

         } catch (error) {
            throw (error)
         }
      }

      browser.close()

      // Remover do banco os veículos que não existe mais
      const newPosts = [...posts.filter(obj1 => veiculos.some(obj2 => obj2.id === obj1.id)), ...postsToSave]

      db.data.posts = newPosts

      db.write()
      return Response.json('ok')

   } catch (error) {
      console.log(error)
      return Response.json(
         { message: error?.message || 'Error Interno' },
         { status: message?.status || 500 }
      )
   }
}

export async function DELETE() {

   await db.read()

   db.data.posts = []
   await db.write()

   return Response.json('ok')

}