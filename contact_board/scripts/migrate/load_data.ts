import fs from 'fs';
import csv from 'csv-parser';
import { MongoClient } from 'mongodb';
import path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const importCSV = async (filePath: string, dbName: string, collectionName: string) => {
	const client = new MongoClient(process.env.MONGO_URI!);

	await client.connect();
	const collection = client.db(dbName).collection(collectionName);

	const records: any[] = [];

	fs.createReadStream(filePath)
		.pipe(csv())
		.on('data', (row) => records.push(row))
		.on('end', async () => {
			await collection.insertMany(records);
			console.log(`✓ Imported ${records.length} records`);
			await client.close();
		});
};

// Usage
importCSV('./data/agencies_agency_rows.csv', 'abdebennar', 'agencies_agency_rows');
importCSV('./data/contacts_contact_rows.csv', 'abdebennar', 'contacts_contact_rows');