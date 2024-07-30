// src/app/api/pokedex/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const name = searchParams.get('name');

	if (!name) {
		return NextResponse.json({ error: 'Name query parameter is required' }, { status: 400 });
	}

	try {
		const result = await pool.query('SELECT * FROM pokemon WHERE name = $1', [name]);
		return NextResponse.json(result.rows[0]);
	} catch (error) {
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
	}
}
