"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { pedidoService } from "../../../services/pedidoService";
import InputMask from "react-input-mask";
import { FormaPagamento } from "../../../types/pedido";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z
  .object({
    nomeCompleto: z.string().min(3, {
      message: "Nome deve ter pelo menos 3 caracteres.",
    }),
    whatsapp: z.string().regex(/^\(?(\d{2})\)?\s?9?\s?\d{4}-?\d{4}$/, {
      message: "Número de WhatsApp inválido.",
    }),
    detalhes: z.string().min(10, {
      message: "Detalhes devem ter pelo menos 10 caracteres.",
    }),
    tipoEntrega: z.enum(["retirada", "entrega"]),
    enderecoEntrega: z.string().optional(),
    dataEntrega: z.date({
      required_error: "A data de entrega é obrigatória.",
    }),
    horaEntrega: z.string({
      required_error: "A hora de entrega é obrigatória.",
    }),
    valorTotal: z.string({
      required_error: "O valor total é obrigatório.",
    }),
    formaPagamento: z.nativeEnum(FormaPagamento),
  })
  .superRefine((data, ctx) => {
    if (data.tipoEntrega === "entrega" && !data.enderecoEntrega) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "O endereço de entrega é obrigatório",
        path: ["enderecoEntrega"],
      });
    }
  });

export default function NovoPedido() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nomeCompleto: "",
      whatsapp: "",
      detalhes: "",
      tipoEntrega: "retirada",
      enderecoEntrega: "",
      valorTotal: "R$ 0,00",
      horaEntrega: "",
      formaPagamento: FormaPagamento.NaoDefinido,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.tipoEntrega === "entrega" && !values.enderecoEntrega) {
      form.setError("enderecoEntrega", {
        type: "manual",
      });
      return;
    }

    const valorTotalNumerico = Number.parseFloat(
      values.valorTotal.replace("R$ ", "").replace(".", "").replace(",", ".")
    );
    const novoPedido = pedidoService.criarPedido({
      ...values,
      valorTotal: valorTotalNumerico,
      dataEntrega: values.dataEntrega.toISOString(),
    });
    router.push("/pedidos");
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6 text-pastel-800">Novo Pedido</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="nomeCompleto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do cliente" {...field} />
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
                    >
                      {(inputProps: any) => (
                        <Input
                          placeholder="Número de celular do cliente"
                          ref={field.ref}
                          {...inputProps}
                        />
                      )}
                    </InputMask>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="detalhes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Detalhes do Pedido</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Descreva os detalhes do pedido"
                    {...field}
                  />
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
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
                    <Input placeholder="Endereço completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <div className="grid grid-cols-2 gap-4 items-start">
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
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: ptBR })
                          ) : (
                            <span>Escolha um dia</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={{ before: new Date() }}
                        initialFocus
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="horaEntrega"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Hora de Entrega</FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      placeholder="Escolha um horário"
                      {...field}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 items-end">
            <FormField
              control={form.control}
              name="valorTotal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor Total</FormLabel>
                  <FormControl>
                    <Input
                      id="value"
                      name="value"
                      type="text"
                      value={field.value}
                      onChange={(e) => {
                        const value = e.target.value;
                        const numericValue = value.replace(/[^0-9]/g, "");
                        const formattedValue = new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(Number(numericValue) / 100);

                        field.onChange(formattedValue);
                      }}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="formaPagamento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Forma de Pagamento</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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
          </div>
          <Button variant={"default"} type="submit">
            Cadastrar Pedido
          </Button>
        </form>
      </Form>
    </div>
  );
}
