import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalysisResult } from "@/lib/schemas";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

type ScoreImprovementProps = {
  data: AnalysisResult;
};

export function ScoreImprovement({ data }: ScoreImprovementProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Improve Your Financial Score</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.scoreImprovements.map((improvement, index) => {
            const Icon =
              improvement.type === "up" ? ArrowUpRight : ArrowDownRight;
            const iconColor =
              improvement.type === "up" ? "text-green-600" : "text-orange-600";
            return (
              <div key={index} className="flex items-start gap-4">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">
                  +{improvement.points}
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{improvement.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {improvement.description}
                  </p>
                </div>
                <Icon className={`w-4 h-4 ${iconColor} shrink-0`} />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
