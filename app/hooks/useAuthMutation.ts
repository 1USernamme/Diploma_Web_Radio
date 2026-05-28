import { useMutation } from "@tanstack/react-query";
import { loginUser, registerUser } from "../api/auth";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export const useLogin = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
<<<<<<< HEAD
      Cookies.set("local_access_token_p", data.access, { expires: 7 });
=======
      // Зберігаємо токен у куки на 7 днів.
      // Якщо бекенд повертає access і refresh, зберігайте потрібний
      Cookies.set("local_access_token_p", data.access, { expires: 7 });

>>>>>>> 4cc7be0704e5c7eb84c13c88ea0ea02422a69448
      router.push("/diagrams");
    },
    onError: (error) => {
      console.error("Помилка входу:", error);
    },
  });
};

export const useRegister = () => {
<<<<<<< HEAD
  // Дістаємо наш готовий хук для логіну
  const loginMutation = useLogin();

  return useMutation({
    mutationFn: registerUser,
    // Додаємо variables, щоб дістати пароль та імейл, які юзер щойно ввів
    onSuccess: (data, variables) => {
      // Якщо бекенд раптом віддає токен при реєстрації - зберігаємо (на майбутнє)
      if (data.access) {
        Cookies.set("local_access_token_p", data.access, { expires: 7 });
        const router = useRouter();
        router.push("/diagrams");
      } else {
        // Якщо токена немає, автоматично логінимо юзера його ж даними!
        // Це викличе loginUser, отримає токен і виконає router.push("/diagrams")
        loginMutation.mutate({
          email: variables.email,
          password: variables.password,
        });
      }
=======
  const router = useRouter();

  return useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      // Опціонально: якщо після реєстрації бекенд одразу віддає токен, теж зберігаємо
      if (data.access) {
        Cookies.set("local_access_token_p", data.access, { expires: 7 });
      }
      router.push("/diagrams");
>>>>>>> 4cc7be0704e5c7eb84c13c88ea0ea02422a69448
    },
    onError: (error) => {
      console.error("Помилка реєстрації:", error);
    },
  });
};
