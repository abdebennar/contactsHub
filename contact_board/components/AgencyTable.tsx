"use client";

import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Agency } from "@/types";
import { Building2 } from "lucide-react";
import { redirect } from "next/navigation";

interface AgencyTableProps {
	agencies: Agency[];
}

export const AgencyTable = ({ agencies }: AgencyTableProps) => {
	const router = useRouter();

	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Agency Name</TableHead>
						<TableHead>State</TableHead>
						<TableHead>City</TableHead>
						<TableHead className="text-right">Contacts</TableHead>
						<TableHead className="text-right">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{agencies.length === 0 ? (
						<TableRow>
							<TableCell colSpan={5} className="text-center text-muted-foreground">
								No agencies found
							</TableCell>
						</TableRow>
					) : (
						agencies.map((agency) => (
							<TableRow key={agency.id}>
								<TableCell className="font-medium">
									<div className="flex items-center gap-2">
										<Building2 className="h-4 w-4 text-muted-foreground" />
										{agency.name}
									</div>
								</TableCell>
								<TableCell>{agency.state}</TableCell>
								<TableCell>{agency.city}</TableCell>
								<TableCell className="text-right">{agency.contactCount}</TableCell>
								<TableCell className="text-right">
									<Button
										size="sm"
										onClick={() => redirect(`/contacts/${agency.id}`)}
									>
										View Contacts
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
