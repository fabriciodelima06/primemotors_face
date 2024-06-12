import axios from "axios"
// import cheerio from "cheerio"
import puppeteer from "puppeteer"
// import { createPage } from "./init"
import path from 'path'
import fs from 'fs'
// import { db } from "@/db/lowdb"

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const loginAndGoToMarketplace = async ({ email, senha, showBrowser = false }) => {

   const browser = await puppeteer.launch({
      // CAMINHO DO CHROME PARA LINUX (REMOVER O COMENTÁRIO ABAIXO)
      // executablePath: '/usr/bin/chromium-browser',
      headless: !showBrowser,
      // ignoreDefaultArgs: ['--disable-extensions'],
      // args: [
      //    // '--proxy-server=http://45.239.175.19:8080',
      //    '--no-sandbox',
      //    '--disable-setuid-sandbox',
      //    '--disable-dev-shm-usage',
      //    '--disable-accelerated-2d-canvas',
      //    '--no-first-run',
      //    '--no-zygote',
      //    // '--single-process', // <- this one doesn't works in Windows
      //    '--disable-gpu'
      // ]
   })
   const page = await browser.newPage(); // Abre uma nova página

   // Navega até o Facebook
   await page.goto('https://www.facebook.com')

   // Evento para capturar redirecionamentos
   console.log(page)
   let urlFinal;
   page.on('response', async (response) => {
      if (response.status() >= 300 && response.status() < 400 && response.headers()['location']) {
         urlFinal = response.headers()['location'];
      }
   })

   // Preenche o formulário de login e clica no botão de login
   await page.type('#email', email); // Insira seu email aqui
   await page.type('#pass', senha); // Insira sua senha aqui
   await page.click('button[name="login"]'); // Clica no botão de login

   // Aguarda o redirecionamento após o login
   await page.waitForNavigation();

   // Verifica se o login foi bem-sucedido
   if (urlFinal !== 'https://www.facebook.com/') {
      throw ({ message: "O login falhou. Verifique suas credenciais.", status: 401 })
   }

   // Navega até o Marketplace
   await page.goto('https://www.facebook.com/marketplace/create/vehicle');

   return ({ browser, page })
}

export const createPostagem = async (page, data) => {

   const { titulo, imgUrls, infos } = data

   await uploadImagem(page, imgUrls)

   // Clique no botão "Tipo de veículo" e depois em "Outro"
   await page.evaluate(async () => {
      const tipoVeiculoButton = document.querySelector('label[aria-label="Tipo de veículo"]');
      tipoVeiculoButton.click();
   })
   await page.evaluate(() => {
      const spans = document.querySelectorAll('span')
      for (let span of spans) {
         if (span.textContent.trim() === 'Outro') span.click()
      }
   })

   // Clique no botão "Ano"
   await page.evaluate(async () => {
      const anoButton = document.querySelector('label[aria-label="Ano"]');
      anoButton.click();
   })
   const anoArr = infos.filter(i => i.label.includes('Ano'))?.[0].value.split('/')
   const ano = anoArr[anoArr.length - 1]
   await page.evaluate((ano) => {
      const spans = document.querySelectorAll('span')
      for (let span of spans) {
         if (span.textContent.trim() === ano) span.click()
      }
   }, ano)

   // Fabricante
   const labelFabricante = await page.$('label[aria-label="Fabricante"]')
   const inputFabricante = await labelFabricante.$('input')
   await inputFabricante.type(titulo.split(" ")[0])

   // Modelo
   const labelModelo = await page.$('label[aria-label="Modelo"]')
   const inputModelo = await labelModelo.$('input')
   await inputModelo.type(infos[0].value)

   // Preco
   const labelPreco = await page.$('label[aria-label="Preço"]')
   const inputPreco = await labelPreco.$('input')
   await inputPreco.type("0")

   // Descricao
   const emojis = {
      'Motor': '🚗',
      'Portas': '🚪',
      'Cor': '🎨',
      'Ano/Modelo': '📅',
      'Combustível': '⛽'
   }
   const [modelo, ...rest] = infos
   let textoFormatado = '';
   rest.forEach(item => textoFormatado += `${emojis[item.label]} ${item.label}: ${item.value}\n`);
   const labelDescricao = await page.$('label[aria-label="Descrição"]')
   const inputDescricao = await labelDescricao.$('textarea')
   await inputDescricao.type(`${modelo.value}\n${textoFormatado}
Acessórios e opcionais:
✅ Completo

♻️ PEGAMOS VEÍCULO NA TROCA

CONTATO ☎️
📞 (66) 99255-7948
📲 Contate via WhatsApp
📞 https://wa.me/5566992557948`
   )

   await sleep(2000)

   // Clique no botão "Avançar"
   await page.evaluate(async () => {
      const avancaButton = document.querySelector('div[aria-label="Avançar"]')
      avancaButton.click();
   })

   await sleep(2000)

   // Anunciar nos 20 primeiros grupos
   for (let i = 1; i <= 20; i++) {
      // Pressione a tecla Tab
      await page.keyboard.press('Tab')

      await sleep(200)

      // verificar se o elemento com foco contem um checkbox
      const focusedElement = await page.evaluateHandle(() => document.activeElement)
      const elementCheck = await focusedElement.$('i')

      if (!elementCheck) break

      // await page.keyboard.press('Space')

   }

   await sleep(1000)

   // Clique no botão "Publicar"
   await page.evaluate(async () => {
      const publicarButton = document.querySelector('div[aria-label="Publicar"]')
      publicarButton.click();
   })

   // Aguarda o redirecionamento após a publicação
   await page.waitForNavigation();

}

const uploadImagem = async (page, imgUrls) => {

   const filePath = "public/images/veiculo"
   limparPasta(filePath)

   // Caminhos onde as imagens serão salvas
   const imagePaths = [];

   // Baixa as imagens e armazena os caminhos
   for (let i = 0; i < imgUrls.length; i++) {
      const imagePath = path.join(filePath, `image${i + 1}.jpg`);
      await downloadImage(imgUrls[i], imagePath);
      imagePaths.push(imagePath);

      if (i >= 20) break
   }

   // Seleciona o input de upload de arquivos e faz o upload das imagens
   const fileInput = await page.waitForSelector('input[type="file"]');
   await fileInput.uploadFile(...imagePaths);
   await sleep(imgUrls.length * 1000); // Ajuste o tempo conforme necessário para o upload ser concluído
}

const downloadImage = async (url, filepath) => {
   const response = await axios({
      url,
      responseType: 'stream',
   });
   return new Promise((resolve, reject) => {
      response.data.pipe(fs.createWriteStream(filepath))
         .on('finish', resolve)
         .on('error', reject);
   });
}

// Função para deletar todos os arquivos na pasta especificada
const limparPasta = (pastaPath) => {
   fs.readdir(pastaPath, (err, arquivos) => {
      if (err) {
         console.error(`Erro ao ler a pasta: ${err}`);
         return;
      }

      for (const arquivo of arquivos) {
         const caminhoArquivo = path.join(pastaPath, arquivo);

         fs.unlink(caminhoArquivo, err => {
            if (err) {
               console.error(`Erro ao deletar o arquivo ${caminhoArquivo}: ${err}`);
               return;
            }
            // console.log(`Arquivo deletado: ${caminhoArquivo}`);
         });
      }
   });
}