import type { PageServerLoad } from "../$types";
import { _clientQuestions } from "../+page.server";

export const load = (async (event) => {
    const score = event.url.searchParams.get('score');
    const total = _clientQuestions.length;
    const incorrectIds = JSON.parse(event.url.searchParams.get('incorrect') || '[]');
    const incorrectQuestions = _clientQuestions.filter((question) => incorrectIds.includes(question.id));

    return {
        score,
        total,
        incorrectQuestions,
    }
}) satisfies PageServerLoad;
