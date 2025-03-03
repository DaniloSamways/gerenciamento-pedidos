import { type Order, OrderStatus, PaymentMethod } from "../types/pedido";

class GraphsService {
  private baseUrl = "/api/orders/graphs";

  async getMonthOrdersValue(): Promise<{ _id: string; totalSales: number }[]> {
    const response = await fetch(this.baseUrl + "/monthAmount");

    if (!response.ok) {
      throw new Error("Erro ao buscar pedidos.");
    }

    return response.json();
  }
}

export const graphsService = new GraphsService();
