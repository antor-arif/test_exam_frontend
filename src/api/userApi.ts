import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseApi';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  totalQuestions: number;
  duration: number;
  createdAt: string;
}

export interface Certificate {
  id: string;
  quizId: any;
  quizName: string;
  level: string;
  score: number;
  date: string;
  step: number;
  certificateId: string;
  certificateUrl: string;
  viewUrl: string | null;
}

export interface QuizResult {
  id: string;
  quiz: {
    id: string;
    name: string;
    niche: string;
  } | null;
  step: number;
  score: number;
  levelAwarded: string;
  hasCertificate: boolean;
  certificateId: string;
  certificateUrl: string;
  date: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    totalCount?: number;
    pageSize?: number;
    currentPage?: number;
    totalPages?: number;
    total?: number;
  };
}

export interface UserResultsParams {
  page?: number;
  limit?: number;
  quizId?: string;
  level?: string;
}

export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery,
  tagTypes: ['Users', 'Quizzes', 'Results', 'Certificates'],
  endpoints: (builder) => ({
    getUsers: builder.query<PaginatedResponse<User>, UserQueryParams>({
      query: (params = { page: 1, limit: 10 }) => {
        const { page = 1, limit = 10, search = '' } = params;
        let url = '/admin/users';
        const queryParams = new URLSearchParams();
        
        queryParams.append('page', page.toString());
        queryParams.append('limit', limit.toString());
        if (search) queryParams.append('search', search);
        
        return `${url}?${queryParams.toString()}`;
      },
      providesTags: ['Users'],
    }),
    getUserById: builder.query<User, string>({
      query: (id) => `/admin/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'Users', id }],
    }),
    updateUser: builder.mutation<User, { id: string; userData: Partial<User> }>({
      query: ({ id, userData }) => ({
        url: `/admin/users/${id}`,
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Users', id },
        'Users',
      ],
    }),
    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users'],
    }),
    getAdminQuizzes: builder.query<Quiz[], void>({
      query: () => '/admin/quizzes',
      providesTags: ['Quizzes'],
    }),
    getQuizById: builder.query<Quiz, string>({
      query: (id) => `/admin/quizzes/${id}`,
      providesTags: (result, error, id) => [{ type: 'Quizzes', id }],
    }),
    createQuiz: builder.mutation<Quiz, Partial<Quiz>>({
      query: (quizData) => ({
        url: '/admin/quizzes',
        method: 'POST',
        body: quizData,
      }),
      invalidatesTags: ['Quizzes'],
    }),
    updateQuiz: builder.mutation<Quiz, { id: string; quizData: Partial<Quiz> }>({
      query: ({ id, quizData }) => ({
        url: `/admin/quizzes/${id}`,
        method: 'PUT',
        body: quizData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Quizzes', id },
        'Quizzes',
      ],
    }),
    deleteQuiz: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/quizzes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Quizzes'],
    }),
    getResults: builder.query<QuizResult[], void>({
      query: () => '/admin/results',
      providesTags: ['Results'],
    }),
    getResultById: builder.query<QuizResult, string>({
      query: (id) => `/admin/results/${id}`,
      providesTags: (result, error, id) => [{ type: 'Results', id }],
    }),
    getResultsByQuiz: builder.query<QuizResult[], string>({
      query: (quizId) => `/admin/quizzes/${quizId}/results`,
      providesTags: (result, error, quizId) => [
        ...((result ?? []).map(({ id }) => ({ type: 'Results' as const, id }))),
        { type: 'Results', id: 'LIST' },
      ],
    }),
    getResultsByUser: builder.query<QuizResult[], string>({
      query: (userId) => `/admin/users/${userId}/results`,
      providesTags: (result, error, userId) => [
        ...((result ?? []).map(({ id }) => ({ type: 'Results' as const, id }))),
        { type: 'Results', id: 'LIST' },
      ],
    }),
    
    getUserResults: builder.query<{ data: QuizResult[], meta: any }, UserResultsParams>({
      query: (params = {}) => {
        const { page = 1, limit = 10, quizId, level } = params;
        let url = '/quiz/results';
        const queryParams = new URLSearchParams();
        
        queryParams.append('page', page.toString());
        queryParams.append('limit', limit.toString());
        if (quizId) queryParams.append('quizId', quizId);
        if (level) queryParams.append('level', level);
        
        return `${url}?${queryParams.toString()}`;
      },
      providesTags: ['Results'],
    }),
    
    getUserCertificates: builder.query<{ data: Certificate[] }, void>({
      query: () => '/quiz/certificates',
      providesTags: ['Certificates'],
    }),
    
    downloadCertificate: builder.query<Blob, string>({
      query: (resultId) => ({
        url: `/quiz/certificates/${resultId}/download`,
        responseHandler: (response) => response.blob(),
      }),
    }),
    
    viewCertificate: builder.query<string, string>({
      query: (certificateId) => ({
        url: `/quiz/certificates/${certificateId}/view`,
        responseHandler: (response) => response.text(),
      }),
    }),
  }),
});

export const {
  // Users hooks
  useGetUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  
  // Quizzes hooks
  useGetAdminQuizzesQuery,
  useGetQuizByIdQuery,
  useCreateQuizMutation,
  useUpdateQuizMutation,
  useDeleteQuizMutation,
  
  // Results hooks
  useGetResultsQuery,
  useGetResultByIdQuery,
  useGetResultsByQuizQuery,
  useGetResultsByUserQuery,
  
  // Student results and certificates hooks
  useGetUserResultsQuery,
  useGetUserCertificatesQuery,
  useDownloadCertificateQuery,
  useViewCertificateQuery,
} = userApi;