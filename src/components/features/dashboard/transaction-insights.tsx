import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnalysisResult } from "@/lib/schemas";

type TransactionInsightsProps = {
  data: AnalysisResult;
};

export function TransactionInsights({ data }: TransactionInsightsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.transactionInsights.map((transaction, index) => (
            <div key={index} className="p-3 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-mono text-muted-foreground">
                  {transaction.original}
                </span>
                <Badge>Decoded</Badge>
              </div>
              <p className="font-medium">{transaction.decoded}</p>
              <p className="text-sm text-muted-foreground">
                Category: {transaction.category}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
