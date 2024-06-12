"use client"

import axios from "axios"
import { Form, FormField, FormItem } from "../ui/form"
import { Label } from "../ui/label"
import { Switch } from "../ui/switch"
import { useForm } from "react-hook-form"
import { useToast } from "../ui/use-toast"
import { CheckCircle, CircleX } from "lucide-react"

export default ({ isActive }) => {

   const { toast } = useToast()
   const form = useForm({ defaultValues: { isActive } })

   const onSubmit = ({ isActive }) => {
      axios.post(`${process.env.url_api}/c/cron`, {isActive})
         .then(() => {
            toast({
               ico: <CheckCircle className="mr-2 h-4 w-4" />,
               title: `Postagem Automática ${isActive ? 'habilitada' : 'desabilitada'} com sucesso`,
               className: "bg-green-600 text-white p-4"
            })
         })
         .catch(error => {
            toast({
               ico: <CircleX className="mr-2 h-4 w-4" />,
               title: `Error ao  ${isActive ? 'habilitar' : 'desabilitar'} a Postagem Automática`,
               description: error?.response?.data?.message,
               className: "bg-red-600 text-white p-4"
            })
         })
   }

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
               control={form.control}
               name="isActive"
               render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                     <Switch id="airplane-mode" checked={field.value} onCheckedChange={field.onChange} type="submit" />
                     <Label htmlFor="airplane-mode" className="cursor-pointer !m-0 !ml-2">
                        Postagem automática {field.value ? 'habilitada' : 'desabilitada'}
                     </Label>
                  </FormItem>
               )}
            />
         </form>
      </Form >
   )
}