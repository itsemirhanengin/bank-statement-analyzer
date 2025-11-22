import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";
import { Calendar, Clock } from "lucide-react";
import { AnalysisResult } from "@/lib/schemas";

const chartConfig = {
  amount: { label: "Amount" },
} satisfies ChartConfig;

type SpendingTrendsProps = {
  data: AnalysisResult;
};

export function SpendingTrends({ data }: SpendingTrendsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending Behavior Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-4">Spending by Day of Week</h4>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart data={data.weekdaySpending}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="amount" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Alert>
              <Calendar className="w-4 h-4" />
              <AlertDescription>
                <strong>Weekend Pattern:</strong> {data.insights.weekendPattern}
              </AlertDescription>
            </Alert>
            <Alert>
              <Clock className="w-4 h-4" />
              <AlertDescription>
                <strong>Peak Hours:</strong> {data.insights.peakHours}
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
