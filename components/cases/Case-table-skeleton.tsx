import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function CaseListTableSkeleton() {
  return (
    <div className="space-y-3">
      <div className="overflow-hidden bg-card border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b bg-muted/30">
              <TableHead className="font-semibold text-muted-foreground text-xs">PATIENT INFO</TableHead>
              <TableHead className="font-semibold text-muted-foreground text-xs">STUDY ID</TableHead>
              <TableHead className="font-semibold text-muted-foreground text-xs">STUDY DATE</TableHead>
              <TableHead className="font-semibold text-muted-foreground text-xs">MODALITY</TableHead>
              <TableHead className="font-semibold text-muted-foreground text-xs">STATUS</TableHead>
              <TableHead className="font-semibold text-muted-foreground text-xs text-right">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 7 }).map((_, i) => (
              <TableRow key={i} className="hover:bg-muted/40 border-b">
                {/* Patient info skeleton */}
                <TableCell className="text-foreground">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                </TableCell>

                {/* Study ID skeleton */}
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>

                {/* Study date skeleton */}
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>

                {/* Modality skeleton */}
                <TableCell>
                  <Skeleton className="h-6 w-24 rounded" />
                </TableCell>

                {/* Status skeleton */}
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <Skeleton className="h-2 w-2 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded" />
                  </div>
                </TableCell>

                {/* Action button skeleton */}
                <TableCell className="text-right">
                  <Skeleton className="h-8 w-20 rounded ml-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded" />
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-8 rounded" />
          ))}
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </div>
    </div>
  )
}
