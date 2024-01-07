import { prismaRoles, type RoleString } from '$lib/util/person/role/roles';
import { QuizType } from '@prisma/client';
import { defaultPermissions } from '../permission/defaultPermissions';
import prisma from '../prisma';

export async function addPerson(name: string, email: string, role: RoleString, teamAffiliated: boolean) {
	const person = await prisma.person.create({ data: { name, email, role: prismaRoles[role], teamAffiliated } });

	// Add default permissions
	await prisma.permission.createMany({
		data: defaultPermissions.map((permission) => ({
			personId: person.id,
			path: permission,
		}))
	});

	// Assign existing lab certification quiz submissions
	await prisma.quizSubmission.updateMany({
		where: {
			submitterEmail: email,
		},
		data: {
			submitterId: person.id,
			submitterEmail: null,
		}
	});

	// Update lab certification based on quiz scores
	const minScores = [
		{
			quizType: QuizType.SAFETY_QUIZ,
			minScore: 80,
			applyCertification: 'safetyQuiz',
		},
		{
			quizType: QuizType.LAB_LAYOUT_EMERGENCY_PREPAREDNESS,
			minScore: 90,
			applyCertification: 'labLayoutEmergencyPreparedness',
		},
	];

	for (const minScore of minScores) {
		const submission = await prisma.quizSubmission.findFirst({
			where: {
				submitterId: person.id,
				quizType: minScore.quizType,
			},
			select: {
				id: true,
				score: true,
				maxScore: true,
			},
			orderBy: {
				timestamp: 'desc',
			},
		});

		if (submission && submission.score / submission.maxScore >= minScore.minScore / 100) {
			await prisma.labCertification.upsert({
				where: {
					personId: person.id,
				},
				update: {
					[minScore.applyCertification]: true,
				},
				create: {
					personId: person.id,
					[minScore.applyCertification]: true,
				},
			})
		}
	}

	return person;
}
