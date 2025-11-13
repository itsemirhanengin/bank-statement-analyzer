import { generateObject } from "ai";
import * as XLSX from "xlsx";
import { z } from "zod";

export const maxDuration = 60;

// Maximum characters per chunk (roughly 10K tokens)
const MAX_CHUNK_SIZE = 40000;

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

const chunkAnalysisSchema = z.object({
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

function chunkData(data: string, maxSize: number): string[] {
  if (data.length <= maxSize) {
    return [data];
  }

  const chunks: string[] = [];
  const lines = data.split("\n");
  let currentChunk = "";

  for (const line of lines) {
    if (currentChunk.length + line.length > maxSize && currentChunk.length > 0) {
      chunks.push(currentChunk);
      currentChunk = line + "\n";
    } else {
      currentChunk += line + "\n";
    }
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }

  return chunks;
}

async function analyzeChunk(chunk: string, currency: string) {
  const prompt = `Analyze this chunk of bank statement data. Extract key information:

Data:
${chunk}

Currency: ${currency}

Extract:
- Total income and expenses in this chunk
- Transaction categories with values
- Subscriptions found
- Top vendors
- Notable transaction insights (max 5)
- Anomalies (max 3)

Translate all descriptions to English.`;

  const result = await generateObject({
    model: "openai/gpt-4o",
    schema: chunkAnalysisSchema,
    prompt,
  });

  return result.object;
}

type ChunkResult = {
  totalIncome: number;
  totalExpenses: number;
  categories: Array<{ name: string; value: number }>;
  subscriptions: Array<{ name: string; amount: number; category: string }>;
  topVendors: Array<{ name: string; amount: number; transactions: number }>;
  transactionInsights: Array<{ original: string; decoded: string; category: string }>;
  anomalies: Array<{ type: string; message: string }>;
};

function mergeChunkResults(chunks: ChunkResult[], currency: string) {
  const totalIncome = chunks.reduce((sum, c) => sum + c.totalIncome, 0);
  const totalExpenses = chunks.reduce((sum, c) => sum + c.totalExpenses, 0);

  const categoryMap = new Map<string, number>();
  chunks.forEach((chunk) => {
    chunk.categories.forEach((cat) => {
      const existing = categoryMap.get(cat.name) || 0;
      categoryMap.set(cat.name, existing + cat.value);
    });
  });

  const categories = Array.from(categoryMap.entries())
    .map(([name, value]) => ({
      name,
      value,
      percentage: Math.round((value / totalExpenses) * 100),
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  const subscriptionMap = new Map<string, { name: string; amount: number; category: string }>();
  chunks.forEach((chunk) => {
    chunk.subscriptions.forEach((sub) => {
      if (!subscriptionMap.has(sub.name)) {
        subscriptionMap.set(sub.name, sub);
      }
    });
  });

  const subscriptions = Array.from(subscriptionMap.values());

  const vendorMap = new Map<string, { amount: number; transactions: number }>();
  chunks.forEach((chunk) => {
    chunk.topVendors.forEach((vendor) => {
      const existing = vendorMap.get(vendor.name);
      if (existing) {
        existing.amount += vendor.amount;
        existing.transactions += vendor.transactions;
      } else {
        vendorMap.set(vendor.name, {
          amount: vendor.amount,
          transactions: vendor.transactions,
        });
      }
    });
  });

  const topVendors = Array.from(vendorMap.entries())
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 10);

  const allInsights = chunks.flatMap((c) => c.transactionInsights);
  const uniqueInsights = allInsights
    .filter(
      (insight, index, self) =>
        index === self.findIndex((t) => t.original === insight.original)
    )
    .slice(0, 10);

  const anomalies = chunks.flatMap((c) => c.anomalies).slice(0, 10);

  return {
    currency,
    totalIncome,
    totalExpenses,
    categories,
    subscriptions,
    topVendors,
    transactionInsights: uniqueInsights,
    anomalies,
  };
}

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

    const currencyPrompt = `Detect the currency from this data. Return ONLY the currency symbol (¥, $, €, £, ₺, etc.):
${statementData.substring(0, 2000)}`;

    const currencyResult = await generateObject({
      model: "openai/gpt-4o",
      schema: z.object({ currency: z.string() }),
      prompt: currencyPrompt,
    });

    const currency = currencyResult.object.currency;

    if (statementData.length > MAX_CHUNK_SIZE) {
      console.log(
        `Large file detected (${statementData.length} chars). Using chunking strategy...`
      );

      const chunks = chunkData(statementData, MAX_CHUNK_SIZE);
      console.log(`Split into ${chunks.length} chunks`);

      const chunkResults = await Promise.all(
        chunks.map((chunk) => analyzeChunk(chunk, currency))
      );

      const mergedData = mergeChunkResults(chunkResults, currency);

      const finalPrompt = `Based on this financial summary, provide final analysis:

Summary:
- Currency: ${currency}
- Total Income: ${mergedData.totalIncome}
- Total Expenses: ${mergedData.totalExpenses}
- Categories: ${JSON.stringify(mergedData.categories)}
- Subscriptions: ${JSON.stringify(mergedData.subscriptions)}

Provide:
1. Financial health score (0-100)
2. Spending by weekday pattern
3. Cash flow by day (aggregate data)
4. Weekend pattern insight
5. Peak hours insight
6. Emergency fund recommendation
7. Optimization opportunities (max 4)
8. Score improvement suggestions (max 5)

Focus only on current statement data.`;

      const finalResult = await generateObject({
        model: "openai/gpt-4o",
        schema: analysisSchema,
        prompt: finalPrompt,
      });

      return Response.json({
        ...finalResult.object,
        currency: mergedData.currency,
        totalIncome: mergedData.totalIncome,
        totalExpenses: mergedData.totalExpenses,
        categories: mergedData.categories,
        subscriptions: mergedData.subscriptions,
        topVendors: mergedData.topVendors,
        transactionInsights: mergedData.transactionInsights,
        anomalies: mergedData.anomalies,
      });
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
- Provide actionable recommendations based ONLY on the current statement data
- Calculate a financial health score based on income/expense ratio, savings rate, and spending patterns shown in THIS statement
- For weekdaySpending, use day names: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday
- For cashFlow, use day numbers (1-31)
- Provide realistic insights and recommendations based ONLY on the actual data in this statement
- DO NOT make future predictions, forecasts, or year-end projections
- DO NOT reference past statements or future trends - analyze only what is in the current uploaded statement
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
