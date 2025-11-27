
// "use client";

// import { useQueryClient } from "@tanstack/react-query";
// import { mockApiClient } from "@/lib/mockApi";
// import { useQueryParams } from "@/hooks/useQueryParams";
// import { ContactTable } from "@/components/ContactTable";
// import { SearchInput } from "@/components/SearchInput";
// import { PaginationControls } from "@/components/PaginationControls";
// import { ContactDetailsDialog } from "@/components/ContactDetailsDialog";
// import { UpgradeDialog } from "@/components/UpgradeDialog";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Users } from "lucide-react";
// import { useState } from "react";
// import { ContactDetails } from "@/types";

// interface ContactsClientProps {
// 	initialData: any;
// 	departments: string[];
// 	initialPage: number;
// 	initialSearch: string;
// 	initialDepartment: string;
// }

// export const ContactsClient = ({
// 	initialData,
// 	departments,
// 	initialPage,
// 	initialSearch,
// 	initialDepartment
// }: ContactsClientProps) => {
// 	const { setParam, setParams } = useQueryParams();
// 	const queryClient = useQueryClient();

// 	const [selectedContact, setSelectedContact] = useState<ContactDetails | null>(null);
// 	const [showUpgrade, setShowUpgrade] = useState(false);

// 	const handleViewContact = async (contactId: string) => {
// 		const result = await mockApiClient.getContactDetails(contactId);

// 		if (result.limitReached) {
// 			setShowUpgrade(true);
// 		} else if (result.data) {
// 			setSelectedContact(result.data);
// 			queryClient.invalidateQueries({ queryKey: ['user-stats'] });
// 		}
// 	};

// 	return (
// 		<div className="h-screen overflow-hidden flex flex-col">
// 			{/* Page Header - Fixed below the top nav */}
// 			<div className="border-b bg-background">
// 				<div className="container mx-auto px-4 py-4">
// 					<div className="flex items-center justify-between mb-4">
// 						<div className="flex items-center gap-4">
// 							<Button
// 								variant="ghost"
// 								size="sm"
// 								asChild
// 							>
// 								<Link href="/">
// 									<ArrowLeft className="h-4 w-4 mr-2" />
// 									Back
// 								</Link>
// 							</Button>
// 							<div>
// 								<h1 className="text-3xl font-bold">{agency?.name}</h1>
// 								<p className="text-muted-foreground mt-1">
// 									{agency?.city}, {agency?.state}
// 								</p>
// 							</div>
// 						</div>
// 						<Suspense fallback={<div className="h-8 w-32 bg-muted animate-pulse rounded" />}>
// 							<ViewsTodayBadge />
// 						</Suspense>
// 					</div>

// 					{/* Search and Filter */}
// 					<div className="flex flex-col sm:flex-row gap-4">
// 						<div className="flex-1">
// 							<SearchInput
// 								defaultValue={search}
// 								placeholder="Search contacts..."
// 							/>
// 						</div>
// 						<DepartmentFilter defaultValue={department} />
// 					</div>
// 				</div>
// 			</div>

// 			{/* Main Content Area - Scrollable */}
// 			<div className="flex-1 overflow-y-auto">
// 				<div className="container mx-auto px-4 py-6 space-y-6">
// 					<Suspense fallback={<SkeletonTable columns={4} />}>
// 						<ContactTableWrapper
// 							contacts={contactsData.data}
// 							agencyId={agencyId}
// 						/>
// 					</Suspense>

// 					<div className="flex justify-center">
// 						<PaginationControls
// 							currentPage={page}
// 							totalPages={contactsData.totalPages}
// 						/>
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	);
// };


"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ContactTable } from "@/components/ContactTable";
import { ContactDetailsDialog } from "@/components/ContactDetailsDialog";
import { UpgradeDialog } from "@/components/UpgradeDialog";
import { ViewsTodayBadge } from "@/components/ViewsTodayBadge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { mockApiClient } from "@/lib/mockApi";
import { ContactDetails } from "@/types";
import { toast } from "sonner";

interface ContactsClientProps {
	contacts: any[];
}

export function ContactsClient({ contacts }: ContactsClientProps) {
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
			queryClient.invalidateQueries({ queryKey: ['user-stats'], exact: true });
		}
	});

	const handleViewContact = (contactId: string) => {
		viewContactMutation.mutate(contactId);
	};

	return (
		<div className="h-screen overflow-hidden flex flex-col">
			{/* Page Header - Fixed */}
			<div className="border-b bg-background">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between mb-4">
						<div className="flex items-center gap-4">
							<Button variant="ghost" size="sm" asChild>
								<Link href="/">
									<ArrowLeft className="h-4 w-4 mr-2" />
									Back
								</Link>
							</Button>
							<div>
								<h1 className="text-3xl font-bold">Agency Contacts</h1>
								<p className="text-muted-foreground mt-1">
									Showing all contacts ({contacts.length} total)
								</p>
							</div>
						</div>
						<ViewsTodayBadge />
					</div>
				</div>
			</div>

			{/* Main Content Area - Scrollable */}
			<div className="flex-1 overflow-y-auto">
				<div className="container mx-auto px-4 py-6">
					<ContactTable
						contacts={contacts}
						onViewContact={handleViewContact}
					/>
				</div>
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
		</div>
	);
}