"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { CheckCircle, CircleX, Save, Settings } from "lucide-react"
import { Input } from "../ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form"
import { Checkbox } from "../ui/checkbox"
import LoadingButton from "./LoadingButton"
import axios from "axios"
import { useToast } from "../ui/use-toast"

export default ({ config }) => {

   const { toast } = useToast()

   const [isShowPass, setIsShowPass] = useState(false)
   const [isLoading, setIsLoading] = useState()

   const form = useForm({
      defaultValues: config,
   })

   const onSubmit = (data) => {
      setIsLoading(true)
      axios.post(`${process.env.url_api}/c/credentials`, data)
         .then(() => {
            toast({
               ico: <CheckCircle className="mr-2 h-4 w-4" />,
               title: "Configurações salvas com sucesso",
               className: "bg-green-600 text-white p-4"
            })
         })
         .catch(error => {
            toast({
               ico: <CircleX className="mr-2 h-4 w-4" />,
               title: "Email ou senha inválidos",
               description: error?.response?.data?.message,
               className: "bg-red-600 text-white p-4"
            })
         })
         .finally(() => setIsLoading(false))
   }

   return (
      <Dialog>
         <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="absolute right-3 text-white hover:text-gray-800">
               <Settings />
            </Button>
         </DialogTrigger>

         <DialogContent className="sm:max-w-[425px]">

            <DialogHeader>
               <DialogTitle>Configuração</DialogTitle>
               <DialogDescription>
                  Adicione seu email e senha do facebook.
               </DialogDescription>
            </DialogHeader>

            <Form {...form}>
               <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" >

                  <FormField
                     control={form.control}
                     name="email"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Email</FormLabel>
                           <FormControl>
                              <Input placeholder="email" {...field} />
                           </FormControl>
                        </FormItem>
                     )}
                  />

                  <FormField
                     control={form.control}
                     name="senha"
                     render={({ field }) => (
                        <FormItem >
                           <FormLabel>Senha</FormLabel>
                           <FormControl>
                              <Input type={isShowPass || 'password'} placeholder="senha" {...field} />
                           </FormControl>
                           <div className="flex items-center space-x-2">
                              <Checkbox id="show-pass" checked={isShowPass} onCheckedChange={() => setIsShowPass(!isShowPass)} />
                              <label
                                 htmlFor="show-pass"
                                 className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                 Mostrar Senha
                              </label>
                           </div>
                        </FormItem>
                     )}
                  />

                  <FormField
                     control={form.control}
                     name="qtd_total_posts"
                     render={({ field }) => (
                        <FormItem >
                           <FormLabel>Total de post</FormLabel>
                           <FormControl>
                              <Input type='number' placeholder="20" {...field} />
                           </FormControl>
                        </FormItem>
                     )}
                  />

                  <FormField
                     control={form.control}
                     name="time_in_second_between_posts"
                     render={({ field }) => (
                        <FormItem >
                           <FormLabel>Tempo entre posts (segundos)</FormLabel>
                           <FormControl>
                              <Input type='number' placeholder="2000" {...field} />
                           </FormControl>
                        </FormItem>
                     )}
                  />

                  <DialogFooter>
                     <LoadingButton
                        isLoading={isLoading}
                        loadingText='Salvando...'
                        ype="submit"
                     >
                        <Save className="mr-2 h-4 w-4" />
                        Salvar Configurações
                     </LoadingButton>
                  </DialogFooter>
               </form>
            </Form>

         </DialogContent>
      </Dialog >
   )
}