import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';
import { documentService } from '../../services/documentService';
import type { AppDocument } from '../../types/document';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { FileText, Image as ImageIcon, Upload, File as FileIcon, Trash2, Download } from 'lucide-react';

export const EmployeeDocumentsPage: React.FC = () => {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [documents, setDocuments] = useState<AppDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user?.id) {
      loadDocuments();
    }
  }, [user]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const docs = await documentService.getEmployeeDocuments(user?.employeeId || user?.id || '');
      setDocuments(docs);
    } catch (err) {
      error('Error', 'Failed to load documents.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    
    try {
      const newDoc = await documentService.uploadDocument(user.employeeId || user.id, user.name, file);
      setDocuments(prev => [newDoc, ...prev]);
      success('Upload Successful', `${file.name} has been uploaded securely.`);
    } catch (err) {
      error('Upload Failed', 'There was an issue uploading your file.');
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (docId: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await documentService.deleteDocument(docId);
        setDocuments(prev => prev.filter(d => d.id !== docId));
        success('File Deleted', `${name} has been removed.`);
      } catch (err) {
        error('Delete Failed', 'Failed to delete the document.');
      }
    }
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FileText className="w-8 h-8 text-rose-500" />;
    if (type.includes('image')) return <ImageIcon className="w-8 h-8 text-blue-500" />;
    return <FileIcon className="w-8 h-8 text-slate-500" />;
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
            My Documents
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your personal files, identity proofs, and HR documents.
          </p>
        </div>
        <div>
          <input
            type="file"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          />
          <Button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Upload Document
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : documents.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-2">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center">
              <FileIcon className="w-8 h-8" />
            </div>
            <div>
              <p className="text-slate-900 font-bold">No documents uploaded yet</p>
              <p className="text-sm text-slate-500">Upload identity proofs or certifications here.</p>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {documents.map((doc) => (
            <Card key={doc.id} className="p-5 flex flex-col group hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-slate-50 rounded-xl">
                  {getFileIcon(doc.type)}
                </div>
                <div className="flex opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                  <button
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                    title="Download"
                    onClick={() => window.open(doc.url, '_blank')}
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                    title="Delete"
                    onClick={() => handleDelete(doc.id, doc.name)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-slate-900 truncate" title={doc.name}>
                  {doc.name}
                </h3>
                <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
                  <span>{formatSize(doc.size)}</span>
                  <span>{new Date(doc.uploadDate).toLocaleDateString()}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
