export interface Agency {
	id: string;
	name: string;
	state: string;
	state_code: string;
	type: string;
	website: string;
}


export interface Contact {
	id: string;
	first_name: string;
	last_name: string;
	email: string;
	title: string;
	phone: string;
	email_type: string;
	department: string;
	// agencyId: string;
	// agencyName: string;
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
