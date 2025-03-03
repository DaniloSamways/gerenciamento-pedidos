"use client";

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
import { orderService } from "../../../services/pedidoService";
import InputMask from "react-input-mask";
import { PaymentMethod } from "../../../types/pedido";
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
import { createOrderSchema } from "@/schemas/orderSchemas";

export function NovoPedido() {
  const router = useRouter();

  const form = useForm<z.infer<typeof createOrderSchema>>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      userId: "67b932c6bcc4e92a3fe5cf25",
      fullName: "",
      phone: "",
      details: "",
      deliveryType: "retirada",
      deliveryAddress: "",
      orderValue: "R$ 0,00",
      deliveryTime: "",
      paymentMethod: PaymentMethod.NaoDefinido,
    },
  });

  async function onSubmit(values: z.infer<typeof createOrderSchema>) {
    if (values.deliveryType === "entrega" && !values.deliveryAddress) {
      form.setError("deliveryAddress", {
        type: "manual",
      });
      return;
    }

    await orderService.createOrder({
      ...values,
      orderValue: parseFloat(
        values.orderValue.replace(/[^\d,]/g, "").replace(",", ".")
      ),
      deliveryDate: values.deliveryDate.toISOString(),
    });

    router.push("/pedidos");
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow text-primary-900">
      <h1 className="text-2xl font-bold mb-6 text-primary-900">Novo Pedido</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, (err) => console.log(err))}
          className="space-y-8"
        >
          <div className="grid grid-cols-2 gap-4 items-start">
            <FormField
              control={form.control}
              name="fullName"
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
              name="phone"
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
            name="details"
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
            name="deliveryType"
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
          {form.watch("deliveryType") === "entrega" && (
            <FormField
              control={form.control}
              name="deliveryAddress"
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
              name="deliveryDate"
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
              name="deliveryTime"
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

          <div className="grid grid-cols-2 gap-4 items-start">
            <FormField
              control={form.control}
              name="orderValue"
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
              name="paymentMethod"
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
                      {Object.values(PaymentMethod).map((forma) => (
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
