import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Question } from '../../api/quizApi';

interface QuizState {
  currentQuizId: string | null;
  questions: Question[];
  answers: Record<string, any>;
  score: number | null;
  certificationLevel: string | null;
  currentQuestionIndex: number;
  currentStep: number;
  completedSteps: number[];
}

const initialState: QuizState = {
  currentQuizId: null,
  questions: [],
  answers: {},
  score: null,
  certificationLevel: null,
  currentQuestionIndex: 0,
  currentStep: 1,
  completedSteps: [],
};

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    setCurrentQuizId: (state, action: PayloadAction<string>) => {
      state.currentQuizId = action.payload;
      state.answers = {};
      state.score = null;
      state.certificationLevel = null;
      state.currentQuestionIndex = 0;
      state.questions = [];
      state.currentStep = 1;
      state.completedSteps = [];
    },
    setQuizQuestions: (state, action: PayloadAction<Question[]>) => {
      state.questions = action.payload;
    },
    setAnswer: (state, action: PayloadAction<{ questionId: string; answer: any }>) => {
      state.answers[action.payload.questionId] = action.payload.answer;
    },
    setCurrentQuestionIndex: (state, action: PayloadAction<number>) => {
      state.currentQuestionIndex = action.payload;
    },
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    completeStep: (state, action: PayloadAction<number>) => {
      if (!state.completedSteps.includes(action.payload)) {
        state.completedSteps.push(action.payload);
      }
    },
    nextQuestion: (state) => {
      if (state.currentQuestionIndex < state.questions.length - 1) {
        state.currentQuestionIndex += 1;
      }
    },
    prevQuestion: (state) => {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex -= 1;
      }
    },
    setResult: (
      state,
      action: PayloadAction<{ score: number; certificationLevel: string }>
    ) => {
      state.score = action.payload.score;
      state.certificationLevel = action.payload.certificationLevel;
    },
    resetQuiz: (state) => {
      state.currentQuizId = null;
      state.questions = [];
      state.answers = {};
      state.score = null;
      state.certificationLevel = null;
      state.currentQuestionIndex = 0;
      state.currentStep = 1;
      state.completedSteps = [];
    },
  },
});

export const { 
  setCurrentQuizId, 
  setQuizQuestions,
  setAnswer, 
  setCurrentQuestionIndex,
  setCurrentStep,
  completeStep,
  nextQuestion,
  prevQuestion,
  setResult, 
  resetQuiz 
} = quizSlice.actions;

export default quizSlice.reducer;
