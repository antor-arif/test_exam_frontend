import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useViewCertificateQuery, useDownloadCertificateQuery } from '../../api/userApi';

const CertificateViewer: React.FC = () => {
  const { certificateId } = useParams<{ certificateId: string }>();
  const navigate = useNavigate();
  const [isDownloading, setIsDownloading] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  
  const {
    data: certificateHtml,
    isLoading: isViewLoading,
    error: viewError
  } = useViewCertificateQuery(certificateId || '', {
    skip: !certificateId
  });
  
  const { 
    data: certificateBlob,
    isLoading: isDownloadLoading,
    error: downloadError
  } = useDownloadCertificateQuery(certificateId || '', {
    skip: !certificateId
  });
  
  useEffect(() => {
    if (certificateId) {
      setShareUrl(window.location.href);
    }
  }, [certificateId]);

  const handleDownload = () => {
    if (!certificateBlob || !certificateId) return;
    
    setIsDownloading(true);
    
    const url = window.URL.createObjectURL(certificateBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `certificate_${certificateId}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
    
    setTimeout(() => setIsDownloading(false), 1000);
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };
  
  if (!certificateId) {
    return (
      <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded shadow-md">
        <div className="p-4 bg-red-100 text-red-700 rounded">
          <p>No certificate ID provided. Please go back and try again.</p>
          <button
            onClick={() => navigate('/certificates')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Back to Certificates
          </button>
        </div>
      </div>
    );
  }
  
  if (isViewLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }
  
  if (viewError) {
    return (
      <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded shadow-md">
        <div className="p-4 bg-red-100 text-red-700 rounded">
          <p>Error loading certificate. The certificate may not exist or you may not have permission to view it.</p>
          <button
            onClick={() => navigate('/certificates')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Back to Certificates
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-5xl mx-auto mt-8 p-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
          <h1 className="text-xl font-semibold">Certificate</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowShareOptions(!showShareOptions)}
              className="px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                </svg>
                Share
              </div>
            </button>
            <button
              onClick={() => navigate('/certificates')}
              className="px-3 py-1.5 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
            >
              Back
            </button>
            <button
              onClick={handleDownload}
              disabled={isDownloading || isDownloadLoading}
              className="px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:bg-green-400"
            >
              {isDownloading || isDownloadLoading ? 'Downloading...' : 'Download PDF'}
            </button>
          </div>
        </div>
        
        {showShareOptions && (
          <div className="p-3 bg-gray-50 border-b">
            <div className="flex items-center">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-3 py-1.5 border rounded-l focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                onClick={handleCopyLink}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-r hover:bg-blue-700 transition"
              >
                {copySuccess ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        )}
        
        <div className="p-0">
          <iframe 
            srcDoc={certificateHtml || '<p>Certificate content unavailable</p>'}
            className="w-full h-[80vh] border-0"
            title="Certificate"
            sandbox="allow-same-origin"
          />
        </div>
      </div>
      
      {downloadError && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
          Error downloading certificate. Please try again.
        </div>
      )}
    </div>
  );
};

export default CertificateViewer;
