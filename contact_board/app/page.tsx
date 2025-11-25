"use client"

import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { redirect } from 'next/navigation';

const Dashboard = () => {
	const dailyLimit = 50;

	return (
		<div className="space-y-6">
			{/* Quick Access */}
			<div className="grid gap-6 lg:grid-cols-2">
				<Card className="p-6 shadow-soft">
					<h3 className="text-lg font-display font-semibold mb-2">Agencies</h3>
					<p className="text-sm text-muted-foreground mb-4">
						View and manage all educational agencies in the database
					</p>
					<Button onClick={() => redirect("/agencies")} className="w-full">
						View All Agencies <ArrowRight className="ml-2 h-4 w-4" />
					</Button>
				</Card>

				<Card className="p-6 shadow-soft">
					<h3 className="text-lg font-display font-semibold mb-2">Contacts</h3>
					<p className="text-sm text-muted-foreground mb-4">
						Review contact information (daily limit: {dailyLimit} views)
					</p>
					<Button onClick={() => redirect("/contacts")} className="w-full">
						View All Contacts <ArrowRight className="ml-2 h-4 w-4" />
					</Button>
				</Card>
			</div>
		</div>
	);
};

export default Dashboard;