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

Edit `.env` with your Visa Acceptance credentials. **Start with SANDBOX testing first**:

```env
# Visa Acceptance API Credentials (Get from https://developer.visa.com/)
VISA_ACCEPTANCE_MERCHANT_ID=your_merchant_id_here
VISA_ACCEPTANCE_API_KEY_ID=your_api_key_id_here  
VISA_ACCEPTANCE_SECRET_KEY=your_secret_key_here
VISA_ACCEPTANCE_ENVIRONMENT=SANDBOX  # SANDBOX for testing, PRODUCTION for live

# OpenAI API Key (Optional - for AI-powered responses)
OPENAI_API_KEY=your_openai_api_key_here

# CyberSource Environment Configuration
CYBS_ENVIRONMENT=SANDBOX  # SANDBOX for testing, PRODUCTION for live

# Server Configuration
PORT=3001
```

### 🧪 Testing with Live Credentials

The application supports comprehensive testing of both sandbox and production environments:

#### **Step 1: Sandbox Testing (Recommended)**
1. **Get Sandbox Credentials**:
   - Visit [Visa Developer Portal](https://developer.visa.com/)
   - Create a sandbox application
   - Get your sandbox merchant ID, API key ID, and secret key

2. **Configure for Sandbox**:
   ```env
   VISA_ACCEPTANCE_ENVIRONMENT=SANDBOX
   CYBS_ENVIRONMENT=SANDBOX
   # Add your sandbox credentials
   ```

3. **Test All Operations**:
   - Create test invoices and payment links
   - Verify all API operations work correctly
   - No real money is processed in sandbox mode

#### **Step 2: Production Testing (After Sandbox Success)**
⚠️ **WARNING**: Production mode processes real transactions and charges real money.

1. **Get Production Credentials**:
   - Upgrade to production access in Visa Developer Portal
   - Get production credentials

2. **Configure for Production**:
   ```env
   VISA_ACCEPTANCE_ENVIRONMENT=PRODUCTION
   CYBS_ENVIRONMENT=PRODUCTION
   # Add your production credentials
   ```

#### **Step 3: Live/Mock Mode Switching**

The application provides three ways to control operation modes:

1. **UI Mode Toggle**: Use the mode toggle button in the application header
2. **Environment-Based**: Configure via environment variables 
3. **API Control**: Use the mode toggle endpoints

**Mode Types**:
- **Demo Mode** 🧪: Mock responses, no real API calls, always available
- **Live Mode** ⚡: Real API calls to Visa Acceptance APIs, requires valid credentials

**API Endpoints for Mode Control**:
```bash
# Check current mode
curl http://localhost:3001/api/mode/status

# Switch to demo mode
curl -X POST -H "Content-Type: application/json" \
  -d '{"mode":"demo"}' http://localhost:3001/api/mode/toggle

# Switch to live mode (requires valid credentials)
curl -X POST -H "Content-Type: application/json" \
  -d '{"mode":"live"}' http://localhost:3001/api/mode/toggle
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

### Mode Toggle Feature

The application includes a **Mode Toggle** feature that allows you to manually switch between Demo and Live modes via the UI:

#### Using the Mode Toggle

1. **Location**: Look for the mode toggle in the header next to the theme toggle
2. **Current Mode**: Shows "Demo" or "Live" with appropriate icons
3. **Switching Modes**: Click the toggle to see available options

#### Mode Types

- **Demo Mode** 🧪
  - Uses mock responses for all operations
  - Perfect for testing the UI and understanding workflows
  - Always available regardless of credential configuration
  - Shows `"demo": true` in all API responses

- **Live Mode** ⚡
  - Connects to real Visa Acceptance APIs
  - Only available when credentials are properly configured
  - Shows `"demo": false` in all API responses
  - Requires valid `VISA_ACCEPTANCE_*` environment variables

#### Smart Mode Detection

The system automatically:
- Detects available credentials and toolkit status
- Prevents switching to Live mode when credentials are missing
- Shows clear indicators of why Live mode might not be available
- Persists your mode preference in browser localStorage

#### Mode Toggle API

You can also control modes programmatically:

```bash
# Check current mode status
curl http://localhost:3001/api/mode/status

# Switch to demo mode
curl -X POST -H "Content-Type: application/json" \
  -d '{"mode":"demo"}' \
  http://localhost:3001/api/mode/toggle

# Switch to live mode (requires valid credentials)
curl -X POST -H "Content-Type: application/json" \
  -d '{"mode":"live"}' \
  http://localhost:3001/api/mode/toggle
```

## API Endpoints

The backend server provides these endpoints:

- `POST /api/agent/ask` - Process natural language queries
- `GET /api/health` - Health check and toolkit status
- `GET /api/agent/tools` - List available tools and capabilities
- `GET /api/mode/status` - Get current mode status and capabilities
- `POST /api/mode/toggle` - Switch between demo and live modes

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
| `CYBS_ENVIRONMENT` | No | CyberSource environment: `SANDBOX` or `PRODUCTION` (default: `SANDBOX`) |
| `PORT` | No | Server port (default: `3001`) |
| `OPENAI_API_KEY` | No | OpenAI API key for enhanced AI responses |

### 🔄 Environment Testing Workflow

1. **Development/Testing**: Use `SANDBOX` for both `VISA_ACCEPTANCE_ENVIRONMENT` and `CYBS_ENVIRONMENT`
2. **Production**: Use `PRODUCTION` for both environments (⚠️ processes real transactions)
3. **Demo Mode**: Leave credentials empty to use mock responses for UI testing

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

### 🔧 Troubleshooting Live Mode

If you encounter issues switching to live mode:

1. **"Visa Acceptance Agent Toolkit not configured"**
   - Check that all required environment variables are set in `.env`
   - Verify credentials are correct for the specified environment
   - Ensure you're using the right environment (SANDBOX/PRODUCTION)

2. **"Dynamic require not supported" error**
   - This is a known issue with certain Node.js module configurations
   - Use `server.js` instead of `server.ts` if you encounter this
   - The application will fall back to demo mode automatically

3. **Server not starting**
   - Check that port 3001 is available
   - Verify all dependencies are installed (`npm install`)
   - Check for any missing environment variables

4. **Frontend can't connect to server**
   - Ensure both frontend and server are running
   - Check that the Vite proxy is configured correctly
   - Verify the server is running on the expected port

### 🎯 Quick Test Commands

Test your credential setup:
```bash
# Check if credentials are detected
curl http://localhost:3001/api/health | jq '.credentialsConfigured, .currentMode'

# Test mode switching (requires valid credentials)
curl -X POST -H "Content-Type: application/json" \
  -d '{"mode":"live"}' http://localhost:3001/api/mode/toggle
```

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
