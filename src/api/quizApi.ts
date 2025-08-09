import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseApi';

export interface QuestionOption {
  key: string;
  text: string;
}

export interface Question {
  _id: string;
  id?: string; 
  competency: string;
  level: string;
  text: string;
  options: (string | QuestionOption)[];
  correctAnswerIndex?: number;
  correctKey?: string; 
}

export interface Quiz {
  _id: string;
  name: string;
  description?: string;
  totalQuestions: number;
  niche : string;
}

export interface PaginatedQuizResponse {
  quizzes: Quiz[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export interface QuizQueryParams {
  page?: number;
  limit?: number;
}

export interface QuizQuestionsParams {
  quizId: string;
  step: number;
}

export interface QuizQuestionsStepResponse {
  questions: Question[];
}

export interface QuestionsByQuizIdParams {
  quizId: string;
  page?: number;
  limit?: number;
}

export interface QuestionsByQuizIdResponse {
  success: boolean;
  data: Question[];
  meta: {
    page: number;
    limit: number;
    totalQuestions: number;
    totalPages: number;
  };
}

export interface StepSubmitResponse {
  result: {
    _id: string;
    score: number;
    levelAwarded: string;
  };
  proceed: boolean;
  certificateSent: boolean;
  certificateUrl: string | null;
}

export const quizApi = createApi({
  reducerPath: 'quizApi',
  baseQuery,
  tagTypes: ['Quiz', 'AdminQuiz', 'Question'],
  endpoints: (builder) => ({
    getQuizzes: builder.query<PaginatedQuizResponse, QuizQueryParams>({
      query: (params = { page: 1, limit: 6 }) => {
        const { page = 1, limit = 6 } = params;
        return `quiz/quizzes?page=${page}&limit=${limit}`;
      },
      providesTags: ['Quiz'],
    }),
    getQuizById: builder.query<Quiz, string>({
      query: (quizId) => `quiz/quizzes/${quizId}`,
      providesTags: (result, error, quizId) => [{ type: 'Quiz', id: quizId }],
    }),
    getQuizQuestions: builder.query<QuestionsByQuizIdResponse, QuestionsByQuizIdParams>({
      query: ({ quizId, page = 1, limit = 20 }) => 
        `/admin/quiz/${quizId}/questions?page=${page}&limit=${limit}`,
      providesTags: (result, error, { quizId }) => [
        { type: 'Question', id: quizId }
      ],
    }),
    getQuizQuestionsByStep: builder.query<QuizQuestionsStepResponse, QuizQuestionsParams>({
      query: ({ quizId, step }) => `/quiz/${quizId}/step/${step}/questions`,
      providesTags: (result, error, { quizId, step }) => [
        { type: 'Quiz', id: `${quizId}-step-${step}` }
      ],
    }),
    submitQuestionForStep: builder.mutation<StepSubmitResponse, { quizId: string; step: number; answers: { questionId: string; selectedKey: string }[] }>({
      query: ({ quizId, step, answers }) => ({
        url: `/quiz/${quizId}/step/${step}/submit`,
        method: 'POST',
        body: { answers },
      }),
      invalidatesTags: (result, error, { quizId, step }) => [
        { type: 'Quiz', id: `${quizId}-step-${step}` }
      ],
    }),

    // Admin endpoints
    createQuiz: builder.mutation<Quiz, Partial<Quiz>>({
      query: (quizData) => ({
        url: '/admin/create-quiz',
        method: 'POST',
        body: quizData,
      }),
      invalidatesTags: ['AdminQuiz', 'Quiz'],
    }),
    updateQuiz: builder.mutation<Quiz, { id: string; quizData: Partial<Quiz> }>({
      query: ({ id, quizData }) => ({
        url: `/admin/quiz/${id}`,
        method: 'PUT',
        body: quizData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'AdminQuiz', id },
        'AdminQuiz',
        'Quiz',
      ],
    }),
    deleteQuiz: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/quiz/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AdminQuiz', 'Quiz'],
    }),
    getAdminQuizzes: builder.query<PaginatedQuizResponse, QuizQueryParams>({
      query: (params = { page: 1, limit: 10 }) => {
        const { page = 1, limit = 10 } = params;
        return `/admin/quizzes?page=${page}&limit=${limit}`;
      },
      providesTags: ['AdminQuiz'],
    }),
    getAdminQuizById: builder.query<Quiz, string>({
      query: (quizId) => `/admin/quiz/${quizId}`,
      providesTags: (result, error, quizId) => [{ type: 'AdminQuiz', id: quizId }],
    }),
    createQuestion: builder.mutation<Question, { quizId: string; questionData: Partial<Question> }>({
      query: ({ quizId, questionData }) => ({
        url: `/admin/${quizId}/questions`,
        method: 'POST',
        body: questionData,
      }),
      invalidatesTags: (result, error, { quizId }) => [
        { type: 'AdminQuiz', id: quizId },
        { type: 'Question', id: quizId },
      ],
    }),
    updateQuestion: builder.mutation<Question, { quizId: string; questionId: string; questionData: Partial<Question> }>({
      query: ({ quizId, questionId, questionData }) => ({
        url: `/admin/${quizId}/questions/${questionId}`,
        method: 'PUT',
        body: questionData,
      }),
      invalidatesTags: (result, error, { quizId, questionId }) => [
        { type: 'Question', id: questionId },
        { type: 'AdminQuiz', id: quizId },
      ],
    }),
    deleteQuestion: builder.mutation<void, { quizId: string; questionId: string }>({
      query: ({ quizId, questionId }) => ({
        url: `/admin/${quizId}/questions/${questionId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { quizId }) => [
        { type: 'Question', id: quizId },
        { type: 'AdminQuiz', id: quizId },
      ],
    }),
  }),
});

export const {
  useGetQuizzesQuery,
  useGetQuizByIdQuery,
  useGetQuizQuestionsQuery,
  useGetQuizQuestionsByStepQuery,
  useSubmitQuestionForStepMutation,
  // Admin exports
  useCreateQuizMutation,
  useUpdateQuizMutation,
  useDeleteQuizMutation,
  useGetAdminQuizzesQuery,
  useGetAdminQuizByIdQuery,
  useCreateQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation
} = quizApi;
