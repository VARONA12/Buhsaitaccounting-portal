export interface OtpData {
  code: string;
  expiresAt: number;
}

// Этот кэш в памяти будет работать только во время локальной разработки.
// В продакшене Next.js (на Vercel или Serverless) его необходимо будет заменить на Redis или базу данных,
// так как запросы могут обрабатываться разными "лямбдами".
// Но для начала разработки этого достаточно.
const globalForOtp = globalThis as unknown as {
  memoryOtpStore: Map<string, OtpData> | undefined;
};

export const memoryOtpStore = globalForOtp.memoryOtpStore ?? new Map<string, OtpData>();

if (process.env.NODE_ENV !== "production") globalForOtp.memoryOtpStore = memoryOtpStore;
