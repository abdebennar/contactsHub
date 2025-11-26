"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ContactTable } from "@/components/ContactTable";
import { ContactDetailsDialog } from "@/components/ContactDetailsDialog";
import { UpgradeDialog } from "@/components/UpgradeDialog";
import { mockApiClient } from "@/lib/mockApi";
import { ContactDetails } from "@/types";
import { toast } from "sonner";

interface ContactTableWrapperProps {
	contacts: any[];
	agencyId: string;
}

export function ContactTableWrapper({ contacts, agencyId }: ContactTableWrapperProps) {
	const queryClient = useQueryClient();
	const [selectedContact, setSelectedContact] = useState<ContactDetails | null>(null);
	const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

	const viewContactMutation = useMutation({
		mutationFn: (contactId: string) => mockApiClient.getContactDetails(contactId),
		onSuccess: (result) => {
			if (result.limitReached) {
				setShowUpgradeDialog(true);
			} else if (result.data) {
				setSelectedContact(result.data);
			} else if (result.error) {
				toast.error(result.error);
			}
			// Invalidate user-stats to update the badge
			queryClient.invalidateQueries({ queryKey: ['user-stats'], exact: true });
		}
	});

	const handleViewContact = (contactId: string) => {
		viewContactMutation.mutate(contactId);
	};

	return (
		<>
			<ContactTable
				contacts={contacts}
				onViewContact={handleViewContact}
			/>

			<ContactDetailsDialog
				open={!!selectedContact}
				onOpenChange={(open) => !open && setSelectedContact(null)}
				contact={selectedContact}
			/>

			<UpgradeDialog
				open={showUpgradeDialog}
				onOpenChange={setShowUpgradeDialog}
			/>
		</>
	);
}