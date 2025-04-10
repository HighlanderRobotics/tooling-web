import { getPersonByEmail } from '$lib/server/util/person/getPersonByEmail.js';
import { getPersonFromUser } from '$lib/server/util/person/getPersonFromUser';
import prisma from '$lib/server/util/prisma.js';
import { QuizType } from '@prisma/client';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';
import {
	QuestionType,
	type Question,
	type ServerQuestion
} from '$lib/util/lab-certification/quizzes.js';

export const _questions: ServerQuestion<string | string[]>[] = [
	{
		id: 'what-do-you-do',
		readableName: 'What do you do in the event of an emergency?',
		type: QuestionType.MULTI_SELECT,
		answers: {
			'call-911': 'Call 911 if needed',
			'run-away': 'Run away screaming',
			'notify-mentor': 'Notify the acting mentor immediately',
			nothing: 'Nothing'
		},
		correctAnswer: ['call-911', 'notify-mentor']
	},
	{
		id: 'where-fire-extinguishers',
		readableName: 'Where are the Fire Extinguishers?',
		type: QuestionType.MULTI_SELECT,
		answers: {
			'door-husky': 'By the door',
			cnc: 'Next to the CNC',
			husky: 'Next to the Husky',
			laser: 'Next to the laser (laser only!)'
		},
		correctAnswer: ['door-husky', 'husky', 'laser']
	},
	{
		id: 'close-calls',
		readableName: 'Should you report any injuries or "close calls" with tool use?',
		type: QuestionType.SINGLE_SELECT,
		answers: {
			yes: 'Yes',
			no: 'No'
		},
		correctAnswer: 'yes'
	},
	{
		id: 'tool-location',
		readableName: 'Where are tools located and who do they belong to?',
		type: QuestionType.MULTI_SELECT,
		answers: {
			'school-tools': 'School tools are in the cabinets and wall and are limited to class use',
			everyone: 'The tools are open to everyone',
			wherever: 'Tools go wherever you feel like',
			robotics:
				'Highlander Robotics tools are located in the team Husky and shed and are limited to robotics use'
		},
		correctAnswer: ['school-tools', 'robotics']
	},
	{
		id: 'first-aid-kit',
		readableName: 'Where is the first-aid kit located?',
		type: QuestionType.SINGLE_SELECT,
		answers: {
			'backpack-husky': 'In the red backpack, in the Husky, and by the sink',
			'fire-extinguisher': 'Next to the fire extinguisher',
			tables: 'In one of the tables and in the shed'
		},
		correctAnswer: 'backpack-husky'
	},
	{
		id: 'earthquake-fire',
		readableName: 'What should you do in the event of an earthquake or fire?',
		type: QuestionType.SINGLE_SELECT,
		answers: {
			'alert-mentor': 'Alert a mentor',
			'alert-mentor-exit': 'Alert a mentor and exit the building',
			continue: "If it's safe, continue working"
		},
		correctAnswer: 'alert-mentor-exit'
	},
	{
		id: 'put-away-tools',
		readableName: 'How do you put away tools?',
		type: QuestionType.SINGLE_SELECT,
		answers: {
			quickly: 'Quickly',
			wherever: 'Wherever you think it should go',
			'proper-location': "In the proper location, asking if you don't know",
			'where-found': 'Back where you got it'
		},
		correctAnswer: 'proper-location'
	},
	{
		id: 'leaving-lab',
		readableName: 'What are the most important things to do before leaving the lab?',
		type: QuestionType.MULTI_SELECT,
		answers: {
			'finishing-project': 'Finishing your project',
			'cleaning-checklist':
				'Making sure the cleaning checklist is completed and the lab is in proper condition',
			'doors-locked': 'Making sure the doors are locked',
			'leave-project-out': 'Leaving your project out so you can work on it next time you come in',
			'machinery-off': 'Ensure all machinery is off'
		},
		correctAnswer: ['cleaning-checklist', 'doors-locked', 'machinery-off']
	},
	{
		id: 'cabinet-locked',
		readableName: 'If a cabinet is locked, what should you do?',
		type: QuestionType.SINGLE_SELECT,
		answers: {
			'steal-key': 'Steal a key and unlock it',
			force: 'Try and force it open',
			ask: 'Ask a supervisor/mentor or lead to unlock it'
		},
		correctAnswer: 'ask'
	},
	{
		id: 'what-do-you-need',
		readableName: 'What do you need to be able to work in the lab?',
		type: QuestionType.SINGLE_SELECT,
		answers: {
			'certified-adult': 'A certified adult to act as supervision',
			friends: 'Some friends',
			food: 'Food'
		},
		correctAnswer: 'certified-adult'
	}
];

export const _clientQuestions: Question<string | string[]>[] = _questions.map((q) => ({
	id: q.id,
	readableName: q.readableName,
	type: q.type,
	answers: q.answers
}));

export const load = (async () => {
	return {
		questions: _clientQuestions
	};
}) satisfies PageServerLoad;

const correctAnswers: Record<string, string | string[]> = Object.fromEntries(
	_questions.map((q) => [q.id, q.correctAnswer])
);

export const actions = {
	default: async (event) => {
		const session = await event.locals.getSession();

		const data = await event.request.formData();

		let person = null;
		if (session?.user) {
			person = await getPersonFromUser(session?.user);
		} else {
			const email = data.get('email')?.toString();

			if (!email) {
				throw error(400, 'No email provided');
			}

			person = await getPersonByEmail(email);
		}

		const answers: Record<string, string | string[]> = {};
		for (const [key, value] of data.entries()) {
			if (!key.includes('__')) {
				if (!correctAnswers[key]) {
					// It's the email or something else we don't care about
					continue;
				}
				answers[key] = value.toString();
			} else {
				const [question, answer] = key.split('__');

				if (!correctAnswers[question]) {
					// It's the email or something else we don't care about
					continue;
				}

				if (!answers[question]) {
					answers[question] = [];
				}

				if (value.toString() === 'on') {
					(answers[question] as string[]).push(answer);
				}
			}
		}

		let score = 0;
		let total = 0;
		const incorrectQuestions: string[] = [];

		for (const [question, correctAnswer] of Object.entries(correctAnswers)) {
			if (Array.isArray(correctAnswer)) {
				total++;
				let correct = true;
				for (const a of correctAnswer) {
					if (!answers[question].includes(a)) {
						correct = false;
					}
				}
				for (const a of answers[question]) {
					if (!correctAnswer.includes(a)) {
						correct = false;
					}
				}
				if (correct) {
					score++;
				} else {
					incorrectQuestions.push(question);
				}
			} else {
				total++;
				if (answers[question] === correctAnswer) {
					score++;
				} else {
					incorrectQuestions.push(question);
				}
			}
		}

		if (!person && !data.get('email')) {
			throw error(400, 'No email provided');
		}

		await prisma.quizSubmission.create({
			data: {
				quizType: QuizType.LAB_LAYOUT_EMERGENCY_PREPAREDNESS,
				submitterId: person?.id,
				submitterEmail: !person ? data.get('email')?.toString() : undefined,
				answers: JSON.stringify(answers),
				score,
				maxScore: total
			}
		});

		const percent = Math.round((score / total) * 100);

		if (percent >= 90) {
			if (person) {
				await prisma.person.update({
					where: {
						id: person.id
					},
					include: {
						labCertification: true
					},
					data: {
						labCertification: {
							upsert: {
								create: {
									labLayoutEmergencyPreparedness: true
								},
								update: {
									labLayoutEmergencyPreparedness: true
								}
							}
						}
					}
				});
			}

			throw redirect(
				303,
				`/tools/lab-certification/quizzes/lab-layout-emergency-preparedness/pass?score=${encodeURIComponent(
					score
				)}&total=${encodeURIComponent(total)}&incorrect=${encodeURIComponent(
					JSON.stringify(incorrectQuestions)
				)}`
			);
		} else {
			if (person) {
				await prisma.person.update({
					where: {
						id: person.id
					},
					include: {
						labCertification: true
					},
					data: {
						labCertification: {
							upsert: {
								create: {
									labLayoutEmergencyPreparedness: false
								},
								update: {
									labLayoutEmergencyPreparedness: false
								}
							}
						}
					}
				});
			}

			throw redirect(
				303,
				`/tools/lab-certification/quizzes/lab-layout-emergency-preparedness/fail?score=${encodeURIComponent(
					score
				)}&total=${encodeURIComponent(total)}&incorrect=${encodeURIComponent(
					JSON.stringify(incorrectQuestions)
				)}`
			);
		}
	}
};
