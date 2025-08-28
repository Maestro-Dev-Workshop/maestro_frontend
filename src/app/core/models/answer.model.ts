export interface AnswerModel {
    questionId: string;
    prompt: string;
    selectedOptions: string[];
    correctOptions: string[];
    isCorrect: boolean;
    feeback: string;
}