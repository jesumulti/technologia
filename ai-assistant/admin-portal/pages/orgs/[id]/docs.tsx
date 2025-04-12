import { useState, useEffect } from 'react';
import Cookies from 'js-cookie'

interface FileItem {
  filename: string;
  size: number;
  uploadDate: string;
}


export default function OrgDocsPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const [fileList, setFileList] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus('Please select a file.');
      return;
    }

    setIsLoading(true);
    setUploadStatus(null); // Clear previous status

    const formData = new FormData();
    formData.append('file', selectedFile);

    const token = Cookies.get('token');
    const orgId = Cookies.get('orgId');
    try {
      const response = await fetch('/api/ingest-docs', {
        method: 'POST',
        headers: {
          'X-API-Key': token || '',
        },
        body: formData,
      });

      setIsLoading(false);
      if (response.ok) {
        setUploadStatus('File uploaded successfully!');
        fetchFileList(); // Refresh the file list
      } else {
        const errorData = await response.json();
        setUploadStatus(`File upload failed: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      setIsLoading(false);
      setUploadStatus(`An error occurred during upload: ${error.message}`);
    }
  };

  const fetchFileList = async () => {
    const orgId = Cookies.get('orgId');
    const token = Cookies.get('token');

    if (orgId && token) {
      try {
        const response = await fetch('/api/list-files', {
        method: 'GET',
        headers: {
            'X-API-Key': token,
            'Content-Type': 'application/json',
            'orgId': orgId // Pass orgId as a header
          },
        },
        );

        if (response.ok) {
          const data = await response.json();
          if (data && data.files) {
            setFileList(data.files);
          }
        } else {
          console.error('Failed to fetch file list');
        }
      } catch (error) {
        console.error('Error fetching file list:', error);
      }
    }
  };  


  useEffect(() => {
    fetchFileList();
  }, []);

  return (
    <>
       <h1>Upload Organization Docs</h1>
      <div>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload} disabled={!selectedFile || isLoading}>
          {isLoading ? 'Uploading...' : 'Upload'}
        </button>
        {uploadStatus && <p>{uploadStatus}</p>}
      </div>
      <h2>Uploaded Files</h2>
      {fileList.length === 0 ? (
        <p>No files uploaded yet.</p>
      ) : (
        <ul>
          {fileList.map((file, index) => (
            <li key={index}>
              {file.name} (Size: {file.size} bytes)
            </li>            
          ))}
        </ul>
      )}
    </>
  );
}