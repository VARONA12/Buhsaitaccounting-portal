"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowRight, Loader2, KeyRound } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Валидация для данных регистрации
const registerSchema = z.object({
  name: z.string().min(2, "Введите ваше имя и фамилию"),
  company: z.string().min(2, "Введите название вашей компании (ИП или ООО)"),
  phone: z.string().min(10, "Введите корректный номер телефона (например, 9001234567)"),
});

// Валидация для поля "Код из СМС"
const codeSchema = z.object({
  code: z.string().length(4, "Код должен состоять из 4 цифр"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;
type CodeFormValues = z.infer<typeof codeSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const codeForm = useForm<CodeFormValues>({
    resolver: zodResolver(codeSchema),
  });

  const onSubmitRegister = async (data: RegisterFormValues) => {
    setErrorMsg("");
    setIsLoading(true);
    try {
      // Здесь мы запрашиваем СМС-код (и потом на бэке свяжем этот номер с новым профилем)
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: data.phone }),
      });
      let result;
      try {
        result = await res.json();
      } catch (e) {
        throw new Error("Ошибка обработки ответа сервера (JSON)");
      }
      
      if (!res.ok) {
        throw new Error(result?.error || "Ошибка при отправке СМС");
      }
      
      setStep(2);
    } catch (error: any) {
      setErrorMsg(error.message || "Неизвестная ошибка связи с сервером.");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitCode = async (data: CodeFormValues) => {
    setErrorMsg("");
    setIsLoading(true);
    try {
      const currentFormValues = registerForm.getValues();
      
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: currentFormValues.name,
          company: currentFormValues.company,
          phone: currentFormValues.phone, 
          code: data.code 
        }),
      });
      let result;
      try {
        result = await res.json();
      } catch (e) {
        throw new Error("Ошибка обработки ответа сервера (JSON)");
      }
      
      if (!res.ok) {
        throw new Error(result?.error || "Неверный код");
      }
      
      // СМС правильная и юзер создан. Аутентифицируем в сессии:
      const signInRes = await signIn("credentials", {
        phone: currentFormValues.phone,
        redirect: false,
      });

      if (signInRes?.error) {
        throw new Error(signInRes.error);
      }

      window.location.href = "/dashboard";
    } catch (error: any) {
      setErrorMsg(error.message || "Ошибка проверки кода.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] flex items-center justify-center relative overflow-hidden text-white font-sans py-12">
      {/* Background glow & gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary rounded-full blur-[150px] opacity-[0.05] z-0"></div>
      
      {/* Container */}
      <div className="w-full max-w-md p-8 glass-glow rounded-3xl relative z-10 shadow-2xl flex flex-col transform transition-all duration-500">
        
        {/* Logo/Brand */}
        <div className="flex flex-col items-center justify-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(229,255,0,0.3)]">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#000000"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Регистрация</h1>
          <p className="text-neutral-400 text-sm mt-2 text-center">
            {step === 1 ? "Создайте аккаунт для вашей компании" : "Введите код из СМС сообщения"}
          </p>
        </div>

        {/* Step 1: Registration Entry */}
        {step === 1 && (
          <form onSubmit={registerForm.handleSubmit(onSubmitRegister)} className="flex flex-col gap-5 animate-in fade-in slide-in-from-right-4 duration-500">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-neutral-300 mb-1.5">
                Имя и Фамилия
              </label>
              <input
                id="name"
                type="text"
                placeholder="Иван Иванов"
                className={`w-full bg-[#141414] border ${registerForm.formState.errors.name ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-4 py-3 text-base focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-white placeholder:text-neutral-600`}
                {...registerForm.register("name")}
                disabled={isLoading}
              />
              {registerForm.formState.errors.name && (
                <p className="mt-1.5 text-xs text-red-400">{registerForm.formState.errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-neutral-300 mb-1.5">
                Название компании (ИП / ООО)
              </label>
              <input
                id="company"
                type="text"
                placeholder="ООО Апекс Решения"
                className={`w-full bg-[#141414] border ${registerForm.formState.errors.company ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-4 py-3 text-base focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-white placeholder:text-neutral-600`}
                {...registerForm.register("company")}
                disabled={isLoading}
              />
              {registerForm.formState.errors.company && (
                <p className="mt-1.5 text-xs text-red-400">{registerForm.formState.errors.company.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-neutral-300 mb-1.5">
                Номер телефона
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 font-medium text-neutral-400 select-none">
                  +7
                </div>
                <input
                  id="phone"
                  type="tel"
                  placeholder="(999) 000-00-00"
                  className={`w-full bg-[#141414] border ${registerForm.formState.errors.phone ? 'border-red-500/50' : 'border-white/10'} rounded-xl pl-10 pr-4 py-3 text-base focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-white placeholder:text-neutral-600`}
                  {...registerForm.register("phone")}
                  disabled={isLoading}
                />
              </div>
              {registerForm.formState.errors.phone && (
                <p className="mt-1.5 text-xs text-red-400">{registerForm.formState.errors.phone.message}</p>
              )}
            </div>
            
            {errorMsg && (
              <p className="text-sm text-red-400 text-center">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-[#000000] font-bold text-lg rounded-xl py-3.5 mt-2 transition-all hover:bg-primary-dark hover:shadow-[0_0_20px_rgba(255,193,7,0.3)] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Регистрация...
                </>
              ) : (
                <>
                  Создать аккаунт
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <div className="text-center mt-4">
              <span className="text-neutral-500 text-sm">Уже есть аккаунт? </span>
              <Link href="/login" className="text-primary hover:text-white transition-colors text-sm font-medium">
                Войти в систему
              </Link>
            </div>
          </form>
        )}

        {/* Step 2: OTP Entry (Регистрация) */}
        {step === 2 && (
          <form onSubmit={codeForm.handleSubmit(onSubmitCode)} className="flex flex-col gap-6 animate-in fade-in slide-in-from-left-4 duration-500">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-neutral-300 mb-2 text-center">
                Код выслан на +7 {registerForm.getValues().phone}
              </label>
              <div className="relative mt-4 flex justify-center">
                <input
                  id="code"
                  type="text"
                  maxLength={4}
                  placeholder="• • • •"
                  className={`w-48 text-center tracking-[1em] font-mono bg-[#141414] border ${codeForm.formState.errors.code || errorMsg ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-4 py-4 text-2xl focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-white placeholder:text-neutral-600`}
                  {...codeForm.register("code")}
                  disabled={isLoading}
                  autoFocus
                />
              </div>
              {codeForm.formState.errors.code && (
                <p className="mt-3 text-sm text-red-400 text-center">{codeForm.formState.errors.code.message}</p>
              )}
              {errorMsg && (
                <p className="mt-3 text-sm text-red-400 text-center">{errorMsg}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-[#000000] font-bold text-lg rounded-xl py-4 transition-all hover:bg-primary-dark hover:shadow-[0_0_20px_rgba(255,193,7,0.3)] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <KeyRound className="w-5 h-5" />
                  Подтвердить код
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={() => { setStep(1); setErrorMsg(""); codeForm.reset(); }}
              className="text-neutral-500 hover:text-white text-sm transition-colors mt-2 text-center"
              disabled={isLoading}
            >
              Изменить данные
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
