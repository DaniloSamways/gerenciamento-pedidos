"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { pedidoService } from "../../../../services/pedidoService"
import { StatusPedido, FormaPagamento } from "../../../../types/pedido"
import InputMask from "react-input-mask-next"
import { Checkbox } from "@/components/ui/checkbox"

const formSchema = z.object({
  nomeCompleto: z.string().min(3, {
    message: "Nome deve ter pelo menos 3 caracteres.",
  }),
  whatsapp: z.string().regex(/^$$\d{2}$$ \d \d{4}-\d{4}$/, {
    message: "Formato inválido. Use (XX) X XXXX-XXXX",
  }),
  detalhes: z.string().min(10, {
    message: "Detalhes devem ter pelo menos 10 caracteres.",
  }),
  tipoEntrega: z.enum(["retirada", "entrega"]),
  enderecoEntrega: z.string().optional(),
  dataEntrega: z.date({
    required_error: "A data de entrega é obrigatória.",
  }),
  valorTotal: z.string().regex(/^R\$ \d{1,3}(\.\d{3})*,\d{2}$/, {
    message: "Formato inválido. Use R$ X.XXX,XX",
  }),
  status: z.nativeEnum(StatusPedido),
  motivoCancelamento: z.string().optional(),
  formaPagamento: z.nativeEnum(FormaPagamento),
  pago: z.boolean(),
})

export default function EditarPedido({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [date, setDate] = useState<Date | undefined>(undefined)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nomeCompleto: "",
      whatsapp: "",
      detalhes: "",
      tipoEntrega: "retirada",
      enderecoEntrega: "",
      valorTotal: "",
      status: StatusPedido.NovoPedido,
      formaPagamento: FormaPagamento.NaoDefinido,
      pago: false,
    },
  })

  useEffect(() => {
    const pedido = pedidoService.obterPedidoPorId(params.id)
    if (pedido) {
      const dataEntrega = new Date(pedido.dataEntrega)
      setDate(dataEntrega)
      form.reset({
        ...pedido,
        dataEntrega: dataEntrega,
        valorTotal: `R$ ${pedido.valorTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      })
    } else {
      router.push("/pedidos")
    }
  }, [params.id, form, router])

  function onSubmit(values: z.infer<typeof formSchema>) {
    const valorTotalNumerico = Number.parseFloat(
      values.valorTotal.replace("R$ ", "").replace(".", "").replace(",", "."),
    )
    const pedidoAtualizado = pedidoService.atualizarPedido(params.id, {
      ...values,
      valorTotal: valorTotalNumerico,
      dataEntrega: values.dataEntrega.toISOString(),
    })
    if (pedidoAtualizado) {
      router.push("/pedidos")
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6 text-pastel-800">Editar Pedido</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="nomeCompleto"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Completo</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="whatsapp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>WhatsApp</FormLabel>
                <FormControl>
                  <InputMask
                    mask="(99) 9 9999-9999"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="(XX) X XXXX-XXXX"
                  >
                    {(inputProps: any) => <Input {...inputProps} />}
                  </InputMask>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="detalhes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Detalhes do Pedido</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tipoEntrega"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Entrega</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de entrega" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="retirada">Retirada</SelectItem>
                    <SelectItem value="entrega">Entrega</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {form.watch("tipoEntrega") === "entrega" && (
            <FormField
              control={form.control}
              name="enderecoEntrega"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço de Entrega</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="dataEntrega"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data de Entrega</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn("w-[240px] pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                      >
                        {field.value ? format(field.value, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        setDate(date)
                        field.onChange(date)
                      }}
                      disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="valorTotal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor Total</FormLabel>
                <FormControl>
                  <InputMask
                    mask="R$ 999.999,99"
                    value={field.value}
                    onChange={field.onChange}
                    maskChar={null}
                    placeholder="R$ 0,00"
                  >
                    {(inputProps: any) => <Input {...inputProps} />}
                  </InputMask>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(StatusPedido).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {form.watch("status") === StatusPedido.Cancelado && (
            <FormField
              control={form.control}
              name="motivoCancelamento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivo do Cancelamento</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="formaPagamento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Forma de Pagamento</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a forma de pagamento" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(FormaPagamento).map((forma) => (
                      <SelectItem key={forma} value={forma}>
                        {forma}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pago"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Pedido Pago</FormLabel>
                  <FormDescription>Marque esta caixa se o pedido já foi pago.</FormDescription>
                </div>
              </FormItem>
            )}
          />
          <Button type="submit">Atualizar Pedido</Button>
        </form>
      </Form>
    </div>
  )
}

