"use client"

import { useState } from "react"
import Image from "next/image"
import { Card } from "../ui/card"
import { Checkbox } from "../ui/checkbox"
import ButtonActions from "./ButtonActions"

export default ({ veiculos }) => {

   const [showNotPosted, setShowNotPosted] = useState()



   return (
      <div className="grid gap-2 mt-4">

         <div className="flex items-center space-x-2">
            <Checkbox id="show-not-posted"
            checked={showNotPosted} 
            onCheckedChange={() => setShowNotPosted(!showNotPosted)} 
            />
            <label
               htmlFor="show-not-posted"
               className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
               Veículos ainda não postados
            </label>
         </div>

         {veiculos?.filter(v => showNotPosted ? !v.posted_at : v)?.map((d, i) => {
            const { titulo, descricao, img, posted_at } = d
            return (
               <Card key={i} className="p-3 flex flex-col sm:flex-row justify-between sm:items-center">
                  <div className="flex gap-3">
                     <Image src={img} width={180} height={54.5} alt={titulo} />

                     <div className="flex flex-col justify-center">
                        <h1 className="font-bold text-lg text-[#c3332d]">{titulo}</h1>
                        <h3 className="text-sm">{descricao}</h3>
                        {posted_at && <h3 className="text-xs bg-green-500 text-white font-semibold px-2 py-1 rounded-sm w-fit">Postado em: 07/06/2024 15:40</h3>}
                     </div>
                  </div>

                  <ButtonActions data={d} />

               </Card>
            )
         })}
      </div>
   )
}