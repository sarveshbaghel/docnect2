
import React, { useState } from 'react';
import { UserProfile, Document, DocStatus, UserRole, DocType } from '../types';
import { 
  CheckCircle, 
  XCircle, 
  Download, 
  Eye, 
  Search, 
  Clock, 
  BarChart3, 
  FileText, 
  MessageSquare,
  Sparkles,
  LayoutGrid,
  Library,
  Folder,
  Tag,
  Activity,
  Users,
  ShieldCheck,
  User
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ProfessorDashboardProps {
  user: UserProfile;
  documents: Document[];
  notifications: any[];
  onUpload: (doc: Document) => void;
  onReview: (id: string, status: DocStatus, remarks?: string) => void;
}

type ViewMode = 'submissions' | 'library' | 'analytics';
type GroupingCriteria = 'subject' | 'type' | 'status' | 'uploaderRole';

const ProfessorDashboard: React.FC<ProfessorDashboardProps> = ({ user, documents, onReview }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState<ViewMode>('submissions');
  const [grouping, setGrouping] = useState<GroupingCriteria>('subject');
  const [reviewingDoc, setReviewingDoc] = useState<Document | null>(null);
  const [remarks, setRemarks] = useState('');

  const submissions = documents.filter(d => d.uploaderRole === UserRole.STUDENT);
  
  const filteredSubmissions = submissions.filter(doc => 
    doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    doc.uploaderName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredLibrary = documents.filter(doc => 
    doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    doc.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupLibrary = () => {
    return filteredLibrary.reduce((acc, doc) => {
      let key = doc[grouping as keyof Document] as string;

      if (grouping === 'uploaderRole') {
        if (doc.uploaderId === user.id) {
          key = 'MY_RESOURCES';
        } else if (doc.uploaderRole === UserRole.PROFESSOR) {
          key = 'OTHER_PROFESSORS';
        } else {
          key = 'STUDENT_SUBMISSIONS';
        }
      }

      if (!acc[key]) acc[key] = [];
      acc[key].push(doc);
      return acc;
    }, {} as Record<string, Document[]>);
  };

  const groupedData = groupLibrary();

  const getGroupNameLabel = (key: string) => {
    if (grouping === 'uploaderRole') {
      switch (key) {
        case 'MY_RESOURCES': return 'My Resources';
        case 'OTHER_PROFESSORS': return 'Other Professor Uploads';
        case 'STUDENT_SUBMISSIONS': return 'Student Submissions';
        default: return key;
      }
    }
    return key;
  };

  const getGroupStyles = (key: string) => {
    if (grouping === 'uploaderRole') {
      if (key === 'MY_RESOURCES') return 'bg-indigo-600';
      if (key === 'OTHER_PROFESSORS') return 'bg-purple-500';
      return 'bg-slate-300';
    }
    return 'bg-indigo-600';
  };

  // Analytics data
  const subjectDataMap = documents.reduce((acc: any, doc) => {
    acc[doc.subject] = (acc[doc.subject] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.keys(subjectDataMap).map(subject => ({
    name: subject,
    count: subjectDataMap[subject]
  }));

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981'];

  const handleReview = (status: DocStatus) => {
    if (reviewingDoc) {
      onReview(reviewingDoc.id, status, remarks);
      setReviewingDoc(null);
      setRemarks('');
    }
  };

  const renderDocCard = (doc: Document) => (
    <div key={doc.id} className="bg-white p-5 rounded-2xl border border-slate-100 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-50/50 transition-all group relative">
      {(doc.uploaderRole === UserRole.PROFESSOR || doc.uploaderId === user.id) && (
        <div className={`absolute -top-2 -right-2 text-white p-1.5 rounded-lg shadow-lg z-10 ${doc.uploaderId === user.id ? 'bg-indigo-600' : 'bg-purple-500'}`}>
          {doc.uploaderId === user.id ? <User size={14} /> : <ShieldCheck size={14} />}
        </div>
      )}
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${doc.fileName.endsWith('pdf') ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
          <FileText size={24} />
        </div>
        <div className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${
          doc.status === DocStatus.APPROVED ? 'bg-emerald-50 text-emerald-600' : 
          doc.status === DocStatus.REJECTED ? 'bg-red-50 text-red-600' : 
          'bg-amber-50 text-amber-600'
        }`}>
          {doc.status}
        </div>
      </div>
      <h4 className="font-bold text-slate-800 mb-1 truncate" title={doc.fileName}>{doc.fileName}</h4>
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
        <span className="bg-slate-100 px-2 py-0.5 rounded-md font-medium">{doc.type}</span>
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-slate-50">
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border border-white ${
            doc.uploaderId === user.id ? 'bg-indigo-600 text-white' : 
            doc.uploaderRole === UserRole.PROFESSOR ? 'bg-purple-500 text-white' : 'bg-slate-100 text-slate-600'
          }`}>
            {doc.uploaderName.charAt(0)}
          </div>
          <span className={`text-[10px] font-medium ${
            doc.uploaderId === user.id ? 'text-indigo-600 font-bold' : 
            doc.uploaderRole === UserRole.PROFESSOR ? 'text-purple-600 font-bold' : 'text-slate-500'
          }`}>
            {doc.uploaderId === user.id ? 'Me' : doc.uploaderName}
          </span>
        </div>
        <div className="flex gap-1">
          <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"><Eye size={16} /></button>
          <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"><Download size={16} /></button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Professor Portal</h1>
          <p className="text-slate-500">Manage submissions and organize document repository.</p>
        </div>
        <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm w-fit">
          <button 
            onClick={() => setView('submissions')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === 'submissions' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Clock size={16} />
            Submissions
          </button>
          <button 
            onClick={() => setView('library')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === 'library' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Library size={16} />
            Library
          </button>
          <button 
            onClick={() => setView('analytics')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === 'analytics' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <BarChart3 size={16} />
            Analytics
          </button>
        </div>
      </header>

      {view === 'analytics' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm col-span-1">
              <p className="text-sm font-medium text-slate-500 mb-1">Total Submissions</p>
              <p className="text-3xl font-bold">{submissions.length}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm col-span-1">
              <p className="text-sm font-medium text-slate-500 mb-1">Pending Review</p>
              <p className="text-3xl font-bold text-amber-500">{submissions.filter(s => s.status === DocStatus.SUBMITTED).length}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm col-span-1">
              <p className="text-sm font-medium text-slate-500 mb-1">Approval Rate</p>
              <p className="text-3xl font-bold text-emerald-600">
                {submissions.length ? Math.round((submissions.filter(s => s.status === DocStatus.APPROVED).length / submissions.length) * 100) : 0}%
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm col-span-1">
              <p className="text-sm font-medium text-slate-500 mb-1">Total Resources</p>
              <p className="text-3xl font-bold text-indigo-600">{documents.length}</p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 mb-8">Subject-wise Distribution</h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                  />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={40}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : view === 'library' ? (
        <div className="space-y-8">
          <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full md:w-fit overflow-x-auto pb-2 md:pb-0">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Group By:</span>
              {(['subject', 'type', 'status', 'uploaderRole'] as GroupingCriteria[]).map((criterion) => (
                <button
                  key={criterion}
                  onClick={() => setGrouping(criterion)}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all capitalize whitespace-nowrap ${
                    grouping === criterion 
                      ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' 
                      : 'bg-slate-50 text-slate-500 border border-slate-100 hover:border-slate-200'
                  }`}
                >
                  {criterion === 'subject' ? <Folder size={14}/> : criterion === 'type' ? <Tag size={14}/> : criterion === 'status' ? <Activity size={14}/> : <Users size={14}/>}
                  {criterion === 'uploaderRole' ? 'Uploader' : criterion}
                </button>
              ))}
            </div>
            <div className="relative w-full md:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search library..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
              />
            </div>
          </div>

          <div className="space-y-12">
            {Object.entries(groupedData).length > 0 ? Object.entries(groupedData)
              .sort(([a], [b]) => {
                if (grouping === 'uploaderRole') {
                  const order = { 'MY_RESOURCES': 0, 'OTHER_PROFESSORS': 1, 'STUDENT_SUBMISSIONS': 2 };
                  return (order[a as keyof typeof order] ?? 99) - (order[b as keyof typeof order] ?? 99);
                }
                return 0;
              })
              .map(([groupKey, docs]) => (
              <section key={groupKey} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`h-6 w-1 rounded-full ${getGroupStyles(groupKey)}`}></div>
                  <h3 className={`text-lg font-bold flex items-center gap-2 capitalize ${
                    grouping === 'uploaderRole' && groupKey === 'MY_RESOURCES' ? 'text-indigo-900' : 'text-slate-800'
                  }`}>
                    {getGroupNameLabel(groupKey)}
                    <span className="bg-slate-100 text-slate-400 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                      {docs.length}
                    </span>
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {docs.map(doc => renderDocCard(doc))}
                </div>
              </section>
            )) : (
              <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
                <Search className="mx-auto text-slate-200 mb-4" size={48} strokeWidth={1} />
                <p className="text-slate-400 text-sm font-medium">Nothing found in the repository.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-6 md:items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">Review Submissions</h2>
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by student or file name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Document</th>
                  <th className="px-6 py-4">Subject</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSubmissions.length > 0 ? filteredSubmissions.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-indigo-600">
                          {doc.uploaderName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 text-sm">{doc.uploaderName}</p>
                          <p className="text-[10px] text-slate-400">ID: ST-00{doc.uploaderId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FileText size={14} className="text-slate-400" />
                        <span className="text-sm font-medium text-slate-700 max-w-[150px] truncate">{doc.fileName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{doc.subject}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                        doc.status === DocStatus.APPROVED ? 'bg-emerald-100 text-emerald-700' : 
                        doc.status === DocStatus.REJECTED ? 'bg-red-100 text-red-700' : 
                        'bg-amber-100 text-amber-700 border border-amber-200'
                      }`}>
                        {doc.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {doc.status === DocStatus.SUBMITTED ? (
                        <button 
                          onClick={() => setReviewingDoc(doc)}
                          className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all"
                        >
                          Review Now
                        </button>
                      ) : (
                        <div className="flex items-center justify-end gap-2 text-slate-400">
                          <Eye size={18} className="cursor-pointer hover:text-indigo-600" />
                          <Download size={18} className="cursor-pointer hover:text-indigo-600" />
                        </div>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                      No pending submissions to review.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewingDoc && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-indigo-600 p-8 text-white relative">
              <button 
                onClick={() => setReviewingDoc(null)}
                className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <XCircle size={24} />
              </button>
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                  <FileText size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Review Submission</h2>
                  <p className="text-indigo-100 opacity-80">Check for accuracy and relevance.</p>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1">Document Name</p>
                  <p className="font-semibold text-slate-800 break-all">{reviewingDoc.fileName}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1">Student</p>
                  <p className="font-semibold text-slate-800">{reviewingDoc.uploaderName}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1">Subject</p>
                  <p className="font-semibold text-slate-800">{reviewingDoc.subject}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1">Type</p>
                  <p className="font-semibold text-slate-800">{reviewingDoc.type}</p>
                </div>
              </div>

              {/* AI Insight Placeholder */}
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-3">
                <Sparkles className="text-amber-500 shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="text-xs font-bold text-amber-800 mb-1">AI Suggestion</p>
                  <p className="text-xs text-amber-700 italic">
                    "This document seems relevant to the current curriculum. The content structure matches standard notes."
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <MessageSquare size={16} />
                  Professor's Remarks (Optional)
                </label>
                <textarea 
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="e.g. Excellent work, or please update page 3..."
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl h-24 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => handleReview(DocStatus.REJECTED)}
                  className="flex items-center justify-center gap-2 py-4 bg-white border-2 border-slate-100 hover:border-red-500 hover:bg-red-50 text-slate-600 hover:text-red-700 font-bold rounded-2xl transition-all"
                >
                  <XCircle size={20} />
                  Reject File
                </button>
                <button 
                  onClick={() => handleReview(DocStatus.APPROVED)}
                  className="flex items-center justify-center gap-2 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-100 transition-all"
                >
                  <CheckCircle size={20} />
                  Approve & Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessorDashboard;
