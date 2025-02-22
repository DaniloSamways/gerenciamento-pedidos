"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { orderService } from "../../services/pedidoService";
import {
  type Order,
  OrderStatus,
  PaymentMethod,
  getStatusColor,
} from "../../types/pedido";
import PedidoModal from "../../components/PedidoModal";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Edit, Eye } from "lucide-react";

export default function Orders() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  async function fetchOrders() {
    try {
      const allOrders = await orderService.getAllOrders();
      setOrders(allOrders);
    } catch (error: any) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  const applyFilter = async () => {
    const filteredOrders = await orderService.filterOrders({
      term: filter,
    });
    setOrders(filteredOrders);
  };

  const handleStatusChange = async (id: string, newStatus: OrderStatus) => {
    const updatedOrder = await orderService.updateOrderStatus(id, newStatus);
    if (updatedOrder) {
      setOrders((prev) => prev.map((p) => (p.id === id ? updatedOrder : p)));
    }
  };

  const formatValue = (val: number) => {
    return val.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatDate = (date: string, time: string) => {
    return `${new Date(date).toLocaleString("pt-BR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })}, ${time}`;
  };

  const handlePaymentMethodChange = async (
    id: string,
    newPaymentMethod: PaymentMethod
  ) => {
    const updatedOrder = await orderService.updatePaymentMethod(
      id,
      newPaymentMethod
    );
    if (updatedOrder) {
      setOrders((prev) => prev.map((p) => (p.id === id ? updatedOrder : p)));
    }
  };

  const handlePaidToggle = async (id: string) => {
    const updatedOrder = await orderService.togglePaid(id);
    if (updatedOrder) {
      setOrders((prev) => prev.map((p) => (p.id === id ? updatedOrder : p)));
    }
  };

  return (
    <div className="flex flex-col gap-6 mt-8">
      <h1 className="text-2xl font-bold text-pastel-800">Todos os Pedidos</h1>
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <div className="flex gap-4">
          <Input
            type="text"
            placeholder="Filtrar por nome ou telefone"
            value={filter}
            onChange={handleFilterChange}
            className="flex-grow"
          />

          <Button onClick={applyFilter}>Aplicar Filtro</Button>
        </div>
      </div>
      <div className="bg-white shadow overflow-x-scroll sm:rounded-lg">
        <table className="min-w-full divide-y divide-pastel-200">
          <thead className="bg-pastel-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-pastel-500 uppercase tracking-wider"
              >
                Nome
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-pastel-500 uppercase tracking-wider"
              >
                Telefone
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-pastel-500 uppercase tracking-wider"
              >
                Valor Total
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-pastel-500 uppercase tracking-wider"
              >
                Data Entrega
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-pastel-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-pastel-500 uppercase tracking-wider">
                Pago
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-pastel-500 uppercase tracking-wider"
              >
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-pastel-200">
            {orders?.map((pedido) => (
              <tr key={pedido.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-pastel-900">
                  {pedido.fullName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-pastel-500">
                  {pedido.phone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-pastel-500">
                  R$ {formatValue(pedido.orderValue)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-pastel-500">
                  {formatDate(pedido.deliveryDate, pedido.deliveryTime)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Select
                    value={pedido.status}
                    onValueChange={(value) =>
                      handleStatusChange(pedido.id, value as OrderStatus)
                    }
                  >
                    <SelectTrigger
                      className={`w-[150px] h-6 ${getStatusColor(
                        pedido.status
                      )} rounded-full text-xs font-semibold`}
                    >
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {Object.values(OrderStatus).map((status) => (
                        <SelectItem
                          key={status}
                          value={status}
                          className={`${getStatusColor(
                            status
                          )} my-2 rounded-xl`}
                        >
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handlePaidToggle(pedido.id)}
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      pedido.paid
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {pedido.paid ? "Sim" : "Não"}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/pedidos/editar/${pedido.id}`)}
                    className="mr-2"
                  >
                    <Edit />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedOrder(pedido)}
                  >
                    <Eye />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedOrder && (
        <PedidoModal
          pedido={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}
