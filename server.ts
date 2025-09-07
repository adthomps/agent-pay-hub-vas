import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { VisaAcceptanceAgentToolkit } from '@visaacceptance/agent-toolkit/ai-sdk';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Visa Acceptance Agent Toolkit setup
let visaToolkit: VisaAcceptanceAgentToolkit | null = null;

try {
  // Initialize the Visa Acceptance Agent Toolkit
  // Based on the TypeScript definition, it uses separate parameters
  visaToolkit = new VisaAcceptanceAgentToolkit(
    process.env.VISA_ACCEPTANCE_MERCHANT_ID,
    process.env.VISA_ACCEPTANCE_API_KEY_ID,
    process.env.VISA_ACCEPTANCE_SECRET_KEY,
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
  console.log('Visa Acceptance Agent Toolkit initialized successfully');
} catch (error) {
  console.warn('Failed to initialize Visa Acceptance Agent Toolkit:', error);
  console.warn('Server will run in demo mode with mock responses');
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

    // If Visa toolkit is available, use it with AI SDK
    if (visaToolkit && process.env.OPENAI_API_KEY) {
      try {
        const tools = visaToolkit.getTools();
        
        const result = await generateText({
          model: openai('gpt-3.5-turbo'),
          tools,
          prompt: query,
        });

        return res.json({
          tool: tool || 'ai-powered',
          result: {
            message: result.text,
            toolCalls: result.toolCalls,
            args: args || {},
            demo: false
          },
          success: true,
        });
      } catch (aiError) {
        console.error('AI SDK error:', aiError);
        // Fall through to mock response
      }
    }

    // Mock response for demo purposes when toolkit is not available
    const mockResponse = {
      tool: tool || 'auto-detected',
      result: {
        message: `Processed: "${query}"`,
        tool: tool || 'auto-detected',
        args: args || {},
        demo: true,
        note: 'Visa Acceptance Agent Toolkit not configured. Please set environment variables.'
      },
      success: true,
    };

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
  res.json({
    status: 'ok',
    visaToolkitAvailable: !!visaToolkit,
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Agent server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  if (!process.env.VISA_ACCEPTANCE_MERCHANT_ID) {
    console.log('\nTo enable Visa Acceptance features, set these environment variables:');
    console.log('- VISA_ACCEPTANCE_MERCHANT_ID');
    console.log('- VISA_ACCEPTANCE_API_KEY_ID');
    console.log('- VISA_ACCEPTANCE_SECRET_KEY');
    console.log('- OPENAI_API_KEY (for AI-powered responses)');
  }
});

export default app;