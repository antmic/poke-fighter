// app/api/search-hints/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const query = searchParams.get('query');

	if (!query) {
		return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
	}

	try {
		const result = await pool.query<{ name: string }>('SELECT name FROM pokemon WHERE name ILIKE $1 LIMIT 5', [
			`${query}%`,
		]);

		if (result.rows.length === 0) {
			return NextResponse.json({ hints: [], message: 'No Pokémon found' });
		}

		return NextResponse.json({ hints: result.rows.map(row => row.name), message: null });
	} catch (error) {
		console.error('Error executing query', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}
