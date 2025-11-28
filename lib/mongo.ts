import { MongoClient } from "mongodb";

if (!process.env.MONGO_URI) throw new Error("❌ MONGO_URI not defined");

const uri = process.env.MONGO_URI;

let clientPromise: Promise<MongoClient>;

// Track connection state
// let isConnected = false;
const options = {
	tls: true,
	tlsAllowInvalidCertificates: true,
	serverSelectionTimeoutMS: 5000,
	socketTimeoutMS: 45000,
};


declare global {
	var _mongoClientPromise: Promise<MongoClient> | undefined;
	var _mongoConnected: boolean | undefined;
}

async function connectClient() {
	try {
		const client = new MongoClient(uri, options);
		await client.connect();

		global._mongoConnected = true;

		return client;
	} catch (err) {
		console.error("❌ MongoDB Connection Failed:", err);
		global._mongoConnected = false;
		throw err;
	}
}

if (process.env.NODE_ENV === "development") {
	if (!global._mongoClientPromise) {
		global._mongoClientPromise = connectClient();
	}
	clientPromise = global._mongoClientPromise;
} else {
	clientPromise = connectClient();
}

// Helper to check connection state in API routes
export function isDbConnected() {
	return global._mongoConnected === true;
}

export default clientPromise;
