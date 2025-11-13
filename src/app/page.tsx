"use client";

import { useState } from "react";
import FileUploader from "@/components/file-uploader";
import AnalysisResults from "@/components/analysis-results";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string | undefined>(
    undefined
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
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
      setShowResults(true);
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
  };

  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20">
      <main className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2 font-heading">
            Bank Statement Analyzer
          </h1>
          <p className="text-muted-foreground">
            {showResults
              ? "Your comprehensive financial analysis"
              : "Upload your bank statement to analyze your spending"}
          </p>
        </div>

        {!showResults && (
          <>
            <FileUploader onFileChange={handleFileChange} />

            {error && (
              <Alert className="border-red-200 bg-red-50 dark:bg-red-950">
                <AlertTriangle className="w-4 h-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end">
              <Button
                size="lg"
                onClick={handleAnalyze}
                disabled={!file || isAnalyzing}
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
          </>
        )}

        {showResults && analysisData && (
          <>
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowResults(false);
                  setFile(null);
                  setAnalysisData(null);
                  setError(null);
                }}
              >
                Analyze Another Statement
              </Button>
            </div>
            <AnalysisResults data={analysisData} />
          </>
        )}
      </main>
    </div>
  );
}
