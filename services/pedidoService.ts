import { type Order, OrderStatus, PaymentMethod } from "../types/pedido";

class OrderService {
  private baseUrl = "/api/orders";

  async createOrder(
    order: Omit<Order, "id" | "status" | "paymentMethod" | "paid" | "createdAt">
  ): Promise<Order> {
    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...order, userId: "67b92dfedca514be3c320c2e" }),
    });

    if (!response.ok) {
      throw new Error("Erro ao criar pedido.");
    }

    return response.json();
  }

  async getAllOrders(): Promise<Order[]> {
    const response = await fetch(this.baseUrl);

    if (!response.ok) {
      throw new Error("Erro ao buscar pedidos.");
    }

    return response.json();
  }

  async getOrderById(id: string): Promise<Order[] | undefined> {
    const response = await fetch(`${this.baseUrl}/${id}`);

    if (!response.ok) {
      throw new Error("Erro ao buscar pedidos.");
    }

    return response.json();
  }

  async updateOrder(
    id: string,
    updatedData: Partial<Order>
  ): Promise<Order | undefined> {
    const response = await fetch(this.baseUrl + `/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      throw new Error("Erro ao atualizar pedido.");
    }

    return response.json();
  }

  async updateOrderStatus(
    id: string,
    newStatus: OrderStatus,
    cancellationReason?: string
  ): Promise<Order | undefined> {
    return this.updateOrder(id, { status: newStatus, cancellationReason });
  }

  async filterOrders(filter: {
    term?: string;
    paid?: boolean;
  }): Promise<Order[]> {
    const params = new URLSearchParams();
    if (filter.term) params.append("term", filter.term);
    // if (filter.paid !== undefined) params.append("paid", String(filter.paid));
    const response = await fetch(`${this.baseUrl}/filter?${params.toString()}`);

    if (!response.ok) {
      throw new Error("Erro ao buscar pedidos.");
    }

    return response.json();
  }

  async updatePaymentMethod(
    id: string,
    paymentMethod: PaymentMethod
  ): Promise<Order | undefined> {
    return this.updateOrder(id, { paymentMethod });
  }

  async togglePaid(id: string): Promise<Order | undefined> {
    const order = await this.getOrderById(id);
    if (order) {
      return this.updateOrder(id, { paid: !order?.[0].paid });
    }
    return;
  }
}

export const orderService = new OrderService();
