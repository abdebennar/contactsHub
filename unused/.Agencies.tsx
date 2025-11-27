import { useQuery } from "@tanstack/react-query";
import { mockApiClient } from "@/lib/mockApi";
import { useQueryParams } from "@/hooks/useQueryParams";
import { AgencyTable } from "@/components/AgencyTable";
import { SearchInput } from "@/components/SearchInput";
import { SkeletonTable } from "@/components/SkeletonTable";
import { PaginationControls } from "@/components/PaginationControls";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2 } from "lucide-react";

const STATES = ['CA', 'NY', 'TX', 'FL', 'IL', 'PA', 'OH'];

const Agencies = () => {
  const { getParam, setParam, setParams } = useQueryParams();
  
  const page = parseInt(getParam('page') || '1');
  const search = getParam('search') || '';
  const state = getParam('state') || 'all';

  const { data, isLoading } = useQuery({
    queryKey: ['agencies', page, search, state],
    queryFn: () => mockApiClient.getAgencies({
      page,
      limit: 20,
      search,
      state: state === 'all' ? undefined : state
    })
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

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchInput
            value={search}
            onChange={(value) => setParams({ search: value, page: '1' })}
            placeholder="Search agencies..."
          />
        </div>
        <Select
          value={state}
          onValueChange={(value) => setParams({ state: value, page: '1' })}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by state" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All States</SelectItem>
            {STATES.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <SkeletonTable columns={5} />
      ) : data ? (
        <>
          <AgencyTable agencies={data.data} />
          <div className="flex justify-center">
            <PaginationControls
              currentPage={page}
              totalPages={data.totalPages}
              onPageChange={(newPage) => setParam('page', newPage.toString())}
            />
          </div>
        </>
      ) : null}
    </div>
  );
};

export default Agencies;
