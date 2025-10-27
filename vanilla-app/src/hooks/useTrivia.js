import { getTriviaQuestions } from "../api/api";

export async function useTrivia() {
  return await getTriviaQuestions();
}
