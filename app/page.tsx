"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Імпортуємо наші заготовки
import {
  loginSchema,
  registerSchema,
  LoginFormValues,
  RegisterFormValues,
} from "./schemas/auth.schema";
import { useLogin, useRegister } from "./hooks/useAuthMutation";

export default function Home() {
  // Стан для перемикання Вхід / Реєстрація
  const [isLogin, setIsLogin] = useState(false);

  // Підключаємо хуки React Query
  const { mutate: login, isPending: isLoginLoading } = useLogin();
  const { mutate: register, isPending: isRegisterLoading } = useRegister();

  // Налаштування форми для Логіну
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  // Налаштування форми для Реєстрації
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      displayName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Обробники сабміту
  const onSubmitLogin = (data: LoginFormValues) => {
    login(data);
  };

  const onSubmitRegister = (data: RegisterFormValues) => {
    // Відкидаємо confirmPassword перед відправкою на бекенд
    const { confirmPassword, ...payload } = data;
    register(payload);
  };

  // Компонент для відображення помилок під інпутами
  const ErrorMessage = ({ message }: { message?: string }) => {
    if (!message) return null;
    return <span className="text-red-500 text-xs mt-1 block">{message}</span>;
  };

  return (
    <div className="flex h-screen w-full bg-[#151a20] text-gray-200 font-sans overflow-hidden">
      {/* Ліва панель - Відео */}
      <div className="relative hidden lg:flex flex-col justify-center w-[65%] h-full bg-black">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        >
          <source src="/decoration-video.mp4" type="video/mp4" />
        </video>
        <div className="relative z-10 px-16 lg:px-24 max-w-4xl">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Real-Time Radio <br /> Signal Analysis
          </h1>
          <p className="text-lg text-gray-300 leading-relaxed max-w-2xl">
            Securely access the spectral processing dashboard. Generate test
            signals, apply FFT algorithms, detect potential threats, and manage
            your analysis history.
          </p>
        </div>
      </div>

      {/* Права панель - Форма */}
      <div className="flex flex-col justify-between w-full lg:w-[35%] h-full bg-[#1b2129] px-8 sm:px-16 py-8 overflow-y-auto">
        <div className="flex-1 flex flex-col justify-center">
          <div className="mb-10">
            <h2 className="text-3xl font-semibold text-white mb-1">
              SIG_ANALYTICS
            </h2>
            <div className="flex items-center mb-6">
              <span className="text-sm text-gray-400 uppercase tracking-widest font-semibold">
                Spectral Engine
              </span>
              <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-[10px] ml-2">
                Prototype v1.0
              </span>
            </div>

            <h3 className="text-xl text-white font-medium">
              {isLogin ? "Sign In" : "System Access"}
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              {isLogin
                ? "Welcome back. Please enter your details."
                : "Register to start processing signal data."}
            </p>
          </div>

          {/* Умовний рендер форм залежно від стану isLogin */}
          {isLogin ? (
            <form
              onSubmit={loginForm.handleSubmit(onSubmitLogin)}
              className="flex flex-col gap-4"
            >
              <div>
                <input
                  type="text"
                  placeholder="Display name"
                  className={`w-full bg-[#f3f4f6] text-gray-900 px-4 py-3 rounded-md outline-none border-2 transition-all ${loginForm.formState.errors.displayName ? "border-red-500" : "border-transparent focus:border-blue-500"}`}
                  {...loginForm.register("displayName")}
                />
                <ErrorMessage
                  message={loginForm.formState.errors.displayName?.message}
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email address"
                  className={`w-full bg-[#f3f4f6] text-gray-900 px-4 py-3 rounded-md outline-none border-2 transition-all ${loginForm.formState.errors.email ? "border-red-500" : "border-transparent focus:border-blue-500"}`}
                  {...loginForm.register("email")}
                />
                <ErrorMessage
                  message={loginForm.formState.errors.email?.message}
                />
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Password"
                  className={`w-full bg-[#f3f4f6] text-gray-900 px-4 py-3 rounded-md outline-none border-2 transition-all ${loginForm.formState.errors.password ? "border-red-500" : "border-transparent focus:border-blue-500"}`}
                  {...loginForm.register("password")}
                />
                <ErrorMessage
                  message={loginForm.formState.errors.password?.message}
                />
              </div>

              <button
                type="submit"
                disabled={isLoginLoading}
                className="w-full bg-white text-gray-900 font-bold py-3 rounded-md mt-4 hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                {isLoginLoading ? "Logging in..." : "Login"}
              </button>
            </form>
          ) : (
            <form
              onSubmit={registerForm.handleSubmit(onSubmitRegister)}
              className="flex flex-col gap-4"
            >
              <div>
                <input
                  type="text"
                  placeholder="Display name"
                  className={`w-full bg-[#f3f4f6] text-gray-900 px-4 py-3 rounded-md outline-none border-2 transition-all ${registerForm.formState.errors.displayName ? "border-red-500" : "border-transparent focus:border-blue-500"}`}
                  {...registerForm.register("displayName")}
                />
                <ErrorMessage
                  message={registerForm.formState.errors.displayName?.message}
                />
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Email address"
                  className={`w-full bg-[#f3f4f6] text-gray-900 px-4 py-3 rounded-md outline-none border-2 transition-all ${registerForm.formState.errors.email ? "border-red-500" : "border-transparent focus:border-blue-500"}`}
                  {...registerForm.register("email")}
                />
                <ErrorMessage
                  message={registerForm.formState.errors.email?.message}
                />
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Create a password"
                  className={`w-full bg-[#f3f4f6] text-gray-900 px-4 py-3 rounded-md outline-none border-2 transition-all ${registerForm.formState.errors.password ? "border-red-500" : "border-transparent focus:border-blue-500"}`}
                  {...registerForm.register("password")}
                />
                <ErrorMessage
                  message={registerForm.formState.errors.password?.message}
                />
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Confirm password"
                  className={`w-full bg-[#f3f4f6] text-gray-900 px-4 py-3 rounded-md outline-none border-2 transition-all ${registerForm.formState.errors.confirmPassword ? "border-red-500" : "border-transparent focus:border-blue-500"}`}
                  {...registerForm.register("confirmPassword")}
                />
                <ErrorMessage
                  message={
                    registerForm.formState.errors.confirmPassword?.message
                  }
                />
              </div>

              <button
                type="submit"
                disabled={isRegisterLoading}
                className="w-full bg-white text-gray-900 font-bold py-3 rounded-md mt-4 hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                {isRegisterLoading ? "Registering..." : "Register"}
              </button>
            </form>
          )}

          {/* Перемикач Вхід/Реєстрація */}
          <div className="mt-8 text-center text-sm text-gray-400">
            <span>
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
            </span>
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-400 hover:text-blue-300 hover:underline transition-colors"
            >
              {isLogin ? "Create one" : "Sign in here"}
            </button>
          </div>
        </div>

        {/* Футер */}
        <div className="pt-6 border-t border-gray-700 flex justify-center flex-wrap gap-4 text-xs text-gray-500">
          <a
            className="cursor-pointer hover:text-gray-300"
            href="https://github.com/1USernamme/Diploma_Web_Radio"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub Repo
          </a>
        </div>
      </div>
    </div>
  );
}
