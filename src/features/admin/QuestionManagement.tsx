import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  useGetQuizByIdQuery,
  useGetQuizQuestionsQuery,
  useDeleteQuestionMutation,
  useUpdateQuestionMutation,
  Question,
  QuestionOption
} from '../../api/quizApi';
import Modal from '../../components/Modal';

interface EditingQuestion {
  _id: string;
  text: string;
  competency: string;
  level: string;
  options: QuestionOption[];
  correctKey?: string;
}

const QuestionManagement: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<EditingQuestion | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const { data: quizData, isLoading: isLoadingQuiz } = useGetQuizByIdQuery(quizId || '');

  const { data: questionsResponse, isLoading: isLoadingQuestions, refetch } = useGetQuizQuestionsQuery({ 
    quizId: quizId || '', 
    page, 
    limit 
  }, {
    refetchOnMountOrArgChange: true
  });
  const [deleteQuestion, { isLoading: isDeleting }] = useDeleteQuestionMutation();
  const [updateQuestion, { isLoading: isUpdating }] = useUpdateQuestionMutation();

  const confirmDelete = (question: Question) => {
    setSelectedQuestion(question);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (selectedQuestion && quizId) {
      try {
        await deleteQuestion({ quizId, questionId: selectedQuestion._id }).unwrap();
        setShowDeleteModal(false);
        refetch();
      } catch (err) {
        console.error('Failed to delete question:', err);
      }
    }
  };

  const startEditing = (question: Question) => {
    
    const formattedOptions = question.options.map((option, index) => {
      if (typeof option === 'string') {
        return { key: String.fromCharCode(65 + index), text: option };
      }
      return option as QuestionOption;
    });

    let correctKey = question.correctKey;
    if (!correctKey && question.correctAnswerIndex !== undefined) {
      correctKey = String.fromCharCode(65 + question.correctAnswerIndex);
    }

    setEditingQuestion({
      _id: question._id,
      text: question.text,
      competency: question.competency,
      level: question.level,
      options: formattedOptions,
      correctKey: correctKey
    });
  };

  const cancelEditing = () => {
    setEditingQuestion(null);
  };

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!editingQuestion) return;
    
    const { name, value } = e.target;
    setEditingQuestion(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleOptionChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingQuestion) return;
    
    const { value } = e.target;
    const updatedOptions = [...editingQuestion.options];
    updatedOptions[index] = { 
      ...updatedOptions[index] as QuestionOption, 
      text: value 
    };
    
    setEditingQuestion(prev => prev ? { ...prev, options: updatedOptions } : null);
  };

  const handleCorrectAnswerChange = (key: string) => {
    if (!editingQuestion) return;
    setEditingQuestion(prev => prev ? { ...prev, correctKey: key } : null);
  };

  const saveQuestion = async () => {
    if (!editingQuestion || !quizId) return;
    
    try {
      
      const correctAnswerIndex = editingQuestion.correctKey 
        ? editingQuestion.options.findIndex(
            option => (option as QuestionOption).key === editingQuestion.correctKey
          )
        : undefined;
      

      const questionData: Partial<Question> = {
        text: editingQuestion.text,
        competency: editingQuestion.competency,
        level: editingQuestion.level,
        options: editingQuestion.options.map(option => (option as QuestionOption).text),
        correctAnswerIndex,
        correctKey: editingQuestion.correctKey
      };
      
      await updateQuestion({
        quizId,
        questionId: editingQuestion._id,
        questionData
      }).unwrap();
      
      setEditingQuestion(null);
      refetch();
    } catch (error) {
      console.error('Failed to update question:', error);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (isLoadingQuiz || isLoadingQuestions) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (!quizData || !questionsResponse) {
    return <div className="text-center py-10">Quiz not found</div>;
  }


  const questions = Array.isArray(questionsResponse?.data) ? questionsResponse.data : [];
  console.log("Questions data:", questions);
  
  const totalPages = questionsResponse?.meta?.totalPages || 1;
  const totalQuestions = questionsResponse?.meta?.totalQuestions || 0;

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Link to="/admin/quizzes" className="text-blue-600 hover:underline flex items-center">
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Quizzes
        </Link>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{quizData.name}: Questions</h1>
          <p className="text-gray-600">{quizData.description}</p>
          <p className="text-sm text-gray-500 mt-1">
            Total Questions: {totalQuestions} | 
            Showing Page {questionsResponse?.meta?.page || 1} of {totalPages}
          </p>
        </div>
        <Link 
          to={`/admin/quizzes/${quizId}/questions/new`}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Add New Question
        </Link>
      </div>

      {questions && questions.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Competency</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Options</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {questions.map((question) => (
                  <tr key={question._id} className={editingQuestion?._id === question._id ? "bg-blue-50" : ""}>
                    <td className="px-6 py-4">
                      {editingQuestion?._id === question._id ? (
                        <textarea
                          name="text"
                          value={editingQuestion.text}
                          onChange={handleQuestionChange}
                          className="w-full px-2 py-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                          rows={3}
                        />
                      ) : (
                        <div className="text-sm text-gray-900">{question.text}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingQuestion?._id === question._id ? (
                        <input
                          type="text"
                          name="competency"
                          value={editingQuestion.competency}
                          onChange={handleQuestionChange}
                          className="w-full px-2 py-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <div className="text-sm text-gray-900">{question.competency}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingQuestion?._id === question._id ? (
                        <select
                          name="level"
                          value={editingQuestion.level}
                          onChange={handleQuestionChange}
                          className="w-full px-2 py-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="A1">A1</option>
                          <option value="A2">A2</option>
                          <option value="B1">B1</option>
                          <option value="B2">B2</option>
                          <option value="C1">C1</option>
                          <option value="C2">C2</option>
                        </select>
                      ) : (
                        <div className="text-sm text-gray-900 capitalize">{question.level}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingQuestion?._id === question._id ? (
                        <div className="space-y-2">
                          {editingQuestion.options.map((option, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <div className="w-8 flex-shrink-0">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center cursor-pointer ${
                                  editingQuestion.correctKey === option.key 
                                    ? 'bg-green-500 text-white' 
                                    : 'border border-gray-300 text-gray-700'
                                }`}
                                onClick={() => handleCorrectAnswerChange(option.key)}>
                                  {option.key}
                                </div>
                              </div>
                              <input
                                type="text"
                                value={option.text}
                                onChange={(e) => handleOptionChange(index, e)}
                                className="flex-grow px-2 py-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-900">
                          {Array.isArray(question.options) && question.options.length} options
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {editingQuestion?._id === question._id ? (
                          <>
                            <button 
                              onClick={saveQuestion}
                              disabled={isUpdating}
                              className="text-green-600 hover:text-green-900 flex items-center"
                              title="Save changes"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                              <span className="ml-1">Save</span>
                            </button>
                            <button 
                              onClick={cancelEditing}
                              className="text-red-600 hover:text-red-900 flex items-center"
                              title="Cancel editing"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                              </svg>
                              <span className="ml-1">Cancel</span>
                            </button>
                          </>
                        ) : (
                          <>
                            <button 
                              onClick={() => startEditing(question)}
                              className="text-indigo-600 hover:text-indigo-900 flex items-center"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                              </svg>
                              Edit
                            </button>
                            <Link 
                              to={`/admin/quizzes/${quizId}/questions/${question._id}/edit`}
                              className="text-blue-600 hover:text-blue-900 flex items-center"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                              </svg>
                              Full Edit
                            </Link>
                            <button 
                              onClick={() => confirmDelete(question)}
                              className="text-red-600 hover:text-red-900 flex items-center"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                              </svg>
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {totalPages > 1 && questions.length > 0 && (
            <div className="flex justify-center mt-6">
              <nav className="inline-flex rounded-md shadow">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className={`px-4 py-2 rounded-l-md border ${
                    page === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-4 py-2 border-t border-b ${
                      page === i + 1
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className={`px-4 py-2 rounded-r-md border ${
                    page === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <svg className="w-20 h-20 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <h2 className="text-xl font-bold text-gray-800 mb-2">No Questions Yet</h2>
          <p className="text-gray-500 mb-6">This quiz doesn't have any questions yet. Create your first question to get started.</p>
          <Link 
            to={`/admin/quizzes/${quizId}/questions/new`}
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            Add Your First Question
          </Link>
        </div>
      )}

      {showDeleteModal && selectedQuestion && (
        <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-sm text-gray-500 mb-4">
              Are you sure you want to delete this question? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default QuestionManagement;
