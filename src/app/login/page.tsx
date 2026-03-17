"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Loader2, KeyRound, Smartphone, ShieldCheck } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const phoneSchema = z.object({
  phone: z.string().refine((val) => {
    const digits = val.replace(/\D/g, "");
    return digits.length === 10 && digits.startsWith("9");
  }, "Введите корректный номер (+7 9XX...)"),
});

const codeSchema = z.object({
  code: z.string().length(4, "Код должен состоять из 4 цифр"),
});

const passwordLoginSchema = z.object({
  phone: z.string().refine((val) => {
    const digits = val.replace(/\D/g, "");
    return digits.length === 10 && digits.startsWith("9");
  }, "Введите корректный номер"),
  password: z.string().min(1, "Введите пароль"),
});

type PhoneFormValues = z.infer<typeof phoneSchema>;
type CodeFormValues = z.infer<typeof codeSchema>;
type PasswordFormValues = z.infer<typeof passwordLoginSchema>;

export default function LoginPage() {
  const [method, setMethod] = useState<"otp" | "password">("otp");
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const phoneForm = useForm<PhoneFormValues>({ resolver: zodResolver(phoneSchema) });
  const codeForm = useForm<CodeFormValues>({ resolver: zodResolver(codeSchema) });
  const passwordForm = useForm<PasswordFormValues>({ resolver: zodResolver(passwordLoginSchema) });

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
    
    // Set for both forms just in case
    phoneForm.setValue("phone", digits, { shouldValidate: true });
    passwordForm.setValue("phone", digits, { shouldValidate: true });
  };


  const onSendOtp = async (data: PhoneFormValues) => {
    setErrorMsg("");
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: data.phone }),
      });
      if (!res.ok) throw new Error("Ошибка отправки. Проверьте номер.");
      setStep(2);
    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onVerifyOtp = async (data: CodeFormValues) => {
    setErrorMsg("");
    setIsLoading(true);
    try {
      const currentPhone = phoneForm.getValues().phone;
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: currentPhone, code: data.code }),
      });
      if (!res.ok) throw new Error("Неверный код");
      
      const resAuth = await signIn("credentials", {
        phone: currentPhone,
        redirect: false,
      });

      if (resAuth?.error) throw new Error(resAuth.error);
      window.location.href = "/dashboard";
    } catch (error: any) {
      setErrorMsg(error.message);
      setIsLoading(false);
    }
  };

  const onSubmitPassword = async (data: PasswordFormValues) => {
    setErrorMsg("");
    setIsLoading(true);
    try {
      const res = await signIn("credentials", {
        phone: data.phone,
        password: data.password,
        redirect: false,
      });

      if (res?.error) throw new Error(res.error);
      window.location.href = "/dashboard";
    } catch (error: any) {
      setErrorMsg(error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4 relative overflow-hidden text-text font-sans">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px] opacity-[0.05] z-0"></div>
      
      <div className="w-full max-w-[440px] p-6 sm:p-10 glass rounded-[48px] relative z-10 shadow-2xl flex flex-col border border-border">
        <div className="flex flex-col items-center justify-center mb-10">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-primary flex items-center justify-center mb-6 shadow-[0_10px_30px_rgba(255,193,7,0.3)] transform -rotate-3 hover:rotate-0 transition-all duration-500">
            {method === "otp" ? <Smartphone size={32} color="black" /> : <ShieldCheck size={32} color="black" />}
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-text">ЭлитФинанс</h1>
          <div className="mt-2 px-2 py-0.5 bg-primary/10 border border-primary/20 rounded-md text-[8px] font-black text-primary uppercase tracking-widest">
            v2.0 Stable
          </div>
          <p className="text-text-muted text-xs md:text-sm mt-1 text-center font-medium">
            Личный кабинет бухгалтерии
          </p>
        </div>

        {step === 1 && (
          <div className="flex bg-surface p-1 rounded-[20px] mb-8 border border-border">
            <button 
              onClick={() => { setMethod("otp"); setErrorMsg(""); }}
              className={`flex-1 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${method === "otp" ? "bg-primary text-black shadow-lg" : "text-text-muted hover:text-text"}`}
            >
              СМС Вход
            </button>
            <button 
              onClick={() => { setMethod("password"); setErrorMsg(""); }}
              className={`flex-1 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${method === "password" ? "bg-primary text-black shadow-lg" : "text-text-muted hover:text-text"}`}
            >
              Пароль
            </button>
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div 
              key={method}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              {method === "otp" ? (
                <form onSubmit={phoneForm.handleSubmit(onSendOtp)} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-muted ml-2 uppercase tracking-widest">Номер телефона</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-5 text-text-muted font-black">+7</div>
                      <input
                        type="tel"
                        placeholder="(999) 000-00-00"
                        value={displayPhone}
                        onChange={handlePhoneChange}
                        className={`w-full bg-surface border rounded-2xl pl-12 pr-5 py-4 text-text text-sm outline-none transition-all placeholder:text-text-muted/30 ${
                          phoneForm.formState.errors.phone ? "border-red-500" : "border-border focus:border-primary"
                        }`}
                      />
                    </div>
                    {phoneForm.formState.errors.phone && (
                      <p className="text-[9px] text-red-500 font-bold mt-1 ml-2 uppercase">
                        {phoneForm.formState.errors.phone.message}
                      </p>
                    )}
                  </div>
                  {errorMsg && <p className="text-red-500 text-[10px] text-center font-black bg-red-500/5 py-3 rounded-xl border border-red-500/10 uppercase tracking-tight">{errorMsg}</p>}
                  <button type="submit" disabled={isLoading} className="w-full bg-primary text-black font-black text-base py-4 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-[0_15px_30px_rgba(255,193,7,0.2)] disabled:opacity-50">
                    {isLoading ? <Loader2 className="animate-spin mx-auto" /> : "ПОЛУЧИТЬ КОД"}
                  </button>
                </form>
              ) : (
                <form onSubmit={passwordForm.handleSubmit(onSubmitPassword)} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-text-muted ml-2 uppercase tracking-widest">Телефон</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-5 text-text-muted font-black">+7</div>
                        <input
                          type="tel"
                          placeholder="(999) 000-00-00"
                          value={displayPhone}
                          onChange={handlePhoneChange}
                          className={`w-full bg-surface border rounded-2xl pl-12 pr-5 py-4 text-text text-sm outline-none transition-all ${
                            passwordForm.formState.errors.phone ? "border-red-500" : "border-border focus:border-primary"
                          }`}
                        />
                      </div>
                      {passwordForm.formState.errors.phone && (
                        <p className="text-[9px] text-red-500 font-bold mt-1 ml-2 uppercase">
                          {passwordForm.formState.errors.phone.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-text-muted ml-2 uppercase tracking-widest">Пароль</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full bg-surface border border-border rounded-2xl px-5 py-4 text-text text-sm focus:border-primary outline-none transition-all"
                        {...passwordForm.register("password")}
                      />
                    </div>
                  </div>
                  {errorMsg && <p className="text-red-500 text-[10px] text-center font-black bg-red-500/5 py-3 rounded-xl border border-red-500/10 uppercase tracking-tight">{errorMsg}</p>}
                  <button type="submit" disabled={isLoading} className="w-full bg-primary text-black font-black text-base py-4 rounded-2xl hover:scale-[1.02] shadow-[0_15px_30px_rgba(255,193,7,0.2)]">
                    {isLoading ? <Loader2 className="animate-spin mx-auto" /> : "ВОЙТИ"}
                  </button>
                </form>
              )}
            </motion.div>
          ) : (
            <motion.form 
              key="otp-step"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={codeForm.handleSubmit(onVerifyOtp)} 
              className="space-y-8"
            >
              <div className="text-center space-y-5">
                <p className="text-text-muted text-xs">Код отправлен на <span className="text-text font-black">+7 {phoneForm.getValues().phone}</span></p>
                <div className="relative inline-block">
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="0000"
                    className="w-48 text-center tracking-[0.8em] font-mono bg-surface border border-border rounded-2xl px-4 py-5 text-3xl focus:border-primary outline-none text-text shadow-xl"
                    {...codeForm.register("code")}
                    autoFocus
                  />
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-40 h-[2px] bg-primary/20"></div>
                </div>
              </div>
              {errorMsg && <p className="text-red-500 text-[10px] text-center font-black">{errorMsg}</p>}
              <div className="space-y-3">
                <button type="submit" disabled={isLoading} className="w-full bg-primary text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] shadow-xl">
                  {isLoading ? <Loader2 className="animate-spin" /> : <><KeyRound size={20} /> ВОЙТИ В СИСТЕМУ</>}
                </button>
                <button type="button" onClick={() => {setStep(1); setErrorMsg("");}} className="w-full text-text-muted text-[10px] hover:text-text flex items-center justify-center gap-1 py-1 font-black uppercase tracking-widest transition-all">
                  <ArrowLeft size={14} /> Назад
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="text-center mt-12 pt-8 border-t border-border">
          <p className="text-text-muted text-xs font-medium">Впервые у нас?</p>
          <Link href="/register" className="text-primary hover:underline font-black text-sm uppercase tracking-tighter mt-1 inline-block">Зарегистрироваться</Link>
        </div>
      </div>
    </div>
  );
}
