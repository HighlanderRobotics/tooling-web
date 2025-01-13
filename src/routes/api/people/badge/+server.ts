import prisma from '$lib/server/util/prisma';
import { error, RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, request }) => {
	const { searchParams } = new URL(url);
	const payload = searchParams.get('payload');

	if (!payload) {
		throw error(400, 'No payload provided');
	}

	const key = request.headers.get('Authorization')?.substring(7);
	if (!key) {
		throw error(401, 'No key provided');
	}

	const row = await prisma.kioskKey.findFirst({
		where: {
			key: key
		}
	});

	if (!row) {
		throw error(401, 'Invalid key');
	}

	const person = await prisma.person.findFirst({
		where: {
			badges: {
				some: {
					payload: payload
				}
			}
		}
	});

	if (!person) {
		throw error(404, 'Badge not found');
	}

	return new Response(JSON.stringify({ person }), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
};

export const OPTIONS: RequestHandler = async () =>
	new Response(null, {
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type, Authorization'
		}
	});
