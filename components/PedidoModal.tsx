import type { Pedido } from "../types/pedido"
import { Button } from "./ui/button"

interface PedidoModalProps {
  pedido: Pedido
  onClose: () => void
}

export default function PedidoModal({ pedido, onClose }: PedidoModalProps) {
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

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" onClick={onClose}>
      <div
        className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-pastel-900">Detalhes do Pedido</h3>
          <div className="mt-2 px-7 py-3">
            <p className="text-sm text-pastel-500">ID: {pedido.id}</p>
            <p className="text-sm text-pastel-500">Nome: {pedido.nomeCompleto}</p>
            <p className="text-sm text-pastel-500">WhatsApp: {pedido.whatsapp}</p>
            <p className="text-sm text-pastel-500">Detalhes: {pedido.detalhes}</p>
            <p className="text-sm text-pastel-500">Tipo de Entrega: {pedido.tipoEntrega}</p>
            {pedido.tipoEntrega === "entrega" && (
              <p className="text-sm text-pastel-500">Endereço: {pedido.enderecoEntrega}</p>
            )}
            <p className="text-sm text-pastel-500">Data de Entrega: {formatarData(pedido.dataEntrega)}</p>
            <p className="text-sm text-pastel-500">Valor Total: R$ {formatarValor(pedido.valorTotal)}</p>
            <p className="text-sm text-pastel-500">Status: {pedido.status}</p>
            {pedido.status === "Cancelado" && pedido.motivoCancelamento && (
              <p className="text-sm text-pastel-500">Motivo do Cancelamento: {pedido.motivoCancelamento}</p>
            )}
          </div>
        </div>
        <div className="items-center px-4 py-3">
          <Button onClick={onClose} className="w-full">
            Fechar
          </Button>
        </div>
      </div>
    </div>
  )
}

