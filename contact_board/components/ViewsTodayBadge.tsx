"use client";

import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";

interface ViewsTodayBadgeProps {
	viewsToday: number;
	viewsLimit: number;
}

export const ViewsTodayBadge = ({ viewsToday, viewsLimit }: ViewsTodayBadgeProps) => {
	const percentage = (viewsToday / viewsLimit) * 100;
	const isNearLimit = percentage >= 80;
	const atLimit = viewsToday >= viewsLimit;

	return (
		<Badge
			variant={atLimit ? "destructive" : isNearLimit ? "secondary" : "outline"}
			className="gap-1"
		>
			<Eye className="h-3 w-3" />
			Views today: {viewsToday}/{viewsLimit}
		</Badge>
	);
};
