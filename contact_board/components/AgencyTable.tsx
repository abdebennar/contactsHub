"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building2 } from "lucide-react";
import { Agency } from "@/types";
import { Button } from "@/components/ui/button";


interface AgencyTableProps {
	agencies: Agency[];
}

export const AgencyTable = ({ agencies }: AgencyTableProps) => {

	const safe = (value?: string | null) => value?.trim() || "__";

	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Agency Name</TableHead>
						<TableHead>State</TableHead>
						<TableHead>Type</TableHead>
						<TableHead>Website</TableHead>
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
										{safe(agency.name)}
									</div>
								</TableCell>

								<TableCell>{safe(`${agency.state} (${agency.state_code})`)}</TableCell>
								<TableCell>{safe(agency.type)}</TableCell>

								<TableCell>
									{agency.website ? (
										<a
											href={agency.website}
											target="_blank"
											rel="noopener noreferrer"
											className="text-blue-600 underline"
										>
											{agency.website}
										</a>
									) : (
										"_"
									)}
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
		</div >
	);
};
