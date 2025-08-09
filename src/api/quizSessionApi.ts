import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseApi';

export interface QuizSession {
  _id: string;
  quiz: string;
  student: string;
  status: 'in-progress' | 'completed' | 'terminated';
  startTime: string;
  endTime?: string;
  score?: number;
}

export const quizSessionApi = createApi({
  reducerPath: 'quizSessionApi',
  baseQuery,
  tagTypes: ['QuizSession'],
  endpoints: (builder) => ({
    startQuiz: builder.mutation<QuizSession, { quizId: string }>({
      query: ({ quizId }) => ({
        url: `/quizzes/${quizId}/start`,
        method: 'POST',
      }),
      invalidatesTags: ['QuizSession'],
    }),
    fetchQuizQuestions: builder.query<any, { quizId: string; step: number }>({
      query: ({ quizId, step }) => `/quiz/${quizId}/${step}/questions`,
      providesTags: ['QuizSession'],
    }),
    submitQuizAnswers: builder.mutation<{ score: number; certificationLevel: string }, { quizId: string; answers: any }>({
      query: ({ quizId, answers }) => ({
        url: `/quizzes/${quizId}/submit`,
        method: 'POST',
        body: { answers },
      }),
      invalidatesTags: ['QuizSession'],
    }),
  }),
});

export const {
  useStartQuizMutation,
  useSubmitQuizAnswersMutation,
  useFetchQuizQuestionsQuery,
} = quizSessionApi;
