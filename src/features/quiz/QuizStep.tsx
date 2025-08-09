import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSubmitQuizAnswersMutation } from '../../api/quizSessionApi';
import { useGetQuizQuestionsByStepQuery, useSubmitQuestionForStepMutation } from '../../api/quizApi';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { 
  setAnswer, 
  setResult, 
  nextQuestion, 
  prevQuestion, 
  setCurrentQuestionIndex,
  setQuizQuestions,
  setCurrentStep,
  completeStep
} from './quizSlice';
import Timer from '../../components/Timer';
import QuestionCard from '../../components/QuestionCard';

const QuizStep: React.FC = () => {
  const { quizId, step } = useParams<{ quizId: string; step: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const currentStep = useAppSelector((state) => state.quiz.currentStep);
  const completedSteps = useAppSelector((state) => state.quiz.completedSteps);
  
  const stepNumber = parseInt(step || '1', 10);
  const questions = useAppSelector((state) => state.quiz.questions);
  const currentQuestionIndex = useAppSelector((state) => state.quiz.currentQuestionIndex);
  const answers = useAppSelector((state) => state.quiz.answers);
  
  const { data: stepQuestions, isLoading: loadingQuestions } = useGetQuizQuestionsByStepQuery(
    { quizId: quizId!, step: stepNumber },
    { skip: !quizId }
  );

  const [questionTimeUp, setQuestionTimeUp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [stepResult, setStepResult] = useState<{ proceed: boolean; levelAwarded: string | null }>({ proceed: true, levelAwarded: null });
  const [showStepResult, setShowStepResult] = useState(false);
  
 
  const [submitQuizAnswers] = useSubmitQuizAnswersMutation();
  const [submitStepAnswers] = useSubmitQuestionForStepMutation();


  const currentQuestion = questions.length > 0 && currentQuestionIndex >= 0 && currentQuestionIndex < questions.length
    ? questions[currentQuestionIndex]
    : null;
  

  const isLastQuestion = currentQuestionIndex === questions.length - 1;


  const overallProgress = ((currentQuestionIndex + 1) / questions.length) * 100;
  

  const questionsPerStep = stepQuestions?.questions?.length || questions.length;
  const questionInStepIndex = currentQuestionIndex % Math.max(1, questionsPerStep);
  const questionInStepNumber = questionInStepIndex + 1;
  const questionsInCurrentStep = questions.length;
  
  console.log("Dynamic questions per step:", {
    questionsPerStep,
    questionInStepIndex,
    questionInStepNumber,
    questionsInCurrentStep
  });

  const handleAnswer = useCallback((questionId: string, answer: any) => {
    dispatch(setAnswer({ questionId, answer }));
  }, [dispatch]);


  const handlePrevQuestion = useCallback(() => {
    dispatch(prevQuestion());
  }, [dispatch]);

  const handleSubmitAnswer = useCallback(async () => {
    if (!currentQuestion) return;
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const isLastQuestionInStep = questionInStepNumber === questionsInCurrentStep;
      const isLastStep = stepNumber === 3; 
      
      if (isLastQuestionInStep) {
        const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
          questionId,
          selectedKey: typeof answer === 'object' && answer !== null ? (answer as any).key : answer
        }));

        const stepResponse = await submitStepAnswers({
          quizId: quizId!,
          step: stepNumber,
          answers: formattedAnswers
        }).unwrap();


      
        dispatch(completeStep(stepNumber));
        
       
        setStepResult({
          proceed: stepResponse?.proceed,
          levelAwarded: stepResponse?.result?.levelAwarded
        });
        setShowStepResult(true);
        
        if (isLastStep) {
          
          dispatch(setResult({ 
            score: stepResponse.result.score, 
            certificationLevel: stepResponse.result.levelAwarded 
          }));
          
          
          setTimeout(() => {
            navigate(`/quiz/${quizId}/result`);
          }, 3000);
        } else if (stepResponse.proceed) {
          
          const nextStep = stepNumber + 1;
          
          setTimeout(() => {
            dispatch(setCurrentStep(nextStep));
            navigate(`/quiz/${quizId}/step/${nextStep}`);
            setShowStepResult(false);
          }, 3000);
        }
    
      } else {
        
        dispatch(nextQuestion());
      }
    } catch (error: any) {
      setSubmitError(error?.data?.message || 'Failed to submit answer');
    } finally {
      setIsSubmitting(false);
      setQuestionTimeUp(false);
    }
  }, [
    currentQuestion, 
    questionInStepNumber, 
    questionsInCurrentStep, 
    stepNumber, 
    quizId, 
    answers, 
    submitStepAnswers, 
    dispatch, 
    navigate
  ]);

 
  useEffect(() => {
    
    if (stepQuestions && stepQuestions.questions && stepQuestions.questions.length > 0) {
      console.log("Step Questions Loaded:", stepQuestions);
      console.log("Questions Length:", stepQuestions.questions.length);
      
      
      dispatch(setQuizQuestions(stepQuestions.questions));
      
     
      console.log("Setting question index to 0 for new step");
      dispatch(setCurrentQuestionIndex(0));
    } else {
      console.log("No questions loaded or empty questions array:", stepQuestions);
    }
  }, [stepQuestions, dispatch, stepNumber]);


 
  useEffect(() => {
    if (!quizId) {
      navigate('/');
      return;
    }
    
    if (step && parseInt(step) !== stepNumber) {
      navigate(`/quiz/${quizId}/step/${stepNumber}`);
    }
    
    console.log("Navigation effect: quizId, step, stepNumber =", quizId, step, stepNumber);
    
    if (quizId && (!questions.length || loadingQuestions)) {
      console.log("Forcing questions fetch or waiting for current fetch to complete");
    }
  }, [quizId, step, stepNumber, navigate, questions.length, loadingQuestions]);

  
  useEffect(() => {
    setQuestionTimeUp(false);
  }, [currentQuestionIndex]);


  useEffect(() => {
    if (questionTimeUp && !isSubmitting) {
   
      handleSubmitAnswer();
    }
  }, [questionTimeUp, isSubmitting, handleSubmitAnswer]);

  if (!questions.length || !currentQuestion) {
    console.log("Loading state shown because:", {
      questionsLength: questions.length,
      currentQuestionIndex,
      hasCurrentQuestion: !!currentQuestion,
      stepQuestionsLoaded: !!stepQuestions
    });
    
    return (
      <div className="flex justify-center items-center mt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        <span className="ml-3 text-lg">Loading questions for Step {stepNumber}...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-4 sm:mt-8 p-4 sm:p-6 bg-white rounded shadow-md">

      <div className="mb-6">
        <div className="flex justify-between mb-2">
          {[1, 2, 3].map((step) => (
            <div 
              key={step} 
              className={`flex flex-col items-center ${
                step < stepNumber ? 'text-green-600' : 
                step === stepNumber ? 'text-blue-600 font-bold' : 'text-gray-400'
              }`}
            >
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  step < stepNumber ? 'bg-green-100 border-green-600' : 
                  step === stepNumber ? 'bg-blue-100 border-blue-600' : 'bg-gray-100 border-gray-300'
                }`}
              >
                {step < stepNumber ? (
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                ) : (
                  step
                )}
              </div>
              <span className="mt-1">Step {step}</span>
            </div>
          ))}
        </div>
        <div className="relative h-2 bg-gray-200 rounded-full">
          <div 
            className="absolute top-0 left-0 h-2 rounded-full bg-blue-600"
            style={{ width: `${((stepNumber - 1) / 2) * 100}%` }}
          ></div>
        </div>
      </div>
      
  
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
          <span>{Math.round(overallProgress)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="h-2.5 rounded-full bg-blue-600"
            style={{ width: `${overallProgress}%` }}
          ></div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-xl font-semibold mb-2 sm:mb-0">
          Step {stepNumber} - Question {questionInStepNumber} / {questionsInCurrentStep}
        </h2>
        <Timer
          key={`question-${currentQuestionIndex}`} 
          minutes={1} 
          onTimeUp={() => setQuestionTimeUp(true)}
        />
      </div>

      <QuestionCard
        question={currentQuestion}
        selectedAnswer={answers[currentQuestion._id]}
        onAnswer={(answer) => handleAnswer(currentQuestion._id, answer)}
      />

      <div className="flex justify-between mt-6">
        
        <div></div> 
        
        <button
          onClick={handleSubmitAnswer}
          disabled={isSubmitting}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-400 flex items-center"
        >
          {isSubmitting && (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {isSubmitting 
            ? 'Submitting...' 
            : isLastQuestion 
              ? 'Complete Quiz' 
              : questionInStepNumber === questionsInCurrentStep
                ? `Complete Step ${stepNumber}`
                : 'Next Question'
          }
        </button>
      </div>
      
      {submitError && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-center">
          {submitError}
        </div>
      )}
      

      {showStepResult && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 text-center">
              {stepResult.proceed ? 'Congratulations!' : 'Sorry!'}
            </h2>
            
            <div className={`text-center p-4 rounded-lg mb-4 ${
              stepResult.proceed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {stepResult.proceed ? (
                <>
                  <svg className="w-16 h-16 mx-auto mb-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <p className="text-lg font-semibold">
                    You passed Step {stepNumber}!
                  </p>
                  <p className="mt-2">
                    Level Awarded: {stepResult.levelAwarded}
                  </p>
                  <p className="mt-2">
                    {stepNumber < 3 ? 'Moving to the next step...' : 'Exam Complete! Finalizing your results...'}
                  </p>
                </>
              ) : (
                <>
                  <svg className="w-16 h-16 mx-auto mb-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <p className="text-lg font-semibold">
                   {
                     stepNumber === 3 ? "Times Up!" : `You did not pass Step ${stepNumber}.`
                   }
                  </p>
                  <p className="mt-2">
                    Level Awarded: {stepResult.levelAwarded || 'None'}
                  </p>
                  <p className="mt-2">
                    {stepNumber < 3 ? 'You cannot proceed to the next step.' : 'Exam Complete. View your final results.'}
                  </p>
                </>
              )}
            </div>
            
            {!stepResult.proceed && (
              <div className="flex justify-center">
                <button
                  onClick={() => stepNumber === 3 ? navigate(`/quiz/${quizId}/result`) : navigate('/')}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {stepNumber === 3 ? 'View Final Results' : 'Return to Dashboard'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizStep;
