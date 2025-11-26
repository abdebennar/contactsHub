import { Building2 } from "lucide-react";
import { AgencyTable } from "@/components/AgencyTable";
import { SearchInput } from "@/components/SearchInput";
import { PaginationControls } from "@/components/PaginationControls";
import { SelectStateFilter } from "./select-state-filter";
import { SkeletonTable } from "@/components/SkeletonTable";
import { mockApiClient } from "@/lib/mockApi";

export default async function AgenciesPage({ searchParams }: { searchParams: any }) {
  const page = parseInt(searchParams.page || "1");
  const search = searchParams.search || "";
  const state = searchParams.state || "all";

  const data = await mockApiClient.getAgencies({
    page,
    limit: 20,
    search,
    state: state === "all" ? undefined : state,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Building2 className="h-8 w-8" />
          Agencies
        </h1>
        <p className="text-muted-foreground mt-1">Browse government agencies and their contacts</p>
      </div>

      {/* Search + State Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchInput defaultValue={search} />
        <SelectStateFilter defaultValue={state} />
      </div>

      {/* Table */}
      {!data ? (
        <SkeletonTable columns={5} />
      ) : (
        <>
          <AgencyTable agencies={data.data} />
          <div className="flex justify-center">
            <PaginationControls currentPage={page} totalPages={data.totalPages} />
          </div>
        </>
      )}
    </div>
  );
}
