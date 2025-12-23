import axios from 'axios';
import { EventSchema, FormSection, InputFieldGroup, FormField } from '@/types/schema';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ;

interface AutoFillResponse {
    data: EventSchema;
    stats: {
        total_fields: number;
        filled_fields: number;
        completion_rate: number;
    };
}

export const autoFillForm = async (
    files: File[], 
    eventName: string, 
    schema: EventSchema
): Promise<EventSchema> => {
    console.log("📤 Sending request to backend...");
    
    const formData = new FormData();
    
    files.forEach((file) => {
        formData.append("files", file);
    });
    
    formData.append("event_name", eventName);
    formData.append("schema", JSON.stringify(schema));

    const response = await axios.post<AutoFillResponse>(`${API_BASE_URL}/auto-fill`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    console.log("📥 Response received from backend");
    console.log("  Status:", response.status);
    const { data: returnedSchema, stats } = response.data;
    
    console.log("📊 Stats:", stats);
    console.log("  Total fields:", stats?.total_fields);
    console.log("  Filled fields:", stats?.filled_fields);
    console.log("  Completion rate:", stats?.completion_rate + "%");
    
    console.log("\n🔍 Checking extracted values:");
    let sampleCount = 0;
    returnedSchema.sections?.forEach((section: FormSection, sIdx: number) => {
        console.log(`\nSection ${sIdx}: ${section.sectionName}`);
        section.inputFields?.forEach((group: InputFieldGroup, gIdx: number) => {
            group.fields?.forEach((field: FormField, fIdx: number) => {
                const value = field.inputValue;
                const isFilled = value !== null && 
                               value !== undefined && 
                               value !== "Nil" && 
                               value !== "" && 
                               (Array.isArray(value) ? value.length > 0 : true);
                
                if (sampleCount < 10) {
                    console.log(
                        `  [${sIdx}.${gIdx}.${fIdx}] ${field.inputName}: ${
                            isFilled ? '✓' : '✗'
                        } ${typeof value === 'object' ? JSON.stringify(value) : value}`
                    );
                    sampleCount++;
                }
            });
        });
    });
    
    console.log("\n✅ Returning data to frontend\n");

    return returnedSchema;
};

export const downloadPDF = async (schema: EventSchema): Promise<void> => {
    const formData = new FormData();
    formData.append("schema", JSON.stringify(schema));

    const response = await axios.post(`${API_BASE_URL}/generate-pdf`, formData, {
        responseType: 'blob', 
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Event_Brief_${Date.now()}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url); 
};