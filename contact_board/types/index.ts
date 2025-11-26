export interface Agency {
	id: string;
	name: string;
	state: string;
	city: string;
	contactCount: number;
}

export interface Contact {
	id: string;
	firstName: string;
	lastName: string;
	title: string;
	department: string;
	agencyId: string;
	agencyName: string;
}

export interface ContactDetails extends Contact {
	email: string;
	phone: string;
}

export interface UserStats {
	viewsToday: number;
	viewsLimit: number;
}

export interface PaginatedResponse<T> {
	data: T[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface ApiError {
	error: string;
	code?: string;
}
