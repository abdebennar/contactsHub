
import { Agency, Contact, ContactDetails, UserStats, PaginatedResponse } from "@/types";

// Mock data storage


const mockAgencies: Agency[] = Array.from({ length: 50 }, (_, i) => ({
	id: `agency-${i + 1}`,
	name: `${['State', 'County', 'City', 'Regional', 'District'][i % 5]} Agency ${i + 1}`,
	state: ['CA', 'NY', 'TX', 'FL', 'IL', 'PA', 'OH'][i % 7],
	state_code: ['CA', 'NY', 'TX', 'FL', 'IL', 'PA', 'OH'][i % 7],
	website: `https://www.agency${i + 1}.gov`, // single string
	type: ['State', 'County', 'City', 'Regional', 'District'][i % 5],
}));


const mockContacts: Contact[] = Array.from({ length: 200 }, (_, i) => ({
	id: `contact-${i + 1}`,
	first_name: ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emma', 'Robert', 'Lisa'][i % 8],
	last_name: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'][i % 8],
	email: ['personal', 'work', 'other'][i % 3],
	title: ['Director', 'Manager', 'Coordinator', 'Specialist', 'Administrator'][i % 5],
	phone: ['personal', 'work', 'mobile'][i % 3],
	department: ['Operations', 'Finance', 'HR', 'IT', 'Legal', 'Communications'][i % 6],
	email_type: ['personal', 'work', 'other'][i % 3],
}));

// Mock viewed contacts tracking (simulated daily limit)
let viewedContactIds = new Set<string>();
let viewCount = 0;
const VIEW_LIMIT = 50;

// Reset views (simulates midnight reset)
export const resetViews = () => {
	viewedContactIds = new Set();
	viewCount = 0;
};

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApiClient = {
	// Get agencies with pagination and filters
	getAgencies: async (params: {
		page?: number;
		limit?: number;
		search?: string;
		state?: string;
	}): Promise<PaginatedResponse<Agency>> => {
		await delay(300);

		let filtered = [...mockAgencies];

		if (params.search) {
			const search = params.search.toLowerCase();
			filtered = filtered.filter(a =>
				a.name.toLowerCase().includes(search)
			);
		}

		if (params.state && params.state !== 'all') {
			filtered = filtered.filter(a => a.state === params.state);
		}

		const page = params.page || 1;
		const limit = params.limit || 20;
		const start = (page - 1) * limit;
		const end = start + limit;

		return {
			data: filtered.slice(start, end),
			total: filtered.length,
			page,
			limit,
			totalPages: Math.ceil(filtered.length / limit)
		};
	},

	// Get single agency
	getAgency: async (id: string): Promise<Agency | null> => {
		await delay(200);
		return mockAgencies.find(a => a.id === id) || null;
	},

	// Get contacts for an agency
	getContacts: async (params: {
		agencyId: string;
		page?: number;
		limit?: number;
		search?: string;
		department?: string;
	}): Promise<PaginatedResponse<Contact>> => {
		await delay(300);

		let filtered = mockContacts.filter(c => c.email === params.agencyId);

		if (params.search) {
			const search = params.search.toLowerCase();
			filtered = filtered.filter(c =>
				c.first_name.toLowerCase().includes(search) ||
				c.last_name.toLowerCase().includes(search) ||
				c.title.toLowerCase().includes(search)
			);
		}

		if (params.department && params.department !== 'all') {
			filtered = filtered.filter(c => c.department === params.department);
		}

		const page = params.page || 1;
		const limit = params.limit || 20;
		const start = (page - 1) * limit;
		const end = start + limit;

		return {
			data: filtered.slice(start, end),
			total: filtered.length,
			page,
			limit,
			totalPages: Math.ceil(filtered.length / limit)
		};
	},

	// Get contact details (protected with view limit)
	getContactDetails: async (id: string): Promise<{ data?: ContactDetails; error?: string; limitReached?: boolean }> => {
		await delay(400);

		const contact = mockContacts.find(c => c.id === id);
		if (!contact) {
			return { error: 'Contact not found' };
		}

		// Check if already viewed today (doesn't count against limit)
		if (viewedContactIds.has(id)) {
			const details: ContactDetails = {
				...contact,
				email: `${contact.first_name.toLowerCase()}.${contact.last_name.toLowerCase()}@agency.gov`,
				phone: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`
			};
			return { data: details };
		}

		// Check limit
		if (viewCount >= VIEW_LIMIT) {
			return { error: 'Daily view limit reached', limitReached: true };
		}

		// Record view
		viewedContactIds.add(id);
		viewCount++;

		const details: ContactDetails = {
			...contact,
			email: `${contact.first_name.toLowerCase()}.${contact.last_name.toLowerCase()}@agency.gov`,
			phone: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`
		};

		return { data: details };
	},

	// Get user stats
	getUserStats: async (): Promise<UserStats> => {
		await delay(100);
		return {
			viewsToday: viewCount,
			viewsLimit: VIEW_LIMIT
		};
	}
};
