"use client";

import { useState } from "react";
import FileUploader from "@/components/file-uploader";
import { Dashboard } from "@/components/features/dashboard/dashboard";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { AnalysisResult } from "@/lib/schemas";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string | undefined>(
    undefined
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      if (extractedText) {
        formData.append("pdfText", extractedText);
      }

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const data = await response.json();
      setAnalysisData(data);
    } catch (err) {
      console.error("Analysis error:", err);
      setError(
        "Failed to analyze the bank statement. Please check your API key and try again."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileChange = (newFile: File | null, text?: string) => {
    setFile(newFile);
    setExtractedText(text);
    setError(null);
  };

  const handleReset = () => {
    setFile(null);
    setExtractedText(undefined);
    setAnalysisData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-background p-8 pb-20 sm:p-20 transition-colors duration-300">
      <main className="max-w-5xl mx-auto space-y-12">
        <div className="space-y-4 text-center sm:text-left">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl font-heading">
            Bank Statement Analyzer
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            {analysisData
              ? "Your comprehensive financial analysis is ready."
              : "Upload your bank statement to unlock insights about your spending habits."}
          </p>
        </div>

        {!analysisData && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <FileUploader onFileChange={handleFileChange} />

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="w-4 h-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end">
              <Button
                size="lg"
                onClick={handleAnalyze}
                disabled={!file || isAnalyzing}
                className="w-full sm:w-auto font-semibold text-lg h-12 px-8"
              >
                {isAnalyzing ? (
                  <>
                    <Spinner className="mr-2" />
                    Analyzing...
                  </>
                ) : (
                  "Start Analysis"
                )}
              </Button>
            </div>
          </div>
        )}

        {analysisData && (
          <Dashboard data={analysisData} onReset={handleReset} />
        )}
      </main>
    </div>
  );
}
