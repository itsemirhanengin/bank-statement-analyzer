import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatMoney } from "@/lib/utils";
import { AnalysisResult } from "@/lib/schemas";

type SubscriptionListProps = {
  data: AnalysisResult;
};

export function SubscriptionList({ data }: SubscriptionListProps) {
  const monthlySubscriptions = data.subscriptions.reduce(
    (sum, sub) => sum + sub.amount,
    0
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Tracking</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">Total Monthly Cost</p>
          <p className="text-3xl font-bold text-primary">
            {formatMoney(monthlySubscriptions, data.currency)}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {formatMoney(monthlySubscriptions * 12, data.currency)} per year
          </p>
        </div>
        <div className="space-y-3">
          {data.subscriptions.map((sub) => (
            <div
              key={sub.name}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div>
                <p className="font-medium">{sub.name}</p>
                <Badge variant="secondary" className="mt-1">
                  {sub.category}
                </Badge>
              </div>
              <p className="font-semibold">
                {formatMoney(sub.amount, data.currency)}/mo
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
