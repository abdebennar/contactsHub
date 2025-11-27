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

	const handlePageChange = (newPage: number): void => {
		const params = new URLSearchParams(searchParams.toString());
		params.set('page', newPage.toString());
		router.push(`?${params.toString()}`, { scroll: false });
	};

	const pages: number[] = [];
	const maxVisible: number = 5;

	let startPage: number = Math.max(1, currentPage - Math.floor(maxVisible / 2));
	const endPage: number = Math.min(totalPages, startPage + maxVisible - 1);

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
						onClick={(): void => { currentPage > 1 && handlePageChange(currentPage - 1); }}
						className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
						size="default"
					/>
				</PaginationItem>

				{pages.map((page: number) => (
					<PaginationItem key={page}>
						<PaginationLink
							onClick={(): void => handlePageChange(page)}
							isActive={page === currentPage}
							size={"default"}
							className="cursor-pointer"
						>
							{page}
						</PaginationLink>
					</PaginationItem>
				))}

				<PaginationItem>
					<PaginationNext
						onClick={(): void => { currentPage < totalPages && handlePageChange(currentPage + 1); }}
						className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
						size="default"
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
};