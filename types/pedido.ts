export enum OrderStatus {
  NovoPedido = "Novo pedido",
  EmPreparo = "Em preparo",
  Finalizado = "Finalizado",
  Entregue = "Entregue",
  Cancelado = "Cancelado",
}

export enum PaymentMethod {
  PIX = "PIX",
  Dinheiro = "Dinheiro",
  Cartao = "Cartão",
  NaoDefinido = "Não definido",
}

export interface Order {
  id: string;
  createdAt: string;
  fullName: string;
  phone: string;
  details: string;
  deliveryType: "retirada" | "entrega";
  deliveryAddress?: string;
  deliveryDate: string;
  deliveryTime: string;
  orderValue: number;
  status: OrderStatus;
  cancellationReason?: string | null;
  paymentMethod: PaymentMethod;
  paid: boolean;
}

export function getStatusColor(status: OrderStatus) {
  switch (status) {
    case OrderStatus.NovoPedido:
      return "bg-blue-100 text-blue-800 focus:bg-blue-200 focus:text-blue-900 focus:ring-blue-800";
    case OrderStatus.EmPreparo:
      return "bg-yellow-100 text-yellow-800 focus:bg-yellow-200 focus:text-yellow-900 focus:ring-yellow-800";
    case OrderStatus.Finalizado:
      return "bg-green-100 text-green-800 focus:bg-green-200 focus:text-green-900 focus:ring-green-800";
    case OrderStatus.Entregue:
      return "bg-purple-100 text-purple-800 focus:bg-purple-200 focus:text-purple-900 focus:ring-purple-800";
    case OrderStatus.Cancelado:
      return "bg-red-100 text-red-800 focus:bg-red-200 focus:text-red-900 focus:ring-red-800";
    default:
      return "bg-gray-100 text-gray-800 focus:bg-gray-200 focus:text-gray-900 focus:ring-gray-800";
  }
}
