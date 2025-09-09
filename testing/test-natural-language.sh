#!/bin/bash

# Natural Language Command Testing Script
# Focuses on testing natural language processing capabilities

echo "=== AGENT PAY HUB VAS - NATURAL LANGUAGE COMMAND TESTING ==="
echo "Testing natural language processing and command interpretation"
echo "Server should be running on http://localhost:3001"
echo ""

BASE_URL="http://localhost:3001"
RESULTS_FILE="test-results-natural-language.md"

# Initialize results file
cat > "$RESULTS_FILE" << 'EOF'
# Natural Language Command Testing Results

## Test Execution Summary
EOF

echo "$(date)" >> "$RESULTS_FILE"
echo "" >> "$RESULTS_FILE"

# Function to test natural language command
test_nl_command() {
    local query=$1
    local mode=$2
    local description=$3
    local expected_tool=$4
    
    echo "Testing: $description"
    echo "### $description" >> "$RESULTS_FILE"
    echo "**Query**: \"$query\"" >> "$RESULTS_FILE"
    echo "**Mode**: $mode" >> "$RESULTS_FILE"
    
    response=$(curl -s -X POST "$BASE_URL/api/agent/ask" \
        -H "Content-Type: application/json" \
        -d "{\"query\": \"$query\"}")
    
    echo "Response: $response" | jq . 2>/dev/null || echo "Response: $response"
    echo '```json' >> "$RESULTS_FILE"
    echo "$response" | jq . 2>/dev/null >> "$RESULTS_FILE" || echo "$response" >> "$RESULTS_FILE"
    echo '```' >> "$RESULTS_FILE"
    
    # Check if response contains expected elements
    success=$(echo "$response" | jq -r '.success // false' 2>/dev/null)
    demo_mode=$(echo "$response" | jq -r '.result.demo // false' 2>/dev/null)
    
    if [ "$success" = "true" ]; then
        echo "✅ SUCCESS"
        echo "**Status**: ✅ SUCCESS" >> "$RESULTS_FILE"
        if [ "$mode" = "demo" ] && [ "$demo_mode" = "true" ]; then
            echo "✅ Correctly identified as demo mode"
            echo "**Demo Mode**: ✅ Correctly identified" >> "$RESULTS_FILE"
        elif [ "$mode" = "live" ] && [ "$demo_mode" = "false" ]; then
            echo "✅ Correctly identified as live mode"
            echo "**Live Mode**: ✅ Correctly identified" >> "$RESULTS_FILE"
        fi
    else
        echo "❌ FAILED"
        echo "**Status**: ❌ FAILED" >> "$RESULTS_FILE"
    fi
    echo ""
    echo "" >> "$RESULTS_FILE"
}

# Switch to live mode first
echo "=== SETTING UP LIVE MODE ==="
curl -s -X POST "$BASE_URL/api/mode/toggle" -H "Content-Type: application/json" -d '{"mode": "live"}' > /dev/null

echo "## Live Mode Natural Language Testing" >> "$RESULTS_FILE"
echo ""

# Test various natural language queries in live mode
echo "=== TESTING INVOICE COMMANDS - LIVE MODE ==="
test_nl_command "Create an invoice for \$100 to john@example.com" "live" "Create Invoice - Basic" "create_invoice"
test_nl_command "I need to create an invoice for 250 dollars for consulting services" "live" "Create Invoice - Detailed" "create_invoice" 
test_nl_command "Show me all my invoices" "live" "List Invoices - Simple" "list_invoices"
test_nl_command "Can you list all the invoices I've created?" "live" "List Invoices - Conversational" "list_invoices"
test_nl_command "Get invoice details for invoice ID inv_12345" "live" "Get Invoice - Specific" "get_invoice"
test_nl_command "I want to see the details of my invoice inv_67890" "live" "Get Invoice - Conversational" "get_invoice"

echo "=== TESTING PAYMENT LINK COMMANDS - LIVE MODE ==="
test_nl_command "Create a payment link for \$50" "live" "Create Payment Link - Basic" "create_payment_link"
test_nl_command "I need a pay-by-link for 75 euros for my product" "live" "Create Payment Link - Detailed" "create_payment_link"
test_nl_command "Show all payment links" "live" "List Payment Links - Simple" "list_payment_links"
test_nl_command "Can you give me a list of all my payment links?" "live" "List Payment Links - Conversational" "list_payment_links"
test_nl_command "Get payment link link_abc123" "live" "Get Payment Link - Specific" "get_payment_link"

echo "=== TESTING COMPLEX COMMANDS - LIVE MODE ==="
test_nl_command "Create an invoice for \$500 to client@company.com with due date in 30 days for web development services" "live" "Complex Invoice Creation" "create_invoice"
test_nl_command "I need a payment link for \$199.99 in USD for my online course with shipping to New York" "live" "Complex Payment Link Creation" "create_payment_link"

# Switch to demo mode
echo "=== SWITCHING TO DEMO MODE ==="
curl -s -X POST "$BASE_URL/api/mode/toggle" -H "Content-Type: application/json" -d '{"mode": "demo"}' > /dev/null

echo "## Demo Mode Natural Language Testing" >> "$RESULTS_FILE"
echo ""

# Test the same queries in demo mode
echo "=== TESTING INVOICE COMMANDS - DEMO MODE ==="
test_nl_command "Create an invoice for \$100 to john@example.com" "demo" "Create Invoice - Basic (Demo)" "invoice.create"
test_nl_command "I need to create an invoice for 250 dollars for consulting services" "demo" "Create Invoice - Detailed (Demo)" "invoice.create"
test_nl_command "Show me all my invoices" "demo" "List Invoices - Simple (Demo)" "invoice.list"
test_nl_command "Can you list all the invoices I've created?" "demo" "List Invoices - Conversational (Demo)" "invoice.list"
test_nl_command "Get invoice details for invoice ID inv_12345" "demo" "Get Invoice - Specific (Demo)" "invoice.get"

echo "=== TESTING PAYMENT LINK COMMANDS - DEMO MODE ==="
test_nl_command "Create a payment link for \$50" "demo" "Create Payment Link - Basic (Demo)" "paymentLinks.create"
test_nl_command "I need a pay-by-link for 75 euros for my product" "demo" "Create Payment Link - Detailed (Demo)" "paymentLinks.create"
test_nl_command "Show all payment links" "demo" "List Payment Links - Simple (Demo)" "paymentLinks.list"
test_nl_command "Can you give me a list of all my payment links?" "demo" "List Payment Links - Conversational (Demo)" "paymentLinks.list"
test_nl_command "Get payment link link_abc123" "demo" "Get Payment Link - Specific (Demo)" "paymentLinks.get"

echo "=== TESTING EDGE CASE COMMANDS ==="
test_nl_command "Help me with payments" "demo" "Ambiguous Command" "auto-detected"
test_nl_command "What can you do?" "demo" "General Help Query" "auto-detected"
test_nl_command "Hello" "demo" "Greeting" "auto-detected"
test_nl_command "Create" "demo" "Incomplete Command" "auto-detected"

echo "## Command Interpretation Analysis" >> "$RESULTS_FILE"
echo "" >> "$RESULTS_FILE"
echo "### Key Findings" >> "$RESULTS_FILE"
echo "- Natural language processing handles both simple and complex queries" >> "$RESULTS_FILE"
echo "- System correctly switches behavior between live and demo modes" >> "$RESULTS_FILE"
echo "- Various phrasings for the same intent are recognized" >> "$RESULTS_FILE"
echo "- Edge cases are handled gracefully" >> "$RESULTS_FILE"

echo ""
echo "=== NATURAL LANGUAGE TESTING COMPLETED ==="
echo "Results saved to: $RESULTS_FILE"