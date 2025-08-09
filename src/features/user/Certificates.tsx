import React, { useState, useEffect } from 'react';
import { useGetUserCertificatesQuery, useDownloadCertificateQuery } from '../../api/userApi';
import { useAppSelector } from '../../hooks';

const Certificates: React.FC = () => {
  const [selectedCertificateId, setSelectedCertificateId] = useState<string | null>(null);
  const [viewingCertificate, setViewingCertificate] = useState<string | null>(null);
  const user = useAppSelector((state) => state.auth.user);
  
  const { 
    data: certificatesData, 
    isLoading, 
    error: certificatesError 
  } = useGetUserCertificatesQuery();
  
  const { 
    data: certificateBlob,
    isFetching: isDownloading,
    error: downloadError
  } = useDownloadCertificateQuery(selectedCertificateId || '', {
    skip: !selectedCertificateId
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const handleDownload = (resultId: string) => {
    setSelectedCertificateId(resultId);
    if (certificateBlob) {
      downloadCertificate(certificateBlob, resultId);
    }
  };
  
  const downloadCertificate = (blob: Blob, resultId: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `certificate_${resultId}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
    setSelectedCertificateId(null);
  };
  
  const handleViewCertificate = (viewUrl: string | null) => {
    if (viewUrl) {
      window.open(viewUrl, '_blank');
    }
  };
  
  useEffect(() => {
    if (certificateBlob && selectedCertificateId) {
      downloadCertificate(certificateBlob, selectedCertificateId);
    }
  }, [certificateBlob, selectedCertificateId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  if (certificatesError) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded">
        <p>Error loading certificates. Please try again later.</p>
      </div>
    );
  }

  const certificates = certificatesData?.data || [];

  if (certificates.length === 0) {
    return (
      <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">My Certificates</h2>
        <div className="p-12 text-center bg-gray-50 rounded-lg">
          <div className="mb-4">
            <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-700 mb-2">No Certificates Yet</h3>
          <p className="text-gray-500 mb-6">Complete quizzes with passing scores to earn certificates</p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Browse Available Quizzes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">My Certificates</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {certificates.map((certificate) => (
          <div
            key={certificate.id}
            className="border rounded-lg p-4 bg-gray-50 hover:shadow-md transition"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-gray-800">{certificate.quizName}</h3>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                certificate.level === 'Expert' ? 'bg-purple-100 text-purple-800' :
                certificate.level === 'Advanced' ? 'bg-blue-100 text-blue-800' :
                certificate.level === 'Intermediate' ? 'bg-green-100 text-green-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {certificate.level}
              </span>
            </div>
            
            <div className="text-gray-600 text-sm mb-4">
              <p>Certificate ID: {certificate.certificateId || 'N/A'}</p>
              <p>Issued: {formatDate(certificate.date)}</p>
              <p>Score: {certificate.score}%</p>
            </div>
            
            <div className="flex space-x-2 mt-4">
              <button
                onClick={() => handleViewCertificate(certificate.viewUrl)}
                disabled={!certificate.viewUrl}
                className="flex-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition disabled:bg-blue-300"
              >
                View Certificate
              </button>
              <button
                onClick={() => handleDownload(certificate.id)}
                disabled={isDownloading && selectedCertificateId === certificate.id}
                className="flex-1 px-3 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition disabled:bg-green-300"
              >
                {isDownloading && selectedCertificateId === certificate.id ? 'Downloading...' : 'Download PDF'}
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {downloadError && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
          Error downloading certificate. Please try again.
        </div>
      )}
    </div>
  );
};

export default Certificates;
