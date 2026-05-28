// schemas/auth.schema.ts
import { z } from "zod";

export const loginSchema = z.object({
  displayName: z.string().min(2, "Ім'я занадто коротке"),
  email: z.string().email("Некоректний формат email"),
  // Для логіну достатньо перевіряти, що поле просто не порожнє
  password: z.string().min(1, "Введіть пароль"),
});

export const registerSchema = z
  .object({
    displayName: z.string().min(2, "Ім'я занадто коротке"),
    email: z.string().email("Некоректний формат email"),
    password: z
      .string()
      .min(8, "Пароль має містити мінімум 8 символів") // Виправлено на 8
      .regex(/[^0-9]/, "Пароль не може складатися лише з цифр") // Перевірка, що є хоча б один не-цифровий символ
      .regex(/[a-zA-Z]/, "Пароль повинен містити хоча б одну літеру"), // Рекомендую додати для надійності
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Паролі не співпадають",
    path: ["confirmPassword"],
  });

// Типізація для React Hook Form на основі схем
export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
