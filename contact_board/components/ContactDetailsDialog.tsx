import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Mail, Phone, Building2, Briefcase, Users } from "lucide-react";
import { ContactDetails } from "@/types";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface ContactDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact: ContactDetails | null;
}

export const ContactDetailsDialog = ({ open, onOpenChange, contact }: ContactDetailsDialogProps) => {
  if (!contact) return null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contact Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-2xl font-semibold">
              {contact.firstName} {contact.lastName}
            </h3>
            <p className="text-sm text-muted-foreground">{contact.title}</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Agency:</span>
              <span className="font-medium">{contact.agencyName}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Department:</span>
              <Badge variant="secondary">{contact.department}</Badge>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Title:</span>
              <span>{contact.title}</span>
            </div>
          </div>

          <div className="space-y-2 rounded-lg border bg-muted/50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span className="font-mono text-sm">{contact.email}</span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(contact.email, 'Email')}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span className="font-mono text-sm">{contact.phone}</span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(contact.phone, 'Phone')}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            This contact has been counted toward your daily view limit
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
