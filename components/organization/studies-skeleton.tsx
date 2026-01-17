"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function StudiesSkeleton() {
  return (
    <div className="flex-1 overflow-auto px-4 py-3">
      <div className="bg-card rounded-lg border overflow-hidden">
        <div className="px-6 py-3 border-b border-border flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Today&apos;s Studies</h2>
          <Skeleton className="h-4 w-24" />
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="px-6 py-3">Patient</TableHead>
              <TableHead className="px-6 py-3">Study ID</TableHead>
              <TableHead className="px-6 py-3">CKD Stage</TableHead>
              <TableHead className="px-6 py-3">Risk</TableHead>
              <TableHead className="px-6 py-3">eGFR</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 10 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell className="px-6 py-4">
                  <Skeleton className="h-6 w-24 rounded-full" />
                </TableCell>
                <TableCell className="px-6 py-4">
                  <Skeleton className="h-4 w-8" />
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <Skeleton className="h-4 w-12 ml-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
