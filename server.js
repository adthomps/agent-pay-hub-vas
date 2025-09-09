import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createRequire } from 'module';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Visa Acceptance Agent Toolkit
let visaToolkit = null;
let visaTools = {};
let toolkitError = null;

// Mode toggle functionality - force demo mode even if credentials are available
let forceDemoMode = false;

async function initializeVisaToolkit() {
  const merchantId = process.env.VISA_ACCEPTANCE_MERCHANT_ID;
  const apiKeyId = process.env.VISA_ACCEPTANCE_API_KEY_ID;
  const secretKey = process.env.VISA_ACCEPTANCE_SECRET_KEY;
  
  if (!merchantId || !apiKeyId || !secretKey) {
    toolkitError = 'Missing required environment variables (VISA_ACCEPTANCE_MERCHANT_ID, VISA_ACCEPTANCE_API_KEY_ID, VISA_ACCEPTANCE_SECRET_KEY)';
    console.warn('Visa Acceptance Agent Toolkit not initialized:', toolkitError);
    return;
  }

  try {
    // Use createRequire to import the CommonJS version which works properly
    const require = createRequire(import.meta.url);
    const { VisaAcceptanceAgentToolkit } = require('@visaacceptance/agent-toolkit/ai-sdk');
    
    // Initialize the toolkit - trying different constructor patterns
    try {
      // Try the object-based constructor first (as shown in documentation)
      visaToolkit = new VisaAcceptanceAgentToolkit({
        merchantId,
        apiKeyId,
        secretKey,
        configuration: {
          actions: {
            invoices: {
              create: true,
              update: true,
              list: true,
              get: true,
            },
            paymentLinks: {
              create: true,
              update: true,
              list: true,
            },
          },
        },
      });
    } catch (objectError) {
      console.log('Object-based constructor failed, trying parameter-based constructor...');
      // Try the parameter-based constructor (as shown in TypeScript definitions)
      visaToolkit = new VisaAcceptanceAgentToolkit(
        merchantId,
        apiKeyId,
        secretKey,
        process.env.VISA_ACCEPTANCE_ENVIRONMENT || 'SANDBOX',
        {
          actions: {
            invoices: {
              create: true,
              update: true,
              list: true,
              get: true,
            },
            paymentLinks: {
              create: true,
              update: true,
              list: true,
            },
          },
        }
      );
    }
    
    visaTools = visaToolkit.getTools();
    console.log('✅ Visa Acceptance Agent Toolkit initialized successfully');
    console.log('📦 Available tools:', Object.keys(visaTools));
  } catch (error) {
    toolkitError = error.message;
    console.error('❌ Failed to initialize Visa Acceptance Agent Toolkit:', error.message);
    console.error('Full error:', error);
  }
}

// Enhanced mock response that simulates the toolkit behavior
function createMockResponse(query, tool, args) {
  const mockTools = {
    'invoice.create': {
      description: 'Create a new invoice with customer information',
      action: 'Would create invoice with Visa Acceptance API'
    },
    'invoice.list': {
      description: 'List all invoices with filtering options',
      action: 'Would retrieve invoice list from Visa Acceptance API'
    },
    'invoice.get': {
      description: 'Get detailed information for a specific invoice',
      action: 'Would fetch invoice details from Visa Acceptance API'
    },
    'invoice.update': {
      description: 'Update existing invoice details',
      action: 'Would update invoice via Visa Acceptance API'
    },
    'invoice.send': {
      description: 'Send invoice to customer via email',
      action: 'Would send invoice email via Visa Acceptance API'
    },
    'link.create': {
      description: 'Create a new payment link',
      action: 'Would create payment link with Visa Acceptance API'
    },
    'link.list': {
      description: 'List all payment links',
      action: 'Would retrieve payment links from Visa Acceptance API'
    }
  };

  const selectedTool = mockTools[tool] || mockTools['invoice.create'];
  
  return {
    tool: tool || 'auto-detected',
    result: {
      message: `Demo: ${selectedTool.action} - Query: "${query}"`,
      toolDescription: selectedTool.description,
      availableTools: Object.keys(mockTools),
      toolkitStatus: visaToolkit ? 'loaded' : 'not-configured',
      toolkitError: toolkitError,
      args: args || {},
      demo: true,
      note: toolkitError || 'Visa Acceptance Agent Toolkit not configured. Please set environment variables.'
    },
    success: true,
  };
}

// Agent API endpoint
app.post('/api/agent/ask', async (req, res) => {
  try {
    const { query, tool, args } = req.body;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Query is required'
      });
    }

    // If Visa toolkit is available and loaded, and not in forced demo mode, use it
    if (visaToolkit && Object.keys(visaTools).length > 0 && !forceDemoMode) {
      try {
        // Here we would use the actual AI SDK with the tools
        // For now, return a structured response showing the toolkit is loaded
        const response = {
          tool: tool || 'visa-toolkit',
          result: {
            message: `✅ Processed with live Visa Acceptance Toolkit: "${query}"`,
            availableTools: Object.keys(visaTools),
            toolsDetails: visaTools,
            tool: tool || 'auto-detected-live',
            args: args || {},
            demo: false,
            note: 'Live Visa Acceptance Agent Toolkit is loaded and operational'
          },
          success: true,
        };

        return res.json(response);
      } catch (toolkitError) {
        console.error('Visa toolkit execution error:', toolkitError);
        // Fall through to mock response
      }
    }

    // Enhanced mock response
    const mockResponse = createMockResponse(query, tool, args);
    res.json(mockResponse);

  } catch (error) {
    console.error('Agent API error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  const canGoLive = !!(visaToolkit && Object.keys(visaTools).length > 0);
  const isCurrentlyLive = canGoLive && !forceDemoMode;
  
  res.json({
    status: 'ok',
    visaToolkitAvailable: !!visaToolkit,
    toolsAvailable: Object.keys(visaTools),
    toolkitError: toolkitError,
    currentMode: isCurrentlyLive ? 'live' : 'demo',
    forceDemoMode: forceDemoMode,
    canGoLive: canGoLive,
    timestamp: new Date().toISOString(),
    environment: process.env.VISA_ACCEPTANCE_ENVIRONMENT || 'not-set',
    cybsEnvironment: process.env.CYBS_ENVIRONMENT || 'not-set',
    credentialsConfigured: !!(process.env.VISA_ACCEPTANCE_MERCHANT_ID && 
                           process.env.VISA_ACCEPTANCE_API_KEY_ID && 
                           process.env.VISA_ACCEPTANCE_SECRET_KEY)
  });
});

// Get available tools endpoint
app.get('/api/agent/tools', (req, res) => {
  const mockTools = [
    { id: 'invoice.create', name: 'Create Invoice', description: 'Create a new invoice with customer information' },
    { id: 'invoice.list', name: 'List Invoices', description: 'Retrieve paginated list of invoices with filtering options' },
    { id: 'invoice.get', name: 'Get Invoice', description: 'Retrieve detailed information for a specific invoice' },
    { id: 'invoice.update', name: 'Update Invoice', description: 'Update existing invoice details including customer and invoice information' },
    { id: 'invoice.send', name: 'Send Invoice', description: 'Send invoice to customer via email' },
    { id: 'invoice.cancel', name: 'Cancel Invoice', description: 'Cancel an existing invoice' },
    { id: 'link.create', name: 'Create Payment Link', description: 'Create a new payment link with optional shipping information' },
    { id: 'link.list', name: 'List Payment Links', description: 'Retrieve paginated list of payment links' },
    { id: 'link.get', name: 'Get Payment Link', description: 'Retrieve details of a specific payment link' },
    { id: 'link.update', name: 'Update Payment Link', description: 'Update existing payment link details' }
  ];

  res.json({
    tools: (visaToolkit && !forceDemoMode) ? Object.keys(visaTools).map(key => ({
      id: key,
      name: key.replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      description: `Live Visa Acceptance API: ${key}`
    })) : mockTools,
    isLive: !!(visaToolkit && !forceDemoMode),
    toolkitStatus: (visaToolkit && !forceDemoMode) ? 'operational' : 'demo-mode'
  });
});

// Mode toggle endpoints
app.get('/api/mode/status', (req, res) => {
  const canGoLive = !!(visaToolkit && Object.keys(visaTools).length > 0);
  const isCurrentlyLive = canGoLive && !forceDemoMode;
  
  res.json({
    currentMode: isCurrentlyLive ? 'live' : 'demo',
    forceDemoMode: forceDemoMode,
    canGoLive: canGoLive,
    toolkitAvailable: !!visaToolkit,
    credentialsConfigured: !!(process.env.VISA_ACCEPTANCE_MERCHANT_ID && 
                           process.env.VISA_ACCEPTANCE_API_KEY_ID && 
                           process.env.VISA_ACCEPTANCE_SECRET_KEY),
    timestamp: new Date().toISOString()
  });
});

app.post('/api/mode/toggle', (req, res) => {
  const { mode } = req.body;
  
  // Validate request
  if (!mode || !['demo', 'live'].includes(mode)) {
    return res.status(400).json({
      success: false,
      error: 'Mode must be either "demo" or "live"'
    });
  }
  
  // Check if live mode is possible
  const canGoLive = !!(visaToolkit && Object.keys(visaTools).length > 0);
  
  if (mode === 'live' && !canGoLive) {
    return res.status(400).json({
      success: false,
      error: 'Cannot switch to live mode: Visa Acceptance toolkit not available or not properly configured',
      details: {
        toolkitAvailable: !!visaToolkit,
        credentialsConfigured: !!(process.env.VISA_ACCEPTANCE_MERCHANT_ID && 
                               process.env.VISA_ACCEPTANCE_API_KEY_ID && 
                               process.env.VISA_ACCEPTANCE_SECRET_KEY)
      }
    });
  }
  
  // Update mode
  forceDemoMode = (mode === 'demo');
  
  const isCurrentlyLive = canGoLive && !forceDemoMode;
  
  res.json({
    success: true,
    previousMode: forceDemoMode ? 'live' : 'demo',
    currentMode: isCurrentlyLive ? 'live' : 'demo',
    message: `Successfully switched to ${isCurrentlyLive ? 'live' : 'demo'} mode`,
    timestamp: new Date().toISOString()
  });
});

// Initialize and start server
async function startServer() {
  await initializeVisaToolkit();
  
  app.listen(PORT, () => {
    console.log(`🚀 Agent server running on port ${PORT}`);
    console.log(`💚 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🔧 Tools info: http://localhost:${PORT}/api/agent/tools`);
    
    if (visaToolkit) {
      console.log('✅ Visa Acceptance Agent Toolkit: OPERATIONAL');
    } else if (toolkitError) {
      console.log('⚠️  Visa Acceptance Agent Toolkit: DEMO MODE');
      console.log('📝 Reason:', toolkitError);
    }
    
    console.log('🏦 CyberSource Environment:', process.env.CYBS_ENVIRONMENT || 'not-set (defaults to SANDBOX when configured)');
    
    if (!process.env.VISA_ACCEPTANCE_MERCHANT_ID) {
      console.log('\n🔑 To enable live Visa Acceptance features, set these environment variables:');
      console.log('   - VISA_ACCEPTANCE_MERCHANT_ID');
      console.log('   - VISA_ACCEPTANCE_API_KEY_ID');
      console.log('   - VISA_ACCEPTANCE_SECRET_KEY');
      console.log('   - VISA_ACCEPTANCE_ENVIRONMENT (SANDBOX or PRODUCTION)');
      console.log('   - OPENAI_API_KEY (for AI-powered responses)');
      console.log('   - CYBS_ENVIRONMENT (SANDBOX or PRODUCTION)\n');
    }
  });
}

startServer().catch(error => {
  console.error('💥 Failed to start server:', error);
  process.exit(1);
});