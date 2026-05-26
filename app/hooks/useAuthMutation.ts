import { useMutation } from "@tanstack/react-query";
import { loginUser, registerUser } from "../api/auth";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export const useLogin = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      // Зберігаємо токен у куки на 7 днів.
      // Якщо бекенд повертає access і refresh, зберігайте потрібний
      Cookies.set("local_access_token_p", data.access, { expires: 7 });

      router.push("/diagrams");
    },
    onError: (error) => {
      console.error("Помилка входу:", error);
    },
  });
};

export const useRegister = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      // Опціонально: якщо після реєстрації бекенд одразу віддає токен, теж зберігаємо
      if (data.access) {
        Cookies.set("local_access_token_p", data.access, { expires: 7 });
      }
      router.push("/diagrams");
    },
    onError: (error) => {
      console.error("Помилка реєстрації:", error);
    },
  });
};
