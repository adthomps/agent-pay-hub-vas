# Visa Acceptance Agent Hub

A React application integrated with the Visa Acceptance Agent Toolkit for AI-powered payment processing. This application demonstrates how to integrate Visa Acceptance APIs with Vercel's AI SDK for natural language processing of payment operations.

![Integration Working](https://github.com/user-attachments/assets/6a23a332-0666-471b-b2cf-5fd828620d38)

## Features

- 🤖 **AI Agent Assistant** - Natural language interface for payment operations
- 💳 **Invoice Management** - Create, update, list, and manage invoices
- 🔗 **Payment Links** - Generate and manage payment links
- 🔧 **Visa Acceptance Integration** - Direct integration with Visa Acceptance APIs
- 📊 **Real-time Dashboard** - View and manage all payment activities

## Architecture

This application consists of:
- **Frontend**: React + TypeScript + Vite application with shadcn/ui components
- **Backend**: Express.js server with Visa Acceptance Agent Toolkit integration
- **AI Integration**: Vercel AI SDK for natural language processing

## Quick Start

### Option 1: GitHub Codespaces (Recommended)

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/adthomps/agent-pay-hub-vas)

Click the button above to launch this project in a GitHub Codespace. The development environment will be automatically configured with:
- Node.js and pnpm pre-installed
- All dependencies installed
- VS Code extensions configured
- Port forwarding for development servers

### Option 2: Local Development

#### 1. Installation

```bash
pnpm install
```

#### 2. Configuration

Copy the example environment file and configure your credentials:

```bash
cp .env.example .env
```

Edit `.env` with your Visa Acceptance credentials:

```env
# Visa Acceptance API Credentials
VISA_ACCEPTANCE_MERCHANT_ID=your_merchant_id_here
VISA_ACCEPTANCE_API_KEY_ID=your_api_key_id_here  
VISA_ACCEPTANCE_SECRET_KEY=your_secret_key_here
VISA_ACCEPTANCE_ENVIRONMENT=SANDBOX

# Server Configuration
PORT=3001

# Optional: For AI-powered responses
OPENAI_API_KEY=your_openai_api_key_here
```

#### 3. Running the Application

Start both the server and frontend:

```bash
pnpm run start:full
```

This will start:
- Backend server on http://localhost:3001
- Frontend application on http://localhost:8080

Alternatively, you can run them separately:

```bash
# Terminal 1: Start the server
pnpm run server:dev

# Terminal 2: Start the frontend
pnpm run dev
```

## Visa Acceptance Agent Toolkit Integration

### Supported Operations

The application integrates with the Visa Acceptance Agent Toolkit to provide:

#### Invoice Operations
- **Create Invoice** - Create new invoices with customer information
- **List Invoices** - Retrieve paginated list of invoices with filtering
- **Get Invoice** - Retrieve detailed information for specific invoices
- **Update Invoice** - Update existing invoice details
- **Send Invoice** - Send invoices to customers via email
- **Cancel Invoice** - Cancel existing invoices

#### Payment Link Operations
- **Create Payment Link** - Create new payment links with optional shipping
- **List Payment Links** - Retrieve paginated list of payment links
- **Get Payment Link** - Retrieve details of specific payment links
- **Update Payment Link** - Update existing payment link details

### Usage Examples

#### Using the AI Agent Assistant

1. Navigate to the application at http://localhost:8080
2. Use the "AI Agent Assistant" section at the top
3. Enter natural language commands such as:
   - "Create an invoice for $150 to alice@example.com for website design services"
   - "List all pending invoices"
   - "Create a payment link for $99.99 for premium subscription"

#### Direct Tool Selection

You can also select specific tools from the dropdown:
- Choose a specific operation (e.g., "Create Invoice")
- Enter your natural language request
- Click "Ask Agent" to execute

## API Endpoints

The backend server provides these endpoints:

- `POST /api/agent/ask` - Process natural language queries
- `GET /api/health` - Health check and toolkit status
- `GET /api/agent/tools` - List available tools and capabilities

## Technologies Used

This project is built with:

- **Frontend**: Vite, TypeScript, React, shadcn-ui, Tailwind CSS
- **Backend**: Express.js, Node.js
- **Integration**: Visa Acceptance Agent Toolkit, Vercel AI SDK
- **Development**: Concurrently, Nodemon, ts-node

## Development

### Scripts

- `pnpm run dev` - Start frontend development server
- `pnpm run build` - Build frontend for production
- `pnpm run server` - Start backend server
- `pnpm run server:dev` - Start backend in development mode with auto-reload
- `pnpm run start:full` - Start both frontend and backend concurrently
- `pnpm run lint` - Run ESLint

### Project Structure

```
├── src/
│   ├── components/        # React components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   └── pages/            # Page components
├── server.js             # Express server with Visa toolkit integration
├── .env.example          # Environment variables template
└── vite.config.ts        # Vite configuration with API proxy
```

## Configuration Details

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VISA_ACCEPTANCE_MERCHANT_ID` | Yes | Your Visa Acceptance merchant ID |
| `VISA_ACCEPTANCE_API_KEY_ID` | Yes | Your Visa Acceptance API key ID |
| `VISA_ACCEPTANCE_SECRET_KEY` | Yes | Your Visa Acceptance secret key |
| `VISA_ACCEPTANCE_ENVIRONMENT` | No | `SANDBOX` or `PRODUCTION` (default: `SANDBOX`) |
| `PORT` | No | Server port (default: `3001`) |
| `OPENAI_API_KEY` | No | OpenAI API key for enhanced AI responses |

### Demo Mode

If the Visa Acceptance credentials are not configured, the application runs in demo mode with mock responses. This allows you to:
- Test the user interface
- Understand the workflow
- See example responses
- Prepare for live integration

### Live Integration

When proper credentials are provided, the application will:
- Initialize the Visa Acceptance Agent Toolkit
- Connect to the live Visa Acceptance APIs
- Process real payment operations
- Provide actual invoice and payment link functionality

## Troubleshooting

### Common Issues

1. **"Visa Acceptance Agent Toolkit not configured"**
   - Check that all required environment variables are set
   - Verify credentials are correct
   - Ensure you're using the right environment (SANDBOX/PRODUCTION)

2. **Server not starting**
   - Check that port 3001 is available
   - Verify all dependencies are installed (`pnpm install`)
   - Check for any missing environment variables

3. **Frontend can't connect to server**
   - Ensure both frontend and server are running
   - Check that the Vite proxy is configured correctly
   - Verify the server is running on the expected port

### Debug Information

Check these endpoints for debugging:
- http://localhost:3001/api/health - Server and toolkit status
- http://localhost:3001/api/agent/tools - Available tools and capabilities

## Contributing

This application demonstrates the integration pattern for the Visa Acceptance Agent Toolkit. Feel free to extend it with:
- Additional payment operations
- Enhanced AI prompts
- Custom business logic
- Advanced error handling

## License

MIT License - see LICENSE file for details.
