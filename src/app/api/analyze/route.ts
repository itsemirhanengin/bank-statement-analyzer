import { analysisService } from "@/services/analysis";
import { parserService } from "@/services/parser";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const pdfText = formData.get("pdfText") as string | null;

    if (!file) {
      return new Response("Missing file", { status: 400 });
    }

    let statementData: string;

    if (pdfText) {
      statementData = pdfText;
    } else {
      const arrayBuffer = await file.arrayBuffer();
      statementData = await parserService.parseExcel(arrayBuffer);
    }

    const result = await analysisService.analyze(statementData);

    return Response.json(result);
  } catch (error) {
    console.error("Analysis error:", error);
    return new Response("Analysis failed", { status: 500 });
  }
}
