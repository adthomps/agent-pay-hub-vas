import { useState } from "react";
import { Link2, ExternalLink, Copy, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { usePayLinks, type CreatePayLinkData } from "@/hooks/usePayLinks";

const CURRENCIES = [
  { value: "USD", label: "USD - US Dollar" },
  { value: "EUR", label: "EUR - Euro" },
  { value: "GBP", label: "GBP - British Pound" },
  { value: "CAD", label: "CAD - Canadian Dollar" },
];

export function CreatePayLinkForm() {
  const [formData, setFormData] = useState<CreatePayLinkData>({
    amount: 0,
    currency: "USD",
    memo: "",
  });
  const [copied, setCopied] = useState(false);
  const { createPayLink, creating, lastCreatedLink } = usePayLinks();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.amount <= 0) return;

    await createPayLink({
      ...formData,
      memo: formData.memo || undefined,
    });
    
    // Reset form
    setFormData({
      amount: 0,
      currency: "USD",
      memo: "",
    });
  };

  const handleChange = (field: keyof CreatePayLinkData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Create Pay-by-Link</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
            <label className="block text-sm font-medium mb-1">Memo</label>
            <Textarea
              value={formData.memo}
              onChange={(e) => handleChange("memo", e.target.value)}
              placeholder="Payment description..."
              className="resize-none h-20"
            />
          </div>

          <Button 
            type="submit"
            disabled={formData.amount <= 0 || creating}
            className="w-full"
          >
            {creating ? (
              "Creating..."
            ) : (
              <>
                <Link2 className="w-4 h-4 mr-2" />
                Create Pay Link
              </>
            )}
          </Button>
        </form>

        {lastCreatedLink && (
          <div className="mt-6 p-4 bg-success/5 border border-success/20 rounded-lg">
            <h4 className="font-medium text-success mb-2">Payment Link Created!</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-2 bg-background border rounded">
                <code className="flex-1 text-sm break-all">{lastCreatedLink.url}</code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(lastCreatedLink.url)}
                  className="shrink-0"
                >
                  {copied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(lastCreatedLink.url, "_blank")}
                  className="flex-1"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Link
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(lastCreatedLink.url)}
                  className="flex-1"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {copied ? "Copied!" : "Copy URL"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}