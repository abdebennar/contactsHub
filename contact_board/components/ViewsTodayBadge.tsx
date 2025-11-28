"use client";

import { Badge } from "@/components/ui/badge";
import { useViews } from "@/components/ViewsProvider";
import { Eye } from "lucide-react";

interface ViewsTodayBadgeProps {
	viewsLimit: number;
}

export const ViewsTodayBadge = ({ viewsLimit }: ViewsTodayBadgeProps) => {
	const { viewsToday } = useViews();
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


// "use client";

// import { useViews } from "@/components/ViewsProvider";

// interface ViewsTodayBadgeProps {
// 	viewsLimit: number;
// }

// export function ViewsTodayBadge({ viewsLimit }: ViewsTodayBadgeProps) {
// 	const { viewsToday } = useViews();

// 	return (
// 		<div className="flex items-center gap-2 px-3 py-1 bg-secondary rounded-md">
// 			<span className="text-sm font-medium">
// 				Views Today: {viewsToday} / {viewsLimit}
// 			</span>
// 		</div>
// 	);
// }