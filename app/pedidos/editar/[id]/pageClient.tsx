"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { orderService } from "../../../../services/pedidoService";
import {
  OrderStatus,
  PaymentMethod,
  getStatusColor,
} from "../../../../types/pedido";
import InputMask from "react-input-mask";
import { Checkbox } from "@/components/ui/checkbox";
import { updateOrderSchema } from "@/schemas/orderSchemas";
import { formatValue } from "@/utils/formatValue";

export function EditarPedido({ params }: { params: { id: string } }) {
  const router = useRouter();

  const form = useForm<z.infer<typeof updateOrderSchema>>({
    resolver: zodResolver(updateOrderSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      details: "",
      deliveryType: "retirada",
      deliveryAddress: "",
      orderValue: "R$ 0,00",
      deliveryTime: "",
      paymentMethod: PaymentMethod.NaoDefinido,
      paid: false,
      status: OrderStatus.NovoPedido,
      cancellationReason: "",
    },
  });

  async function fetchOrder() {
    const order = await orderService
      .getOrderById(params.id)
      .then((data) => data?.[0])
      .catch((error) => {
        console.error(error);
        return router.push("/pedidos");
      });

    if (order) {
      const deliveryDate = new Date(order.deliveryDate);

      form.reset({
        ...order,
        cancellationReason: order.cancellationReason || "",
        deliveryDate: deliveryDate,
        orderValue: formatValue(order.orderValue),
      });
    } else {
      router.push("/pedidos");
    }
  }

  useEffect(() => {
    fetchOrder();
  }, [params.id, form, router]);

  async function onSubmit(values: z.infer<typeof updateOrderSchema>) {
    if (values.deliveryType === "entrega" && !values.deliveryAddress) {
      form.setError("deliveryAddress", {
        type: "manual",
      });
      return;
    }

    if (values.status === OrderStatus.Cancelado && !values.cancellationReason) {
      form.setError("cancellationReason", {
        type: "manual",
      });
      return;
    }

    const updatedOrder = await orderService.updateOrder(params.id, {
      ...values,
      orderValue: parseFloat(
        values.orderValue?.replace(/[^\d,]/g, "").replace(",", ".")!
      ),
      deliveryDate: values.deliveryDate!.toISOString(),
    });
    if (updatedOrder) {
      router.push("/pedidos");
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow text-primary-900">
      <h1 className="text-2xl font-bold mb-6 text-primary-900">
        Editar Pedido
      </h1>
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
                    placeholder="Descreva os details do pedido"
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
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger
                      className={`w-[150px] h-6 ${getStatusColor(
                        field.value!
                      )} rounded-full text-xs font-semibold`}
                    >
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(OrderStatus).map((status) => (
                      <SelectItem
                        key={status}
                        value={status}
                        className={`${getStatusColor(status)} my-2 rounded`}
                      >
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {form.watch("status") === OrderStatus.Cancelado && (
            <FormField
              control={form.control}
              name="cancellationReason"
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
            name="paid"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Pedido Pago</FormLabel>
                  <FormDescription>
                    Marque esta caixa se o pedido já foi pago.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          <Button type="submit">Atualizar Pedido</Button>
        </form>
      </Form>
    </div>
  );
}
