import React from 'react';
import { EventSchema, FormField } from '@/types/schema';
import { X, Download, FileText } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data: EventSchema;
  onDownload: () => void;
}

interface Stakeholder {
  Name?: string | null;
  Email?: string | null;
}

export const PDFViewerModal: React.FC<Props> = ({ isOpen, onClose, data, onDownload }) => {
  if (!isOpen) return null;

  const renderValue = (val: FormField['inputValue']): React.ReactNode => {
    if (!val || val === "Nil") return "—";
    if (Array.isArray(val)) {
      return <ul className="list-disc ml-4">{val.map((item, i) => <li key={i}>{String(item)}</li>)}</ul>;
    }
    if (typeof val === 'object' && val !== null) {
      const obj = val as Stakeholder;
      const name = obj.Name || "";
      const email = obj.Email && obj.Email !== "Nil" ? `(${obj.Email})` : "";
      return <span>{name} {email}</span>;
    }
    return String(val);
  };

  const getHeaderVal = (name: string): string => {
    const f = data.sections[0]?.inputFields[0]?.fields.find(field => field.inputName === name);
    return typeof f?.inputValue === 'string' ? f.inputValue : "N/A";
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-800 w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-700">
        
        
        <div className="bg-slate-900 px-6 py-4 flex justify-between items-center border-b border-slate-700">
          <div className="flex items-center gap-3 text-slate-200">
            <FileText className="text-blue-400" size={20} />
            <span className="font-bold">Document Preview</span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={onDownload}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2 px-6 rounded-lg transition shadow-lg"
            >
              <Download size={16} /> Export PDF
            </button>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition">
              <X size={24} />
            </button>
          </div>
        </div>

        
        <div className="flex-1 overflow-y-auto bg-slate-200/50 p-6 md:p-12 custom-scrollbar">
          <div className="bg-white mx-auto w-full max-w-[800px] shadow-2xl p-16 text-black min-h-full">
            
            <div className="bg-black text-white p-10 -m-16 mb-12 flex justify-between items-end">
              <div>
                <h1 className="text-4xl font-black italic uppercase tracking-tighter">GPJ Input Brief</h1>
                <div className="bg-[#00ffaa] text-black px-3 py-1 inline-block text-[10px] font-bold mt-2 uppercase">For IBM</div>
              </div>
            </div>

            
            <div className="grid grid-cols-2 border-2 border-black mb-10 text-sm font-sans">
              <div className="border-r-2 border-black p-4 font-bold bg-gray-50 flex justify-between uppercase">
                Project Name: <span className="font-normal normal-case ml-2">{getHeaderVal("Project Name")}</span>
              </div>
              <div className="p-4 font-bold bg-gray-50 flex justify-between uppercase">
                Project Type: <span className="font-normal normal-case ml-2">{getHeaderVal("Project Type")}</span>
              </div>
            </div>

            
            {data.sections.map((section, sIdx) => (
              <div key={sIdx} className="mb-10 font-sans">
                <div className="bg-gray-100 border-l-[6px] border-black px-4 py-2 font-black text-xs uppercase tracking-widest mb-4">
                  {sIdx + 1}. {section.sectionName}
                </div>
                <table className="w-full border-collapse border border-gray-200 text-[11px] leading-relaxed">
                  <tbody>
                    {section.inputFields.map((group, gIdx) => (
                      <React.Fragment key={gIdx}>
                        {group.fieldsHeading && (
                          <tr><td colSpan={2} className="px-3 pt-5 pb-2 font-black text-blue-700 border-b border-blue-50 uppercase bg-blue-50/20">{group.fieldsHeading}</td></tr>
                        )}
                        {group.fields.map((field, fIdx) => (
                          <tr key={fIdx} className="border-b border-gray-100 last:border-b-0">
                            <td className="w-1/3 p-3 font-bold text-gray-500 bg-gray-50/50 border-r border-gray-100">{field.inputName || "Detail"}</td>
                            <td className="p-3 text-gray-800">{renderValue(field.inputValue)}</td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};