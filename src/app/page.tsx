"use client";
import { useState } from 'react';
import { autoFillForm } from '@/services/api';
import { initialSchema } from '@/lib/initialSchema';
import { Upload, Loader2, CheckCircle, Eye } from 'lucide-react';
import { EventSchema } from '@/types/schema';
import { PDFViewerModal } from '@/components/forms/PDFViewerModal';
import { DynamicForm } from '@/components/forms/DynamicForm';


interface ExtractionStats {
  total: number;
  filled: number;
  rate: string;
}

export default function Dashboard() {
  const [formData, setFormData] = useState<EventSchema>(initialSchema as EventSchema);
  const [eventName, setEventName] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [stats, setStats] = useState<ExtractionStats | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleProcess = async () => {
    if (!eventName || files.length === 0) {
      alert("Please provide an Event Name and at least one document.");
      return;
    }

    setIsLoading(true);
    setStats(null);

    try {
      const updatedData = await autoFillForm(files, eventName, formData);
      setFormData({ ...updatedData });

      let totalFields = 0;
      let filledFields = 0;
      updatedData.sections?.forEach(section => {
        section.inputFields?.forEach(group => {
          group.fields?.forEach(field => {
            if (field.prompt) {
              totalFields++;
              const val = field.inputValue;
              if (val && val !== "Nil" && val !== "" && (Array.isArray(val) ? val.length > 0 : true)) {
                filledFields++;
              }
            }
          });
        });
      });

      setStats({
        total: totalFields,
        filled: filledFields,
        rate: ((filledFields / totalFields) * 100).toFixed(1)
      });

      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);

    } catch (error) {
      console.error("Extraction failed:", error);
      alert("AI Extraction failed. Check server connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (): Promise<void> => {
    try {
      const { downloadPDF } = await import('@/services/api');
      await downloadPDF(formData);
    } catch (error) {
      console.error("PDF Download failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-black font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Event Automation</h1>
            <p className="text-gray-500 text-sm">Convert project documents into structured event briefs</p>
          </div>
          {isSuccess && (
            <div className="flex items-center text-green-600 font-bold bg-green-50 px-4 py-2 rounded-full border border-green-200">
              <CheckCircle className="mr-2" size={18} /> Processed {stats?.filled} fields
            </div>
          )}
        </header>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Event Name</label>
              <input
                type="text"
                placeholder="Enter event name..."
                className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition bg-gray-50"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Upload Files</label>
              <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-3 hover:bg-gray-50 cursor-pointer transition">
                <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
                <div className="flex items-center justify-center text-sm text-gray-400">
                  <Upload size={18} className="mr-2" />
                  {files.length > 0 ? `${files.length} documents selected` : "PDF, Word, PPT or JSON"}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleProcess}
              disabled={isLoading}
              className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center disabled:opacity-50 shadow-lg active:scale-[0.98]"
            >
              {isLoading ? <><Loader2 className="animate-spin mr-2" /> Processing...</> : "Run AI Extraction"}
            </button>

            <button
              onClick={() => setIsPreviewOpen(true)}
              className="flex-1 bg-white border-2 border-slate-200 hover:border-blue-400 hover:text-blue-600 text-slate-700 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Eye size={20} /> Preview & Export
            </button>
          </div>
        </div>
        
        <div className="mt-10">
          <DynamicForm formData={formData} setFormData={setFormData} />
        </div>

        <PDFViewerModal 
          isOpen={isPreviewOpen} 
          onClose={() => setIsPreviewOpen(false)} 
          data={formData}
          onDownload={handleDownload}
        />
      </div>
    </div>
  );
}