"use client";

import { PaginationControls } from "@/components/PaginationControls";
import { useRouter, useSearchParams } from "next/navigation";

interface ClientPaginationProps {
	currentPage: number;
	totalPages: number;
}

export function ClientPagination({ currentPage, totalPages }: ClientPaginationProps) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const handlePageChange = (newPage: number) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set('page', newPage.toString());
		router.push(`?${params.toString()}`);
	};

	return (
		<div className="flex justify-center" >
			<PaginationControls
				currentPage={currentPage}
				totalPages={totalPages}
			// onPageChange={handlePageChange}
			/>
		</div>
	);
}