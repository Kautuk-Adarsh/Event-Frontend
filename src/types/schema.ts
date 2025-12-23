export interface FormField {
  inputName?: string;
  inputValue: string | string[] | Record<string, string | null> | null;
  dataType: "String" | "Date" | "Array" | "Object" | "Number";
  fieldType: "input" | "dropdown" | "textarea";
  prompt?: string;
  options?: string[];
  helperText?: string[];
}

export interface InputFieldGroup {
  fieldsHeading: string;
  fields: FormField[];
}

export interface FormSection {
  sectionName: string;
  inputFields: InputFieldGroup[];
}

export interface EventSchema {
  templateName: string;
  sections: FormSection[];
}