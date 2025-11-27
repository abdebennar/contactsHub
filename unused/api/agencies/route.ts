import clientPromise from "@/lib/mongo";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	try {
		const client = await clientPromise;
		const db = client.db();
		
		const limit: string = req.nextUrl.searchParams.get("limit") || "10";
		const offset: string = req.nextUrl.searchParams.get("offset") || "0";
		console.log("Limit parameter:", limit);
		console.log("Offset parameter:", offset);


		
		const contacts = await db
		.collection("agencies_agency_rows")
		.find({})
		.limit(Number(limit))
		.skip(Number(offset))
		.toArray();
		
		console.log(contacts);

		return NextResponse.json({ success: true, data: contacts });
	} catch (error: any) {
		console.error("GET /api/contacts error:", error);
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}
