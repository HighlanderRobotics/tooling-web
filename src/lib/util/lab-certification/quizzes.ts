export enum QuestionType {
    SINGLE_SELECT,
    MULTI_SELECT,
}

export type Question<T extends string | string[]> = {
    id: string;
    readableName: string;
    type: T extends string ? QuestionType.SINGLE_SELECT : QuestionType.MULTI_SELECT;
    answers: Record<string, string>;
}

export type ServerQuestion<T extends string | string[]> = Question<T> & {
    correctAnswer: T;
}
