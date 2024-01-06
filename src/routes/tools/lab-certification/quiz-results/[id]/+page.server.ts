import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { getPersonFromUser } from "$lib/server/util/person/getPersonFromUser";
import { hasPermission } from "$lib/server/util/permission/hasPermission";
import prisma from "$lib/server/util/prisma";
import { QuizType } from "@prisma/client";
import { _questions as safetyQuizQuestions } from "../../quizzes/safety-quiz/+page.server";

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

    const submissionId = event.params.id;

    const submission = await prisma.quizSubmission.findUnique({
        where: {
            id: submissionId
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
            answers: true,
        }
    });

    if (!submission) throw error(404);

    const questionList = [
        {
            quizType: QuizType.SAFETY_QUIZ,
            questions: safetyQuizQuestions,
        },
    ].find(q => q.quizType === submission.quizType)?.questions;

    if (!questionList) throw error(500);

	return {
		permissions,
        submission,
        questionList,
	};
}
