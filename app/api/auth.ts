// api/auth.ts
import axios from "axios";

// Створюємо базовий інстанс (зручно, якщо бекенд висить на одному порту, наприклад 8000)
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL, // Замініть на ваш URL бекенду
  headers: {
    "Content-Type": "application/json",
  },
});

export const loginUser = async (data: any) => {
  let payload = {
    ...data,
    username: data.email, // Якщо бекенд очікує username, а ми використовуємо email
  };
  const response = await apiClient.post("/api/auth/login/", payload);
  return response.data;
};

export const registerUser = async (data: any) => {
  const response = await apiClient.post("/api/auth/register/", data);
  return response.data;
};
