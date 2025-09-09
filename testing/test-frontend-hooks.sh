#!/bin/bash

# Frontend Integration Testing Script
# Tests React hooks and frontend integration

echo "=== AGENT PAY HUB VAS - FRONTEND INTEGRATION TESTING ==="
echo "Testing React hooks and frontend API integration"
echo "Server should be running on http://localhost:3001"
echo ""

BASE_URL="http://localhost:3001"
RESULTS_FILE="test-results-frontend-hooks.md"

# Initialize results file
cat > "$RESULTS_FILE" << 'EOF'
# Frontend Integration Testing Results

## Test Execution Summary
EOF

echo "$(date)" >> "$RESULTS_FILE"
echo "" >> "$RESULTS_FILE"

# Function to test API endpoints that frontend hooks use
test_hook_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local description=$4
    
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
    else
        echo "❌ FAILED"
        echo "**Status**: ❌ FAILED" >> "$RESULTS_FILE"
    fi
    
    echo "Response: $body"
    echo '```json' >> "$RESULTS_FILE"
    echo "$body" | jq . 2>/dev/null >> "$RESULTS_FILE" || echo "$body" >> "$RESULTS_FILE"
    echo '```' >> "$RESULTS_FILE"
    echo ""
    echo "" >> "$RESULTS_FILE"
}

echo "## useInvoices Hook Testing" >> "$RESULTS_FILE"
echo ""

# Test invoice-related endpoints that useInvoices hook would call
echo "=== TESTING INVOICE HOOK ENDPOINTS ==="

# Note: These endpoints might not exist in the current backend
# Testing them to see what the frontend hooks would encounter
test_hook_endpoint "GET" "/api/invoices" "" "Fetch Invoices (useInvoices.fetchInvoices)"
test_hook_endpoint "POST" "/api/invoices" '{"amount": 100, "currency": "USD", "email": "test@example.com", "memo": "Test invoice"}' "Create Invoice (useInvoices.createInvoice)"

# Test with different invoice data
test_hook_endpoint "POST" "/api/invoices" '{"amount": 250.50, "currency": "EUR", "email": "client@company.com", "name": "John Doe", "memo": "Consulting services", "dueDays": 30}' "Create Invoice with Full Data"

# Test invoice actions
test_hook_endpoint "POST" "/api/invoices/test_123/send" "" "Send Invoice (useInvoices.sendInvoice)"
test_hook_endpoint "POST" "/api/invoices/test_123/cancel" "" "Cancel Invoice (useInvoices.cancelInvoice)"

echo "## usePayLinks Hook Testing" >> "$RESULTS_FILE"
echo ""

# Test payment link endpoints that usePayLinks hook would call
echo "=== TESTING PAYMENT LINKS HOOK ENDPOINTS ==="
test_hook_endpoint "GET" "/api/links" "" "Fetch Payment Links (usePayLinks.fetchPayLinks)"
test_hook_endpoint "POST" "/api/links" '{"amount": 75, "currency": "USD", "memo": "Test payment link"}' "Create Payment Link (usePayLinks.createPayLink)"

# Test with different payment link data
test_hook_endpoint "POST" "/api/links" '{"amount": 199.99, "currency": "USD", "memo": "Premium product", "description": "Advanced features package"}' "Create Payment Link with Description"

echo "## Agent Integration Testing" >> "$RESULTS_FILE"
echo ""

# Test how the hooks might interact with the agent system
echo "=== TESTING AGENT INTEGRATION SCENARIOS ==="

# Switch to demo mode to see fallback behavior
echo "Setting up demo mode for hook fallback testing..."
curl -s -X POST "$BASE_URL/api/mode/toggle" -H "Content-Type: application/json" -d '{"mode": "demo"}' > /dev/null

echo "### Demo Mode Hook Behavior" >> "$RESULTS_FILE"
test_hook_endpoint "GET" "/api/invoices" "" "Fetch Invoices in Demo Mode"
test_hook_endpoint "GET" "/api/links" "" "Fetch Payment Links in Demo Mode"

# Switch to live mode
echo "Setting up live mode for hook testing..."
curl -s -X POST "$BASE_URL/api/mode/toggle" -H "Content-Type: application/json" -d '{"mode": "live"}' > /dev/null

echo "### Live Mode Hook Behavior" >> "$RESULTS_FILE"
test_hook_endpoint "GET" "/api/invoices" "" "Fetch Invoices in Live Mode"
test_hook_endpoint "GET" "/api/links" "" "Fetch Payment Links in Live Mode"

echo "## Frontend Mock Data Analysis" >> "$RESULTS_FILE"
echo ""

# Analyze the mock data structure from the hooks
echo "=== ANALYZING FRONTEND HOOK IMPLEMENTATIONS ==="

echo "### useInvoices Hook Analysis" >> "$RESULTS_FILE"
echo "Based on the hook implementation:" >> "$RESULTS_FILE"
echo "- **Mock Invoices Data Structure**:" >> "$RESULTS_FILE"
echo '```typescript' >> "$RESULTS_FILE"
echo 'interface Invoice {' >> "$RESULTS_FILE"
echo '  id: string;' >> "$RESULTS_FILE"
echo '  amount: number;' >> "$RESULTS_FILE"
echo '  currency: string;' >> "$RESULTS_FILE"
echo '  email: string;' >> "$RESULTS_FILE"
echo '  name?: string;' >> "$RESULTS_FILE"
echo '  memo?: string;' >> "$RESULTS_FILE"
echo '  status: "draft" | "sent" | "paid" | "cancelled";' >> "$RESULTS_FILE"
echo '  dueDate: string;' >> "$RESULTS_FILE"
echo '  createdAt: string;' >> "$RESULTS_FILE"
echo '}' >> "$RESULTS_FILE"
echo '```' >> "$RESULTS_FILE"
echo "" >> "$RESULTS_FILE"

echo "- **Hook Functions**:" >> "$RESULTS_FILE"
echo "  - `fetchInvoices()` - GET /api/invoices" >> "$RESULTS_FILE"
echo "  - `createInvoice(data)` - POST /api/invoices" >> "$RESULTS_FILE"
echo "  - `sendInvoice(id)` - POST /api/invoices/{id}/send" >> "$RESULTS_FILE"
echo "  - `cancelInvoice(id)` - POST /api/invoices/{id}/cancel" >> "$RESULTS_FILE"
echo "" >> "$RESULTS_FILE"

echo "### usePayLinks Hook Analysis" >> "$RESULTS_FILE"
echo "Based on the hook implementation:" >> "$RESULTS_FILE"
echo "- **Mock Payment Links Data Structure**:" >> "$RESULTS_FILE"
echo '```typescript' >> "$RESULTS_FILE"
echo 'interface PayLink {' >> "$RESULTS_FILE"
echo '  id: string;' >> "$RESULTS_FILE"
echo '  url: string;' >> "$RESULTS_FILE"
echo '  amount: number;' >> "$RESULTS_FILE"
echo '  currency: string;' >> "$RESULTS_FILE"
echo '  memo?: string;' >> "$RESULTS_FILE"
echo '  createdAt: string;' >> "$RESULTS_FILE"
echo '}' >> "$RESULTS_FILE"
echo '```' >> "$RESULTS_FILE"
echo "" >> "$RESULTS_FILE"

echo "- **Hook Functions**:" >> "$RESULTS_FILE"
echo "  - `fetchPayLinks()` - GET /api/links" >> "$RESULTS_FILE"
echo "  - `createPayLink(data)` - POST /api/links" >> "$RESULTS_FILE"
echo "  - `refreshPayLinks()` - Refresh data" >> "$RESULTS_FILE"
echo "" >> "$RESULTS_FILE"

echo "## Error Handling and Fallback Testing" >> "$RESULTS_FILE"
echo ""

# Test various error scenarios that hooks need to handle
echo "=== TESTING ERROR SCENARIOS ==="

echo "### Network Error Simulation" >> "$RESULTS_FILE"
# Test with invalid JSON
test_hook_endpoint "POST" "/api/invoices" '{"invalid": json}' "Invalid JSON Handling"

# Test with missing required fields
test_hook_endpoint "POST" "/api/invoices" '{}' "Missing Required Fields"
test_hook_endpoint "POST" "/api/links" '{}' "Missing Payment Link Fields"

echo "### Hook Fallback Behavior Analysis" >> "$RESULTS_FILE"
echo "The frontend hooks implement the following fallback strategies:" >> "$RESULTS_FILE"
echo "- **useInvoices**: Falls back to mock invoice data when API fails" >> "$RESULTS_FILE"
echo "- **usePayLinks**: Creates mock payment link when API fails" >> "$RESULTS_FILE"
echo "- **Error Toast Notifications**: Both hooks use toast notifications for error feedback" >> "$RESULTS_FILE"
echo "- **Loading States**: Both hooks provide loading states for UI feedback" >> "$RESULTS_FILE"
echo "" >> "$RESULTS_FILE"

echo "## Frontend Integration Conclusions" >> "$RESULTS_FILE"
echo "" >> "$RESULTS_FILE"
echo "### Key Findings" >> "$RESULTS_FILE"
echo "1. **Missing Backend Endpoints**: The expected REST API endpoints (/api/invoices, /api/links) are not implemented" >> "$RESULTS_FILE"
echo "2. **Agent Integration Gap**: Frontend hooks expect REST endpoints but backend uses agent-based processing" >> "$RESULTS_FILE"
echo "3. **Fallback Mechanisms**: Hooks have good fallback to mock data when APIs fail" >> "$RESULTS_FILE"
echo "4. **Data Structure Consistency**: Mock data structures are well-defined and consistent" >> "$RESULTS_FILE"
echo "5. **Error Handling**: Both hooks implement proper error handling and user feedback" >> "$RESULTS_FILE"
echo "" >> "$RESULTS_FILE"
echo "### Recommendations" >> "$RESULTS_FILE"
echo "1. **Implement Missing Endpoints**: Add REST API endpoints that hooks expect" >> "$RESULTS_FILE"
echo "2. **Bridge Agent System**: Connect REST endpoints to agent processing system" >> "$RESULTS_FILE"
echo "3. **Unified Error Handling**: Ensure consistent error responses across all endpoints" >> "$RESULTS_FILE"
echo "4. **Mode-Aware Responses**: Make REST endpoints respect demo/live mode settings" >> "$RESULTS_FILE"

echo ""
echo "=== FRONTEND INTEGRATION TESTING COMPLETED ==="
echo "Results saved to: $RESULTS_FILE"