import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";
import { getPersonFromUser } from "$lib/server/util/person/getPersonFromUser";
import { hasPermission } from "$lib/server/util/permission/hasPermission";
import prisma from "$lib/server/util/prisma";
import { QuizType } from "@prisma/client";

export const load: PageServerLoad = async (event) => {
    const session = await event.locals.getSession();
	if (!session?.user) throw error(500);

	const person = await getPersonFromUser(session?.user);
	if (!person) throw error(500);

	const permissions = {
		view: await hasPermission(person, 'labcertification.view'),
		edit: await hasPermission(person, 'labcertification.edit'),
	};

	if (!permissions.view) throw error(403, 'You do not have permission to view lab certification.');

    const filterPerson = event.url.searchParams.get('person');
    const filterEmail = event.url.searchParams.get('email');
    const filterQuiz = event.url.searchParams.get('quiz');

    const submissions = await prisma.quizSubmission.findMany({
        where: {
            submitterId: filterPerson ? filterPerson : undefined,
            submitterEmail: filterEmail ? filterEmail : undefined,
            quizType: filterQuiz ? {
                "safety-quiz": QuizType.SAFETY_QUIZ,
                "lab-layout-emergency-preparedness": QuizType.LAB_LAYOUT_EMERGENCY_PREPAREDNESS,
            }[filterQuiz] : undefined
        },
        select: {
            id: true,
            quizType: true,
            submitter: {
                select: {
                    id: true,
                    name: true,
                }
            },
            submitterEmail: true,
            score: true,
            maxScore: true,
            timestamp: true,
        },
        orderBy: {
            timestamp: 'desc'
        }
    });

	return {
		permissions,
        submissions
	};
}
