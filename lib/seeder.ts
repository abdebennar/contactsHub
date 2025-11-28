// lib/seeder.ts
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { Db } from 'mongodb';

// Helper to parse CSV and return data
const parseCSV = (filePath: string): Promise<any[]> => {
	return new Promise((resolve, reject) => {
		const records: any[] = [];
		// Use process.cwd() to find the file relative to the project root
		const fullPath = path.join(process.cwd(), filePath);

		if (!fs.existsSync(fullPath)) {
			console.warn(`⚠️ Data file not found: ${fullPath}`);
			resolve([]); // Return empty to avoid crashing, but log warning
			return;
		}

		fs.createReadStream(fullPath)
			.pipe(csv())
			.on('data', (row) => records.push(row))
			.on('end', () => resolve(records))
			.on('error', (err) => reject(err));
	});
};

export async function seedDatabase(db: Db) {
	console.log("🔄 Starting Database Seeding...");

	// 1. Seed Agencies
	const agenciesCol = db.collection("agencies_agency_rows");
	const agenciesCount = await agenciesCol.countDocuments();

	if (agenciesCount === 0) {
		console.log("   ↳ Seeding Agencies...");
		const agenciesData = await parseCSV('data/agencies_agency_rows.csv');
		if (agenciesData.length > 0) {
			await agenciesCol.insertMany(agenciesData);
			// Create index for faster searching
			await agenciesCol.createIndex({ name: 1 });
			await agenciesCol.createIndex({ state_code: 1 });
			console.log(`     ✓ Inserted ${agenciesData.length} agencies`);
		}
	} else {
		console.log("   ✓ Agencies collection already exists");
	}

	// 2. Seed Contacts
	const contactsCol = db.collection("contacts_contact_rows");
	const contactsCount = await contactsCol.countDocuments();

	if (contactsCount === 0) {
		console.log("   ↳ Seeding Contacts...");
		const contactsData = await parseCSV('data/contacts_contact_rows.csv');
		if (contactsData.length > 0) {
			await contactsCol.insertMany(contactsData);
			// Create indexes
			await contactsCol.createIndex({ id: 1 }, { unique: true });
			await contactsCol.createIndex({ first_name: 1, last_name: 1 });
			console.log(`     ✓ Inserted ${contactsData.length} contacts`);
		}
	} else {
		console.log("   ✓ Contacts collection already exists");
	}

	// 3. Ensure Users Collection Exists
	const usersCol = db.collection("users");
	// We don't seed users, but we ensure the index exists
	await usersCol.createIndex({ userId: 1 }, { unique: true });
	console.log("   ✓ Users collection configured");

	console.log("✅ Database Seeding Complete");
}