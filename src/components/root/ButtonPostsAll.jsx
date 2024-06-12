"use client"

import { useState } from "react"
import { CheckCircle, CircleX, Facebook, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Checkbox } from "../ui/checkbox"
import axios from "axios"
import LoadingButton from "./LoadingButton"

export default ({ show_browser }) => {

    const { toast } = useToast()

    const [isLoadingPost, setIsLoadingPost] = useState()
    const [isLoadingDelete, setIsLoadingDelete] = useState()
    const [showBrowser, setShowBrouser] = useState(show_browser)

    const handleChangeShowBrwser = () => {
        setShowBrouser(!showBrowser)
        axios.post(`${process.env.url_api}/c`, { show_browser: !showBrowser })
    }

    const handlePostFace = () => {
        setIsLoadingPost(true)
        axios.post(`${process.env.url_api}/c/postsAll`)
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
                    title: "Erro ao realizar a postagem",
                    description: error?.response?.data?.message,
                    className: "bg-red-600 text-white p-4"
                })
            })
            .finally(() => setIsLoadingPost(false))
    }

    const handleDelete = () => {

        const usuarioConfirmou = confirm("Essa ação não irá deletar a postagem no facebook, somente no banco. Deseja continuar?")
        if (!usuarioConfirmou) return

        setIsLoadingDelete(true)
        axios.delete(`${process.env.url_api}/c/postsAll`)
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
                    title: "Erro ao deletar a postagem",
                    description: error?.response?.data?.message,
                    className: "bg-red-600 text-white p-4"
                })
            })
            .finally(() => setIsLoadingDelete(false))
    }

    return (
        <div className="space-y-2">

            <div className="flex gap-2 mt-2">
                <LoadingButton
                    isLoading={isLoadingPost}
                    loadingText='Postando...'
                    onClick={handlePostFace}
                    className={'w-full bg-green-500 hover:bg-green-700'}
                >
                    <Facebook className="mr-2 h-4 w-4" />
                    Postar no Face
                </LoadingButton>

                <LoadingButton
                    isLoading={isLoadingDelete}
                    loadingText='Deletando...'
                    onClick={handleDelete}
                    className={'w-full bg-red-500 hover:bg-red-700 hover:text-white'}
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Limpar Banco
                </LoadingButton>
            </div>
            <div className="flex items-center space-x-2">
                <Checkbox id="show-browser"
                    checked={showBrowser}
                    onCheckedChange={handleChangeShowBrwser}
                />
                <label
                    htmlFor="show-browser"
                    className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    Mostrar Navegador
                </label>
            </div>
        </div>
    )
}