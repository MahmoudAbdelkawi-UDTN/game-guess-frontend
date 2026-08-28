import { format } from 'date-fns'
import { ChevronLeft, ChevronRight, Trophy } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { GameHistoryItem, PagedResult } from '@/types/api'

interface HistoryTableProps {
  history: PagedResult<GameHistoryItem>
  page: number
  onPageChange: (page: number) => void
}

export function HistoryTable({ history, page, onPageChange }: HistoryTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Game history</CardTitle>
      </CardHeader>
      <CardContent>
        {history.items.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No completed games in this range yet.
          </p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Completed</TableHead>
                    <TableHead className="text-right">Secret number</TableHead>
                    <TableHead className="text-right">Guesses</TableHead>
                    <TableHead className="text-right">Badge</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.items.map((item) => (
                    <TableRow key={item.gameId}>
                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {format(new Date(item.completedAt), 'MMM d, yyyy · h:mm a')}
                      </TableCell>
                      <TableCell className="text-right font-medium">{item.secretNumber}</TableCell>
                      <TableCell className="text-right">{item.guessCount}</TableCell>
                      <TableCell className="text-right">
                        {item.isPersonalBest && (
                          <Badge variant="secondary" className="gap-1 bg-primary/10 text-primary">
                            <Trophy className="size-3" />
                            Best
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {history.totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Page {history.page} of {history.totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => onPageChange(page - 1)}
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="size-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= history.totalPages}
                    onClick={() => onPageChange(page + 1)}
                    aria-label="Next page"
                  >
                    Next
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

export function HistoryTableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Game history</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </CardContent>
    </Card>
  )
}
