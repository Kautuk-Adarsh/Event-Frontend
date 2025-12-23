# 🎨 Event Automation Dashboard (Frontend)

A high-performance, schema-driven dashboard built with **Next.js 14** and **TypeScript**. This application serves as the interactive layer for the AI-powered event brief generation system.

## 🚀 Overview
The frontend is designed as a **Dynamic Editor**. Instead of static inputs, it consumes a JSON schema to build complex forms on the fly. It allows users to upload source documents, trigger AI analysis, edit extracted data, and preview the final branded document in an immersive modal.

## 🛠️ Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript 
- **Styling:** Tailwind CSS
- **Iconography:** Lucide React
- **API Client:** Axios

## ✨ Key Features
- **Dynamic Form Engine:** Automatically maps nested JSON structures into editable UI components.
- **Immersive PDF Preview:** A custom-built, full-screen viewer modal that mimics high-fidelity paper layouts.
- **Type-Safe Object Handling:** Specialized logic to handle complex data types like Stakeholder objects and narrative arrays without rendering errors.
- **Real-time Synchronization:** Form edits instantly propagate to the PDF preview canvas.

## 📦 Installation & Setup
1. Move into the directory:
   ```bash
   cd event-frontend
## Install dependencies:
    npm install    
## Run the server:
    npm run dev