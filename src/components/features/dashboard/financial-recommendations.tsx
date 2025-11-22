import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AnalysisResult } from "@/lib/schemas";
import { PiggyBank } from "lucide-react";

type FinancialRecommendationsProps = {
  data: AnalysisResult;
};

export function FinancialRecommendations({
  data,
}: FinancialRecommendationsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-950">
          <PiggyBank className="w-4 h-4" />
          <AlertDescription>
            <strong>Emergency Fund:</strong>{" "}
            {data.insights.emergencyFundRecommendation}
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
