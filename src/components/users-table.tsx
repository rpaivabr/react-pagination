import { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import httpClient from "@/lib/http-client";

export interface PaginatedResponse<T> {
  first: 1,
  prev: null,
  next: 2,
  last: 2,
  pages: 2,
  items: 15,
  data: T[];
}

export interface User {
  id: number;
  nomeCompleto: string;
  cidadeId: number;
  email: string;
}

export function UsersTable() {
  const [paginatedResponse, setPaginatedResponse] = useState<PaginatedResponse<User>>();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const isLoading = !paginatedResponse;
  const users = paginatedResponse?.data || [];
  const totalPages = paginatedResponse?.pages || 0;

  useEffect(() => {
    httpClient.get(`/users?_page=${currentPage}&_per_page=${itemsPerPage}`)
      .then(response => {
        setPaginatedResponse(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      })
  }, [currentPage]);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Id</TableHead>
            <TableHead>Nome Completo</TableHead>
            <TableHead>Cidade</TableHead>
            <TableHead className="text-right">Email</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.id}</TableCell>
              <TableCell>{user.nomeCompleto}</TableCell>
              <TableCell>{user.cidadeId}</TableCell>
              <TableCell className="text-right">{user.email}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">$2,500.00</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      <div className="mt-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink 
                  onClick={() => setCurrentPage(index + 1)}
                  isActive={currentPage === index + 1}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}

