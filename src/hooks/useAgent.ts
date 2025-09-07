import { useState } from "react";
import { useToast } from "./use-toast";

export interface AgentRequest {
  tool?: string;
  args?: Record<string, any>;
  query: string;
}

export interface AgentResponse {
  tool: string;
  result: any;
  success: boolean;
  error?: string;
}

export function useAgent() {
  const [loading, setLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState<AgentResponse | null>(null);
  const { toast } = useToast();

  const askAgent = async (request: AgentRequest): Promise<AgentResponse | null> => {
    setLoading(true);
    try {
      const response = await fetch("/api/agent/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });

      if (response.ok) {
        const result = await response.json();
        setLastResponse(result);
        toast({
          title: "Agent Response",
          description: `Successfully executed ${result.tool}`,
        });
        return result;
      } else {
        const error = await response.text();
        throw new Error(error);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      
      // Mock response for demo purposes
      const mockResponse: AgentResponse = {
        tool: request.tool || "auto",
        result: {
          message: `Processed: "${request.query}"`,
          tool: request.tool || "auto-detected",
          args: request.args || {},
          demo: true
        },
        success: true,
      };
      
      setLastResponse(mockResponse);
      toast({
        title: "Demo Mode",
        description: "Agent API not available, showing mock response",
        variant: "default",
      });
      
      return mockResponse;
    } finally {
      setLoading(false);
    }
  };

  return {
    askAgent,
    loading,
    lastResponse,
  };
}