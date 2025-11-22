import { generateObject } from "ai";
import { z } from "zod";
import {
  analysisSchema,
  chunkAnalysisSchema,
  type AnalysisResult,
  type ChunkAnalysisResult,
} from "@/lib/schemas";

const MODEL_NAME = "openai/gpt-4o";
const MAX_CHUNK_SIZE = 40000;

type MergedData = Pick<
  AnalysisResult,
  | "currency"
  | "totalIncome"
  | "totalExpenses"
  | "categories"
  | "subscriptions"
  | "topVendors"
  | "transactionInsights"
  | "anomalies"
>;

export class AnalysisService {
  async analyze(data: string): Promise<AnalysisResult> {
    const currency = await this.detectCurrency(data);

    if (data.length > MAX_CHUNK_SIZE) {
      return this.analyzeLargeFile(data, currency);
    }

    return this.analyzeSmallFile(data, currency);
  }

  private async detectCurrency(data: string): Promise<string> {
    const prompt = `Detect the currency from this data. Return ONLY the currency symbol (¥, $, €, £, ₺, etc.):
${data.substring(0, 2000)}`;

    const result = await generateObject({
      model: MODEL_NAME,
      schema: z.object({ currency: z.string() }),
      prompt,
    });

    return result.object.currency;
  }

  private async analyzeSmallFile(
    data: string,
    currency: string
  ): Promise<AnalysisResult> {
    const prompt = `You are a financial analyst. Analyze the following bank statement data and provide a comprehensive financial analysis.

Bank Statement Data:
${data}

Important:
- Currency detected: ${currency}
- Return the currency as a symbol (¥, $, €, £, ₺, etc.)
- All categories should be in English
- Translate any foreign language transaction descriptions to English
- Categorize transactions into: Groceries, Restaurants, Transportation, Entertainment, Bills, Shopping, Health, etc.
- Detect recurring subscriptions
- Identify spending patterns by day of week
- Detect anomalies and unusual transactions
- Provide actionable recommendations based ONLY on the current statement data
- Calculate a financial health score based on income/expense ratio, savings rate, and spending patterns
- For weekdaySpending, use day names: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday
- For cashFlow, use day numbers (1-31)
- Provide realistic insights and recommendations based ONLY on the actual data
- DO NOT make future predictions or reference past statements`;

    const result = await generateObject({
      model: MODEL_NAME,
      schema: analysisSchema,
      prompt,
    });

    return result.object;
  }

  private async analyzeLargeFile(
    data: string,
    currency: string
  ): Promise<AnalysisResult> {
    const chunks = this.chunkData(data, MAX_CHUNK_SIZE);

    const chunkResults = await Promise.all(
      chunks.map((chunk) => this.analyzeChunk(chunk, currency))
    );

    const mergedData = this.mergeChunkResults(chunkResults, currency);
    return this.generateFinalAnalysis(mergedData, currency);
  }

  private chunkData(data: string, maxSize: number): string[] {
    if (data.length <= maxSize) return [data];

    const chunks: string[] = [];
    const lines = data.split("\n");
    let currentChunk = "";

    for (const line of lines) {
      if (
        currentChunk.length + line.length > maxSize &&
        currentChunk.length > 0
      ) {
        chunks.push(currentChunk);
        currentChunk = line + "\n";
      } else {
        currentChunk += line + "\n";
      }
    }

    if (currentChunk.length > 0) chunks.push(currentChunk);

    return chunks;
  }

  private async analyzeChunk(
    chunk: string,
    currency: string
  ): Promise<ChunkAnalysisResult> {
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
      model: MODEL_NAME,
      schema: chunkAnalysisSchema,
      prompt,
    });

    return result.object;
  }

  private mergeChunkResults(
    chunks: ChunkAnalysisResult[],
    currency: string
  ): MergedData {
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

    const subscriptionMap = new Map<
      string,
      { name: string; amount: number; category: string }
    >();
    chunks.forEach((chunk) => {
      chunk.subscriptions.forEach((sub) => {
        if (!subscriptionMap.has(sub.name)) {
          subscriptionMap.set(sub.name, sub);
        }
      });
    });

    const subscriptions = Array.from(subscriptionMap.values());

    const vendorMap = new Map<
      string,
      { amount: number; transactions: number }
    >();
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

  private async generateFinalAnalysis(
    mergedData: MergedData,
    currency: string
  ): Promise<AnalysisResult> {
    const prompt = `Based on this financial summary, provide final analysis:

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

    const result = await generateObject({
      model: MODEL_NAME,
      schema: analysisSchema,
      prompt,
    });

    return {
      ...result.object,
      currency: mergedData.currency,
      totalIncome: mergedData.totalIncome,
      totalExpenses: mergedData.totalExpenses,
      categories: mergedData.categories,
      subscriptions: mergedData.subscriptions,
      topVendors: mergedData.topVendors,
      transactionInsights: mergedData.transactionInsights,
      anomalies: mergedData.anomalies,
    };
  }
}

export const analysisService = new AnalysisService();
