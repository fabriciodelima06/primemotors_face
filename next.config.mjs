// import axios from 'axios'
import open from 'open'

const urlApi = "http://localhost:3624/api"

/** @type {import('next').NextConfig} */
const nextConfig = {
   experimental: {
      serverComponentsExternalPackages: [
         'puppeteer-extra',
         'puppeteer-extra-plugin-stealth',
      ],
   },
   images: {
      remotePatterns: [
         {
            protocol: 'https',
            hostname: '**',
            port: '',
            pathname: '**',
         },
      ],
   },
   env: {
      url_api: urlApi,
      url_search: "https://primemotorsmt.com.br/seminovos-mt",
      max_posts_search: "1",
      time_in_second_between_posts: "2000"
   },
   // criar node-cron na inicialização do server
   async redirects() {
      // axios.get(`${urlApi}/c/cron/status`)
      //    .then(res => res.data && axios.post(`${urlApi}/c/cron`, { isActive: true }))

      //abrir o navegador
      open(`http://localhost:3624`)
      return []
   },
};

export default nextConfig;
