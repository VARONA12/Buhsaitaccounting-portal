"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowRight, Loader2, KeyRound, Lock, User, Building2, Smartphone, ArrowLeft } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const registerSchema = z.object({
  name: z.string().min(2, "Введите ваше имя и фамилию"),
  company: z.string().min(2, "Введите название вашей компании"),
  phone: z.string().refine((val) => {
    const digits = val.replace(/\D/g, "");
    return digits.length === 10 && digits.startsWith("9");
  }, "Введите корректный номер (+7 9XX...)"),
  password: z.string()
    .min(8, "Пароль должен быть не менее 8 символов")
    .regex(/[A-Za-z]/, "Пароль должен содержать хотя бы одну букву")
    .regex(/[0-9]/, "Пароль должен содержать хотя бы одну цифру"),
});

const codeSchema = z.object({
  code: z.string().length(4, "Код должен состоять из 4 цифр"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;
type CodeFormValues = z.infer<typeof codeSchema>;

export default function RegisterPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const codeForm = useForm<CodeFormValues>({
    resolver: zodResolver(codeSchema),
  });

  const [displayPhone, setDisplayPhone] = useState("");

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length > 10) return displayPhone;
    
    let formatted = "";
    if (digits.length > 0) {
      formatted += "(" + digits.substring(0, 3);
      if (digits.length >= 3) {
        formatted += ") ";
        if (digits.length > 3) {
          formatted += digits.substring(3, 6);
          if (digits.length >= 6) {
            formatted += "-";
            if (digits.length > 6) {
              formatted += digits.substring(6, 8);
              if (digits.length >= 8) {
                formatted += "-" + digits.substring(8, 10);
              }
            }
          }
        }
      }
    }
    return formatted;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const digits = input.replace(/\D/g, "");
    const formatted = formatPhone(digits);
    setDisplayPhone(formatted);
    registerForm.setValue("phone", digits, { shouldValidate: true });
  };


  const onSubmitRegister = async (data: RegisterFormValues) => {
    setErrorMsg("");
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: data.phone }),
      });
      if (!res.ok) throw new Error("Ошибка отправки СМС. Проверьте номер.");
      setStep(2);
    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitCode = async (data: CodeFormValues) => {
    setErrorMsg("");
    setIsLoading(true);
    try {
      const currentValues = registerForm.getValues();
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...currentValues, code: data.code }),
      });
      
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Ошибка регистрации");
      
      await signIn("credentials", {
        phone: currentValues.phone,
        password: currentValues.password,
        callbackUrl: "/dashboard",
      });
    } catch (error: any) {
      setErrorMsg(error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4 relative overflow-hidden text-text font-sans py-12">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px] opacity-[0.05] z-0"></div>
      
      <div className="w-full max-w-[500px] p-6 sm:p-10 glass rounded-[48px] relative z-10 shadow-2xl flex flex-col border border-border">
        <div className="flex flex-col items-center justify-center mb-10">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-primary flex items-center justify-center mb-6 shadow-[0_10px_30px_rgba(255,193,7,0.3)] transform rotate-3 hover:rotate-0 transition-all duration-500">
            <User size={32} color="black" />
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-text">Регистрация</h1>
          <p className="text-text-muted text-xs md:text-sm mt-1 text-center font-medium">
            Станьте клиентом ЭлитФинанс за пару минут
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.form 
              key="reg-step"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={registerForm.handleSubmit(onSubmitRegister)} 
              className="flex flex-col gap-5"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-muted ml-2 uppercase tracking-widest leading-none">ФИО</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-text-muted/60"><User size={18}/></div>
                    <input
                      placeholder="Иван..."
                      className="w-full bg-surface border border-border rounded-2xl pl-12 pr-4 py-4 text-text text-sm focus:border-primary outline-none transition-all placeholder:text-text-muted/30"
                      {...registerForm.register("name")}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-muted ml-2 uppercase tracking-widest leading-none">Компания</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-text-muted/60"><Building2 size={18}/></div>
                    <input
                      placeholder="ИП..."
                      className="w-full bg-surface border border-border rounded-2xl pl-12 pr-4 py-4 text-text text-sm focus:border-primary outline-none transition-all placeholder:text-text-muted/30"
                      {...registerForm.register("company")}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-muted ml-2 uppercase tracking-widest leading-none">Телефон</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-text-muted font-black">+7</div>
                  <input
                    type="tel"
                    placeholder="(999) 000-00-00"
                    value={displayPhone}
                    onChange={handlePhoneChange}
                    autoComplete="tel"
                    className={`w-full bg-surface border rounded-2xl pl-12 pr-4 py-4 text-text text-sm outline-none transition-all placeholder:text-text-muted/30 ${
                      registerForm.formState.errors.phone ? "border-red-500" : "border-border focus:border-primary"
                    }`}
                  />
                  {registerForm.formState.errors.phone && (
                    <p className="text-[9px] text-red-500 font-bold mt-1 ml-2 uppercase">
                      {registerForm.formState.errors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-muted ml-2 uppercase tracking-widest leading-none">Придумайте пароль</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-text-muted/60"><Lock size={18}/></div>
                  <input
                    type="password"
                    placeholder="8+ знаков (буквы и цифры)"
                    className={`w-full bg-surface border rounded-2xl pl-12 pr-4 py-4 text-text text-sm outline-none transition-all placeholder:text-text-muted/30 ${
                      registerForm.formState.errors.password ? "border-red-500" : "border-border focus:border-primary"
                    }`}
                    {...registerForm.register("password")}
                  />
                  {registerForm.formState.errors.password && (
                    <p className="text-[9px] text-red-500 font-bold mt-1 ml-2 uppercase">
                      {registerForm.formState.errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              {errorMsg && <p className="text-[10px] text-red-500 text-center font-black bg-red-500/5 py-3 rounded-xl border border-red-500/10 uppercase">{errorMsg}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-black font-black text-base rounded-2xl py-4 mt-2 hover:shadow-[0_15px_30px_rgba(255,193,7,0.3)] flex items-center justify-center gap-2 disabled:opacity-50 transition-all active:scale-95"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : <>ПРОДОЛЖИТЬ <ArrowRight size={20} /></>}
              </button>

              <div className="text-center mt-4">
                <span className="text-text-muted text-xs font-medium">Есть аккаунт? </span>
                <Link href="/login" className="text-primary hover:underline font-black text-xs uppercase tracking-tighter">Войти</Link>
              </div>
            </motion.form>
          )}

          {step === 2 && (
            <motion.form 
              key="code-step"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onSubmit={codeForm.handleSubmit(onSubmitCode)} 
              className="flex flex-col gap-8"
            >
              <div className="text-center space-y-5">
                <div className="w-16 h-16 rounded-[24px] bg-primary/10 flex items-center justify-center mx-auto text-primary">
                  <Smartphone size={28} />
                </div>
                <p className="text-text-muted text-xs leading-relaxed">
                  Мы отправили проверочный код на<br/>
                  <span className="text-text font-black">+7 {registerForm.getValues().phone}</span>
                </p>
                <div className="relative inline-block">
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="0000"
                    className="w-48 text-center tracking-[0.8em] font-mono bg-surface border border-border rounded-2xl px-4 py-5 text-3xl focus:border-primary outline-none text-text shadow-xl transition-all"
                    {...codeForm.register("code")}
                    autoFocus
                  />
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-40 h-[2px] bg-primary/20"></div>
                </div>
              </div>
              {errorMsg && <p className="text-red-500 text-[10px] text-center font-black bg-red-500/5 py-3 rounded-xl border border-red-500/10 uppercase">{errorMsg}</p>}
              <div className="space-y-4">
                <button disabled={isLoading} type="submit" className="w-full bg-primary text-black font-black py-4 md:py-5 rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] shadow-xl transition-all">
                  {isLoading ? <Loader2 className="animate-spin" /> : <><KeyRound size={20} /> ЗАВЕРШИТЬ</>}
                </button>
                <button 
                  type="button"
                  onClick={() => setStep(1)} 
                  className="w-full text-text-muted text-[10px] hover:text-text py-1 font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                >
                  <ArrowLeft size={14} /> Назад к данным
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
