import { getPersonByEmail } from "$lib/server/util/person/getPersonByEmail.js";
import { getPersonFromUser } from "$lib/server/util/person/getPersonFromUser";
import prisma from "$lib/server/util/prisma.js";
import { QuizType } from "@prisma/client";
import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types.js";
import { QuestionType, type Question, type ServerQuestion } from "$lib/util/lab-certification/quizzes.js";

export const _questions: ServerQuestion<string | string[]>[] = [
    {
        id: "safety-glasses",
        readableName: "When should you be wearing safety glasses?",
        type: QuestionType.SINGLE_SELECT,
        answers: {
            "working-on-robot": "When working on the robot.",
            "all-times": "At all times in the shop.",
            "advanced-machine-tool": "When operating an advanced machine tool.",
            "feel-unsafe": "Only when you feel unsafe.",
        },
        correctAnswer: "all-times",
    },
    {
        id: "tool-without-test",
        readableName: "Can you use a shop tool without the safety test if you're careful?",
        type: QuestionType.SINGLE_SELECT,
        answers: {
            "basic-tools": "Only for basic tools.",
            "never": "Never.",
            "student-supervision": "With the supervision of another student.",
        },
        correctAnswer: "never",
    },
    {
        id: "unacceptable-attire",
        readableName: "What is unacceptable attire for the shop?",
        type: QuestionType.MULTI_SELECT,
        answers: {
            "shorts": "Shorts",
            "long-hair": "Long hair not tied back",
            "close-toed-shoes": "Close Toed Shoes",
            "baggy-sweaters": "Baggy sweaters",
            "safety-glasses": "Safety Glasses",
            "reading-glasses": "Reading Glasses with protective safety glasses",
            "long-pants": "Long Pants",
        },
        correctAnswer: [
            "shorts",
            "long-hair",
            "baggy-sweaters",
        ],
    },
    {
        id: "when-finished",
        readableName: "What needs to be done after you finish with a tool or machine?",
        type: QuestionType.MULTI_SELECT,
        answers: {
            "leave-it": "Leave it for someone else.",
            "put-away": "Put it await in the correct location.",
            "clean-up": "Clean up your space.",
            "find-someone-else": "Find someone else who needs it.",
        },
        correctAnswer: [
            "put-away",
            "clean-up",
        ],
    },
    {
        id: "when-clean-up",
        readableName: "When should you clean up your mess?",
        type: QuestionType.SINGLE_SELECT,
        answers: {
            "end-of-day": "At the end of the work day.",
            "too-messy": "When you feel the space is too messy to work.",
            "finish-using-tool": "After you finish using the tool.",
        },
        correctAnswer: "finish-using-tool",
    },
    {
        id: "can-work-when-alone",
        readableName: "Can you work in the shop when everybody is getting food and you're alone?",
        type: QuestionType.SINGLE_SELECT,
        answers: {
            "yes": "Yes.",
            "no": "No.",
        },
        correctAnswer: "no",
    },
    {
        id: "bad-etiquette",
        readableName: "What are some examples of bad shop etiquette?",
        type: QuestionType.MULTI_SELECT,
        answers: {
            "too-many-questions": "Asking too many questions.",
            "leaving-tools-out": "Leaving tools out for someone else.",
            "talking-while-machining": "Talking to someone as they are machining.",
            "eating-when-working": "Eating food when working with tools",
            "working-when-tired": "Working when tired or distracted if the part needs to get done.",
            "turning-off-machine": "Turning off your machine before walking away.",
        },
        correctAnswer: [
            "leaving-tools-out",
            "talking-while-machining",
            "eating-when-working",
            "working-when-tired",
        ],
    },
    {
        id: "feel-uncomfortable",
        readableName: "If you don't feel comfortable with a tool you should...",
        type: QuestionType.SINGLE_SELECT,
        answers: {
            "carefully-slowly": "Try to use it carefully and slowly.",
            "teach-you-now": "Have someone teach you then and there.",
            "wikihow": "Read a WikiHow page on it.",
            "re-certified": "Refer back to the machine training and get re-certified.",
        },
        correctAnswer: "re-certified",
    },
    {
        id: "can-be-messy",
        readableName: "Floors, tables, and machines can be messy if...",
        type: QuestionType.SINGLE_SELECT,
        answers: {
            "looks-good": "It makes the shop look like work is getting done.",
            "should-not-be": "They should not be.",
            "need-to-finish": "We're back logged and need to finish.",
        },
        correctAnswer: "should-not-be",
    },
    {
        id: "emergency",
        readableName: "In case of an emergency you should...",
        type: QuestionType.SINGLE_SELECT,
        answers: {
            "help": "Take immediate action and help.",
            "leave": "Leave them and don't create further trouble.",
            "notify": "Notify the parent or mentor supervising to take care of the emergency.",
            "call-911": "Immediately call 911.",
        },
        correctAnswer: "notify",
    },
    {
        id: "about-to-use",
        readableName: "If you're about to use a tool or machine you should...",
        type: QuestionType.MULTI_SELECT,
        answers: {
            "have-fun": "Use it and have fun.",
            "avoid-mistakes": "Assess what can go wrong and avoid mistakes.",
            "take-photo": "Have someone take a photo of you.",
            "aware-safety-glasses": "Make sure others are aware and are wearing their safety glasses",
        },
        correctAnswer: [
            "avoid-mistakes",
            "aware-safety-glasses",
        ],
    },
    {
        id: "gloves",
        readableName: "When should you wear gloves?",
        type: QuestionType.MULTI_SELECT,
        answers: {
            "welding": "While welding, in which case you use specific gloves.",
            "hot": "When handling something hot.",
            "rotating-machine": "When using any rotating machine.",
            "drive-base": "Working on the drive base, grease is dirty.",
            "sharps": "When working with sharp objects or splintered wood.",
        },
        correctAnswer: [
            "welding",
            "hot",
            "drive-base",
            "sharps",
        ],
    },
    {
        id: "defective-tools",
        readableName: "If tools become defective you should...",
        type: QuestionType.SINGLE_SELECT,
        answers: {
            "discard": "Toss it.",
            "consult": "Talk to a mentor or student leader and see what to do.",
            "repair": "Attempt to repair it.",
            "take-home": "Take it home.",
            "put-back": "Put it back in the toolbox.",
        },
        correctAnswer: "consult",
    },
];

export const _clientQuestions: Question<string | string[]>[] = _questions.map((q) => ({
    id: q.id,
    readableName: q.readableName,
    type: q.type,
    answers: q.answers,
}));

export const load = (async () => {
    return {
        questions: _clientQuestions,
    };
}) satisfies PageServerLoad;

const correctAnswers: Record<string, string | string[]> = Object.fromEntries(_questions.map((q) => [q.id, q.correctAnswer]));

export const actions = {
    default: async (event) => {
        const session = await event.locals.getSession();
        
        const data = await event.request.formData();

        let person = null;
        if (session?.user) {
            person = await getPersonFromUser(session?.user);
        } else {
            const email = data.get("email")?.toString();

            if (!email) {
                throw error(400, "No email provided");
            }

            person = await getPersonByEmail(email);
        }

        
        const answers: Record<string, string | string[]> = {};
        for (const [key, value] of data.entries()) {
            if (!key.includes("__")) {
                if (!correctAnswers[key]) {
                    // It's the email or something else we don't care about
                    continue;
                }
                answers[key] = value.toString();
            } else {
                const [question, answer] = key.split("__");

                if (!correctAnswers[question]) {
                    // It's the email or something else we don't care about
                    continue;
                }

                if (!answers[question]) {
                    answers[question] = [];
                }

                if (value.toString() === "on") {
                    (answers[question] as string[]).push(answer);
                }
            }
        }

        let score = 0;
        let total = 0;
        const incorrectQuestions: string[] = [];

        for (const [question, correctAnswer] of Object.entries(correctAnswers)) {
            if (Array.isArray(correctAnswer)) {
                total++
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

        if (!person && !data.get("email")) {
            throw error(400, "No email provided");
        }

        await prisma.quizSubmission.create({
            data: {
                quizType: QuizType.SAFETY_QUIZ,
                submitterId: person?.id,
                submitterEmail: !person ? data.get("email")?.toString() : undefined,
                answers: JSON.stringify(answers),
                score,
                maxScore: total,
            }
        });

        const percent = Math.round(score / total * 100);

        if (percent >= 80) {
            if (person) {
                await prisma.person.update({
                    where: {
                        id: person.id,
                    },
                    include: {
                        labCertification: true,
                    },
                    data: {
                        labCertification: {
                            upsert: {
                                create: {
                                    safetyQuiz: true,
                                },
                                update: {
                                    safetyQuiz: true,
                                }
                            }
                        }
                    }
                });
            }

            throw redirect(303, `/tools/lab-certification/quizzes/safety-quiz/pass?score=${encodeURIComponent(score)}&total=${encodeURIComponent(total)}&incorrect=${encodeURIComponent(JSON.stringify(incorrectQuestions))}`);
        } else {
            if (person) {
                await prisma.person.update({
                    where: {
                        id: person.id,
                    },
                    include: {
                        labCertification: true,
                    },
                    data: {
                        labCertification: {
                            upsert: {
                                create: {
                                    safetyQuiz: false,
                                },
                                update: {
                                    safetyQuiz: false,
                                }
                            }
                        }
                    }
                });
            }

            throw redirect(303, `/tools/lab-certification/quizzes/safety-quiz/fail?score=${encodeURIComponent(score)}&total=${encodeURIComponent(total)}&incorrect=${encodeURIComponent(JSON.stringify(incorrectQuestions))}`);
        }
    },
}

