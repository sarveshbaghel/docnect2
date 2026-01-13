
import React, { useState } from 'react';
import { UserProfile, Document, DocStatus, UserRole, DocType } from '../types';
import { 
  Upload, 
  Search, 
  Download, 
  Eye, 
  Clock, 
  CheckCircle, 
  XCircle, 
  LayoutGrid, 
  List, 
  Folder, 
  FileText, 
  Tag, 
  Activity,
  Users,
  ShieldCheck,
  User
} from 'lucide-react';
import UploadModal from './UploadModal';

interface StudentDashboardProps {
  user: UserProfile;
  documents: Document[];
  notifications: any[];
  onUpload: (doc: Document) => void;
}

type ViewLayout = 'list' | 'sections';
type GroupingCriteria = 'subject' | 'type' | 'status' | 'uploaderRole';

const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, documents, onUpload, notifications }) => {
  const [layout, setLayout] = useState<ViewLayout>('sections');
  const [grouping, setGrouping] = useState<GroupingCriteria>('subject');
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showUpload, setShowUpload] = useState(false);

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         doc.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' ? true : doc.uploaderId === user.id;
    return matchesSearch && matchesTab;
  });

  const groupDocuments = () => {
    return filteredDocs.reduce((acc, doc) => {
      let key = doc[grouping as keyof Document] as string;
      
      // Special logic for Uploader grouping to separate "Professor", "Me", and "Peers"
      if (grouping === 'uploaderRole') {
        if (doc.uploaderRole === UserRole.PROFESSOR) {
          key = 'PROFESSOR_RESOURCES';
        } else if (doc.uploaderId === user.id) {
          key = 'MY_UPLOADS';
        } else {
          key = 'PEER_CONTRIBUTIONS';
        }
      }
      
      if (!acc[key]) acc[key] = [];
      acc[key].push(doc);
      return acc;
    }, {} as Record<string, Document[]>);
  };

  const groupedData = groupDocuments();

  const getIconForCriteria = (criteria: GroupingCriteria) => {
    switch (criteria) {
      case 'subject': return <Folder size={18} />;
      case 'type': return <Tag size={18} />;
      case 'status': return <Activity size={18} />;
      case 'uploaderRole': return <Users size={18} />;
    }
  };

  const getGroupNameLabel = (key: string) => {
    if (grouping === 'uploaderRole') {
      switch (key) {
        case 'PROFESSOR_RESOURCES': return 'Official Professor Resources';
        case 'MY_UPLOADS': return 'My Uploads';
        case 'PEER_CONTRIBUTIONS': return 'Peer Contributions';
        default: return key;
      }
    }
    return key;
  };

  const getGroupStyles = (key: string) => {
    if (grouping === 'uploaderRole') {
      if (key === 'PROFESSOR_RESOURCES') return 'bg-indigo-600';
      if (key === 'MY_UPLOADS') return 'bg-emerald-500';
      return 'bg-slate-300';
    }
    return 'bg-indigo-600';
  };

  const renderDocCard = (doc: Document) => (
    <div key={doc.id} className="bg-white p-5 rounded-2xl border border-slate-100 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-50/50 transition-all group relative">
      {doc.uploaderRole === UserRole.PROFESSOR && (
        <div className="absolute -top-2 -right-2 bg-indigo-600 text-white p-1.5 rounded-lg shadow-lg z-10" title="Professor Uploaded">
          <ShieldCheck size={14} />
        </div>
      )}
      {doc.uploaderId === user.id && doc.uploaderRole !== UserRole.PROFESSOR && (
        <div className="absolute -top-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-lg shadow-lg z-10" title="My Upload">
          <User size={14} />
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
        <span>•</span>
        <span>{doc.uploadDate}</span>
      </div>
      {doc.aiSummary && (
        <p className="text-xs text-slate-500 mb-4 line-clamp-2 italic">"{doc.aiSummary}"</p>
      )}
      <div className="flex items-center justify-between pt-4 border-t border-slate-50">
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border border-white ${
            doc.uploaderRole === UserRole.PROFESSOR ? 'bg-indigo-600 text-white' : 
            doc.uploaderId === user.id ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600'
          }`}>
            {doc.uploaderName.charAt(0)}
          </div>
          <span className={`text-[10px] font-medium ${
            doc.uploaderRole === UserRole.PROFESSOR ? 'text-indigo-600 font-bold' : 
            doc.uploaderId === user.id ? 'text-emerald-600 font-bold' : 'text-slate-500'
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
          <h1 className="text-3xl font-bold text-slate-900">Document Repository</h1>
          <p className="text-slate-500">Browse categorized academic resources.</p>
        </div>
        <button 
          onClick={() => setShowUpload(true)}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-100 transition-all"
        >
          <Upload size={20} />
          Upload Document
        </button>
      </header>

      {/* Filter & View Controls */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-fit">
            <button 
              onClick={() => setActiveTab('all')}
              className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'all' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              All Library
            </button>
            <button 
              onClick={() => setActiveTab('my')}
              className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'my' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              My Files
            </button>
          </div>

          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by title, subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
            />
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => setLayout('sections')}
              className={`p-2.5 rounded-xl transition-all ${layout === 'sections' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-50 text-slate-400 hover:text-slate-600'}`}
              title="Section View"
            >
              <LayoutGrid size={20} />
            </button>
            <button 
              onClick={() => setLayout('list')}
              className={`p-2.5 rounded-xl transition-all ${layout === 'list' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-50 text-slate-400 hover:text-slate-600'}`}
              title="List View"
            >
              <List size={20} />
            </button>
          </div>
        </div>

        {layout === 'sections' && (
          <div className="flex items-center gap-3 pt-2 border-t border-slate-50 overflow-x-auto">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Group By:</span>
            {(['subject', 'type', 'status', 'uploaderRole'] as GroupingCriteria[]).map((criterion) => (
              <button
                key={criterion}
                onClick={() => setGrouping(criterion)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all capitalize whitespace-nowrap ${
                  grouping === criterion 
                    ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' 
                    : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300'
                }`}
              >
                {getIconForCriteria(criterion)}
                {criterion === 'uploaderRole' ? 'Uploader Type' : criterion}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {layout === 'sections' ? (
        <div className="space-y-12">
          {Object.entries(groupedData).length > 0 ? Object.entries(groupedData)
            .sort(([a], [b]) => {
              if (grouping === 'uploaderRole') {
                const order = { 'PROFESSOR_RESOURCES': 0, 'MY_UPLOADS': 1, 'PEER_CONTRIBUTIONS': 2 };
                return (order[a as keyof typeof order] ?? 99) - (order[b as keyof typeof order] ?? 99);
              }
              return 0;
            })
            .map(([groupKey, docs]) => (
            <section key={groupKey} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`h-8 w-1.5 rounded-full ${getGroupStyles(groupKey)}`}></div>
                <h3 className={`text-xl font-bold flex items-center gap-2 capitalize ${
                  grouping === 'uploaderRole' && groupKey === 'PROFESSOR_RESOURCES' ? 'text-indigo-900' : 
                  grouping === 'uploaderRole' && groupKey === 'MY_UPLOADS' ? 'text-emerald-900' : 'text-slate-800'
                }`}>
                  {getGroupNameLabel(groupKey)}
                  <span className="bg-slate-100 text-slate-500 text-xs px-2 py-0.5 rounded-full font-medium">
                    {docs.length}
                  </span>
                  {grouping === 'uploaderRole' && groupKey === 'PROFESSOR_RESOURCES' && (
                    <span className="ml-2 flex items-center gap-1 text-[10px] px-2 py-0.5 bg-indigo-600 text-white rounded-md uppercase tracking-wider">
                      <ShieldCheck size={10} />
                      Verified
                    </span>
                  )}
                  {grouping === 'uploaderRole' && groupKey === 'MY_UPLOADS' && (
                    <span className="ml-2 flex items-center gap-1 text-[10px] px-2 py-0.5 bg-emerald-600 text-white rounded-md uppercase tracking-wider">
                      <User size={10} />
                      Personal
                    </span>
                  )}
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {docs.map(doc => renderDocCard(doc))}
              </div>
            </section>
          )) : (
            <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
              <Search className="mx-auto text-slate-200 mb-4" size={64} strokeWidth={1} />
              <p className="text-slate-500 font-medium">No documents found matching your filters.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Document</th>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${doc.fileName.endsWith('pdf') ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                        <FileText size={18} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-slate-800 text-sm truncate max-w-[150px]">{doc.fileName}</p>
                          {doc.uploaderRole === UserRole.PROFESSOR && (
                            <ShieldCheck size={14} className="text-indigo-600" />
                          )}
                          {doc.uploaderId === user.id && doc.uploaderRole !== UserRole.PROFESSOR && (
                            <User size={14} className="text-emerald-600" />
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 uppercase font-bold">{doc.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-600">{doc.subject}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                      doc.status === DocStatus.APPROVED ? 'bg-emerald-50 text-emerald-600' : 
                      doc.status === DocStatus.REJECTED ? 'bg-red-50 text-red-600' : 
                      'bg-amber-50 text-amber-600'
                    }`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-400 font-medium">{doc.uploadDate}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all"><Eye size={18} /></button>
                      <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all"><Download size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showUpload && (
        <UploadModal 
          user={user} 
          onClose={() => setShowUpload(false)} 
          onUpload={(doc) => {
            onUpload(doc);
            setShowUpload(false);
          }} 
        />
      )}
    </div>
  );
};

export default StudentDashboard;
