'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'

interface FileUploaderProps {
  onFileChange: (file: File | null) => void
}

export default function FileUploader({ onFileChange }: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (
        droppedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        droppedFile.type === 'application/vnd.ms-excel'
      ) {
        setFile(droppedFile)
        onFileChange(droppedFile)
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      onFileChange(e.target.files[0])
    }
  }

  const handleRemove = () => {
    setFile(null)
    onFileChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div
      className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
        dragActive ? 'border-primary bg-primary/5' : 'border-border'
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
        accept=".xlsx,.xls"
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
            <h3 className="text-lg font-semibold mb-2">Upload Bank Statement</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Drag and drop your bank statement Excel file here, or click to browse
            </p>
            <label htmlFor="file-upload">
              <Button type="button" onClick={() => document.getElementById('file-upload')?.click()}>
                Choose File
              </Button>
            </label>
            <p className="text-xs text-muted-foreground mt-2">
              Supports .xlsx and .xls files
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
  )
}
