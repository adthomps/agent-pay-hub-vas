# Visa Acceptance Agent Toolkit - AI Integration

This project integrates the Visa Acceptance Agent Toolkit using the Vercel AI SDK for function-calling capabilities in a Node.js/TypeScript environment.

## Architecture

The application consists of:

1. **React Frontend** (Vite + TypeScript) - User interface for interacting with the AI agent
2. **Express API Server** (Node.js + TypeScript) - Handles AI agent requests and tool execution
3. **AI SDK Integration** - Uses Vercel AI SDK with OpenAI for natural language processing

## Features

### Supported Visa Acceptance Tools

- **Create Invoice** - Generate invoices with amount, currency, customer details
- **List Invoices** - Retrieve invoices with optional filtering by status
- **Send Invoice** - Send existing invoices to customers
- **Create Payment Link** - Generate payment links for quick transactions

### AI Capabilities

- **Natural Language Processing** - Understands queries like "Create invoice for $200 to customer@test.com"
- **Parameter Extraction** - Automatically extracts amounts, emails, currencies from text
- **Tool Selection** - Intelligently chooses the appropriate Visa tool based on user intent
- **Fallback Logic** - Rule-based parsing when OpenAI API is not available

## Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Optional: Set OpenAI API key for full AI functionality
echo "OPENAI_API_KEY=your-api-key" > .env
```

### Development

```bash
# Start both frontend and API server
npm run dev

# Or run separately:
npm run dev:client  # Frontend only (port 8080)
npm run dev:server  # API server only (port 3001)
```

### API Endpoints

- `POST /api/agent/ask` - Main agent endpoint
- `GET /api/health` - Health check

### Example Agent Request

```json
{
  "query": "Create invoice for $150 to john@example.com",
  "tool": "auto"  // Optional: specify tool or use "auto" for AI selection
}
```

### Example Agent Response

```json
{
  "tool": "create_invoice",
  "result": {
    "success": true,
    "data": {
      "id": "inv_1234567890",
      "amount": 150,
      "currency": "USD",
      "email": "john@example.com",
      "status": "draft",
      "dueDate": "2024-10-07"
    },
    "message": "Invoice created successfully for john@example.com",
    "aiReasoning": "Detected invoice creation request based on keywords",
    "extractedParameters": {
      "amount": 150,
      "currency": "USD",
      "email": "john@example.com"
    }
  },
  "success": true
}
```

## AI Integration Details

### With OpenAI API Key

When `OPENAI_API_KEY` is provided, the system uses GPT-3.5-turbo for:
- Intent recognition
- Parameter extraction
- Tool selection reasoning

### Without OpenAI API Key (Fallback)

The system uses rule-based parsing that:
- Detects keywords (create, invoice, list, send, link, payment)
- Extracts amounts using regex patterns
- Identifies email addresses and currencies
- Provides intelligent tool selection

## Example Queries

- `"Create invoice for $200 to customer@test.com"`
- `"List all draft invoices"`
- `"Send invoice inv_123"`
- `"Create payment link for EUR 75"`
- `"Generate a €500 invoice for jane@company.com with 14 day terms"`

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, TypeScript
- **AI**: Vercel AI SDK, OpenAI GPT-3.5-turbo
- **UI Components**: Radix UI, shadcn/ui
- **Development**: tsx, concurrently, hot reloading

## Production Deployment

1. Build the frontend: `npm run build`
2. Deploy the Express server with environment variables
3. Set `OPENAI_API_KEY` for full AI functionality
4. Configure proxy/reverse proxy to serve both frontend and API

## Real Visa Integration

In a production environment, replace the mock functions in `server/index.ts` with actual Visa API calls:

```typescript
// Replace mock implementation
case 'create_invoice':
  // Call actual Visa Invoice API
  const response = await fetch('https://api.visa.com/invoices', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${visaApiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(args)
  });
  return await response.json();
```