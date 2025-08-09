import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  useGetAdminQuizByIdQuery, 
  useCreateQuizMutation, 
  useUpdateQuizMutation,
  Quiz
} from '../../api/quizApi';

interface FormErrors {
  name?: string;
  description?: string;
  niche?: string;
  totalQuestions?: number;
}

const QuizForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<Partial<Quiz>>({
    name: '',
    description: '',
    niche: '',
    totalQuestions: 0
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizDataInfo, setQuizDataInfo] = useState<Partial<Quiz>>({});

  const { data: quizData, isLoading: isLoadingQuiz } = useGetAdminQuizByIdQuery(id || '', { 
    skip: !isEditMode 
  });
  
  const [createQuiz, { isLoading: isCreating }] = useCreateQuizMutation();
  const [updateQuiz, { isLoading: isUpdating }] = useUpdateQuizMutation();


  useEffect(() => {
    console.log("useEffect triggered with quizData:", quizData);
    if (isEditMode && quizData) {
      const quizInfo = quizData.data ? quizData.data : quizData;
      console.log("Setting form data with:", quizInfo);
      
      setFormData({
        name: quizInfo.name || '',
        description: quizInfo.description || '',
        niche: quizInfo.niche || '',
        totalQuestions: quizInfo.totalQuestions || 0
      });
    }
  }, [isEditMode, quizData]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = 'Quiz name is required';
    }
    
    if (!formData.niche?.trim()) {
      newErrors.niche = 'Niche is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (isEditMode && id) {
        await updateQuiz({ id, quizData: formData }).unwrap();
      } else {
        await createQuiz(formData).unwrap();
      }
      navigate('/admin/quizzes');
    } catch (error) {
      console.error('Failed to save quiz:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEditMode && isLoadingQuiz) {
    return <div className="text-center py-10">Loading quiz data...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        {isEditMode ? 'Edit Quiz' : 'Create New Quiz'}
      </h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Quiz Name*
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              rows={4}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="niche" className="block text-sm font-medium text-gray-700">
              Niche/Category*
            </label>
            <input
              type="text"
              id="niche"
              name="niche"
              value={formData.niche || ''}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.niche ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            />
            {errors.niche && (
              <p className="mt-1 text-sm text-red-600">{errors.niche}</p>
            )}
          </div>
          <div>
            <label htmlFor="totalQuestions" className="block text-sm font-medium text-gray-700">
              Total Questions*
            </label>
            <input
              type="number"
              id="totalQuestions"
              name="totalQuestions"
              value={formData.totalQuestions || 0}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.totalQuestions ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            />
            {errors.totalQuestions && (
              <p className="mt-1 text-sm text-red-600">{errors.totalQuestions}</p>
            )}
          </div>
            
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/admin/quizzes')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isSubmitting ? 'Saving...' : isEditMode ? 'Update Quiz' : 'Create Quiz'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuizForm;
