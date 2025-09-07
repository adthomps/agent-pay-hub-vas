# GitHub Codespaces Configuration

This repository is configured to work seamlessly with GitHub Codespaces, providing a one-click development environment.

## What's Included

- **Node.js 20** - Latest LTS version
- **pnpm** - Fast, disk space efficient package manager
- **VS Code Extensions**:
  - TypeScript support
  - Tailwind CSS IntelliSense
  - Prettier code formatter
  - ESLint
  - JSON support
  - Remote Containers extension

## Port Forwarding

The devcontainer is configured to automatically forward these ports:
- **8080** - Frontend development server (Vite)
- **3001** - Backend API server (Express)

## Getting Started

1. Click the "Open in GitHub Codespaces" button in the main README
2. Wait for the container to build and dependencies to install
3. Configure your environment variables in `.env` (copy from `.env.example`)
4. Run `pnpm run start:full` to start both servers
5. Access the application through the forwarded port 8080

## Development Workflow

The Codespace comes pre-configured with:
- All dependencies installed via `pnpm install`
- VS Code settings optimized for the project
- Auto-formatting on save enabled
- Proper TypeScript configuration

## Environment Variables

Remember to set up your environment variables for the Visa Acceptance Agent Toolkit:

```env
VISA_ACCEPTANCE_MERCHANT_ID=your_merchant_id_here
VISA_ACCEPTANCE_API_KEY_ID=your_api_key_id_here  
VISA_ACCEPTANCE_SECRET_KEY=your_secret_key_here
VISA_ACCEPTANCE_ENVIRONMENT=SANDBOX
PORT=3001
OPENAI_API_KEY=your_openai_api_key_here
```

The application will run in demo mode without these credentials, but you'll need them for full functionality.