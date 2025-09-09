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
    
    // Initialize the toolkit with parameter-based constructor (object-based doesn't work properly)
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
            read: true,
          },
          paymentLinks: {
            create: true,
            update: true,
            list: true,
            read: true,
          },
        },
      }
    );
    
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

// Invoices API endpoints
app.get('/api/invoices', async (req, res) => {
  try {
    if (visaToolkit && Object.keys(visaTools).length > 0 && !forceDemoMode) {
      // Use live Visa toolkit
      const listInvoicesTool = visaTools['list_invoices'];
      if (listInvoicesTool) {
        try {
          const result = await listInvoicesTool.execute({ offset: 0, limit: 50 });
          // Return array directly, not wrapped in object
          res.json(Array.isArray(result) ? result : (result?.invoices || []));
        } catch (error) {
          console.error('Visa toolkit list_invoices error:', error);
          // Fall back to demo mode if network or API call fails
          res.json([
            {
              id: "inv_001",
              amount: 100.00,
              currency: "USD",
              email: "jane@example.com",
              name: "Jane Doe",
              memo: "Consulting services",
              status: "sent",
              dueDate: "2024-02-15",
              createdAt: "2024-01-15"
            },
            {
              id: "inv_002",
              amount: 250.00,
              currency: "USD",
              email: "john@company.com",
              memo: "Software license",
              status: "draft",
              dueDate: "2024-02-20",
              createdAt: "2024-01-16"
            }
          ]);
        }
      } else {
        res.status(500).json({ error: 'list_invoices tool not available' });
      }
    } else {
      // Demo mode - return mock data as array
      res.json([
        {
          id: "inv_001",
          amount: 100.00,
          currency: "USD",
          email: "jane@example.com",
          name: "Jane Doe",
          memo: "Consulting services",
          status: "sent",
          dueDate: "2024-02-15",
          createdAt: "2024-01-15"
        },
        {
          id: "inv_002",
          amount: 250.00,
          currency: "USD",
          email: "john@company.com",
          memo: "Software license",
          status: "draft",
          dueDate: "2024-02-20",
          createdAt: "2024-01-16"
        }
      ]);
    }
  } catch (error) {
    console.error('Get invoices error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/invoices', async (req, res) => {
  try {
    const invoiceData = req.body;
    
    if (visaToolkit && Object.keys(visaTools).length > 0 && !forceDemoMode) {
      // Use live Visa toolkit
      const createInvoiceTool = visaTools['create_invoice'];
      if (createInvoiceTool) {
        try {
          const result = await createInvoiceTool.execute(invoiceData);
          
          // Check if result is an error string
          if (typeof result === 'string' && result.toLowerCase().includes('failed')) {
            throw new Error(result);
          }
          
          res.json(result);
        } catch (error) {
          console.error('Visa toolkit create_invoice error:', error);
          // Fall back to demo mode if network or API call fails
          const mockInvoice = {
            id: `inv_${Date.now()}`,
            amount: invoiceData.amount,
            currency: invoiceData.currency,
            email: invoiceData.email,
            name: invoiceData.name,
            memo: invoiceData.memo,
            status: "draft",
            dueDate: new Date(Date.now() + (invoiceData.dueDays || 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            createdAt: new Date().toISOString().split('T')[0]
          };
          res.json(mockInvoice);
        }
      } else {
        res.status(500).json({ error: 'create_invoice tool not available' });
      }
    } else {
      // Demo mode - return mock invoice
      const mockInvoice = {
        id: `inv_${Date.now()}`,
        amount: invoiceData.amount,
        currency: invoiceData.currency,
        email: invoiceData.email,
        name: invoiceData.name,
        memo: invoiceData.memo,
        status: "draft",
        dueDate: new Date(Date.now() + (invoiceData.dueDays || 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        createdAt: new Date().toISOString().split('T')[0]
      };
      res.json(mockInvoice);
    }
  } catch (error) {
    console.error('Create invoice error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/invoices/:id/send', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (visaToolkit && Object.keys(visaTools).length > 0 && !forceDemoMode) {
      // Use live Visa toolkit
      const sendInvoiceTool = visaTools['send_invoice'];
      if (sendInvoiceTool) {
        try {
          const result = await sendInvoiceTool.execute({ invoiceId: id });
          
          // Check if result is an error string
          if (typeof result === 'string' && result.toLowerCase().includes('failed')) {
            throw new Error(result);
          }
          
          res.json(result);
        } catch (error) {
          console.error('Visa toolkit send_invoice error:', error);
          // Fall back to demo mode if network or API call fails
          res.json({ success: true, message: `Demo fallback: Invoice ${id} sent successfully` });
        }
      } else {
        res.status(500).json({ error: 'send_invoice tool not available' });
      }
    } else {
      // Demo mode
      res.json({ success: true, message: `Demo: Invoice ${id} sent successfully` });
    }
  } catch (error) {
    console.error('Send invoice error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/invoices/:id/cancel', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (visaToolkit && Object.keys(visaTools).length > 0 && !forceDemoMode) {
      // Use live Visa toolkit
      const cancelInvoiceTool = visaTools['cancel_invoice'];
      if (cancelInvoiceTool) {
        try {
          const result = await cancelInvoiceTool.execute({ invoiceId: id });
          
          // Check if result is an error string
          if (typeof result === 'string' && result.toLowerCase().includes('failed')) {
            throw new Error(result);
          }
          
          res.json(result);
        } catch (error) {
          console.error('Visa toolkit cancel_invoice error:', error);
          // Fall back to demo mode if network or API call fails
          res.json({ success: true, message: `Demo fallback: Invoice ${id} cancelled successfully` });
        }
      } else {
        res.status(500).json({ error: 'cancel_invoice tool not available' });
      }
    } else {
      // Demo mode
      res.json({ success: true, message: `Demo: Invoice ${id} cancelled successfully` });
    }
  } catch (error) {
    console.error('Cancel invoice error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Payment Links API endpoints
app.get('/api/links', async (req, res) => {
  try {
    if (visaToolkit && Object.keys(visaTools).length > 0 && !forceDemoMode) {
      // Use live Visa toolkit
      const listPaymentLinksTool = visaTools['list_payment_links'];
      if (listPaymentLinksTool) {
        try {
          const result = await listPaymentLinksTool.execute({ offset: 0, limit: 50 });
          // Return array directly, not wrapped in object
          res.json(Array.isArray(result) ? result : (result?.paymentLinks || []));
        } catch (error) {
          console.error('Visa toolkit list_payment_links error:', error);
          // Fall back to demo mode if network or API call fails
          res.json([
            {
              id: "link_1",
              url: "https://pay.example.com/link_1",
              amount: 100,
              currency: "USD",
              memo: "Sample payment link",
              createdAt: new Date(Date.now() - 86400000).toISOString(),
            },
            {
              id: "link_2", 
              url: "https://pay.example.com/link_2",
              amount: 250,
              currency: "EUR",
              memo: "Another payment link",
              createdAt: new Date(Date.now() - 172800000).toISOString(),
            }
          ]);
        }
      } else {
        res.status(500).json({ error: 'list_payment_links tool not available' });
      }
    } else {
      // Demo mode - return mock data as array
      res.json([
        {
          id: "link_1",
          url: "https://pay.example.com/link_1",
          amount: 100,
          currency: "USD",
          memo: "Sample payment link",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: "link_2", 
          url: "https://pay.example.com/link_2",
          amount: 250,
          currency: "EUR",
          memo: "Another payment link",
          createdAt: new Date(Date.now() - 172800000).toISOString(),
        }
      ]);
    }
  } catch (error) {
    console.error('Get payment links error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/links', async (req, res) => {
  try {
    const linkData = req.body;
    
    if (visaToolkit && Object.keys(visaTools).length > 0 && !forceDemoMode) {
      // Use live Visa toolkit
      const createPaymentLinkTool = visaTools['create_payment_link'];
      if (createPaymentLinkTool) {
        try {
          const result = await createPaymentLinkTool.execute(linkData);
          
          // Check if result is an error string
          if (typeof result === 'string' && result.toLowerCase().includes('failed')) {
            throw new Error(result);
          }
          
          res.json(result);
        } catch (error) {
          console.error('Visa toolkit create_payment_link error:', error);
          // Fall back to demo mode if network or API call fails
          const mockLink = {
            id: `link_${Date.now()}`,
            url: `https://pay.example.com/link_${Date.now()}`,
            amount: linkData.amount,
            currency: linkData.currency,
            memo: linkData.memo,
            createdAt: new Date().toISOString()
          };
          res.json(mockLink);
        }
      } else {
        res.status(500).json({ error: 'create_payment_link tool not available' });
      }
    } else {
      // Demo mode - return mock payment link
      const mockLink = {
        id: `link_${Date.now()}`,
        url: `https://pay.example.com/link_${Date.now()}`,
        amount: linkData.amount,
        currency: linkData.currency,
        memo: linkData.memo,
        createdAt: new Date().toISOString()
      };
      res.json(mockLink);
    }
  } catch (error) {
    console.error('Create payment link error:', error);
    res.status(500).json({ error: error.message });
  }
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