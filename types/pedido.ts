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
  id: string
  nomeCompleto: string
  whatsapp: string
  detalhes: string
  tipoEntrega: "retirada" | "entrega"
  enderecoEntrega?: string
  dataEntrega: string
  valorTotal: number
  status: StatusPedido
  motivoCancelamento?: string
  formaPagamento: FormaPagamento
  pago: boolean
}

