import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AppIcon from "./AppIcon";
import Link from "next/link";

export default function AppCard({
  cardTitle,
  cardContent,
  cardSubtitle,
  cardIcon,
  cardLink = "#",
  contentStyles
}) {
  return (
    <Link  href={cardLink}>
      <Card className="cursor-pointer md:hover:scale-105 transition-all ease-in-out w-full">
        <CardHeader className="flex flex-row items-center justify-between flex-wrap space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{cardTitle}</CardTitle>
          <AppIcon icon={cardIcon} className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${contentStyles}`}>{cardContent}</div>
          <p className="text-xs text-muted-foreground">{cardSubtitle}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
