import { type Pedido, StatusPedido, FormaPagamento } from "../types/pedido"

class PedidoService {
  private pedidos: Pedido[] = []

  criarPedido(pedido: Omit<Pedido, "id" | "status" | "formaPagamento" | "pago">): Pedido {
    const novoPedido: Pedido = {
      ...pedido,
      id: Date.now().toString(),
      status: StatusPedido.NovoPedido,
      formaPagamento: FormaPagamento.NaoDefinido,
      pago: false,
    }
    this.pedidos.push(novoPedido)
    return novoPedido
  }

  obterTodosPedidos(): Pedido[] {
    return this.pedidos
  }

  obterPedidoPorId(id: string): Pedido | undefined {
    return this.pedidos.find((pedido) => pedido.id === id)
  }

  atualizarPedido(id: string, dadosAtualizados: Partial<Pedido>): Pedido | undefined {
    const index = this.pedidos.findIndex((pedido) => pedido.id === id)
    if (index !== -1) {
      this.pedidos[index] = { ...this.pedidos[index], ...dadosAtualizados }
      return this.pedidos[index]
    }
    return undefined
  }

  atualizarStatusPedido(id: string, novoStatus: StatusPedido, motivoCancelamento?: string): Pedido | undefined {
    const pedido = this.obterPedidoPorId(id)
    if (pedido) {
      pedido.status = novoStatus
      if (novoStatus === StatusPedido.Cancelado) {
        pedido.motivoCancelamento = motivoCancelamento
      }
      return pedido
    }
    return undefined
  }

  filtrarPedidos(filtro: { termo?: string }): Pedido[] {
    if (!filtro.termo) {
      return this.pedidos
    }

    const termoLowerCase = filtro.termo.toLowerCase()
    return this.pedidos.filter(
      (pedido) => pedido.nomeCompleto.toLowerCase().includes(termoLowerCase) || pedido.whatsapp.includes(filtro.termo),
    )
  }

  atualizarFormaPagamento(id: string, formaPagamento: FormaPagamento): Pedido | undefined {
    const pedido = this.obterPedidoPorId(id)
    if (pedido) {
      pedido.formaPagamento = formaPagamento
      return pedido
    }
    return undefined
  }

  alternarPago(id: string): Pedido | undefined {
    const pedido = this.obterPedidoPorId(id)
    if (pedido) {
      pedido.pago = !pedido.pago
      return pedido
    }
    return undefined
  }
}

export const pedidoService = new PedidoService()

