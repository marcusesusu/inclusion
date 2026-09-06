'use client';

import * as React from 'react';
import { useDropzone } from 'react-dropzone';
import { useFormContext, Controller } from 'react-hook-form';
import { UploadCloud, FileCheck, AlertCircle, X } from 'lucide-react';

interface DocumentUploadProps {
  name: string;
  label: string;
  description?: string;
}

export function DocumentUpload({ name, label, description }: DocumentUploadProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const errorMessage = errors[name]?.message as string | undefined;

  return (
    <div className="w-full space-y-1.5">
      <label className="block text-sm font-medium text-foreground">{label}</label>

      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => {
          const file = value instanceof File ? value : null;

          const { getRootProps, getInputProps, isDragActive } = useDropzone({
            accept: {
              'image/jpeg': ['.jpg', '.jpeg'],
              'image/png': ['.png'],
              'application/pdf': ['.pdf'],
            },
            maxSize: 5 * 1024 * 1024, // 5MB Limit
            multiple: false,
            onDrop: (acceptedFiles) => {
              if (acceptedFiles[0]) {
                onChange(acceptedFiles[0]);
              }
            },
          });

          return (
            <div>
              {!file ? (
                <div
                  {...getRootProps()}
                  className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-colors cursor-pointer ${
                    isDragActive
                      ? 'border-primary bg-primary/5'
                      : errorMessage
                      ? 'border-secondary bg-secondary/5'
                      : 'border-border bg-muted/30 hover:bg-muted/50'
                  }`}
                >
                  <input {...getInputProps()} />
                  <UploadCloud className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium text-foreground">
                    Click to upload or drag & drop
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    JPEG, PNG or PDF (max 5MB)
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-between rounded-xl border border-border bg-muted/40 p-3">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-tertiary/10 text-tertiary">
                      <FileCheck className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onChange(null)}
                    className="p-1 rounded-lg text-muted-foreground hover:bg-background hover:text-foreground transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          );
        }}
      />

      {description && !errorMessage && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}

      {errorMessage && (
        <div className="flex items-center gap-1.5 text-xs text-secondary font-medium">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
