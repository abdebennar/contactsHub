"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationControlsProps {
	currentPage: number;
	totalPages: number;
}

export const PaginationControls = ({ currentPage, totalPages }: PaginationControlsProps) => {
	const router = useRouter();
	const searchParams = useSearchParams();

	if (totalPages <= 1) return null;

	const handlePageChange = (newPage: number) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set('page', newPage.toString());
		router.push(`?${params.toString()}`, { scroll: false });
	};

	const pages = [];
	const maxVisible = 5;

	let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
	let endPage = Math.min(totalPages, startPage + maxVisible - 1);

	if (endPage - startPage < maxVisible - 1) {
		startPage = Math.max(1, endPage - maxVisible + 1);
	}

	for (let i = startPage; i <= endPage; i++) {
		pages.push(i);
	}

	return (
		<Pagination>
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious
						onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
						className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
					/>
				</PaginationItem>

				{pages.map((page) => (
					<PaginationItem key={page}>
						<PaginationLink
							onClick={() => handlePageChange(page)}
							isActive={page === currentPage}
							className="cursor-pointer"
						>
							{page}
						</PaginationLink>
					</PaginationItem>
				))}

				<PaginationItem>
					<PaginationNext
						onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
						className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
};