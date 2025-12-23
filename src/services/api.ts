/* eslint-disable @typescript-eslint/no-explicit-any */
import 'dotenv/config';
import axios from 'axios';
import { EventSchema } from '@/types/schema';

const API_BASE_URL = process.env.API_URL;

export const autoFillForm = async (
  files: File[], 
  eventName: string, 
  schema: EventSchema
): Promise<EventSchema> => {
    console.log("📤 Sending request to backend...");
    console.log("  Files:", files.map(f => f.name));
    console.log("  Event Name:", eventName);
    console.log("  Schema sections:", schema.sections.map(s => s.sectionName));
    
    const formData = new FormData();
    
    
    files.forEach((file) => {
        formData.append("files", file);
    });
    
    
    formData.append("event_name", eventName);
    formData.append("schema", JSON.stringify(schema));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await axios.post<any>(`${API_BASE_URL}/auto-fill`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    console.log("📥 Response received from backend");
    console.log("  Status:", response.status);
    console.log("  Response keys:", Object.keys(response.data));
    
  
    const returnedData = response.data.data || response.data;
    
    console.log("📊 Stats:", response.data.stats);
    console.log("  Total fields:", response.data.stats?.total_fields);
    console.log("  Filled fields:", response.data.stats?.filled_fields);
    console.log("  Completion rate:", response.data.stats?.completion_rate + "%");
    
    
    console.log("\n🔍 Checking extracted values:");
    let sampleCount = 0;
    returnedData.sections?.forEach((section: any, sIdx: number) => {
        console.log(`\nSection ${sIdx}: ${section.sectionName}`);
        section.inputFields?.forEach((group: any, gIdx: number) => {
            group.fields?.forEach((field: any, fIdx: number) => {
                const value = field.inputValue;
                const isFilled = value && value !== "Nil" && value !== "" && 
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

    return returnedData;
};

export const downloadPDF = async (schema: EventSchema) => {
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
};