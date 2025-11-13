import { generateObject } from "ai";
import * as XLSX from "xlsx";
import { z } from "zod";

export const maxDuration = 60;

const analysisSchema = z.object({
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
    yearEndProjection: z.string(),
    seasonalAlert: z.string(),
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
  forecast: z.object({
    projectedExpenses: z.number(),
    expectedIncome: z.number(),
    netPosition: z.number(),
  }),
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const pdfText = formData.get("pdfText") as string | null;

    if (!file) {
      return new Response("Missing file", { status: 400 });
    }

    let statementData: string;

    // Check if PDF text was already extracted on client side
    if (pdfText) {
      statementData = pdfText;
    } else {
      // Parse Excel file
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      statementData = JSON.stringify(jsonData, null, 2);
    }

    const prompt = `You are a financial analyst. Analyze the following bank statement data and provide a comprehensive financial analysis.

Bank Statement Data:
${statementData}

Important:
- Detect the currency used in the document. Look for currency symbols (¥, $, €, £, ₺, etc.) or currency codes (CNY, USD, EUR, GBP, TRY, etc.)
- If no currency is explicitly found, infer it from the language of the transaction descriptions (e.g., Turkish → ₺, Chinese → ¥, English → $)
- Return the currency as a symbol (¥, $, €, £, ₺, etc.)
- All categories should be in English
- Translate any Turkish, Chinese, or other language transaction descriptions to English
- Categorize transactions into: Groceries, Restaurants, Transportation, Entertainment, Bills, Shopping, Health, etc.
- Detect recurring subscriptions (Netflix, Spotify, gym memberships, etc.)
- Identify spending patterns by day of week
- Detect anomalies and unusual transactions
- Provide actionable recommendations
- Calculate a financial health score based on income/expense ratio, savings rate, and spending patterns
- For weekdaySpending, use day names: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday
- For cashFlow, use day numbers (1-31)
- Provide realistic insights and recommendations based on the actual data
- Parse the data intelligently whether it's in JSON format (from Excel) or plain text format (from PDF)`;

    const result = await generateObject({
      model: "openai/gpt-4o",
      schema: analysisSchema,
      prompt,
    });

    return Response.json(result.object);
  } catch (error) {
    console.error("Analysis error:", error);
    return new Response("Analysis failed", { status: 500 });
  }
}
