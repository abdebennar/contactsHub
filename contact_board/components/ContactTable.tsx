import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Contact } from "@/types";
import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ContactTableProps {
	contacts: Contact[];
	onViewContact: (id: string) => void;
}

export const ContactTable = ({ contacts, onViewContact }: ContactTableProps) => {
	return (
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
					{(contacts || []).length === 0 ? (
						<TableRow>
							<TableCell colSpan={4} className="text-center text-muted-foreground">
								No contacts found
							</TableCell>
						</TableRow>
					) : (
						contacts.map((contact) => (
							<TableRow key={contact.id}>
								<TableCell className="font-medium">
									{contact.firstName} {contact.lastName}
								</TableCell>
								<TableCell className="text-muted-foreground">{contact.title}</TableCell>
								<TableCell>
									<Badge variant="secondary">{contact.department}</Badge>
								</TableCell>
								<TableCell className="text-right">
									<Button
										size="sm"
										variant="outline"
										onClick={() => onViewContact(contact.id)}
									>
										<Eye className="h-4 w-4 mr-1" />
										View Contact
									</Button>
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
		</div>
	);
};
