import { useState } from "react";
import { Send, ChevronDown, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { useAgent } from "@/hooks/useAgent";

const TOOL_OPTIONS = [
  { value: "auto", label: "Auto (AI chooses)" },
  { value: "invoice.create", label: "Create Invoice" },
  { value: "invoice.list", label: "List Invoices" },
  { value: "invoice.send", label: "Send Invoice" },
  { value: "link.create", label: "Create Pay Link" },
];

export function AgentBox() {
  const [query, setQuery] = useState("");
  const [selectedTool, setSelectedTool] = useState("auto");
  const [responseOpen, setResponseOpen] = useState(false);
  const { askAgent, loading, lastResponse } = useAgent();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const request = {
      query: query.trim(),
      tool: selectedTool === "auto" ? undefined : selectedTool,
    };

    await askAgent(request);
    setResponseOpen(true);
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          🤖 AI Agent Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Natural Language Command
            </label>
            <Textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., 'Create invoice for $100 to jane@example.com' or 'List all pending invoices'"
              className="min-h-[80px] resize-none touch-pan-y"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Tool Selection
            </label>
            <Select value={selectedTool} onValueChange={setSelectedTool}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TOOL_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            type="submit" 
            disabled={!query.trim() || loading}
            className="w-full"
          >
            {loading ? (
              "Processing..."
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Ask Agent
              </>
            )}
          </Button>
        </form>

        {lastResponse && (
          <Collapsible open={responseOpen} onOpenChange={setResponseOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-2">
                <span className="text-sm font-medium">Agent Response</span>
                {responseOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <div className="bg-muted rounded-md p-3 border">
                <pre className="text-xs overflow-auto max-h-48 whitespace-pre-wrap">
                  {JSON.stringify(lastResponse, null, 2)}
                </pre>
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}
      </CardContent>
    </Card>
  );
}