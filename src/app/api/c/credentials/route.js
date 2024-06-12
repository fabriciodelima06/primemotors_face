import { loginAndGoToMarketplace } from "@/lib/puppeteer"
import { db } from "@/db/lowdb"

export async function POST(req) {
    const data = await req.json()
    await db.read()

    try {
        db.data.config = data
        db.write()

        // fazer login no facebook
        const { browser } = await loginAndGoToMarketplace(data)
        browser.close()

        return Response.json('ok')

    } catch (error) {
        console.log(error)
        browser.close()
        return Response.json(
            { message: error?.message || 'Error Interno' },
            { status: message?.status || 500 }
        )
    }
}