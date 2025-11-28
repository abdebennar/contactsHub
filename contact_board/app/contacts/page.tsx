import { Users } from "lucide-react";
import { ContactTable } from "@/components/ContactTable";
import { ClientPagination } from "@/components/ClientPagination";
import clientPromise from "@/lib/mongo";
import { Contact } from "@/types";
import { Filter } from "mongodb";
import { ViewsTodayBadge } from "@/components/ViewsTodayBadge";
import { auth } from "@clerk/nextjs/server";
import { ViewsProvider } from "@/components/ViewsProvider";



interface PageProps {
	searchParams: Promise<{
		page?: string;
	}>;
}

export default async function ContactsPage({ searchParams }: PageProps) {
	const params = await searchParams;

	const { userId } = await auth();
	const page = parseInt(params.page || "1");
	const limit = 20;
	const offset = (page - 1) * limit;

	const client = await clientPromise;
	const db = client.db();

	const filter: Filter<Document | undefined> = {};

	const today = new Date().toISOString().slice(0, 10);

	const [viewdTodayData, total, data] = await Promise.all([
		db.collection("user_views").findOne({ userId: userId, date: today }, { projection: { viewedCount: 1, _id: 0 } }),
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
		<ViewsProvider initialViews={viewedToday}>
			<div className="container mx-auto px-4 py-8 space-y-6">
				<div>
					<div className="flex items-center justify-between">
						<h1 className="text-3xl font-bold flex items-center gap-2">
							<Users className="h-8 w-8" />
							Contacts
						</h1>


						{/* TODO day view limit is here  */}
						<ViewsTodayBadge viewsLimit={50} />
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

				{contacts.length === 0 ? (
					<div className="text-center py-12 border rounded-lg">
						<p className="text-lg text-muted-foreground">No contacts found</p>
					</div>
				) : (
					<>
						<ContactTable contacts={contacts} />
						<ClientPagination currentPage={page} totalPages={totalPages} />
					</>
				)}
			</div>
		</ViewsProvider>
	);
}
