import { Users } from "lucide-react";
import { ContactTable } from "@/components/ContactTable";
import { SkeletonTable } from "@/components/SkeletonTable";
import { ClientPagination } from "@/components/ClientPagination";
import { SearchInput } from "@/components/SearchInput";
import clientPromise from "@/lib/mongo";
import { Contact } from "@/types";
import { Filter } from "mongodb";
import { ViewsTodayBadge } from "@/components/ViewsTodayBadge";
import { auth } from "@clerk/nextjs/server";



interface PageProps {
	searchParams: Promise<{
		page?: string;
		search?: string;
	}>;
}

export default async function ContactsPage({ searchParams }: PageProps) {
	const params = await searchParams;

	const { userId } = await auth();
	const page = parseInt(params.page || "1");
	const search = params.search || "";
	const limit = 20;
	const offset = (page - 1) * limit;

	// Fetch data directly from MongoDB
	const client = await clientPromise;
	const db = client.db();

	// Build filter
	const filter: Filter<Contact> = {};


	if (search) {
		filter.$or = [
			{ first_name: { $regex: search, $options: "i" } },
			{ last_name: { $regex: search, $options: "i" } },
			{ email: { $regex: search, $options: "i" } },
			{ title: { $regex: search, $options: "i" } },
		];
	}

	const [viewdTodayData, total, data] = await Promise.all([
		db.collection("user_views").findOne({ userId: userId }, { projection: { viewedCount: 1, _id: 0 } }),
		db.collection("contacts_contact_rows").countDocuments(filter),
		db
			.collection("contacts_contact_rows")
			.find(filter)
			.project({ id: 1, first_name: 1, last_name: 1, title: 1, department: 1, _id: 0 })
			.sort({ first_name: 1, last_name: 1 })
			.limit(limit)
			.skip(offset)
			.toArray(),
	]);

	const contacts: Contact[] = data as unknown as Contact[];
	const viewedToday = viewdTodayData?.viewedCount || 0;


	const totalPages = Math.ceil(total / limit);

	return (
		<div className="container mx-auto px-4 py-8 space-y-6">
			<div>
				<div className="flex items-center justify-between">
					<h1 className="text-3xl font-bold flex items-center gap-2">
						<Users className="h-8 w-8" />
						Contacts
					</h1>


					{/* TODO day view limit is here  */}
					<ViewsTodayBadge viewsLimit={50} viewsToday={viewedToday} />
				</div>

				<div className="flex justify-between items-center mt-1 text-muted-foreground">
					<p>
						Browse {total.toLocaleString()} government agency contacts
					</p>
					<p className="text-sm">
						Showing {contacts.length} of {total.toLocaleString()} contacts
					</p>
				</div>
			</div>

			{/* Search */}
			{/* <div className="flex flex-col sm:flex-row gap-4">
				<SearchInput defaultValue={search} placeholder="Search contacts..." />
			</div> */}


			{contacts.length === 0 ? (
				<div className="text-center py-12 border rounded-lg">
					<p className="text-lg text-muted-foreground">No contacts found</p>
					<p className="text-sm text-muted-foreground mt-2">
						Try adjusting your search
					</p>
				</div>
			) : (
				<>
					<ContactTable contacts={contacts} />
					<ClientPagination currentPage={page} totalPages={totalPages} />
				</>
			)}
		</div>
	);
}