"use client"

import { useState } from "react"
import { CheckCircle, CircleX, Facebook, Save, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import axios from "axios"
import LoadingButton from "./LoadingButton"

export default ({ data }) => {

   const { toast } = useToast()

   const { posted_at } = data
   const [isLoading, setIsLoading] = useState()
   const [isLoadingSave, setIsLoadingSave] = useState()

   const handlePostFace = () => {
      setIsLoading(true)
      axios.post(`${process.env.url_api}/c/posts`, data)
         .then(() => {
            toast({
               ico: <CheckCircle className="mr-2 h-4 w-4" />,
               title: "Postagem realizada com sucesso",
               className: "bg-green-600 text-white p-4"
            })
         })
         .catch(error => {
            toast({
               ico: <CircleX className="mr-2 h-4 w-4" />,
               title: "Erro ao realizar postagem",
               description: error?.response?.data?.message,
               className: "bg-red-600 text-white p-4"
            })
         })
         .finally(() => setIsLoading(false))
   }

   const handleSaveDb = () => {
      setIsLoadingSave(true)
      axios.post(`${process.env.url_api}/c/posts?onlySaveDb=true`, data)
         .then(() => {
            toast({
               ico: <CheckCircle className="mr-2 h-4 w-4" />,
               title: "Postagem salva com sucesso",
               className: "bg-green-600 text-white p-4"
            })
         })
         .catch(error => {
            toast({
               ico: <CircleX className="mr-2 h-4 w-4" />,
               title: "Erro ao salvar postagem",
               description: error?.response?.data?.message,
               className: "bg-red-600 text-white p-4"
            })
         })
         .finally(() => setIsLoadingSave(false))
   }

   const handleDelete = () => {

      const usuarioConfirmou = confirm("Essa ação não irá deletar a postagem no facebook, somente no banco. Deseja continuar?")
      if (!usuarioConfirmou) return

      setIsLoading(true)
      axios.delete(`${process.env.url_api}/c/posts?id=${data.id}`)
         .then(() => {
            toast({
               ico: <CheckCircle className="mr-2 h-4 w-4" />,
               title: "Postagem deletada com sucesso",
               className: "bg-green-600 text-white p-4"
            })
         })
         .catch(error => {
            toast({
               ico: <CircleX className="mr-2 h-4 w-4" />,
               title: "Erro ao deletar postagem",
               description: error?.response?.data?.message,
               className: "bg-red-600 text-white p-4"
            })
         })
         .finally(() => setIsLoading(false))
   }

   return (
      <div className="flex gap-2 mt-2 sm:flex-col">
         {!posted_at &&
            <LoadingButton
               variant="outline"
               isLoading={isLoading}
               loadingText='Postando...'
               onClick={handlePostFace}
               className={'w-full hover:bg-green-500 hover:text-white'}
            >
               <Facebook className="mr-2 h-4 w-4" />
               Postar no Face
            </LoadingButton>}

         {!posted_at &&
            <LoadingButton
               variant="outline"
               isLoading={isLoadingSave}
               loadingText='Salvando...'
               onClick={handleSaveDb}
               className={'w-full hover:bg-gray-950 hover:text-white'}
            >
               <Save className="mr-2 h-4 w-4" />
               Salvar no Banco
            </LoadingButton>}

         {posted_at &&
            <LoadingButton
               variant="outline"
               isLoading={isLoading}
               loadingText='Deletando...'
               onClick={handleDelete}
               className={'w-full hover:bg-red-500 hover:text-white'}
            >
               <Trash2 className="mr-2 h-4 w-4" />
               Deletar do Banco
            </LoadingButton>}
      </div>
   )
}