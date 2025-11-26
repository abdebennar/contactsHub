// "use client";

// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { useParams, useRouter } from "next/navigation";
// // import { redirect } from "next/navigation";
// import { mockApiClient } from "@/lib/mockApi";
// import { useQueryParams } from "@/hooks/useQueryParams";
// import { ContactTable } from "@/components/ContactTable";
// import { SearchInput } from "@/components/SearchInput";
// import { SkeletonTable } from "@/components/SkeletonTable";
// import { PaginationControls } from "@/components/PaginationControls";
// import { ViewsTodayBadge } from "@/components/ViewsTodayBadge";
// import { ContactDetailsDialog } from "@/components/ContactDetailsDialog";
// import { UpgradeDialog } from "@/components/UpgradeDialog";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
// import { ArrowLeft } from "lucide-react";
// import { useState } from "react";
// import { ContactDetails } from "@/types";
// import { toast } from "sonner";

// const DEPARTMENTS = ['Operations', 'Finance', 'HR', 'IT', 'Legal', 'Communications'];

// const AgencyContacts = () => {
// 	const params = useParams();
// 	const agencyId = params.id as string;

// 	const router = useRouter();
// 	const queryClient = useQueryClient();
// 	const { getParam, setParam, setParams } = useQueryParams();

// 	const [selectedContact, setSelectedContact] = useState<ContactDetails | null>(null);
// 	const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

// 	const page = parseInt(getParam('page') || '1');
// 	const search = getParam('search') || '';
// 	const department = getParam('department') || 'all';

// 	const { data: agency } = useQuery({
// 		queryKey: ['agency', agencyId],
// 		queryFn: () => mockApiClient.getAgency(agencyId!),
// 		enabled: !!agencyId,
// 		staleTime: 5 * 60 * 1000, // 5 minutes
// 		gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
// 	});

// 	const { data, isLoading } = useQuery({
// 		queryKey: ['contacts', agencyId, page, search, department],
// 		queryFn: () => mockApiClient.getContacts({
// 			agencyId: agencyId!,
// 			page,
// 			limit: 20,
// 			search,
// 			department: department === 'all' ? undefined : department
// 		}),
// 		enabled: !!agencyId,
// 		staleTime: 30 * 1000, // 30 seconds
// 		gcTime: 5 * 60 * 1000, // 5 minutes
// 	});

// 	const viewContactMutation = useMutation({
// 		mutationFn: (contactId: string) => mockApiClient.getContactDetails(contactId),
// 		onSuccess: (result) => {
// 			if (result.limitReached) {
// 				setShowUpgradeDialog(true);
// 			} else if (result.data) {
// 				setSelectedContact(result.data);
// 			} else if (result.error) {
// 				toast.error(result.error);
// 			}
// 			// Only invalidate user-stats, don't invalidate the contacts query
// 			queryClient.invalidateQueries({ queryKey: ['user-stats'], exact: true });
// 		}
// 	});

// 	const handleViewContact = (contactId: string) => {
// 		viewContactMutation.mutate(contactId);
// 	};

// 	if (!agencyId) return null;

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
// 								onClick={() => router.push('/')}
// 							>
// 								<ArrowLeft className="h-4 w-4 mr-2" />
// 								Back
// 							</Button>
// 							<div>
// 								<h1 className="text-3xl font-bold">{agency?.name}</h1>
// 								<p className="text-muted-foreground mt-1">
// 									{agency?.city}, {agency?.state}
// 								</p>
// 							</div>
// 						</div>
// 						<ViewsTodayBadge />
// 					</div>

// 					{/* Search and Filter */}
// 					<div className="flex flex-col sm:flex-row gap-4">
// 						<div className="flex-1">
// 							<SearchInput
// 								value={search}
// 								onChange={(value) => setParams({ search: value, page: '1' })}
// 								placeholder="Search contacts..."
// 							/>
// 						</div>
// 						<Select
// 							value={department}
// 							onValueChange={(value) => setParams({ department: value, page: '1' })}
// 						>
// 							<SelectTrigger className="w-full sm:w-48">
// 								<SelectValue placeholder="Filter by department" />
// 							</SelectTrigger>
// 							<SelectContent>
// 								<SelectItem value="all">All Departments</SelectItem>
// 								{DEPARTMENTS.map((d) => (
// 									<SelectItem key={d} value={d}>{d}</SelectItem>
// 								))}
// 							</SelectContent>
// 						</Select>
// 					</div>
// 				</div>
// 			</div>

// 			{/* Main Content Area - Scrollable */}
// 			<div className="flex-1 overflow-y-auto">
// 				<div className="container mx-auto px-4 py-6 space-y-6">
// 					{isLoading ? (
// 						<SkeletonTable columns={4} />
// 					) : data ? (
// 						<>
// 							<ContactTable
// 								contacts={data.data}
// 								onViewContact={handleViewContact}
// 							/>
// 							<div className="flex justify-center">
// 								<PaginationControls
// 									currentPage={page}
// 									totalPages={data.totalPages}
// 									onPageChange={(newPage) => setParam('page', newPage.toString())}
// 								/>
// 							</div>
// 						</>
// 					) : null}
// 				</div>
// 			</div>

// 			{/* Dialogs */}
// 			<ContactDetailsDialog
// 				open={!!selectedContact}
// 				onOpenChange={(open) => !open && setSelectedContact(null)}
// 				contact={selectedContact}
// 			/>

// 			<UpgradeDialog
// 				open={showUpgradeDialog}
// 				onOpenChange={setShowUpgradeDialog}
// 			/>
// 		</div>
// 	);
// };

// export default AgencyContacts;


// {
// 	"_id": "69258ef07acc72d9dfc451a7",
// 	"id": "00011104-435e-460f-b149-6409157f9604",
// 	"first_name": "Sage",
// 	"last_name": "Lindusky",
// 	"email": "sage.lindusky@academicarts.org",
// 	"phone": "(651)457-7427",
// 	"title": "Receptionist",
// 	"email_type": "direct",
// 	"contact_form_url": "",
// 	"created_at": "2025-11-15 14:42:09.721355+00",
// 	"updated_at": "2025-11-15 14:42:09.721373+00",
// 	"agency_id": "7f2e0e35-4d26-4f74-9fd8-63e5c9c683a7",
// 	"firm_id": "",
// 	"department": "Administration"
//   },

import { mockApiClient } from "@/lib/mockApi";
import { ContactTableWrapper } from "@/components/ContactTableWrapper";
import { SearchInput } from "@/components/SearchInput";
import { PaginationControls } from "@/components/PaginationControls";
import { ViewsTodayBadge } from "@/components/ViewsTodayBadge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { SkeletonTable } from "@/components/SkeletonTable";
import clientPromise from "@/lib/mongo";


const DEPARTMENTS = ['Operations', 'Finance', 'HR', 'IT', 'Legal', 'Communications'];

interface PageProps {
	params: Promise<{
		id: string;
	}>,
}

export default async function AgencyContacts({ params }: { params: { id: string } }) {
	const searchParams = {};
	const agencyId = params.id;
	const page = parseInt(searchParams.page || '1');
	const search = searchParams.search || '';
	const department = searchParams.department || 'all';

	const client = await clientPromise;
	const db = client.db();

	// Build filter
	const filter: any = { id: agencyId };

	// if (search) {
	// 	filter.$or = [
	// 		{ name: { $regex: search, $options: "i" } },
	// 		{ county: { $regex: search, $options: "i" } },
	// 	];
	// }

	// if (state !== "all") {
	// 	filter.state_code = state;
	// }

	// Get total count and data in parallel
	const [total, data] = await Promise.all([
		db.collection("contacts_contact_rows").countDocuments(filter),
		db
			.collection("contacts_contact_rows")
			.find(filter)
			.sort({ name: 1 })
			.toArray(),
	]);

	const contactsData = data.map(agency => ({
		...agency,
		_id: agency._id.toString(),
	}));

	console.log("Contacts Data:", contactsData);


	const agency = { name: "test", city: "Test City", state: "TS" }; // Replace with actual agency fetch if needed

	return (
		<div className="h-screen overflow-hidden flex flex-col">
			{/* Page Header - Fixed below the top nav */}
			<div className="border-b bg-background">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between mb-4">
						<div className="flex items-center gap-4">
							<Button
								variant="ghost"
								size="sm"
								asChild
							>
								<Link href="/">
									<ArrowLeft className="h-4 w-4 mr-2" />
									Back
								</Link>
							</Button>
							<div>
								<h1 className="text-3xl font-bold">{agency?.name}</h1>
								<p className="text-muted-foreground mt-1">
									{agency?.city}, {agency?.state}
								</p>
							</div>
						</div>
						<Suspense fallback={<div className="h-8 w-32 bg-muted animate-pulse rounded" />}>
							<ViewsTodayBadge />
						</Suspense>
					</div>

					{/* Search and Filter */}
					<div className="flex flex-col sm:flex-row gap-4">
						<div className="flex-1">
							<SearchInput
								defaultValue={search}
								placeholder="Search contacts..."
							/>
						</div>
						<DepartmentFilter defaultValue={department} />
					</div>
				</div>
			</div>

			{/* Main Content Area - Scrollable */}
			<div className="flex-1 overflow-y-auto">
				<div className="container mx-auto px-4 py-6 space-y-6">
					<Suspense fallback={<SkeletonTable columns={4} />}>
						<ContactTableWrapper
							contacts={contactsData.data}
							agencyId={agencyId}
						/>
					</Suspense>

					<div className="flex justify-center">
						<PaginationControls
							currentPage={page}
							totalPages={contactsData.totalPages}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

// Client component for department filter
function DepartmentFilter({ defaultValue }: { defaultValue: string }) {
	return (
		<Select defaultValue={defaultValue} name="department">
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
	);
}