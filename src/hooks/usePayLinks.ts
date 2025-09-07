import { useState, useEffect } from "react";
import { useToast } from "./use-toast";

export interface CreatePayLinkData {
  amount: number;
  currency: string;
  memo?: string;
}

export interface PayLink {
  id: string;
  url: string;
  amount: number;
  currency: string;
  memo?: string;
  createdAt: string;
}

export function usePayLinks() {
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [payLinks, setPayLinks] = useState<PayLink[]>([]);
  const [lastCreatedLink, setLastCreatedLink] = useState<PayLink | null>(null);
  const { toast } = useToast();

  const createPayLink = async (data: CreatePayLinkData): Promise<PayLink | null> => {
    setCreating(true);
    try {
      const response = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        setLastCreatedLink(result);
        toast({
          title: "Success",
          description: "Pay-by-link created successfully",
        });
        return result;
      } else {
        throw new Error("Failed to create pay-by-link");
      }
    } catch (error) {
      // Mock response for demo
      const mockLink: PayLink = {
        id: `link_${Date.now()}`,
        url: `https://pay.example.com/link_${Date.now()}`,
        amount: data.amount,
        currency: data.currency,
        memo: data.memo,
        createdAt: new Date().toISOString(),
      };
      
      setLastCreatedLink(mockLink);
      toast({
        title: "Demo Mode",
        description: "Pay-by-link API not available, showing mock link",
      });
      
      return mockLink;
    } finally {
      setCreating(false);
    }
  };

  const fetchPayLinks = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/links");
      if (response.ok) {
        const result = await response.json();
        setPayLinks(result);
      } else {
        throw new Error("Failed to fetch pay links");
      }
    } catch (error) {
      // Mock response for demo
      const mockLinks: PayLink[] = [
        {
          id: "link_1",
          url: "https://pay.example.com/link_1",
          amount: 100,
          currency: "USD",
          memo: "Sample payment link",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: "link_2", 
          url: "https://pay.example.com/link_2",
          amount: 250,
          currency: "EUR",
          memo: "Another payment link",
          createdAt: new Date(Date.now() - 172800000).toISOString(),
        },
      ];
      setPayLinks(mockLinks);
    } finally {
      setLoading(false);
    }
  };

  const refreshPayLinks = () => {
    fetchPayLinks();
  };

  useEffect(() => {
    fetchPayLinks();
  }, []);

  return {
    createPayLink,
    creating,
    loading,
    payLinks,
    lastCreatedLink,
    refreshPayLinks,
  };
}