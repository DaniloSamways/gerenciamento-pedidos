export enum StatusPedido {
  NovoPedido = "Novo pedido",
  EmPreparo = "Em preparo",
  Finalizado = "Finalizado",
  Entregue = "Entregue",
  Cancelado = "Cancelado",
}

export enum FormaPagamento {
  PIX = "PIX",
  Dinheiro = "Dinheiro",
  Cartao = "Cartão",
  NaoDefinido = "Não definido",
}

export interface Pedido {
  id: string;
  dataCriado: string;
  nomeCompleto: string;
  whatsapp: string;
  detalhes: string;
  tipoEntrega: "retirada" | "entrega";
  enderecoEntrega?: string;
  dataEntrega: string;
  horaEntrega: string;
  valorTotal: number;
  status: StatusPedido;
  motivoCancelamento?: string;
  formaPagamento: FormaPagamento;
  pago: boolean;
}

export function getStatusColor(status: StatusPedido) {
  switch (status) {
    case StatusPedido.NovoPedido:
      return "bg-blue-100 text-blue-800 focus:bg-blue-200";
    case StatusPedido.EmPreparo:
      return "bg-yellow-100 text-yellow-800 focus:bg-yellow-200";
    case StatusPedido.Finalizado:
      return "bg-green-100 text-green-800 focus:bg-green-200";
    case StatusPedido.Entregue:
      return "bg-purple-100 text-purple-800 focus:bg-purple-200";
    case StatusPedido.Cancelado:
      return "bg-red-100 text-red-800 focus:bg-red-200";
    default:
      return "bg-gray-100 text-gray-800 focus:bg-gray-200";
  }
}
