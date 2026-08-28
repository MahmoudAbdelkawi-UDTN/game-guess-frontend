import { format } from 'date-fns'
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'
import { Skeleton } from '@/components/ui/skeleton'
import type { TopGame } from '@/types/api'

const chartConfig = {
  guessCount: {
    label: 'Guesses',
    color: 'var(--color-primary)',
  },
} satisfies ChartConfig

interface TopGamesChartProps {
  topGames: TopGame[]
}

export function TopGamesChart({ topGames }: TopGamesChartProps) {
  if (topGames.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top 3 best games</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="py-8 text-center text-sm text-muted-foreground">
            No completed games yet - finish a game to see your best runs here.
          </p>
        </CardContent>
      </Card>
    )
  }

  const data = topGames.map((game, index) => ({
    rank: `#${index + 1}`,
    guessCount: game.guessCount,
    completedAt: game.completedAt,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 3 best games</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[180px] w-full">
          <BarChart data={data} layout="vertical" margin={{ left: 8, right: 64 }}>
            <CartesianGrid horizontal={false} strokeDasharray="3 3" />
            <XAxis type="number" hide allowDecimals={false} />
            <YAxis type="category" dataKey="rank" tickLine={false} axisLine={false} width={28} />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(_, payload) =>
                    payload[0] ? format(new Date(payload[0].payload.completedAt as string), 'MMM d, yyyy') : ''
                  }
                />
              }
            />
            <Bar dataKey="guessCount" fill="var(--color-guessCount)" radius={6} barSize={28}>
              <LabelList
                dataKey="guessCount"
                position="right"
                formatter={(value) => `${value} ${value === 1 ? 'guess' : 'guesses'}`}
                className="fill-foreground text-xs font-medium"
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function TopGamesChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 3 best games</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3" aria-hidden="true">
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-4/5" />
        <Skeleton className="h-9 w-3/5" />
      </CardContent>
    </Card>
  )
}
