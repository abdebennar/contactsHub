'use client';

import { useQueryClient } from "@tanstack/react-query";
import { mockApiClient } from "@/lib/mockApi";
import { useQueryParams } from "@/hooks/useQueryParams";
import { ContactTable } from "@/components/ContactTable";
import { SearchInput } from "@/components/SearchInput";
import { PaginationControls } from "@/components/PaginationControls";
import { ContactDetailsDialog } from "@/components/ContactDetailsDialog";
import { UpgradeDialog } from "@/components/UpgradeDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users } from "lucide-react";
import { useState } from "react";
import { ContactDetails } from "@/types";

interface ContactsClientProps {
  initialData: any;
  departments: string[];
  initialPage: number;
  initialSearch: string;
  initialDepartment: string;
}

export const ContactsClient = ({ 
  initialData, 
  departments,
  initialPage,
  initialSearch,
  initialDepartment
}: ContactsClientProps) => {
  const { setParam, setParams } = useQueryParams();
  const queryClient = useQueryClient();
  
  const [selectedContact, setSelectedContact] = useState<ContactDetails | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const handleViewContact = async (contactId: string) => {
    const result = await mockApiClient.getContactDetails(contactId);
    
    if (result.limitReached) {
      setShowUpgrade(true);
    } else if (result.data) {
      setSelectedContact(result.data);
      queryClient.invalidateQueries({ queryKey: ['user-stats'] });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Users className="h-8 w-8" />
          All Contacts
        </h1>
        <p className="text-muted-foreground mt-1">Browse all government agency contacts</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchInput
            value={initialSearch}
            onChange={(value) => setParams({ search: value, page: '1' })}
            placeholder="Search contacts..."
          />
        </div>
        <Select
          value={initialDepartment}
          onValueChange={(value) => setParams({ department: value, page: '1' })}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map((d) => (
              <SelectItem key={d} value={d}>{d}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ContactTable contacts={initialData.data} onViewContact={handleViewContact} />
      
      <div className="flex justify-center">
        <PaginationControls
          currentPage={initialPage}
          totalPages={initialData.totalPages}
          onPageChange={(newPage) => setParam('page', newPage.toString())}
        />
      </div>

      <ContactDetailsDialog
        contact={selectedContact}
        open={!!selectedContact}
        onOpenChange={(open) => !open && setSelectedContact(null)}
      />

      <UpgradeDialog
        open={showUpgrade}
        onOpenChange={setShowUpgrade}
      />
    </div>
  );
};