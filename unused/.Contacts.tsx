"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { mockApiClient } from "@/lib/mockApi";
import { useQueryParams } from "@/hooks/useQueryParams";
import { ContactTable } from "@/components/ContactTable";
import { SearchInput } from "@/components/SearchInput";
import { SkeletonTable } from "@/components/SkeletonTable";
import { PaginationControls } from "@/components/PaginationControls";
import { ContactDetailsDialog } from "@/components/ContactDetailsDialog";
import { UpgradeDialog } from "@/components/UpgradeDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users } from "lucide-react";
import { useState } from "react";
import { ContactDetails } from "@/types";

const DEPARTMENTS = ['Operations', 'Finance', 'HR', 'IT', 'Legal', 'Communications'];

const Contacts = () => {
	const { getParam, setParam, setParams } = useQueryParams();
	// const queryClient = useQueryClient();

	const [selectedContact, setSelectedContact] = useState<ContactDetails | null>(null);
	const [showUpgrade, setShowUpgrade] = useState(false);

	const page = parseInt(getParam('page') || '1');
	const search = getParam('search') || '';
	const department = getParam('department') || 'all';

	const { data, isLoading } = useQuery({
		queryKey: ['contacts', page, search, department],
		queryFn: () => mockApiClient.getContacts({
			page,
			limit: 20,
			search,
			department: department === 'all' ? undefined : department
		})
	});

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
						value={search}
						onChange={(value) => setParams({ search: value, page: '1' })}
						placeholder="Search contacts..."
					/>
				</div>
				<Select
					value={department}
					onValueChange={(value) => setParams({ department: value, page: '1' })}
				>
					<SelectTrigger className="w-full sm:w-48">
						<SelectValue placeholder="Filter by department" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Departments</SelectItem>
						{DEPARTMENTS.map((d) => (
							<SelectItem key={d} value={d}>{d}</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{isLoading ? (
				<SkeletonTable columns={5} />
			) : data ? (
				<>
					<ContactTable contacts={data.data} onViewContact={handleViewContact} />
					<div className="flex justify-center">
						<PaginationControls
							currentPage={page}
							totalPages={data.totalPages}
							onPageChange={(newPage) => setParam('page', newPage.toString())}
						/>
					</div>
				</>
			) : null}

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

export default Contacts;