
import React, { useState, useRef } from 'react';
import { UserProfile, Document, DocStatus, DocType, UserRole } from '../types';
import { X, Upload, File, Sparkles, AlertCircle } from 'lucide-react';
import { summarizeDocument } from '../services/geminiService';

interface UploadModalProps {
  user: UserProfile;
  onClose: () => void;
  onUpload: (doc: Document) => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ user, onClose, onUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [subject, setSubject] = useState('');
  const [type, setType] = useState<DocType>(DocType.NOTES);
  const [isUploading, setIsUploading] = useState(false);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !subject) return;

    setIsUploading(true);
    setAiAnalyzing(true);

    // Call Gemini for summary
    const summary = await summarizeDocument(file.name, subject, type);
    
    setAiAnalyzing(false);

    const newDoc: Document = {
      id: Date.now().toString(),
      fileName: file.name,
      subject,
      type,
      year: user.year || 'N/A',
      branch: user.branch || 'N/A',
      uploadDate: new Date().toISOString().split('T')[0],
      uploaderId: user.id,
      uploaderName: user.name,
      uploaderRole: user.role,
      status: user.role === UserRole.PROFESSOR ? DocStatus.APPROVED : DocStatus.SUBMITTED,
      fileUrl: URL.createObjectURL(file), // Local URL simulation
      aiSummary: summary
    };

    // Simulate network delay
    setTimeout(() => {
      onUpload(newDoc);
      setIsUploading(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Upload Document</h2>
              <p className="text-slate-500 text-sm">Add resources for the academic repository.</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`
                border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all
                ${file ? 'border-indigo-500 bg-indigo-50/30' : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50'}
              `}
            >
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.doc,.docx"
              />
              {file ? (
                <div className="text-center">
                  <div className="p-4 bg-indigo-100 text-indigo-600 rounded-2xl w-fit mx-auto mb-4">
                    <File size={32} />
                  </div>
                  <p className="font-bold text-slate-800">{file.name}</p>
                  <p className="text-xs text-slate-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB • Click to change</p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="p-4 bg-slate-100 text-slate-400 rounded-2xl w-fit mx-auto mb-4">
                    <Upload size={32} />
                  </div>
                  <p className="font-bold text-slate-600">Click to upload file</p>
                  <p className="text-xs text-slate-400 mt-1">PDF, DOCX up to 20MB</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Subject Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Physics"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Document Type</label>
                <select 
                  value={type}
                  onChange={(e) => setType(e.target.value as DocType)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                >
                  {Object.values(DocType).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl">
              <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wider mb-2">
                <Sparkles size={14} />
                Smart AI Processing
              </div>
              <p className="text-xs text-indigo-600 leading-relaxed">
                Gemini AI will automatically scan your document to generate keywords and a professional summary for better searchability.
              </p>
            </div>

            <div className="pt-4 flex gap-4">
              <button 
                type="button"
                onClick={onClose}
                className="flex-1 py-4 font-bold text-slate-600 hover:bg-slate-50 rounded-2xl transition-all"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={!file || !subject || isUploading}
                className={`
                  flex-1 flex items-center justify-center gap-2 py-4 font-bold rounded-2xl shadow-lg transition-all
                  ${!file || !subject || isUploading 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' 
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100'}
                `}
              >
                {isUploading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    {aiAnalyzing ? 'AI Analyzing...' : 'Uploading...'}
                  </>
                ) : (
                  <>
                    <Upload size={20} />
                    Complete Upload
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
