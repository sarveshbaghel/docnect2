
import React, { useState, useEffect, useCallback } from 'react';
import { UserRole, UserProfile, Document, DocStatus, DocType, Notification } from './types';
import Login from './components/Auth';
import StudentDashboard from './components/DashboardStudent';
import ProfessorDashboard from './components/DashboardProfessor';
import NotificationsPage from './components/NotificationsPage';
import ProfilePage from './components/ProfilePage';
import { 
  BookOpen, 
  Bell, 
  LogOut, 
  User as UserIcon, 
  Menu, 
  X,
  FileText,
  LayoutDashboard
} from 'lucide-react';

const MOCK_STUDENT: UserProfile = {
  id: 's1',
  name: 'Alex Johnson',
  role: UserRole.STUDENT,
  email: 'alex.j@university.edu',
  rollNumber: 'CS2021-042',
  branch: 'Computer Science',
  year: '3rd Year'
};

const MOCK_PROFESSOR: UserProfile = {
  id: 'p1',
  name: 'Dr. Sarah Miller',
  role: UserRole.PROFESSOR,
  email: 'sarah.miller@university.edu',
};

const INITIAL_DOCS: Document[] = [
  {
    id: '1',
    fileName: 'DataStructures_L1.pdf',
    subject: 'Data Structures',
    type: DocType.NOTES,
    year: '2nd Year',
    branch: 'CS',
    uploadDate: '2023-10-15',
    uploaderId: 'p1',
    uploaderName: 'Dr. Sarah Miller',
    uploaderRole: UserRole.PROFESSOR,
    status: DocStatus.APPROVED,
    fileUrl: 'https://example.com/file1',
    aiSummary: 'Comprehensive overview of linked lists and stacks.'
  },
  {
    id: '2',
    fileName: 'Cloud_Computing_Proj.docx',
    subject: 'Cloud Computing',
    type: DocType.ASSIGNMENT,
    year: '4th Year',
    branch: 'IT',
    uploadDate: '2023-11-01',
    uploaderId: 's1',
    uploaderName: 'Alex Johnson',
    uploaderRole: UserRole.STUDENT,
    status: DocStatus.SUBMITTED,
    fileUrl: 'https://example.com/file2'
  }
];

type View = 'documents' | 'notifications' | 'profile';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [documents, setDocuments] = useState<Document[]>(INITIAL_DOCS);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState<View>('documents');

  const handleLogin = (role: UserRole) => {
    setCurrentUser(role === UserRole.STUDENT ? MOCK_STUDENT : MOCK_PROFESSOR);
    setActiveView('documents');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsSidebarOpen(false);
    setActiveView('documents');
  };

  const addDocument = (doc: Document) => {
    setDocuments(prev => [doc, ...prev]);
    if (doc.uploaderRole === UserRole.STUDENT) {
      addNotification(`New Submission: ${doc.fileName}`, `${doc.uploaderName} uploaded a document for ${doc.subject}.`);
    }
  };

  const updateDocStatus = (id: string, status: DocStatus, remarks?: string) => {
    setDocuments(prev => prev.map(d => d.id === id ? { ...d, status, remarks } : d));
    const doc = documents.find(d => d.id === id);
    if (doc) {
      addNotification(
        `Document ${status}`, 
        `Your document "${doc.fileName}" has been ${status.toLowerCase()}${remarks ? `: ${remarks}` : '.'}`
      );
    }
  };

  const addNotification = (title: string, message: string) => {
    const newNotif: Notification = {
      id: Date.now().toString(),
      title,
      message,
      date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const renderView = () => {
    if (!currentUser) return null;

    switch (activeView) {
      case 'notifications':
        return (
          <NotificationsPage 
            notifications={notifications} 
            onMarkAllRead={markAllAsRead} 
            onClear={clearNotifications}
          />
        );
      case 'profile':
        return <ProfilePage user={currentUser} documents={documents} />;
      case 'documents':
      default:
        return currentUser.role === UserRole.STUDENT ? (
          <StudentDashboard 
            user={currentUser} 
            documents={documents} 
            onUpload={addDocument}
            notifications={notifications}
          />
        ) : (
          <ProfessorDashboard 
            user={currentUser} 
            documents={documents} 
            onUpload={addDocument}
            onReview={updateDocStatus}
            notifications={notifications}
          />
        );
    }
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  const navItems = [
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: notifications.filter(n => !n.read).length },
    { id: 'profile', label: 'Profile', icon: UserIcon },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2 text-indigo-600">
          <BookOpen size={24} />
          <span className="font-bold text-lg">AcademiaRepo</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0
      `}>
        <div className="h-full flex flex-col">
          <div className="p-6 flex items-center gap-3 text-indigo-600 border-b">
            <BookOpen size={28} />
            <span className="font-bold text-xl">AcademiaRepo</span>
          </div>

          <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
            <div className="mb-8">
              <div 
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 border mb-6 cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => { setActiveView('profile'); setIsSidebarOpen(false); }}
              >
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold uppercase">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{currentUser.name}</p>
                  <p className="text-xs text-slate-500 capitalize">{currentUser.role.toLowerCase()}</p>
                </div>
              </div>

              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 mb-3">Main</h3>
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => {
                      setActiveView(item.id as View);
                      setIsSidebarOpen(false);
                    }}
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all font-medium relative ${
                      activeView === item.id 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'
                    }`}
                  >
                    <item.icon size={20} />
                    {item.label}
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className={`ml-auto text-[10px] px-1.5 py-0.5 rounded-full ${
                        activeView === item.id ? 'bg-white text-indigo-600' : 'bg-red-500 text-white'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <div className="p-4 border-t mt-auto">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-bold"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-y-auto h-screen p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
