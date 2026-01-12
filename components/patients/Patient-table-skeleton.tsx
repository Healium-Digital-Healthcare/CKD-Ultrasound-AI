"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

export function PatientListTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="overflow-hidden bg-card border">
        <Table>
          <TableHeader>
            <TableRow className="border-b bg-muted/30 hover:bg-transparent">
              <TableHead className="font-semibold text-muted-foreground h-10">PATIENT INFO</TableHead>
              <TableHead className="font-semibold text-muted-foreground">MRN / ID</TableHead>
              <TableHead className="font-semibold text-muted-foreground">LAST SCAN DATE</TableHead>
              <TableHead className="font-semibold text-muted-foreground">MODALITY</TableHead>
              <TableHead className="font-semibold text-muted-foreground text-center">EGFR</TableHead>
              <TableHead className="font-semibold text-muted-foreground">STATUS</TableHead>
              <TableHead className="font-semibold text-muted-foreground text-right">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 6 }).map((_, index) => (
              <TableRow key={index} className="border-b hover:bg-muted/50 h-16">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-20 rounded-md" />
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="h-4 w-12 mx-auto" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-24 rounded-md" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-8 w-20 rounded ml-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
