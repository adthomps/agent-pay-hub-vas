import { useState, useEffect } from "react";
import { useToast } from "./use-toast";

export interface Invoice {
  id: string;
  amount: number;
  currency: string;
  email: string;
  name?: string;
  memo?: string;
  status: "draft" | "sent" | "paid" | "cancelled";
  dueDate: string;
  createdAt: string;
}

export interface CreateInvoiceData {
  amount: number;
  currency: string;
  email: string;
  name?: string;
  memo?: string;
  dueDays?: number;
}

export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/invoices");
      if (response.ok) {
        const data = await response.json();
        setInvoices(data);
      } else {
        // Show mock data if API is not available
        setInvoices([
          {
            id: "inv_001",
            amount: 100.00,
            currency: "USD",
            email: "jane@example.com",
            name: "Jane Doe",
            memo: "Consulting services",
            status: "sent",
            dueDate: "2024-02-15",
            createdAt: "2024-01-15"
          },
          {
            id: "inv_002",
            amount: 250.00,
            currency: "USD",
            email: "john@company.com",
            memo: "Software license",
            status: "draft",
            dueDate: "2024-02-20",
            createdAt: "2024-01-16"
          }
        ]);
      }
    } catch (error) {
      console.error("Failed to fetch invoices:", error);
      toast({
        title: "Error",
        description: "Failed to fetch invoices. Showing mock data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createInvoice = async (data: CreateInvoiceData) => {
    try {
      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const newInvoice = await response.json();
        setInvoices(prev => [newInvoice, ...prev]);
        toast({
          title: "Success",
          description: "Invoice created successfully",
        });
        return newInvoice;
      } else {
        throw new Error("Failed to create invoice");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create invoice",
        variant: "destructive",
      });
      throw error;
    }
  };

  const sendInvoice = async (id: string) => {
    try {
      const response = await fetch(`/api/invoices/${id}/send`, {
        method: "POST",
      });

      if (response.ok) {
        setInvoices(prev =>
          prev.map(inv => inv.id === id ? { ...inv, status: "sent" as const } : inv)
        );
        toast({
          title: "Success",
          description: "Invoice sent successfully",
        });
      } else {
        throw new Error("Failed to send invoice");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send invoice",
        variant: "destructive",
      });
    }
  };

  const cancelInvoice = async (id: string) => {
    try {
      const response = await fetch(`/api/invoices/${id}/cancel`, {
        method: "POST",
      });

      if (response.ok) {
        setInvoices(prev =>
          prev.map(inv => inv.id === id ? { ...inv, status: "cancelled" as const } : inv)
        );
        toast({
          title: "Success",
          description: "Invoice cancelled successfully",
        });
      } else {
        throw new Error("Failed to cancel invoice");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel invoice",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return {
    invoices,
    loading,
    createInvoice,
    sendInvoice,
    cancelInvoice,
    refreshInvoices: fetchInvoices,
  };
}