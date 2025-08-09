import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../hooks';

interface Certificate {
  _id: string;
  quizName: string;
  levelAwarded: string;
  issueDate: string;
  certificateUrl: string;
}

const Certificates: React.FC = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useAppSelector((state) => state.auth.user);
  
  useEffect(() => {
    setTimeout(() => {
      const mockCertificates: Certificate[] = [
        {
          _id: '1',
          quizName: 'JavaScript Fundamentals',
          levelAwarded: 'Intermediate',
          issueDate: '2025-08-05T10:30:00Z',
          certificateUrl: '/certificates/js-cert.pdf'
        },
        {
          _id: '2',
          quizName: 'JavaScript Fundamentals',
          levelAwarded: 'Advanced',
          issueDate: '2025-08-06T14:45:00Z',
          certificateUrl: '/certificates/js-adv-cert.pdf'
        }
      ];
      
      setCertificates(mockCertificates);
      setLoading(false);
    }, 1000);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4">
      <h1 className="text-3xl font-bold mb-6">My Certificates</h1>
      
      {certificates.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded text-center">
          <p className="text-yellow-800">You haven't earned any certificates yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <div key={cert._id} className="bg-white rounded-lg border border-gray-200 shadow-md overflow-hidden">
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="text-xl font-bold tracking-tight text-gray-900 mb-1">{cert.quizName}</h5>
                    <p className="text-gray-500 text-sm">Issued on {formatDate(cert.issueDate)}</p>
                  </div>
                  <span 
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      cert.levelAwarded === 'Advanced' ? 'bg-green-100 text-green-800' :
                      cert.levelAwarded === 'Intermediate' ? 'bg-blue-100 text-blue-800' :
                      cert.levelAwarded === 'Beginner' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {cert.levelAwarded}
                  </span>
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <a 
                    href={cert.certificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300"
                  >
                    View Certificate
                    <svg className="ml-2 -mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                    </svg>
                  </a>
                  
                  <button 
                    className="inline-flex items-center py-2 px-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:ring-4 focus:ring-gray-300"
                  >
                    <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-blue-800 mb-2">Share Your Achievements</h2>
        <p className="text-blue-700 mb-4">
          Your certificates can be shared directly with potential employers or on professional networks.
        </p>
        <div className="flex space-x-2">
          <button className="inline-flex items-center py-2 px-3 text-sm font-medium text-blue-700 bg-white rounded-lg border border-blue-200 hover:bg-blue-50">
            <svg className="mr-2 w-4 h-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"></path>
            </svg>
            LinkedIn
          </button>
          <button className="inline-flex items-center py-2 px-3 text-sm font-medium text-blue-700 bg-white rounded-lg border border-blue-200 hover:bg-blue-50">
            <svg className="mr-2 w-4 h-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"></path>
            </svg>
            Twitter
          </button>
          <button className="inline-flex items-center py-2 px-3 text-sm font-medium text-blue-700 bg-white rounded-lg border border-blue-200 hover:bg-blue-50">
            <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            Email
          </button>
        </div>
      </div>
    </div>
  );
};

export default Certificates;
