import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import prisma from '$lib/server/util/prisma';

import { createCanvas, GlobalFonts } from '@napi-rs/canvas';

export const GET: RequestHandler = async ({ params, url }) => {
	const { id } = params;
	const size = parseInt(url.searchParams.get('size') || '100');

	if (!id) {
		throw error(400, 'Missing id');
	}

	if (isNaN(size)) {
		throw error(400, 'Invalid size');
	}

	const person = await prisma.person.findUnique({
		where: {
			id
		}
	});

	if (!person) {
		throw error(404, 'Person not found');
	}

	const user = await prisma.user.findUnique({
		where: {
			email: person.email
		}
	});

	// Return either the default image or an image with initials
	if (user?.image) {
		// Fetch the image but replace the size
		const response = await fetch(user.image.replace(/=s\d+-c$/, `=s${size}-c`));
		const buffer = await response.arrayBuffer();

		return new Response(buffer, {
			headers: {
				'Content-Type': 'image/png',
				'Cache-Control': 's-maxage=300, public'
			}
		});
	} else {
		const canvas = createCanvas(size, size);
		const context = canvas.getContext('2d');

		const backgroundColors = [
			'#003366',
			'#990000',
			'#006600',
			'#663399',
			'#993366',
			'#003300',
			'#660066',
			'#333399',
			'#FF6600',
			'#333333'
		];

		// Randomly select a background color seeded by the person's id
		const backgroundColor =
			backgroundColors[
				id.split('').reduce((a, b) => a + b.charCodeAt(0), 0) % backgroundColors.length
			];

		context.fillStyle = backgroundColor;
		context.fillRect(0, 0, size, size);

		context.fillStyle = '#fff';

		// Load the custom font file
		GlobalFonts.registerFromPath('src/lib/assets/fonts/heebo.ttf', 'Heebo');

		// Set the font for the canvas context
		context.font = `${size / 2.3}px 'Heebo', sans-serif`;
		context.textAlign = 'center';
		context.textBaseline = 'middle';
		context.fillText(
			person.name
				.split(' ')
				.map((a) => a[0])
				.join(''),
			size / 2,
			size / 2 + size / 45
		);

		const buffer = canvas.toBuffer('image/png');

		return new Response(buffer, {
			headers: {
				'Content-Type': 'image/png',
				'Cache-Control': 's-maxage=300, public'
			}
		});
	}
};
