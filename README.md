# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/973c464b-5038-41db-8524-66e114acbb03

## Visa Acceptance Agent Toolkit Integration

This project now includes a complete integration of the **Visa Acceptance Agent Toolkit** using the **Vercel AI SDK** for function-calling capabilities in a Node.js/TypeScript environment.

### 🚀 New Features

- **AI-Powered Agent** - Natural language processing for payment operations
- **Function Calling** - Automatic tool selection and parameter extraction
- **Visa Toolkit Integration** - Complete support for invoice and payment link operations
- **Dual Mode Operation** - Works with or without OpenAI API key

### 🤖 AI Agent Capabilities

The AI agent can understand and execute natural language commands such as:
- `"Create invoice for $200 to customer@test.com"`
- `"List all draft invoices"`
- `"Send invoice inv_123"`  
- `"Create payment link for EUR 75"`

### 📖 Documentation

See [AI_INTEGRATION.md](./AI_INTEGRATION.md) for complete integration details, API documentation, and setup instructions.

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/973c464b-5038-41db-8524-66e114acbb03) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev  # This now starts both frontend AND AI agent server
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- **Vercel AI SDK** (NEW)
- **OpenAI Integration** (NEW)
- **Express.js API Server** (NEW)

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/973c464b-5038-41db-8524-66e114acbb03) and click on Share -> Publish.

For production deployment with the AI features:
1. Deploy both the frontend build and the Express API server
2. Set the `OPENAI_API_KEY` environment variable for full AI functionality
3. The system will gracefully fallback to rule-based AI when the API key is not available

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
