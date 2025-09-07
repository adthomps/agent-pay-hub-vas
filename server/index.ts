import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Visa Acceptance toolkit functions
const visaTools = {
  create_invoice: {
    description: 'Create a new invoice for payment processing',
    parameters: {
      type: 'object',
      properties: {
        amount: { type: 'number', description: 'Invoice amount' },
        currency: { type: 'string', description: 'Currency code (USD, EUR, etc.)' },
        email: { type: 'string', description: 'Customer email address' },
        name: { type: 'string', description: 'Customer name (optional)' },
        memo: { type: 'string', description: 'Invoice description or memo' },
        dueDays: { type: 'number', description: 'Number of days until due (default 30)' }
      },
      required: ['amount', 'currency', 'email']
    }
  },
  list_invoices: {
    description: 'List all invoices with optional filtering',
    parameters: {
      type: 'object',
      properties: {
        status: { type: 'string', enum: ['draft', 'sent', 'paid', 'cancelled'], description: 'Filter by invoice status' },
        limit: { type: 'number', description: 'Maximum number of invoices to return' }
      }
    }
  },
  send_invoice: {
    description: 'Send an existing invoice to the customer',
    parameters: {
      type: 'object',
      properties: {
        invoiceId: { type: 'string', description: 'Invoice ID to send' }
      },
      required: ['invoiceId']
    }
  },
  create_pay_link: {
    description: 'Create a payment link for quick payments',
    parameters: {
      type: 'object',
      properties: {
        amount: { type: 'number', description: 'Payment amount' },
        currency: { type: 'string', description: 'Currency code (USD, EUR, etc.)' },
        memo: { type: 'string', description: 'Payment description' }
      },
      required: ['amount', 'currency']
    }
  }
};

// Tool execution functions
async function executeVisaTool(toolName: string, args: Record<string, unknown>) {
  switch (toolName) {
    case 'create_invoice': {
      // Mock invoice creation - in real implementation, this would call Visa APIs
      const invoice = {
        id: `inv_${Date.now()}`,
        amount: args.amount,
        currency: args.currency,
        email: args.email,
        name: args.name,
        memo: args.memo,
        status: 'draft',
        dueDate: new Date(Date.now() + (args.dueDays as number || 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        createdAt: new Date().toISOString().split('T')[0]
      };
      return { success: true, data: invoice, message: `Invoice created successfully for ${args.email}` };
    }

    case 'list_invoices': {
      // Mock invoice listing
      const mockInvoices = [
        {
          id: 'inv_1',
          amount: 100,
          currency: 'USD',
          email: 'john@example.com',
          name: 'John Doe',
          memo: 'Consulting services',
          status: 'sent',
          dueDate: '2024-02-15',
          createdAt: '2024-01-15'
        },
        {
          id: 'inv_2',
          amount: 250,
          currency: 'EUR',
          email: 'jane@example.com',
          name: 'Jane Smith',
          memo: 'Design work',
          status: 'draft',
          dueDate: '2024-02-20',
          createdAt: '2024-01-16'
        }
      ];
      const filteredInvoices = args.status 
        ? mockInvoices.filter(inv => inv.status === args.status)
        : mockInvoices;
      
      return { 
        success: true, 
        data: filteredInvoices.slice(0, args.limit as number || 10),
        message: `Found ${filteredInvoices.length} invoices` 
      };
    }

    case 'send_invoice': {
      // Mock invoice sending
      return { 
        success: true, 
        data: { invoiceId: args.invoiceId, status: 'sent' },
        message: `Invoice ${args.invoiceId} sent successfully` 
      };
    }

    case 'create_pay_link': {
      // Mock pay link creation
      const payLink = {
        id: `link_${Date.now()}`,
        url: `https://pay.visa.com/link_${Date.now()}`,
        amount: args.amount,
        currency: args.currency,
        memo: args.memo,
        createdAt: new Date().toISOString()
      };
      return { 
        success: true, 
        data: payLink, 
        message: `Payment link created: ${payLink.url}` 
      };
    }

    default:
      return { success: false, message: `Unknown tool: ${toolName}` };
  }
}

// Rule-based AI fallback for parsing queries
function parseQueryWithRules(query: string) {
  const lowerQuery = query.toLowerCase();
  
  // Extract email pattern
  const emailMatch = query.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
  
  // Extract amount pattern
  const amountMatch = query.match(/\$?(\d+(?:\.\d{2})?)/);
  
  // Extract currency (default to USD if not found)
  const currencyMatch = query.match(/\b(USD|EUR|GBP|CAD|JPY)\b/i);
  
  // Determine tool based on keywords
  if (lowerQuery.includes('create') && lowerQuery.includes('invoice')) {
    return {
      tool: 'create_invoice',
      parameters: {
        amount: amountMatch ? parseFloat(amountMatch[1]) : 100,
        currency: currencyMatch ? currencyMatch[1].toUpperCase() : 'USD',
        email: emailMatch ? emailMatch[1] : 'customer@example.com',
        memo: 'Generated by AI agent'
      },
      reasoning: 'Detected invoice creation request based on keywords'
    };
  }
  
  if (lowerQuery.includes('list') && lowerQuery.includes('invoice')) {
    let status = null;
    if (lowerQuery.includes('draft')) status = 'draft';
    else if (lowerQuery.includes('sent')) status = 'sent';
    else if (lowerQuery.includes('paid')) status = 'paid';
    
    return {
      tool: 'list_invoices',
      parameters: {
        ...(status && { status }),
        limit: 10
      },
      reasoning: 'Detected invoice listing request based on keywords'
    };
  }
  
  if (lowerQuery.includes('send') && lowerQuery.includes('invoice')) {
    // Extract invoice ID pattern
    const invoiceIdMatch = query.match(/inv_\w+/i) || query.match(/invoice\s+(\w+)/i);
    
    return {
      tool: 'send_invoice',
      parameters: {
        invoiceId: invoiceIdMatch ? invoiceIdMatch[0] : 'inv_unknown'
      },
      reasoning: 'Detected invoice sending request based on keywords'
    };
  }
  
  if (lowerQuery.includes('create') && (lowerQuery.includes('link') || lowerQuery.includes('payment'))) {
    return {
      tool: 'create_pay_link',
      parameters: {
        amount: amountMatch ? parseFloat(amountMatch[1]) : 50,
        currency: currencyMatch ? currencyMatch[1].toUpperCase() : 'USD',
        memo: 'Generated payment link'
      },
      reasoning: 'Detected payment link creation request based on keywords'
    };
  }
  
  // Default fallback
  return {
    tool: 'create_invoice',
    parameters: {
      amount: amountMatch ? parseFloat(amountMatch[1]) : 100,
      currency: 'USD',
      email: emailMatch ? emailMatch[1] : 'customer@example.com',
      memo: 'Default invoice from AI processing'
    },
    reasoning: 'Default invoice creation - no specific tool pattern detected'
  };
}

// Agent endpoint
app.post('/api/agent/ask', async (req, res) => {
  try {
    const { query, tool } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    // If a specific tool is requested, execute it directly
    if (tool && tool !== 'auto') {
      const toolName = tool.replace('.', '_'); // Convert "invoice.create" to "create_invoice"
      if (visaTools[toolName as keyof typeof visaTools]) {
        // For demo purposes, extract basic parameters from the query
        let args = {};
        
        // Simple parameter extraction from natural language
        if (toolName === 'create_invoice') {
          const amountMatch = query.match(/\$?(\d+(?:\.\d{2})?)/);
          const emailMatch = query.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
          
          args = {
            amount: amountMatch ? parseFloat(amountMatch[1]) : 100,
            currency: 'USD',
            email: emailMatch ? emailMatch[1] : 'customer@example.com',
            memo: 'Generated from AI request'
          };
        }
        
        const result = await executeVisaTool(toolName, args);
        return res.json({
          tool: tool,
          result: result,
          success: result.success
        });
      }
    }

    // Use AI to determine the appropriate tool and parameters
    // First try with OpenAI if API key is available
    let aiResponse;
    
    try {
      if (process.env.OPENAI_API_KEY) {
        const systemPrompt = `You are a Visa Acceptance payment processing assistant. You have access to the following tools:

${Object.entries(visaTools).map(([name, tool]) => 
  `- ${name}: ${tool.description}\n  Parameters: ${JSON.stringify(tool.parameters.properties, null, 2)}`
).join('\n\n')}

Based on the user's request, determine the most appropriate tool to use and extract the necessary parameters from their natural language query. Respond with JSON in this format:
{
  "tool": "tool_name",
  "parameters": { "param1": "value1", "param2": "value2" },
  "reasoning": "Why this tool was selected"
}

User request: "${query}"`;

        const result = await generateText({
          model: openai('gpt-3.5-turbo'),
          prompt: systemPrompt,
          temperature: 0.1,
        });

        aiResponse = JSON.parse(result.text);
      } else {
        throw new Error('OpenAI API key not available, using fallback AI logic');
      }
    } catch (e) {
      // Fallback: Rule-based AI for demo purposes
      aiResponse = parseQueryWithRules(query);
    }

    // Execute the determined tool
    const toolResult = await executeVisaTool(aiResponse.tool, aiResponse.parameters);

    res.json({
      tool: aiResponse.tool,
      result: {
        ...toolResult,
        aiReasoning: aiResponse.reasoning,
        extractedParameters: aiResponse.parameters
      },
      success: toolResult.success
    });

  } catch (error) {
    console.error('Agent error:', error);
    
    // Fallback response for when AI is not available
    res.json({
      tool: 'demo',
      result: {
        message: `Processed query: "${req.body.query}"`,
        note: 'AI service unavailable, showing demo response',
        success: true
      },
      success: true
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Visa Acceptance Agent API is running' });
});

app.listen(port, () => {
  console.log(`Visa Acceptance Agent API server running on port ${port}`);
});