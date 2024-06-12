import axios from "axios"
import cheerio from "cheerio"
import path from 'path'
import fs from 'fs'
import { db } from "@/db/lowdb"

export const getVeiculo = async () => {

   const url = process.env.url_search
   const resp = await axios.get(url)
   const $ = cheerio.load(resp.data);

   await db.read()

   const veiculos = []
   const elements = $('.row.carro-resultado')

   for (const element of elements) {
      const titulo = $(element).find('.carro-info h3 a').text().trim();
      const descricao = $(element).find('.carro-info .col-md-12').last().text().trim();
      const img = $(element).find('.carro-img img').attr('src');
      const url = $(element).find('.carro-img a').attr('href');
      // const preco = $(element).find('.col-md-3 h3').text().trim();
      const id = url.match(/\/(\d+)$/)[1]

      const post = db.data.posts.find(d => d.id === id)

      veiculos.push({ id, titulo, descricao, img, url, ...post })
   }

   return veiculos

}

export const getDetails = async (url, img) => {

   // get host
   const url_search = process.env.url_search
   const urlObj = new URL(url_search);
   const host = urlObj.protocol + "//" + urlObj.host

   const details = await axios.get(`${host}${url}`)
   const $ = cheerio.load(details.data);

   // coletar as imagens
   const imgUrls = [];
   const imgElements = $('#lightgallery a')
   for (const imgEl of imgElements) { imgUrls.push($(imgEl).attr('href')) }
   if (imgUrls.length === 0) imgUrls.push(img)

   // coletar informações
   let infos = [];
   const infosElements = $('.col-md-6 font')
   for (const info of infosElements) {
      // modelo
      const modelo = $(info).text().trim().split('\n')[0]
      infos.push({ label: 'modelo', value: modelo })

      const rows = $(info).text().trim().split('\n').filter(row => row.includes(':'))
      rows.forEach(row => {
         const arr = row.trim().split(':')
         infos.push({ label: arr[0], value: arr[1].trim() })
      })
   }

   return ({ imgUrls, infos })
}