import { z } from "zod";

export const analysisSchema = z.object({
  currency: z.string(),
  financialScore: z.number().min(0).max(100),
  totalIncome: z.number(),
  totalExpenses: z.number(),
  categories: z.array(
    z.object({
      name: z.string(),
      value: z.number(),
      percentage: z.number(),
    })
  ),
  subscriptions: z.array(
    z.object({
      name: z.string(),
      amount: z.number(),
      category: z.string(),
    })
  ),
  weekdaySpending: z.array(
    z.object({
      day: z.string(),
      amount: z.number(),
    })
  ),
  cashFlow: z.array(
    z.object({
      date: z.string(),
      income: z.number(),
      expense: z.number(),
    })
  ),
  topVendors: z.array(
    z.object({
      name: z.string(),
      amount: z.number(),
      transactions: z.number(),
    })
  ),
  insights: z.object({
    weekendPattern: z.string(),
    peakHours: z.string(),
    emergencyFundRecommendation: z.string(),
  }),
  opportunities: z.array(
    z.object({
      type: z.enum(["coffee", "gym", "savings", "entertainment"]),
      title: z.string(),
      current: z.string(),
      savings: z.number(),
      description: z.string(),
    })
  ),
  transactionInsights: z.array(
    z.object({
      original: z.string(),
      decoded: z.string(),
      category: z.string(),
    })
  ),
  anomalies: z.array(
    z.object({
      type: z.enum(["warning", "error", "success"]),
      message: z.string(),
    })
  ),
  scoreImprovements: z.array(
    z.object({
      points: z.number(),
      title: z.string(),
      description: z.string(),
      type: z.enum(["up", "down"]),
    })
  ),
});

export const chunkAnalysisSchema = z.object({
  totalIncome: z.number(),
  totalExpenses: z.number(),
  categories: z.array(
    z.object({
      name: z.string(),
      value: z.number(),
    })
  ),
  subscriptions: z.array(
    z.object({
      name: z.string(),
      amount: z.number(),
      category: z.string(),
    })
  ),
  topVendors: z.array(
    z.object({
      name: z.string(),
      amount: z.number(),
      transactions: z.number(),
    })
  ),
  transactionInsights: z.array(
    z.object({
      original: z.string(),
      decoded: z.string(),
      category: z.string(),
    })
  ),
  anomalies: z.array(
    z.object({
      type: z.enum(["warning", "error", "success"]),
      message: z.string(),
    })
  ),
});

export type AnalysisResult = z.infer<typeof analysisSchema>;
export type ChunkAnalysisResult = z.infer<typeof chunkAnalysisSchema>;
