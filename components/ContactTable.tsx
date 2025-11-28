"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { User, Eye } from "lucide-react";
import { Contact } from "@/types";
import { Badge } from "@/components/ui/badge";
import { ContactDetailsDialog } from "@/components/ContactDetailsDialog";
import { fetchContactDetails } from "@/actions/getConetentDetails";
import { useViews } from "@/components/ViewsProvider";
import { UpgradeDialog } from "@/components/UpgradeDialog";

interface ContactTableProps {
	contacts: Contact[];
}

export const ContactTable = ({ contacts }: ContactTableProps) => {
	const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
	const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
	const [loadingContactId, setLoadingContactId] = useState<string | null>(null);
	const { incrementViews } = useViews();

	const safe = (value?: string | null) => value?.trim() || "_";

	const handleViewContact = async (contact: Contact) => {
		setLoadingContactId(contact.id);

		const result = await fetchContactDetails(contact.id);

		setLoadingContactId(null);

		if (!result.success) {
			// Handle different error messages
			if (result.message === "Daily limit exceeded") {
				setShowUpgradeDialog(true);
			} else {
				alert(result.message);
			}
			return;
		}

		// Success!
		setSelectedContact(result.contact);
		incrementViews();
	};

	return (
		<>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Title</TableHead>
							<TableHead>Department</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{contacts.length === 0 ? (
							<TableRow>
								<TableCell colSpan={4} className="text-center text-muted-foreground">
									No contacts found
								</TableCell>
							</TableRow>
						) : (
							contacts.map((contact) => (
								<TableRow key={contact.id}>
									<TableCell className="font-medium">
										<div className="flex items-center gap-2">
											<User className="h-4 w-4 text-muted-foreground" />
											{safe(contact.first_name)} {safe(contact.last_name)}
										</div>
									</TableCell>

									<TableCell>{safe(contact.title)}</TableCell>

									<TableCell>
										{contact.department ? (
											<Badge variant="secondary">{contact.department}</Badge>
										) : (
											"-"
										)}
									</TableCell>

									<TableCell className="text-right">
										<Button
											size="sm"
											variant="outline"
											onClick={() => handleViewContact(contact)}
											disabled={loadingContactId === contact.id}
										>
											<Eye className="h-4 w-4 mr-1" />
											{loadingContactId === contact.id ? "Loading..." : "View Contact"}
										</Button>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

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
};