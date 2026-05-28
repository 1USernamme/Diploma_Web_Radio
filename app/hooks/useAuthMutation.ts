import { useMutation } from "@tanstack/react-query";
import { loginUser, registerUser } from "../api/auth";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export const useLogin = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      Cookies.set("local_access_token_p", data.access, { expires: 7 });
      router.push("/diagrams");
    },
    onError: (error) => {
      console.error("Помилка входу:", error);
    },
  });
};

export const useRegister = () => {
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
    },
    onError: (error) => {
      console.error("Помилка реєстрації:", error);
    },
  });
};
