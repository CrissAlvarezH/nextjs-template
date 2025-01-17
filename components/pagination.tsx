"use client";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useRouter, useSearchParams } from "next/navigation";

export function Paginator({ totalPages }: { totalPages: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const paginate = (pageNumber: number) => {
    router.push(`?page=${pageNumber}`);
  };

  return (
    <Pagination className="mt-8">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={`?page=${currentPage > 1 ? currentPage - 1 : 1}`}
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) paginate(currentPage - 1);
            }}
          />
        </PaginationItem>
        {Array.from({ length: totalPages }, (_, i) => (
          <PaginationItem key={i + 1}>
            <PaginationLink
              href={`?page=${i + 1}`}
              isActive={currentPage === i + 1}
              onClick={(e) => {
                e.preventDefault();
                paginate(i + 1);
              }}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            href={`?page=${currentPage < totalPages ? currentPage + 1 : totalPages}`}
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) paginate(currentPage + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
