import React from 'react';
import { FormField as FormFieldType } from '@/types/schema';

interface Props {
  field: FormFieldType;
  onChange: (value: string) => void;
}

export const FormField: React.FC<Props> = ({ field, onChange }) => {
  const baseStyles = "w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white text-black";

  const getDisplayValue = (): string => {
    const val = field.inputValue;
    
    if (!val || val === "Nil") return "";
    
    if (typeof val === 'object' && !Array.isArray(val) && val !== null) {
      const obj = val as Record<string, string | null>;
      
      const hasName = obj.Name !== null && obj.Name !== undefined && obj.Name !== "" && obj.Name !== "Nil";
      const hasEmail = obj.Email !== null && obj.Email !== undefined && obj.Email !== "" && obj.Email !== "Nil";

      if (!hasName && !hasEmail) return "";
      
      if (hasName && hasEmail) return `${obj.Name} (${obj.Email})`;
      return String(obj.Name || obj.Email || "");
    }
    
    if (Array.isArray(val)) {
      return val.filter(item => item !== "Nil").join(", ");
    }
    
    return String(val);
  };

  const displayValue = getDisplayValue();

  
  if (field.fieldType === "dropdown") {
    return (
      <select 
        className={baseStyles}
        value={displayValue || "Nil"}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="Nil">Select...</option>
        {field.options?.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    );
  }

  
  if (field.fieldType === "textarea") {
    return (
      <textarea
        className={`${baseStyles} min-h-[100px] resize-y`}
        value={displayValue}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.inputName}
      />
    );
  }

  
  return (
    <input 
      type="text"
      className={baseStyles}
      value={displayValue}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.inputName}
    />
  );
};
