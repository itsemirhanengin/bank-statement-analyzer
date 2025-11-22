"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";

type FileUploaderProps = {
  onFileChange: (file: File | null, extractedText?: string) => void;
};

export default function FileUploader({ onFileChange }: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractPDFText = async (file: File): Promise<string> => {
    const pdfjsLib = await import("pdfjs-dist");

    if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.mjs";
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: unknown) => (item as { str: string }).str)
        .join(" ");
      fullText += pageText + "\n";
    }

    return fullText;
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (
        droppedFile.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        droppedFile.type === "application/vnd.ms-excel" ||
        droppedFile.type === "application/pdf"
      ) {
        setFile(droppedFile);
        setIsProcessing(true);

        try {
          if (droppedFile.type === "application/pdf") {
            const extractedText = await extractPDFText(droppedFile);
            console.log(extractedText);
            onFileChange(droppedFile, extractedText);
          } else {
            onFileChange(droppedFile);
          }
        } catch (error) {
          console.error("Error processing file:", error);
          onFileChange(droppedFile);
        } finally {
          setIsProcessing(false);
        }
      }
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setIsProcessing(true);

      try {
        if (selectedFile.type === "application/pdf") {
          const extractedText = await extractPDFText(selectedFile);
          console.log(extractedText);
          onFileChange(selectedFile, extractedText);
        } else {
          onFileChange(selectedFile);
        }
      } catch (error) {
        console.error("Error processing file:", error);
        onFileChange(selectedFile);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleRemove = () => {
    setFile(null);
    onFileChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div
      className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
        dragActive ? "border-primary bg-primary/5" : "border-border"
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        id="file-upload"
        ref={fileInputRef}
        className="hidden"
        accept=".xlsx,.xls,.pdf"
        onChange={handleChange}
      />

      {!file ? (
        <div className="space-y-4">
          <div className="flex justify-center">
            <svg
              className="w-16 h-16 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Upload Bank Statement
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Drag and drop your bank statement file here, or click to browse
            </p>
            <label htmlFor="file-upload">
              <Button
                type="button"
                onClick={() => document.getElementById("file-upload")?.click()}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Choose File"}
              </Button>
            </label>
            <p className="text-xs text-muted-foreground mt-2">
              Supports .xlsx, .xls, and .pdf files
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-center">
            <svg
              className="w-16 h-16 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">{file.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {(file.size / 1024).toFixed(2)} KB
            </p>
            <Button variant="destructive" onClick={handleRemove}>
              Remove File
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
