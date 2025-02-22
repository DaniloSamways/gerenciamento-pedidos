"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { pedidoService } from "../../services/pedidoService";
import {
  type Pedido,
  StatusPedido,
  FormaPagamento,
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

export default function Pedidos() {
  const router = useRouter();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [filtro, setFiltro] = useState("");
  const [pedidoSelecionado, setPedidoSelecionado] = useState<Pedido | null>(
    null
  );

  useEffect(() => {
    const todosPedidos = pedidoService.obterTodosPedidos();
    setPedidos(todosPedidos);
  }, []);

  const handleFiltroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiltro(e.target.value);
  };

  const aplicarFiltro = () => {
    const pedidosFiltrados = pedidoService.filtrarPedidos({
      termo: filtro,
    });
    setPedidos(pedidosFiltrados);
  };

  const handleStatusChange = (id: string, novoStatus: StatusPedido) => {
    const pedidoAtualizado = pedidoService.atualizarStatusPedido(
      id,
      novoStatus
    );
    if (pedidoAtualizado) {
      setPedidos((prev) =>
        prev.map((p) => (p.id === id ? pedidoAtualizado : p))
      );
    }
  };

  const formatarValor = (valor: number) => {
    return valor.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatarData = (data: string, hora: string) => {
    return `${new Date(data).toLocaleString("pt-BR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })}, ${hora}`;
  };

  const handleFormaPagamentoChange = (
    id: string,
    novaFormaPagamento: FormaPagamento
  ) => {
    const pedidoAtualizado = pedidoService.atualizarFormaPagamento(
      id,
      novaFormaPagamento
    );
    if (pedidoAtualizado) {
      setPedidos((prev) =>
        prev.map((p) => (p.id === id ? pedidoAtualizado : p))
      );
    }
  };

  const handlePagoToggle = (id: string) => {
    const pedidoAtualizado = pedidoService.alternarPago(id);
    if (pedidoAtualizado) {
      setPedidos((prev) =>
        prev.map((p) => (p.id === id ? pedidoAtualizado : p))
      );
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
            value={filtro}
            onChange={handleFiltroChange}
            className="flex-grow"
          />

          <Button onClick={aplicarFiltro}>Aplicar Filtro</Button>
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
            {pedidos.map((pedido) => (
              <tr key={pedido.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-pastel-900">
                  {pedido.nomeCompleto}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-pastel-500">
                  {pedido.whatsapp}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-pastel-500">
                  R$ {formatarValor(pedido.valorTotal)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-pastel-500">
                  {formatarData(pedido.dataEntrega, pedido.horaEntrega)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Select
                    value={pedido.status}
                    onValueChange={(value) =>
                      handleStatusChange(pedido.id, value as StatusPedido)
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
                      {Object.values(StatusPedido).map((status) => (
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
                    onClick={() => handlePagoToggle(pedido.id)}
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      pedido.pago
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {pedido.pago ? "Sim" : "Não"}
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
                    onClick={() => setPedidoSelecionado(pedido)}
                  >
                    <Eye />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pedidoSelecionado && (
        <PedidoModal
          pedido={pedidoSelecionado}
          onClose={() => setPedidoSelecionado(null)}
        />
      )}
    </div>
  );
}
