import { Building2 } from "lucide-react";
import { Filter } from "mongodb";
import { AgencyTable } from "@/components/AgencyTable";
import { ClientPagination } from "@/components/ClientPagination";
import clientPromise from "@/lib/mongo";
import { Agency } from "@/types";

interface PageProps {
	searchParams: Promise<{
		page?: string;
		search?: string;
		state?: string;
	}>;
}

export default async function AgenciesPage({ searchParams }: PageProps) {
	const params = await searchParams;

	const page = parseInt(params.page || "1");
	const search = params.search || "";
	const state = params.state || "all";
	const limit = 20;
	const offset = (page - 1) * limit;




	const client = await clientPromise;
	const db = client.db();

	// Build filter
	const filter: Filter<Agency> = {};

	if (search) {
		filter.$or = [
			{ name: { $regex: search, $options: "i" } },
			{ county: { $regex: search, $options: "i" } },
		];
	}

	if (state !== "all") {
		filter.state_code = state;
	}

	const [total, data] = await Promise.all([
		db.collection<Agency>("agencies_agency_rows").countDocuments(filter),
		db
			.collection<Agency>("agencies_agency_rows")
			.find(filter, { projection: { _id: 0 } })
			.sort({ name: 1 })
			.limit(limit)
			.skip(offset)
			.toArray()
	]);

	const agencies: Agency[] = data as Agency[];
	const totalPages = Math.ceil(total / limit);

	return (
		<div className="container mx-auto px-4 py-8 space-y-6">
			<div>
				<h1 className="text-3xl font-bold flex items-center gap-2">
					<Building2 className="h-8 w-8" />
					Agencies
				</h1>
				<div className="flex justify-between items-center mt-1 text-muted-foreground">
					<p>
						Browse {total.toLocaleString()} government agencies and their contacts
					</p>
					<p className="text-sm">
						Showing {agencies.length * page} of {total.toLocaleString()} agencies
					</p>
				</div>

			</div>

			{agencies.length === 0 ? (
				<div className="text-center py-12 border rounded-lg">
					<p className="text-lg text-muted-foreground">No agencies found</p>
					<p className="text-sm text-muted-foreground mt-2">
						Try adjusting your search or filters
					</p>
				</div>
			) : (
				<>
					<AgencyTable agencies={agencies} />
					<ClientPagination currentPage={page} totalPages={totalPages} />
				</>
			)}
		</div>
	);
}