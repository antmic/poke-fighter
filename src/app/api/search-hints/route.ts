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
			const suggestions = await pool.query<{ name: string }>(
				'SELECT name FROM pokemon ORDER BY similarity(name, $1) DESC LIMIT 5',
				[query]
			);
			return NextResponse.json({
				hints: suggestions.rows.map(row => row.name),
				found: false,
			});
		}

		return NextResponse.json({ hints: result.rows.map(row => row.name), found: true, suggestions: [] });
	} catch (error) {
		console.error('Error executing query', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}
