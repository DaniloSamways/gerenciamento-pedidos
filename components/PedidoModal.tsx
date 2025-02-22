import { cn } from "@/lib/utils";
import { getStatusColor, type Pedido } from "../types/pedido";
import { Button } from "./ui/button";

interface PedidoModalProps {
  pedido: Pedido;
  onClose: () => void;
}

export default function PedidoModal({ pedido, onClose }: PedidoModalProps) {
  const formatarValor = (valor: number) => {
    return valor.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatarData = (data: string, hora?: string) => {
    if (hora) {
      return `${new Date(data).toLocaleString("pt-BR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })}, ${hora}`;
    }

    return new Date(data).toLocaleString("pt-BR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
      onClick={onClose}
    >
      <div
        className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-pastel-900">
            Detalhes do Pedido{" "}
            <span className="text-sm text-pastel-500">- {pedido.id}</span>
          </h3>
          <div className="flex flex-col gap-4 mt-2 px-7 py-3 text-left text-sm text-pastel-500">
            <div>
              <span className="font-bold text-base">Criado em</span>
              <p>{formatarData(pedido.dataCriado, pedido.horaEntrega)}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="font-bold text-base">Status</span>
                <p
                  className={cn(
                    "rounded-xl max-w-fit px-2 py-1 text-xs",
                    getStatusColor(pedido.status)
                  )}
                >
                  {pedido.status}
                </p>
              </div>

              <div>
                <span className="font-bold text-base">Pago</span>
                <p
                  className={`px-2 py-1 max-w-fit rounded-full text-xs font-semibold ${
                    pedido.pago
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {pedido.pago ? "Sim" : "Não"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="font-bold text-base">Nome</span>
                <p>{pedido.nomeCompleto}</p>
              </div>

              <div>
                <span className="font-bold text-base">WhatsApp</span>
                <p>{pedido.whatsapp}</p>
              </div>
            </div>

            <div>
              <span className="font-bold text-base">Detalhes</span>
              <p>{pedido.detalhes}</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="font-bold text-base">Tipo de Entrega</span>
                <p>{pedido.tipoEntrega.toUpperCase()}</p>
              </div>
              <div>
                <span className="font-bold text-base">Data de Entrega</span>
                <p>{formatarData(pedido.dataEntrega, pedido.horaEntrega)}</p>
              </div>
            </div>

            {pedido.tipoEntrega === "entrega" && (
              <div>
                <span className="font-bold text-base">Endereço</span>
                <p>{pedido.enderecoEntrega}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="font-bold text-base">Valor Total</span>
                <p>R$ {formatarValor(pedido.valorTotal)}</p>
              </div>

              <div>
                <span className="font-bold text-base">Forma de Pagamento</span>
                <p>{pedido.formaPagamento}</p>
              </div>
            </div>

            {pedido.status === "Cancelado" && pedido.motivoCancelamento && (
              <div>
                <span className="font-bold text-base">
                  Motivo do Cancelamento
                </span>
                <p>{pedido.motivoCancelamento}</p>
              </div>
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
  );
}
