import React from 'react';
import { Question, QuestionOption } from '../api/quizApi';

interface Props {
  question: Question;
  selectedAnswer: string | undefined;
  onAnswer: (answer: string) => void;
}

const QuestionCard: React.FC<Props> = ({ question, selectedAnswer, onAnswer }) => {
  return (
    <div className="border border-gray-200 p-4 sm:p-6 rounded-lg shadow-sm bg-white">
      <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">
        {question?.text}
      </h3>
      
      <div className="space-y-3">
        {question.options.map((opt, idx) => {
          const optionValue = typeof opt === 'object' ? (opt as any).text || '' : opt;
          const optionKey = typeof opt === 'object' ? (opt as any).key || idx : opt;
          
          return (
            <div 
              key={idx}
              onClick={() => onAnswer(optionKey)}
              className={`p-3 rounded-lg border ${
                selectedAnswer === optionKey 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
              } cursor-pointer transition-colors duration-200`}
            >
              <label className="flex items-center cursor-pointer w-full">
                <div className={`w-5 h-5 rounded-full border ${
                  selectedAnswer === optionKey 
                    ? 'border-blue-600 bg-blue-600' 
                    : 'border-gray-400'
                } flex items-center justify-center mr-3`}>
                  {selectedAnswer === optionKey && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
                <span className={`${selectedAnswer === optionKey ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>
                  {optionValue}
                </span>
              </label>
            </div>
          );
        })}
      </div>
      
      {question.competency && (
        <div className="mt-4 text-sm text-gray-500">
          Competency: {question.competency} | Level: {question.level || 'Standard'}
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
