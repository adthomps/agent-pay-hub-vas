import { RefreshCw, Copy, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { usePayLinks, type PayLink } from "@/hooks/usePayLinks";
import { useToast } from "@/hooks/use-toast";

export function PayLinksTable() {
  const { payLinks, loading, refreshPayLinks } = usePayLinks();
  const { toast } = useToast();

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied",
        description: "Link copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const openLink = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Pay-by-Links</CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={refreshPayLinks}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Loading pay links...</div>
          </div>
        ) : payLinks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No pay links found. Create your first pay link below.
          </div>
        ) : (
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden sm:table-cell">ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="hidden md:table-cell">Memo</TableHead>
                  <TableHead className="hidden lg:table-cell">Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payLinks.map((link) => (
                  <TableRow key={link.id}>
                    <TableCell className="font-medium font-mono text-xs hidden sm:table-cell">
                      {link.id}
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="sm:hidden text-xs text-muted-foreground mb-1">
                        {link.id}
                      </div>
                      {link.currency} {link.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="text-sm">
                        {link.memo || "No memo"}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs hidden lg:table-cell">
                      {new Date(link.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col sm:flex-row items-end sm:items-center justify-end gap-1 sm:gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(link.url)}
                          className="hover:bg-primary/5 w-full sm:w-auto text-xs"
                        >
                          <Copy className="w-3 h-3 sm:mr-1" />
                          <span className="hidden sm:inline">Copy</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openLink(link.url)}
                          className="hover:bg-primary/5 w-full sm:w-auto text-xs"
                        >
                          <ExternalLink className="w-3 h-3 sm:mr-1" />
                          <span className="hidden sm:inline">Open</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}