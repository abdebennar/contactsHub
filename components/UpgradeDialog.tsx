"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Clock } from "lucide-react";

interface UpgradeDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export const UpgradeDialog = ({ open, onOpenChange }: UpgradeDialogProps) => {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="text-2xl">Daily Limit Reached</DialogTitle>
					<DialogDescription>
						{"You've viewed 50 contacts today"}
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6">
					<div className="rounded-lg bg-muted/50 p-4">
						<p className="text-sm font-medium mb-3">Upgrade to Pro and get:</p>
						<ul className="space-y-2">
							{[
								'Unlimited contact views',
								'API access'
							].map((benefit) => (
								<li key={benefit} className="flex items-center gap-2 text-sm">
									<Check className="h-4 w-4 text-green-600" />
									<span>{benefit}</span>
								</li>
							))}
						</ul>
					</div>

					<div className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
						<Clock className="h-4 w-4" />
						<span>Your daily limit resets at midnight</span>
					</div>

					<div className="flex flex-col gap-2">
						<Button className="w-full" size="lg" disabled={true}>
							Upgrade to Pro
						</Button>
						<Button
							variant="outline"
							className="w-full"
							size="lg"
							onClick={() => onOpenChange(false)}
						>
							Maybe Later
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};