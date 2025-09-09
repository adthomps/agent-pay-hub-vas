# Agent Pay Hub VAS - Comprehensive Testing Guide

This document provides comprehensive testing for all functions and actions in the Agent Pay Hub VAS system, covering both Demo/Mock and Live (Sandbox) modes.

## Prerequisites

1. **Environment Setup**:
   - Node.js and npm installed
   - Dependencies installed: `npm install`
   - Environment variables configured in `.env`:
     ```
     VISA_ACCEPTANCE_MERCHANT_ID=test123
     VISA_ACCEPTANCE_API_KEY_ID=test456
     VISA_ACCEPTANCE_SECRET_KEY=test789
     ```

2. **Server Running**:
   ```bash
   npm run server:ts
   ```

## Testing Structure

### Core Functionality Testing
- ✅ **Natural Language Command Processing**
- ✅ **Tool Section Management**
- ✅ **Invoice Operations** (Create, List, Get)
- ✅ **Pay-By-Link Operations** (Create, List, Get)
- ✅ **Mode Switching** (Demo ↔ Live)

### Test Coverage
- ✅ **API Endpoints** - Backend functionality
- ✅ **Frontend Hooks** - UI integration
- ✅ **Error Handling** - Edge cases
- ✅ **Mode Validation** - Demo vs Live behavior

---

## Quick Test Execution

Run all tests:
```bash
cd testing
chmod +x run-all-tests.sh
./run-all-tests.sh
```

Run specific test category:
```bash
./test-api-endpoints.sh
./test-natural-language.sh
./test-mode-switching.sh
```

---

## Manual Testing Procedures

### 1. System Health Check
```bash
curl -s http://localhost:3001/api/health | jq .
```
**Expected**: Status "ok", toolkit available, credentials configured

### 2. Mode Status Verification
```bash
curl -s http://localhost:3001/api/mode/status | jq .
```
**Expected**: Current mode, toolkit availability, credentials status

### 3. Available Tools Check
```bash
curl -s http://localhost:3001/api/agent/tools | jq .
```
**Expected**: List of available tools based on current mode

---

## Detailed Test Results

See individual test files for comprehensive results:
- `test-results-api-endpoints.md` - API endpoint testing
- `test-results-natural-language.md` - NL command testing  
- `test-results-mode-switching.md` - Mode switching testing
- `test-results-frontend-hooks.md` - Frontend integration testing

---

## Test Environment Status

- **Server**: TypeScript server (server.ts) - Full featured
- **Toolkit**: Visa Acceptance Agent Toolkit v0.0.96
- **AI Integration**: AI SDK with OpenAI (configurable)
- **Mode Support**: Demo/Mock and Live/Sandbox modes