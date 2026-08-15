import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  hintClassName,
}: {
  label: string;
  value: string;
  hint?: string;
  hintClassName?: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        <p className="text-2xl font-semibold">{value}</p>
        {hint && <p className={cn("text-xs text-muted-foreground", hintClassName)}>{hint}</p>}
      </CardContent>
    </Card>
  );
}
