"use client";

import { PaginationControls } from "@/components/PaginationControls";

interface ClientPaginationProps {
	currentPage: number;
	totalPages: number;
}

export function ClientPagination({ currentPage, totalPages }: ClientPaginationProps) {

	return (
		<div className="flex justify-center" >
			<PaginationControls
				currentPage={currentPage}
				totalPages={totalPages}
			/>
		</div>
	);
}