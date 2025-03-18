# Ollama Frontend

A lightweight frontend for Ollama's DeepSeek models, featuring real-time streaming responses and thinking process visualization.

## Prerequisites

- Node.js (v18 or later)
- Ollama installed and running locally
- DeepSeek model pulled in Ollama

## Setup Instructions

### Windows

1. Install Node.js from https://nodejs.org/
2. Install Ollama from https://ollama.ai/
3. Open PowerShell and pull the DeepSeek model:
   ```powershell
   ollama pull deepseek-r1:1.5b
   ```
4. Clone this repository
5. Navigate to the project directory
6. Install dependencies:
   ```powershell
   npm install
   ```
7. Start the development server:
   ```powershell
   npm run dev
   ```

### Ubuntu

1. Install Node.js:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```
2. Install Ollama:
   ```bash
   curl -fsSL https://ollama.ai/install.sh | sh
   ```
3. Pull the DeepSeek model:
   ```bash
   ollama pull deepseek-r1:1.5b
   ```
4. Clone this repository
5. Navigate to the project directory
6. Install dependencies:
   ```bash
   npm install
   ```
7. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at http://localhost:5173

## Features

- Real-time streaming responses
- Thinking process visualization
- Responsive design for desktop and mobile
- Dark theme UI
- No authentication required
- No database dependencies

## Development

The project uses:
- Vite for fast development and building
- React for UI components
- Tailwind CSS for styling
- Server-Sent Events for streaming responses