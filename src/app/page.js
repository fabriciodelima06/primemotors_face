import Image from "next/image";
import axios from 'axios';
// import moment from 'moment'
// import ActiveSwitch from "@/components/root/ActiveSwitch";
// import Licenca from "@/components/root/Licenca";
import CardVeiculo from "@/components/root/CardVeiculo";
import ButtonSettings from "@/components/root/ButtonSettings";
import ButtonPostsAll from "@/components/root/ButtonPostsAll";

export default async () => {

   const { data } = await axios.get(`${process.env.url_api}/c`)
   const { show_browser, config, veiculos } = data

   const veiculoLength = veiculos.length
   const postsLength = veiculos.filter(d => d.posted_at).length

   return (
      <main>

         <div className="bg-[#080808] border-solid border-b-4 border-b-red-700 h-24 flex justify-center items-center relative">
            <Image src='/logo.png' width={500} height={54.5} alt="logo" />
            <ButtonSettings config={config} />
         </div>

         <div className="container p-4">

            <div className="flex flex-col justify-between items-center md:flex-row">
               <div className="flex flex-col items-center md:items-start">
                  <h1 className="font-bold text-3xl">Veículos Seminovos ({postsLength}/{veiculoLength})</h1>
                  {/* <h6 className="text-xs">As atualizações são realizadas às 12:00 e às 17:00</h6> */}
               </div>

               <ButtonPostsAll show_browser={show_browser} />
            </div>

            <CardVeiculo veiculos={veiculos} />

         </div>

         <div className="bg-[#080808] border-solid border-t-4 border-t-red-700 h-36 flex justify-center items-center">
            <Image src='/logo.png' width={500} height={54.5} alt="logo" />
         </div>

      </main>
   );
}
