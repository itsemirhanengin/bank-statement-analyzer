import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMoney } from "@/lib/utils";
import { AnalysisResult } from "@/lib/schemas";
import { Coffee, Dumbbell, PiggyBank, Target } from "lucide-react";

type OptimizationOpportunitiesProps = {
  data: AnalysisResult;
};

export function OptimizationOpportunities({
  data,
}: OptimizationOpportunitiesProps) {
  const getOpportunityIcon = (type: string) => {
    switch (type) {
      case "coffee":
        return Coffee;
      case "gym":
        return Dumbbell;
      case "savings":
        return PiggyBank;
      case "entertainment":
        return Target;
      default:
        return Target;
    }
  };

  const getOpportunityColor = (type: string) => {
    switch (type) {
      case "coffee":
        return {
          bg: "bg-amber-100 dark:bg-amber-900/30",
          text: "text-amber-600 dark:text-amber-400",
        };
      case "gym":
        return {
          bg: "bg-purple-100 dark:bg-purple-900/30",
          text: "text-purple-600 dark:text-purple-400",
        };
      case "savings":
        return {
          bg: "bg-blue-100 dark:bg-blue-900/30",
          text: "text-blue-600 dark:text-blue-400",
        };
      case "entertainment":
        return {
          bg: "bg-green-100 dark:bg-green-900/30",
          text: "text-green-600 dark:text-green-400",
        };
      default:
        return {
          bg: "bg-gray-100 dark:bg-gray-900/30",
          text: "text-gray-600 dark:text-gray-400",
        };
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Optimization Opportunities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.opportunities.map((opportunity, index) => {
            const Icon = getOpportunityIcon(opportunity.type);
            const colors = getOpportunityColor(opportunity.type);
            return (
              <div key={index} className="border rounded-lg p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2 ${colors.bg} rounded-lg`}>
                    <Icon className={`w-5 h-5 ${colors.text}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{opportunity.title}</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      {opportunity.current}
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-green-600">
                        {formatMoney(opportunity.savings, data.currency)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        potential savings
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {opportunity.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
