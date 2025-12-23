import React from 'react';
import { EventSchema } from '@/types/schema';
import { FormField } from './FormField';

interface Props {
  formData: EventSchema;
  setFormData: React.Dispatch<React.SetStateAction<EventSchema>>;
}

export const DynamicForm: React.FC<Props> = ({ formData, setFormData }) => {
  
  const handleFieldChange = (sectionIdx: number, groupIdx: number, fieldIdx: number, newValue: string) => {
    const updatedSchema = { ...formData };
    updatedSchema.sections[sectionIdx].inputFields[groupIdx].fields[fieldIdx].inputValue = newValue;
    setFormData(updatedSchema);
  };

  return (
    <div className="space-y-10 pb-20">
      {formData.sections.map((section, sIdx) => (
        <div key={sIdx} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">{section.sectionName}</h2>
          </div>
          
          <div className="p-6 space-y-8">
            {section.inputFields.map((group, gIdx) => (
              <div key={gIdx} className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-blue-600 border-b pb-2">
                  {group.fieldsHeading}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {group.fields.map((field, fIdx) => (
                    <div key={fIdx} className="space-y-1">
                      <label className="block text-xs font-semibold text-gray-500 uppercase">
                        {field.inputName}
                      </label>
                      <FormField 
                        field={field} 
                        onChange={(val) => handleFieldChange(sIdx, gIdx, fIdx, val)} 
                      />
                      {field.helperText && (
                        <p className="text-[10px] text-gray-400 italic leading-tight">
                          {field.helperText.join(", ")}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
