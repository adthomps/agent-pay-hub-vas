import { AgentBox } from "@/components/AgentBox";
import { InvoicesTable } from "@/components/InvoicesTable";
import { PayLinksTable } from "@/components/PayLinksTable";
import { CreateInvoiceForm } from "@/components/CreateInvoiceForm";
import { CreatePayLinkForm } from "@/components/CreatePayLinkForm";
import { ThemeToggle } from "@/components/ThemeToggle";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">V</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  Visa Acceptance Agent Toolkit
                </h1>
                <p className="text-sm text-muted-foreground hidden sm:block">
                  Payment processing made simple
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 pb-safe">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Left Column - Forms and Agent */}
          <div className="space-y-6 order-2 xl:order-1">
            <AgentBox />
            
            {/* Mobile: Show forms in a more compact layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-6">
              <CreateInvoiceForm />
              <CreatePayLinkForm />
            </div>
          </div>

          {/* Right Column - Tables */}
          <div className="space-y-6 order-1 xl:order-2">
            <InvoicesTable />
            <PayLinksTable />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
