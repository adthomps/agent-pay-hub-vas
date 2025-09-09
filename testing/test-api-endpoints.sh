#!/bin/bash

# API Endpoints Testing Script
# Tests all API endpoints in both Demo and Live modes

echo "=== AGENT PAY HUB VAS - API ENDPOINTS TESTING ==="
echo "Testing all API endpoints for Invoice and Pay-By-Link operations"
echo "Server should be running on http://localhost:3001"
echo ""

BASE_URL="http://localhost:3001"
RESULTS_FILE="test-results-api-endpoints.md"

# Initialize results file
cat > "$RESULTS_FILE" << 'EOF'
# API Endpoints Testing Results

## Test Execution Summary
EOF

echo "$(date)" >> "$RESULTS_FILE"
echo "" >> "$RESULTS_FILE"

# Function to test endpoint and log results
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local description=$4
    local expected=$5
    
    echo "Testing: $description"
    echo "### $description" >> "$RESULTS_FILE"
    echo "**Endpoint**: $method $endpoint" >> "$RESULTS_FILE"
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "%{http_code}" "$BASE_URL$endpoint")
    else
        response=$(curl -s -w "%{http_code}" -X "$method" "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data")
    fi
    
    http_code="${response: -3}"
    body="${response%???}"
    
    echo "HTTP Code: $http_code"
    echo "**HTTP Code**: $http_code" >> "$RESULTS_FILE"
    
    if [ "$http_code" = "200" ]; then
        echo "✅ SUCCESS"
        echo "**Status**: ✅ SUCCESS" >> "$RESULTS_FILE"
        echo "Response: $body" | jq . 2>/dev/null || echo "Response: $body"
        echo '```json' >> "$RESULTS_FILE"
        echo "$body" | jq . 2>/dev/null >> "$RESULTS_FILE" || echo "$body" >> "$RESULTS_FILE"
        echo '```' >> "$RESULTS_FILE"
    else
        echo "❌ FAILED"
        echo "**Status**: ❌ FAILED" >> "$RESULTS_FILE"
        echo "Response: $body"
        echo "**Error**: $body" >> "$RESULTS_FILE"
    fi
    echo ""
    echo "" >> "$RESULTS_FILE"
}

echo "## Phase 1: Basic Health and Status Checks" >> "$RESULTS_FILE"
echo ""

# Basic health checks
test_endpoint "GET" "/api/health" "" "Health Check" "status: ok"
test_endpoint "GET" "/api/mode/status" "" "Mode Status Check" "currentMode"
test_endpoint "GET" "/api/agent/tools" "" "Available Tools Check" "tools array"

echo "## Phase 2: Live Mode Testing" >> "$RESULTS_FILE"
echo ""

# Ensure we're in live mode
echo "=== SWITCHING TO LIVE MODE ==="
test_endpoint "POST" "/api/mode/toggle" '{"mode": "live"}' "Switch to Live Mode" "currentMode: live"

# Test natural language processing in live mode
echo "=== TESTING NATURAL LANGUAGE PROCESSING - LIVE MODE ==="
test_endpoint "POST" "/api/agent/ask" '{"query": "Create an invoice for $100"}' "NL Command: Create Invoice" "success: true"
test_endpoint "POST" "/api/agent/ask" '{"query": "List all invoices"}' "NL Command: List Invoices" "success: true"
test_endpoint "POST" "/api/agent/ask" '{"query": "Create a payment link for $50"}' "NL Command: Create Payment Link" "success: true"
test_endpoint "POST" "/api/agent/ask" '{"query": "Show all payment links"}' "NL Command: List Payment Links" "success: true"

# Test specific tool calls in live mode
echo "=== TESTING SPECIFIC TOOLS - LIVE MODE ==="
test_endpoint "POST" "/api/agent/ask" '{"query": "Create invoice", "tool": "create_invoice", "args": {"amount": 100, "currency": "USD"}}' "Direct Tool: Create Invoice" "success: true"
test_endpoint "POST" "/api/agent/ask" '{"query": "List invoices", "tool": "list_invoices"}' "Direct Tool: List Invoices" "success: true"
test_endpoint "POST" "/api/agent/ask" '{"query": "Create payment link", "tool": "create_payment_link", "args": {"amount": 50, "currency": "USD"}}' "Direct Tool: Create Payment Link" "success: true"
test_endpoint "POST" "/api/agent/ask" '{"query": "List payment links", "tool": "list_payment_links"}' "Direct Tool: List Payment Links" "success: true"

echo "## Phase 3: Demo Mode Testing" >> "$RESULTS_FILE"
echo ""

# Switch to demo mode
echo "=== SWITCHING TO DEMO MODE ==="
test_endpoint "POST" "/api/mode/toggle" '{"mode": "demo"}' "Switch to Demo Mode" "currentMode: demo"

# Verify tools change in demo mode
test_endpoint "GET" "/api/agent/tools" "" "Available Tools in Demo Mode" "toolkitStatus: demo-mode"

# Test natural language processing in demo mode
echo "=== TESTING NATURAL LANGUAGE PROCESSING - DEMO MODE ==="
test_endpoint "POST" "/api/agent/ask" '{"query": "Create an invoice for $100", "tool": "invoice.create"}' "NL Command: Create Invoice (Demo)" "demo: true"
test_endpoint "POST" "/api/agent/ask" '{"query": "List all invoices", "tool": "invoice.list"}' "NL Command: List Invoices (Demo)" "demo: true"
test_endpoint "POST" "/api/agent/ask" '{"query": "Create a payment link for $50", "tool": "paymentLinks.create"}' "NL Command: Create Payment Link (Demo)" "demo: true"
test_endpoint "POST" "/api/agent/ask" '{"query": "Show all payment links", "tool": "paymentLinks.list"}' "NL Command: List Payment Links (Demo)" "demo: true"

# Test invoice operations in demo mode
echo "=== TESTING INVOICE OPERATIONS - DEMO MODE ==="
test_endpoint "POST" "/api/agent/ask" '{"query": "Create invoice", "tool": "invoice.create", "args": {"amount": 100, "currency": "USD", "email": "test@example.com"}}' "Demo: Create Invoice with Args" "demo: true"
test_endpoint "POST" "/api/agent/ask" '{"query": "Get invoice", "tool": "invoice.get", "args": {"id": "inv_123"}}' "Demo: Get Invoice" "demo: true"
test_endpoint "POST" "/api/agent/ask" '{"query": "Update invoice", "tool": "invoice.update", "args": {"id": "inv_123", "amount": 150}}' "Demo: Update Invoice" "demo: true"
test_endpoint "POST" "/api/agent/ask" '{"query": "Send invoice", "tool": "invoice.send", "args": {"id": "inv_123"}}' "Demo: Send Invoice" "demo: true"
test_endpoint "POST" "/api/agent/ask" '{"query": "Cancel invoice", "tool": "invoice.cancel", "args": {"id": "inv_123"}}' "Demo: Cancel Invoice" "demo: true"

# Test payment link operations in demo mode
echo "=== TESTING PAYMENT LINK OPERATIONS - DEMO MODE ==="
test_endpoint "POST" "/api/agent/ask" '{"query": "Create payment link", "tool": "paymentLinks.create", "args": {"amount": 75, "currency": "EUR", "memo": "Test payment"}}' "Demo: Create Payment Link with Args" "demo: true"
test_endpoint "POST" "/api/agent/ask" '{"query": "Get payment link", "tool": "paymentLinks.get", "args": {"id": "link_456"}}' "Demo: Get Payment Link" "demo: true"
test_endpoint "POST" "/api/agent/ask" '{"query": "Update payment link", "tool": "paymentLinks.update", "args": {"id": "link_456", "amount": 100}}' "Demo: Update Payment Link" "demo: true"

echo "## Phase 4: Error Handling and Edge Cases" >> "$RESULTS_FILE"
echo ""

# Test error handling
echo "=== TESTING ERROR HANDLING ==="
test_endpoint "POST" "/api/agent/ask" '{}' "Empty Request" "error"
test_endpoint "POST" "/api/agent/ask" '{"query": ""}' "Empty Query" "error"
test_endpoint "POST" "/api/mode/toggle" '{"mode": "invalid"}' "Invalid Mode" "error"
test_endpoint "GET" "/api/nonexistent" "" "Non-existent Endpoint" "404"

echo ""
echo "=== TESTING COMPLETED ==="
echo "Results saved to: $RESULTS_FILE"
echo "Check the results file for detailed analysis."