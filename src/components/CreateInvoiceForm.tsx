import { useState } from "react";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useInvoices, type CreateInvoiceData } from "@/hooks/useInvoices";

const CURRENCIES = [
  { value: "USD", label: "USD - US Dollar" },
  { value: "EUR", label: "EUR - Euro" },
  { value: "GBP", label: "GBP - British Pound" },
  { value: "CAD", label: "CAD - Canadian Dollar" },
];

export function CreateInvoiceForm() {
  const [formData, setFormData] = useState<CreateInvoiceData>({
    amount: 0,
    currency: "USD",
    email: "",
    name: "",
    memo: "",
    dueDays: 30,
  });
  const [submitting, setSubmitting] = useState(false);
  const { createInvoice } = useInvoices();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || formData.amount <= 0) return;

    setSubmitting(true);
    try {
      await createInvoice({
        ...formData,
        name: formData.name || undefined,
        memo: formData.memo || undefined,
      });
      
      // Reset form
      setFormData({
        amount: 0,
        currency: "USD",
        email: "",
        name: "",
        memo: "",
        dueDays: 30,
      });
    } catch (error) {
      // Error is handled by the hook
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field: keyof CreateInvoiceData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Create Invoice</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Amount *</label>
              <Input
                type="number"
                step="0.01"
                min="0.01"
                value={formData.amount || ""}
                onChange={(e) => handleChange("amount", parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Currency</label>
              <Select value={formData.currency} onValueChange={(value) => handleChange("currency", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((currency) => (
                    <SelectItem key={currency.value} value={currency.value}>
                      {currency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Customer Email *</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="customer@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Customer Name</label>
            <Input
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="John Doe (optional)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Memo</label>
            <Textarea
              value={formData.memo}
              onChange={(e) => handleChange("memo", e.target.value)}
              placeholder="Description of services or products..."
              className="resize-none h-20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Due Days</label>
            <Select value={formData.dueDays?.toString()} onValueChange={(value) => handleChange("dueDays", parseInt(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="15">15 days</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="60">60 days</SelectItem>
                <SelectItem value="90">90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            type="submit"
            disabled={!formData.email || formData.amount <= 0 || submitting}
            className="w-full"
          >
            {submitting ? (
              "Creating..."
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Create Invoice
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}