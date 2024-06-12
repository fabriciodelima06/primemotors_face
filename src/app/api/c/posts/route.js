import { db } from "@/db/lowdb"
import { getDetails } from "@/lib/scraper"
import { createPostagem, loginAndGoToMarketplace } from "@/lib/puppeteer"

export async function POST(req) {

   const data = await req.json()
   const searchParams = req.nextUrl.searchParams
   const onlySaveDb = searchParams.get('onlySaveDb')

   await db.read()

   if (onlySaveDb) {
      db.data.posts.push({ ...data, posted_at: new Date() })
      db.write()

      return Response.json('ok')
   }

   try {
      // fazer login no facebook e ir para o marketplace
      const { browser, page } = await loginAndGoToMarketplace({ ...db.data.config, showBrowser: db.data.show_browser })

      //pegar detalhes do veículo
      const { imgUrls, infos } = await getDetails(data.url, data.img)

      await createPostagem(page, { ...data, imgUrls, infos })

      const post = { ...data, posted_at: new Date() }

      db.data.posts.push(post)
      db.write()

      browser.close()
      return Response.json(post)

   } catch (error) {
      console.log(error)
      return Response.json(
         { message: error?.message || 'Error Interno' },
         { status: message?.status || 500 }
      )
   }

}

export async function DELETE(req) {

   // paramentros da url
   const searchParams = req.nextUrl.searchParams
   const id = searchParams.get('id')

   await db.read()

   db.data.posts = db.data.posts.filter(d => d.id !== id)
   await db.write()

   return Response.json('ok')

}