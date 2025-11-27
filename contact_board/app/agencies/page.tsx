import { Building2 } from "lucide-react";
import { AgencyTable } from "@/components/AgencyTable";
import { SkeletonTable } from "@/components/SkeletonTable";
import { ClientPagination } from "@/components/ClientPagination";
import { SearchInput } from "@/components/SearchInput";
import { SelectStateFilter } from "@/components/SelectStateFilter";
import clientPromise from "@/lib/mongo";

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

	// Fetch data directly from MongoDB
	const client = await clientPromise;
	const db = client.db();

	// Build filter
	const filter: any = {};

	if (search) {
		filter.$or = [
			{ name: { $regex: search, $options: "i" } },
			{ county: { $regex: search, $options: "i" } },
		];
	}

	if (state !== "all") {
		filter.state_code = state;
	}

	// Get total count and data in parallel
	const [total, data] = await Promise.all([
		db.collection("agencies_agency_rows").countDocuments(filter),
		db
			.collection("agencies_agency_rows")
			.find(filter)
			.sort({ name: 1 })
			.limit(limit)
			.skip(offset)
			.toArray(),
	]);


	const agencies = data.map(agency => ({
		...agency,
		_id: agency._id.toString(),
	}));


	const totalPages = Math.ceil(total / limit);

	return (
		<div className="container mx-auto px-4 py-8 space-y-6">
			<div>
				<h1 className="text-3xl font-bold flex items-center gap-2">
					<Building2 className="h-8 w-8" />
					Agencies
				</h1>
				<p className="text-muted-foreground mt-1">
					Browse {total.toLocaleString()} government agencies and their contacts
				</p>
			</div>

			{/* Search + State Filter */}
			<div className="flex flex-col sm:flex-row gap-4">
				<SearchInput defaultValue={search} placeholder="Search agencies..." />
				{/* <SelectStateFilter defaultValue={state} /> */}
			</div>

			{/* Results count */}
			<div className="text-sm text-muted-foreground">
				Showing {agencies.length} of {total.toLocaleString()} agencies
				{search && ` matching "${search}"`}
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