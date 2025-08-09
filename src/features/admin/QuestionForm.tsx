import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  useGetQuizByIdQuery,
  useGetQuizQuestionsQuery,
  useCreateQuestionMutation,
  useUpdateQuestionMutation,
  Question,
  QuestionOption
} from '../../api/quizApi';

interface FormErrors {
  text?: string;
  competency?: string;
  level?: string;
  options?: string;
  correctAnswerIndex?: string;
}

const QuestionForm: React.FC = () => {
  const { quizId, questionId } = useParams<{ quizId: string; questionId: string }>();
  const navigate = useNavigate();
  const isEditMode = !!questionId;

  const [formData, setFormData] = useState<Partial<Question>>({
    text: '',
    competency: '',
    level: 'A1',
    options: [
      { key: 'A', text: '' },
      { key: 'B', text: '' },
      { key: 'C', text: '' },
      { key: 'D', text: '' },
    ],
    correctAnswerIndex: 0,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: quiz } = useGetQuizByIdQuery(quizId || '');
  const { data: questionsResponse } = useGetQuizQuestionsQuery({ 
    quizId: quizId || '',
    page: 1,
    limit: 100
  }, {
    skip: !isEditMode,
  });

  const [createQuestion] = useCreateQuestionMutation();
  const [updateQuestion] = useUpdateQuestionMutation();

  useEffect(() => {
    if (isEditMode && questionsResponse && questionsResponse.data) {
      const question = questionsResponse.data.find(q => q._id === questionId);
      if (question) {
        let formattedOptions: QuestionOption[] = [];
        
        if (Array.isArray(question.options)) {
          formattedOptions = question.options.map((opt, index) => {
            if (typeof opt === 'string') {
              return { key: String.fromCharCode(65 + index), text: opt };
            } else if (typeof opt === 'object' && 'key' in opt && 'text' in opt) {
              return opt as QuestionOption;
            }
            return { key: String.fromCharCode(65 + index), text: '' };
          });
        }
        
        setFormData({
          ...question,
          options: formattedOptions
        });
      }
    }
  }, [isEditMode, questionsResponse, questionId]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.text?.trim()) {
      newErrors.text = 'Question text is required';
    }
    
    if (!formData.competency?.trim()) {
      newErrors.competency = 'Competency is required';
    }
    
    if (!formData.level?.trim()) {
      newErrors.level = 'Level is required';
    }
    
    const options = formData.options as QuestionOption[];
    if (!options || options.length < 2) {
      newErrors.options = 'At least 2 options are required';
    } else {
      const emptyOptions = options.filter(opt => !opt.text.trim());
      if (emptyOptions.length > 0) {
        newErrors.options = 'All options must have text';
      }
    }
    
    if (formData.correctAnswerIndex === undefined || formData.correctAnswerIndex < 0) {
      newErrors.correctAnswerIndex = 'Correct answer must be selected';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'correctAnswerIndex') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...(formData.options as QuestionOption[])];
    updatedOptions[index] = { ...updatedOptions[index], text: value };
    
    setFormData(prev => ({ ...prev, options: updatedOptions }));
    
    if (errors.options) {
      setErrors(prev => ({ ...prev, options: undefined }));
    }
  };

  const handleAddOption = () => {
    const options = formData.options as QuestionOption[];
    const newKey = String.fromCharCode(65 + options.length);
    setFormData(prev => ({
      ...prev,
      options: [...options, { key: newKey, text: '' }]
    }));
  };

  const handleRemoveOption = (index: number) => {
    const options = [...(formData.options as QuestionOption[])];
    if (options.length <= 2) {
      setErrors(prev => ({ ...prev, options: 'At least 2 options are required' }));
      return;
    }
    
    options.splice(index, 1);
    
    const updatedOptions = options.map((opt, idx) => ({
      ...opt,
      key: String.fromCharCode(65 + idx)
    }));
    
    let correctIndex = formData.correctAnswerIndex;
    if (correctIndex !== undefined) {
      if (index === correctIndex) {
        correctIndex = 0; 
      } else if (index < correctIndex) {
        correctIndex--; 
      }
    }
    
    setFormData(prev => ({
      ...prev,
      options: updatedOptions,
      correctAnswerIndex: correctIndex
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !quizId) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (isEditMode && questionId) {
        await updateQuestion({
          quizId,
          questionId,
          questionData: formData
        }).unwrap();
      } else {
        await createQuestion({
          quizId,
          questionData: formData
        }).unwrap();
      }
      navigate(`/admin/quizzes/${quizId}/questions`);
    } catch (error) {
      console.error('Failed to save question:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!quiz) {
    return <div className="text-center py-10">Loading quiz data...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        {isEditMode ? 'Edit Question' : 'Add New Question'} for {quiz.name}
      </h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="text" className="block text-sm font-medium text-gray-700">
              Question Text*
            </label>
            <textarea
              id="text"
              name="text"
              value={formData.text}
              onChange={handleChange}
              rows={3}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.text ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            />
            {errors.text && (
              <p className="mt-1 text-sm text-red-600">{errors.text}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="competency" className="block text-sm font-medium text-gray-700">
                Competency*
              </label>
              <input
                type="text"
                id="competency"
                name="competency"
                value={formData.competency}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.competency ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors.competency && (
                <p className="mt-1 text-sm text-red-600">{errors.competency}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="level" className="block text-sm font-medium text-gray-700">
                Level*
              </label>
              <select
                id="level"
                name="level"
                value={formData.level}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.level ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              >
                <option value="A1">A1</option>
                <option value="A2">A2</option>
                <option value="B1">B1</option>
                <option value="B2">B2</option>
                <option value="C1">C1</option>
                <option value="C2">C2</option>
              </select>
              {errors.level && (
                <p className="mt-1 text-sm text-red-600">{errors.level}</p>
              )}
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Answer Options*
              </label>
              <button
                type="button"
                onClick={handleAddOption}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                + Add Option
              </button>
            </div>
            
            {errors.options && (
              <p className="mt-1 text-sm text-red-600 mb-2">{errors.options}</p>
            )}
            
            <div className="space-y-3">
              {(formData.options as QuestionOption[]).map((option, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-none w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    {option.key}
                  </div>
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${option.key}`}
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <label htmlFor="correctAnswerIndex" className="block text-sm font-medium text-gray-700">
              Correct Answer*
            </label>
            <select
              id="correctAnswerIndex"
              name="correctAnswerIndex"
              value={formData.correctAnswerIndex}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.correctAnswerIndex ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            >
              {(formData.options as QuestionOption[]).map((option, index) => (
                <option key={index} value={index}>
                  {option.key}: {option.text.substring(0, 30)}{option.text.length > 30 ? '...' : ''}
                </option>
              ))}
            </select>
            {errors.correctAnswerIndex && (
              <p className="mt-1 text-sm text-red-600">{errors.correctAnswerIndex}</p>
            )}
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => navigate(`/admin/quizzes/${quizId}/questions`)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isSubmitting ? 'Saving...' : isEditMode ? 'Update Question' : 'Add Question'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuestionForm;
