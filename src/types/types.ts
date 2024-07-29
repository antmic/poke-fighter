export interface SearchResponse {
	hints: string[];
	found: boolean;
}

export interface SearchState {
	hints: string[];
	message: string | null;
	isLoading: boolean;
}
