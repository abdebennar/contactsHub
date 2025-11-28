// lib/bootstrap.ts
import clientPromise from "@/lib/mongo";
import { seedDatabase } from "@/lib/seeder";

const REQUIRED_ENV_VARS = [
	"MONGO_URI",
	"NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
	"CLERK_SECRET_KEY",
	"MONGO_URI"
];

export async function bootstrap() {
	console.log("----------------------------------------");
	console.log("🚀 Starting System Check...");

	const missingVars = REQUIRED_ENV_VARS.filter(key => !process.env[key]);

	if (missingVars.length > 0) {
		console.error("❌ CRITICAL ERROR: Missing environment variables:");
		missingVars.forEach(v => console.error(`   - ${v}`));
		process.exit(1);
	}
	console.log("✅ Environment variables verified");


	try {
		const client = await clientPromise;
		await client.db().command({ ping: 1 });
		console.log("✅ MongoDB connection established");

		const db = client.db();
		await seedDatabase(db);

	} catch (error) {
		console.error("❌ CRITICAL DATABASE ERROR:");
		console.error(error);
		process.exit(1);
	}

	console.log("🚀 System Check Passed. App Starting...");
	console.log("----------------------------------------");
}