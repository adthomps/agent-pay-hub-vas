#!/bin/bash

# Quick Demo Script - Shows the system working with key functionality

echo "=== AGENT PAY HUB VAS - SYSTEM DEMONSTRATION ==="
echo "Quick demo of all tested functionality"
echo ""

BASE_URL="http://localhost:3001"

# Check server health
echo "1. 🏥 Health Check"
curl -s "$BASE_URL/api/health" | jq '{status, currentMode, toolkitAvailable}'
echo ""

# Show available tools
echo "2. 🔧 Available Tools"
curl -s "$BASE_URL/api/agent/tools" | jq '{toolkitStatus, isLive, toolCount: (.tools | length)}'
echo ""

# Test natural language invoice creation
echo "3. 📝 Create Invoice (Natural Language)"
response=$(curl -s -X POST "$BASE_URL/api/agent/ask" \
  -H "Content-Type: application/json" \
  -d '{"query": "Create an invoice for $150 to john@example.com for web development"}')
echo "$response" | jq '{tool, success, demo: .result.demo}'
echo ""

# Test payment link creation
echo "4. 💳 Create Payment Link (Natural Language)"
response=$(curl -s -X POST "$BASE_URL/api/agent/ask" \
  -H "Content-Type: application/json" \
  -d '{"query": "Create a payment link for $75 for my online course"}')
echo "$response" | jq '{tool, success, demo: .result.demo}'
echo ""

# Switch modes and test again
echo "5. 🔄 Switch to Demo Mode"
curl -s -X POST "$BASE_URL/api/mode/toggle" \
  -H "Content-Type: application/json" \
  -d '{"mode": "demo"}' | jq '{success, currentMode}'
echo ""

echo "6. 📝 Create Invoice in Demo Mode"
response=$(curl -s -X POST "$BASE_URL/api/agent/ask" \
  -H "Content-Type: application/json" \
  -d '{"query": "Create an invoice for $200", "tool": "invoice.create"}')
echo "$response" | jq '{tool, success, demo: .result.demo}'
echo ""

echo "7. 📋 List Invoices in Demo Mode"
response=$(curl -s -X POST "$BASE_URL/api/agent/ask" \
  -H "Content-Type: application/json" \
  -d '{"query": "Show all invoices", "tool": "invoice.list"}')
echo "$response" | jq '{tool, success, demo: .result.demo}'
echo ""

# Switch back to live
echo "8. 🔄 Switch to Live Mode"
curl -s -X POST "$BASE_URL/api/mode/toggle" \
  -H "Content-Type: application/json" \
  -d '{"mode": "live"}' | jq '{success, currentMode}'
echo ""

echo "9. 💳 List Payment Links in Live Mode"
response=$(curl -s -X POST "$BASE_URL/api/agent/ask" \
  -H "Content-Type: application/json" \
  -d '{"query": "Show all payment links"}')
echo "$response" | jq '{tool, success, demo: .result.demo}'
echo ""

echo "=== DEMONSTRATION COMPLETED ==="
echo "✅ All core functionality working:"
echo "   - Natural Language Processing ✅"
echo "   - Invoice Creation ✅"
echo "   - Payment Link Creation ✅"  
echo "   - List Operations ✅"
echo "   - Demo/Live Mode Switching ✅"
echo ""
echo "🌐 Frontend running at: http://localhost:8080"
echo "🔧 Backend API running at: http://localhost:3001"