
import React, { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import * as pdfjsLib from 'pdfjs-dist';

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://esm.sh/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

interface DataInputProps {
  value: string;
  onChange: (val: string) => void;
  onLoading: (isLoading: boolean) => void;
}

const DataInput: React.FC<DataInputProps> = ({ value, onChange, onLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = async (file: File) => {
    onLoading(true);
    try {
      const fileType = file.name.split('.').pop()?.toLowerCase();

      if (fileType === 'csv' || fileType === 'txt') {
        const text = await file.text();
        onChange(text);
      } else if (fileType === 'xlsx' || fileType === 'xls') {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        let fullText = '';
        workbook.SheetNames.forEach(sheetName => {
          const worksheet = workbook.Sheets[sheetName];
          fullText += `--- Sheet: ${sheetName} ---\n`;
          fullText += XLSX.utils.sheet_to_csv(worksheet);
          fullText += '\n\n';
        });
        onChange(fullText.trim());
      } else if (fileType === 'pdf') {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const strings = content.items.map((item: any) => item.str);
          fullText += strings.join(' ') + '\n';
        }
        onChange(fullText.trim());
      } else {
        alert('Unsupported file format. Please upload CSV, PDF, or Excel.');
      }
    } catch (error) {
      console.error('File processing error:', error);
      alert('Error parsing file. Please try a different document.');
    } finally {
      onLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-semibold text-gray-700">
          Source Data
        </label>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 px-2 py-1 rounded border border-indigo-100 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Upload PDF/CSV/XLS
        </button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".csv,.pdf,.xlsx,.xls,.txt"
          onChange={handleFileChange}
        />
      </div>
      
      <div 
        className={`flex-1 relative transition-all duration-200 ${isDragging ? 'scale-[1.01]' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <textarea
          className={`h-full w-full p-4 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono resize-none transition-colors ${
            isDragging ? 'border-indigo-500 bg-indigo-50 border-dashed border-2' : 'border-gray-300'
          }`}
          placeholder="Paste your data here or drag and drop a file (PDF, CSV, Excel)..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {isDragging && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-indigo-600 text-white px-4 py-2 rounded-full shadow-lg text-sm font-bold animate-bounce">
              Drop file to extract data
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataInput;
