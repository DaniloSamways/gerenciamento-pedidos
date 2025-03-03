import { OrderStatus, PaymentMethod } from "@/types/pedido";
import { z } from "zod";

export const createOrderSchema = z
  .object({
    fullName: z.string().min(3, {
      message: "Nome deve ter pelo menos 3 caracteres.",
    }),
    phone: z
      .string()
      .transform((v) => v.replace(/\D/g, "")) // Remove caracteres não numéricos
      .refine((v) => v.length >= 10 && v.length <= 11, {
        message: "Número de WhatsApp inválido.",
      }),
    details: z.string().min(10, {
      message: "Detalhes devem ter pelo menos 10 caracteres.",
    }),
    deliveryType: z.enum(["retirada", "entrega"]),
    deliveryAddress: z.string().optional(),
    deliveryDate: z.date({
      required_error: "A data de entrega é obrigatória.",
    }),
    deliveryTime: z.string({
      required_error: "A hora de entrega é obrigatória.",
    }),
    orderValue: z.number(),

    paymentMethod: z.nativeEnum(PaymentMethod),
    userId: z.string({
      required_error: "O ID do usuário é obrigatório.",
    }),
  })
  .superRefine((data, ctx) => {
    if (data.deliveryType === "entrega" && !data.deliveryAddress) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "O endereço de entrega é obrigatório",
        path: ["deliveryAddress"],
      });
    }
  });

export const getOrderByIdSchema = z.object({
  id: z.string({
    required_error: "O ID do pedido é obrigatório.",
  }),
});

export const getOrdersSchema = z.object({
  status: z.string().optional().nullable(),
  userId: z.string().optional().nullable(),
  //   userId: z.string({
  //     required_error: "O ID do usuário é obrigatório.",
  //   }),
});

export const updateOrderSchema = z
  .object({
    fullName: z
      .string()
      .min(3, {
        message: "Nome deve ter pelo menos 3 caracteres.",
      })
      .optional(),
    phone: z
      .string()
      .transform((v) => v.replace(/\D/g, "")) // Remove caracteres não numéricos
      .refine((v) => v.length >= 10 && v.length <= 11, {
        message: "Número de WhatsApp inválido.",
      })
      .optional(),
    details: z
      .string()
      .min(10, {
        message: "Detalhes devem ter pelo menos 10 caracteres.",
      })
      .optional(),
    deliveryType: z.enum(["retirada", "entrega"]).optional(),
    deliveryAddress: z.string().optional(),
    deliveryDate: z
      .date({
        required_error: "A data de entrega é obrigatória.",
      })
      .optional(),
    deliveryTime: z
      .string({
        required_error: "A hora de entrega é obrigatória.",
      })
      .optional(),
    orderValue: z.number().optional(),
    paymentMethod: z.nativeEnum(PaymentMethod).optional(),
    paid: z.boolean().optional(),
    status: z.nativeEnum(OrderStatus).optional(),
    cancellationReason: z.string().optional(),
    userId: z
      .string({
        required_error: "O ID do usuário é obrigatório.",
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.deliveryType === "entrega" && !data.deliveryAddress) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "O endereço de entrega é obrigatório",
        path: ["deliveryAddress"],
      });
    }

    if (data.status === OrderStatus.Cancelado && !data.cancellationReason) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "O motivo do cancelamento é obrigatório",
      });
    }
  });

export const filterOrderSchema = z.object({
  term: z.string().optional(),
});
