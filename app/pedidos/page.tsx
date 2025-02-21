"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { pedidoService } from "../../services/pedidoService"
import { type Pedido, StatusPedido, FormaPagamento } from "../../types/pedido"
import PedidoModal from "../../components/PedidoModal"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"

export default function Pedidos() {
  const router = useRouter()
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [filtro, setFiltro] = useState("")
  const [pedidoSelecionado, setPedidoSelecionado] = useState<Pedido | null>(null)

  useEffect(() => {
    const todosPedidos = pedidoService.obterTodosPedidos()
    setPedidos(todosPedidos)
  }, [])

  const handleFiltroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiltro(e.target.value)
  }

  const aplicarFiltro = () => {
    const pedidosFiltrados = pedidoService.filtrarPedidos({
      termo: filtro,
    })
    setPedidos(pedidosFiltrados)
  }

  const handleStatusChange = (id: string, novoStatus: StatusPedido) => {
    const pedidoAtualizado = pedidoService.atualizarStatusPedido(id, novoStatus)
    if (pedidoAtualizado) {
      setPedidos((prev) => prev.map((p) => (p.id === id ? pedidoAtualizado : p)))
    }
  }

  const getStatusColor = (status: StatusPedido) => {
    switch (status) {
      case StatusPedido.NovoPedido:
        return "bg-blue-100 text-blue-800"
      case StatusPedido.EmPreparo:
        return "bg-yellow-100 text-yellow-800"
      case StatusPedido.Finalizado:
        return "bg-green-100 text-green-800"
      case StatusPedido.Entregue:
        return "bg-purple-100 text-purple-800"
      case StatusPedido.Cancelado:
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatarValor = (valor: number) => {
    return valor.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  const formatarData = (data: string) => {
    return new Date(data).toLocaleString("pt-BR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleFormaPagamentoChange = (id: string, novaFormaPagamento: FormaPagamento) => {
    const pedidoAtualizado = pedidoService.atualizarFormaPagamento(id, novaFormaPagamento)
    if (pedidoAtualizado) {
      setPedidos((prev) => prev.map((p) => (p.id === id ? pedidoAtualizado : p)))
    }
  }

  const handlePagoToggle = (id: string) => {
    const pedidoAtualizado = pedidoService.alternarPago(id)
    if (pedidoAtualizado) {
      setPedidos((prev) => prev.map((p) => (p.id === id ? pedidoAtualizado : p)))
    }
  }

  return (
    <div className="space-y-6">
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
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
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
                Pagamento
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-pastel-500 uppercase tracking-wider">Pago</th>
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-pastel-500">{pedido.whatsapp}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-pastel-500">
                  R$ {formatarValor(pedido.valorTotal)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-pastel-500">
                  {formatarData(pedido.dataEntrega)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Select
                    value={pedido.status}
                    onValueChange={(value) => handleStatusChange(pedido.id, value as StatusPedido)}
                  >
                    <SelectTrigger className={`w-[180px] ${getStatusColor(pedido.status)}`}>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(StatusPedido).map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Select
                    value={pedido.formaPagamento}
                    onValueChange={(value) => handleFormaPagamentoChange(pedido.id, value as FormaPagamento)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Forma de Pagamento" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(FormaPagamento).map((forma) => (
                        <SelectItem key={forma} value={forma}>
                          {forma}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handlePagoToggle(pedido.id)}
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      pedido.pago ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
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
                    Editar
                  </Button>
                  <Button variant="outline" onClick={() => setPedidoSelecionado(pedido)}>
                    Visualizar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pedidoSelecionado && <PedidoModal pedido={pedidoSelecionado} onClose={() => setPedidoSelecionado(null)} />}
    </div>
  )
}

