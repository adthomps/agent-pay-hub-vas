# API Endpoints Testing Results

## Test Execution Summary
Tue Sep  9 02:33:15 UTC 2025

## Phase 1: Basic Health and Status Checks
### Health Check
**Endpoint**: GET /api/health
**HTTP Code**: 200
**Status**: ✅ SUCCESS
```json
{
  "status": "ok",
  "visaToolkitAvailable": true,
  "toolsAvailable": [
    "create_invoice",
    "update_invoice",
    "get_invoice",
    "list_invoices",
    "send_invoice",
    "cancel_invoice",
    "create_payment_link",
    "update_payment_link",
    "get_payment_link",
    "list_payment_links"
  ],
  "toolkitError": null,
  "currentMode": "live",
  "forceDemoMode": false,
  "canGoLive": true,
  "timestamp": "2025-09-09T02:33:15.190Z",
  "environment": "not-set",
  "cybsEnvironment": "not-set",
  "credentialsConfigured": true,
  "openaiConfigured": false
}
```

### Mode Status Check
**Endpoint**: GET /api/mode/status
**HTTP Code**: 200
**Status**: ✅ SUCCESS
```json
{
  "currentMode": "live",
  "forceDemoMode": false,
  "canGoLive": true,
  "toolkitAvailable": true,
  "credentialsConfigured": true,
  "openaiConfigured": false,
  "timestamp": "2025-09-09T02:33:15.202Z"
}
```

### Available Tools Check
**Endpoint**: GET /api/agent/tools
**HTTP Code**: 200
**Status**: ✅ SUCCESS
```json
{
  "tools": [
    {
      "id": "create_invoice",
      "name": "Create_invoice",
      "description": "Live Visa Acceptance API: create_invoice"
    },
    {
      "id": "update_invoice",
      "name": "Update_invoice",
      "description": "Live Visa Acceptance API: update_invoice"
    },
    {
      "id": "get_invoice",
      "name": "Get_invoice",
      "description": "Live Visa Acceptance API: get_invoice"
    },
    {
      "id": "list_invoices",
      "name": "List_invoices",
      "description": "Live Visa Acceptance API: list_invoices"
    },
    {
      "id": "send_invoice",
      "name": "Send_invoice",
      "description": "Live Visa Acceptance API: send_invoice"
    },
    {
      "id": "cancel_invoice",
      "name": "Cancel_invoice",
      "description": "Live Visa Acceptance API: cancel_invoice"
    },
    {
      "id": "create_payment_link",
      "name": "Create_payment_link",
      "description": "Live Visa Acceptance API: create_payment_link"
    },
    {
      "id": "update_payment_link",
      "name": "Update_payment_link",
      "description": "Live Visa Acceptance API: update_payment_link"
    },
    {
      "id": "get_payment_link",
      "name": "Get_payment_link",
      "description": "Live Visa Acceptance API: get_payment_link"
    },
    {
      "id": "list_payment_links",
      "name": "List_payment_links",
      "description": "Live Visa Acceptance API: list_payment_links"
    }
  ],
  "isLive": true,
  "toolkitStatus": "operational"
}
```

## Phase 2: Live Mode Testing
### Switch to Live Mode
**Endpoint**: POST /api/mode/toggle
**HTTP Code**: 200
**Status**: ✅ SUCCESS
```json
{
  "success": true,
  "previousMode": "live",
  "currentMode": "live",
  "message": "Successfully switched to live mode",
  "timestamp": "2025-09-09T02:33:15.227Z"
}
```

### NL Command: Create Invoice
**Endpoint**: POST /api/agent/ask
**HTTP Code**: 200
**Status**: ✅ SUCCESS
```json
{
  "tool": "visa-toolkit",
  "result": {
    "message": "✅ Processed with live Visa Acceptance Toolkit: \"Create an invoice for $100\"",
    "args": {},
    "demo": false,
    "note": "Live Visa Acceptance Agent Toolkit is operational"
  },
  "success": true
}
```

### NL Command: List Invoices
**Endpoint**: POST /api/agent/ask
**HTTP Code**: 200
**Status**: ✅ SUCCESS
```json
{
  "tool": "visa-toolkit",
  "result": {
    "message": "✅ Processed with live Visa Acceptance Toolkit: \"List all invoices\"",
    "args": {},
    "demo": false,
    "note": "Live Visa Acceptance Agent Toolkit is operational"
  },
  "success": true
}
```

### NL Command: Create Payment Link
**Endpoint**: POST /api/agent/ask
**HTTP Code**: 200
**Status**: ✅ SUCCESS
```json
{
  "tool": "visa-toolkit",
  "result": {
    "message": "✅ Processed with live Visa Acceptance Toolkit: \"Create a payment link for $50\"",
    "args": {},
    "demo": false,
    "note": "Live Visa Acceptance Agent Toolkit is operational"
  },
  "success": true
}
```

### NL Command: List Payment Links
**Endpoint**: POST /api/agent/ask
**HTTP Code**: 200
**Status**: ✅ SUCCESS
```json
{
  "tool": "visa-toolkit",
  "result": {
    "message": "✅ Processed with live Visa Acceptance Toolkit: \"Show all payment links\"",
    "args": {},
    "demo": false,
    "note": "Live Visa Acceptance Agent Toolkit is operational"
  },
  "success": true
}
```

### Direct Tool: Create Invoice
**Endpoint**: POST /api/agent/ask
**HTTP Code**: 200
**Status**: ✅ SUCCESS
```json
{
  "tool": "create_invoice",
  "result": {
    "message": "✅ Processed with live Visa Acceptance Toolkit: \"Create invoice\"",
    "args": {
      "amount": 100,
      "currency": "USD"
    },
    "demo": false,
    "note": "Live Visa Acceptance Agent Toolkit is operational"
  },
  "success": true
}
```

### Direct Tool: List Invoices
**Endpoint**: POST /api/agent/ask
**HTTP Code**: 200
**Status**: ✅ SUCCESS
```json
{
  "tool": "list_invoices",
  "result": {
    "message": "✅ Processed with live Visa Acceptance Toolkit: \"List invoices\"",
    "args": {},
    "demo": false,
    "note": "Live Visa Acceptance Agent Toolkit is operational"
  },
  "success": true
}
```

### Direct Tool: Create Payment Link
**Endpoint**: POST /api/agent/ask
**HTTP Code**: 200
**Status**: ✅ SUCCESS
```json
{
  "tool": "create_payment_link",
  "result": {
    "message": "✅ Processed with live Visa Acceptance Toolkit: \"Create payment link\"",
    "args": {
      "amount": 50,
      "currency": "USD"
    },
    "demo": false,
    "note": "Live Visa Acceptance Agent Toolkit is operational"
  },
  "success": true
}
```

### Direct Tool: List Payment Links
**Endpoint**: POST /api/agent/ask
**HTTP Code**: 200
**Status**: ✅ SUCCESS
```json
{
  "tool": "list_payment_links",
  "result": {
    "message": "✅ Processed with live Visa Acceptance Toolkit: \"List payment links\"",
    "args": {},
    "demo": false,
    "note": "Live Visa Acceptance Agent Toolkit is operational"
  },
  "success": true
}
```

## Phase 3: Demo Mode Testing
### Switch to Demo Mode
**Endpoint**: POST /api/mode/toggle
**HTTP Code**: 200
**Status**: ✅ SUCCESS
```json
{
  "success": true,
  "previousMode": "live",
  "currentMode": "demo",
  "message": "Successfully switched to demo mode",
  "timestamp": "2025-09-09T02:33:15.340Z"
}
```

### Available Tools in Demo Mode
**Endpoint**: GET /api/agent/tools
**HTTP Code**: 200
**Status**: ✅ SUCCESS
```json
{
  "tools": [
    {
      "id": "invoice.create",
      "name": "Create Invoice",
      "description": "Create a new invoice with customer information"
    },
    {
      "id": "invoice.list",
      "name": "List Invoices",
      "description": "Retrieve paginated list of invoices with filtering options"
    },
    {
      "id": "invoice.get",
      "name": "Get Invoice",
      "description": "Retrieve detailed information for a specific invoice"
    },
    {
      "id": "invoice.update",
      "name": "Update Invoice",
      "description": "Update existing invoice details including customer and invoice information"
    },
    {
      "id": "invoice.send",
      "name": "Send Invoice",
      "description": "Send invoice to customer via email"
    },
    {
      "id": "invoice.cancel",
      "name": "Cancel Invoice",
      "description": "Cancel an existing invoice"
    },
    {
      "id": "paymentLinks.create",
      "name": "Create Payment Link",
      "description": "Create a new payment link with optional shipping information"
    },
    {
      "id": "paymentLinks.list",
      "name": "List Payment Links",
      "description": "Retrieve paginated list of payment links"
    },
    {
      "id": "paymentLinks.get",
      "name": "Get Payment Link",
      "description": "Retrieve details of a specific payment link"
    },
    {
      "id": "paymentLinks.update",
      "name": "Update Payment Link",
      "description": "Update existing payment link details"
    }
  ],
  "isLive": false,
  "toolkitStatus": "demo-mode"
}
```

### NL Command: Create Invoice (Demo)
**Endpoint**: POST /api/agent/ask
**HTTP Code**: 200
**Status**: ✅ SUCCESS
```json
{
  "tool": "invoice.create",
  "result": {
    "message": "Demo: Would create invoice with Visa Acceptance API - Query: \"Create an invoice for $100\"",
    "args": {},
    "demo": true,
    "note": "Visa Acceptance Agent Toolkit not configured. Please set environment variables."
  },
  "success": true
}
```

### NL Command: List Invoices (Demo)
**Endpoint**: POST /api/agent/ask
**HTTP Code**: 200
**Status**: ✅ SUCCESS
```json
{
  "tool": "invoice.list",
  "result": {
    "message": "Demo: Would retrieve invoice list from Visa Acceptance API - Query: \"List all invoices\"",
    "args": {},
    "demo": true,
    "note": "Visa Acceptance Agent Toolkit not configured. Please set environment variables."
  },
  "success": true
}
```

### NL Command: Create Payment Link (Demo)
**Endpoint**: POST /api/agent/ask
**HTTP Code**: 200
**Status**: ✅ SUCCESS
```json
{
  "tool": "paymentLinks.create",
  "result": {
    "message": "Demo: Would create payment link with Visa Acceptance API - Query: \"Create a payment link for $50\"",
    "args": {},
    "demo": true,
    "note": "Visa Acceptance Agent Toolkit not configured. Please set environment variables."
  },
  "success": true
}
```

### NL Command: List Payment Links (Demo)
**Endpoint**: POST /api/agent/ask
**HTTP Code**: 200
**Status**: ✅ SUCCESS
```json
{
  "tool": "paymentLinks.list",
  "result": {
    "message": "Demo: Would retrieve payment links from Visa Acceptance API - Query: \"Show all payment links\"",
    "args": {},
    "demo": true,
    "note": "Visa Acceptance Agent Toolkit not configured. Please set environment variables."
  },
  "success": true
}
```

### Demo: Create Invoice with Args
**Endpoint**: POST /api/agent/ask
**HTTP Code**: 200
**Status**: ✅ SUCCESS
```json
{
  "tool": "invoice.create",
  "result": {
    "message": "Demo: Would create invoice with Visa Acceptance API - Query: \"Create invoice\"",
    "args": {
      "amount": 100,
      "currency": "USD",
      "email": "test@example.com"
    },
    "demo": true,
    "note": "Visa Acceptance Agent Toolkit not configured. Please set environment variables."
  },
  "success": true
}
```

### Demo: Get Invoice
**Endpoint**: POST /api/agent/ask
**HTTP Code**: 200
**Status**: ✅ SUCCESS
```json
{
  "tool": "invoice.get",
  "result": {
    "message": "Demo: Would fetch invoice details from Visa Acceptance API - Query: \"Get invoice\"",
    "args": {
      "id": "inv_123"
    },
    "demo": true,
    "note": "Visa Acceptance Agent Toolkit not configured. Please set environment variables."
  },
  "success": true
}
```

### Demo: Update Invoice
**Endpoint**: POST /api/agent/ask
**HTTP Code**: 200
**Status**: ✅ SUCCESS
```json
{
  "tool": "invoice.update",
  "result": {
    "message": "Demo: Would update invoice via Visa Acceptance API - Query: \"Update invoice\"",
    "args": {
      "id": "inv_123",
      "amount": 150
    },
    "demo": true,
    "note": "Visa Acceptance Agent Toolkit not configured. Please set environment variables."
  },
  "success": true
}
```

### Demo: Send Invoice
**Endpoint**: POST /api/agent/ask
**HTTP Code**: 200
**Status**: ✅ SUCCESS
```json
{
  "tool": "invoice.send",
  "result": {
    "message": "Demo: Would send invoice email via Visa Acceptance API - Query: \"Send invoice\"",
    "args": {
      "id": "inv_123"
    },
    "demo": true,
    "note": "Visa Acceptance Agent Toolkit not configured. Please set environment variables."
  },
  "success": true
}
```

### Demo: Cancel Invoice
**Endpoint**: POST /api/agent/ask
**HTTP Code**: 200
**Status**: ✅ SUCCESS
```json
{
  "tool": "invoice.cancel",
  "result": {
    "message": "Demo: Would cancel invoice via Visa Acceptance API - Query: \"Cancel invoice\"",
    "args": {
      "id": "inv_123"
    },
    "demo": true,
    "note": "Visa Acceptance Agent Toolkit not configured. Please set environment variables."
  },
  "success": true
}
```

### Demo: Create Payment Link with Args
**Endpoint**: POST /api/agent/ask
**HTTP Code**: 200
**Status**: ✅ SUCCESS
```json
{
  "tool": "paymentLinks.create",
  "result": {
    "message": "Demo: Would create payment link with Visa Acceptance API - Query: \"Create payment link\"",
    "args": {
      "amount": 75,
      "currency": "EUR",
      "memo": "Test payment"
    },
    "demo": true,
    "note": "Visa Acceptance Agent Toolkit not configured. Please set environment variables."
  },
  "success": true
}
```

### Demo: Get Payment Link
**Endpoint**: POST /api/agent/ask
**HTTP Code**: 200
**Status**: ✅ SUCCESS
```json
{
  "tool": "paymentLinks.get",
  "result": {
    "message": "Demo: Would fetch payment link details from Visa Acceptance API - Query: \"Get payment link\"",
    "args": {
      "id": "link_456"
    },
    "demo": true,
    "note": "Visa Acceptance Agent Toolkit not configured. Please set environment variables."
  },
  "success": true
}
```

### Demo: Update Payment Link
**Endpoint**: POST /api/agent/ask
**HTTP Code**: 200
**Status**: ✅ SUCCESS
```json
{
  "tool": "paymentLinks.update",
  "result": {
    "message": "Demo: Would update payment link via Visa Acceptance API - Query: \"Update payment link\"",
    "args": {
      "id": "link_456",
      "amount": 100
    },
    "demo": true,
    "note": "Visa Acceptance Agent Toolkit not configured. Please set environment variables."
  },
  "success": true
}
```

## Phase 4: Error Handling and Edge Cases
### Empty Request
**Endpoint**: POST /api/agent/ask
**HTTP Code**: 400
**Status**: ❌ FAILED
**Error**: {"success":false,"error":"Query is required"}

### Empty Query
**Endpoint**: POST /api/agent/ask
**HTTP Code**: 400
**Status**: ❌ FAILED
**Error**: {"success":false,"error":"Query is required"}

### Invalid Mode
**Endpoint**: POST /api/mode/toggle
**HTTP Code**: 400
**Status**: ❌ FAILED
**Error**: {"success":false,"error":"Mode must be either \"demo\" or \"live\""}

### Non-existent Endpoint
**Endpoint**: GET /api/nonexistent
**HTTP Code**: 404
**Status**: ❌ FAILED
**Error**: <!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Error</title>
</head>
<body>
<pre>Cannot GET /api/nonexistent</pre>
</body>
</html>


