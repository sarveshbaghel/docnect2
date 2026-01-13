
import React from 'react';
import { UserProfile, Document, UserRole } from '../types';
import { 
  User as UserIcon, 
  Mail, 
  MapPin, 
  BookOpen, 
  Calendar, 
  Edit3, 
  Shield, 
  FileText,
  Award,
  Settings,
  ChevronRight
} from 'lucide-react';

interface ProfilePageProps {
  user: UserProfile;
  documents: Document[];
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, documents }) => {
  const userDocs = documents.filter(d => d.uploaderId === user.id);
  const isStudent = user.role === UserRole.STUDENT;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
        <p className="text-slate-500">Manage your academic identity and account settings.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-600 relative">
              <div className="absolute -bottom-12 left-8 p-1 bg-white rounded-3xl shadow-xl">
                <div className="w-24 h-24 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-4xl uppercase overflow-hidden border-2 border-slate-50">
                  {user.name.charAt(0)}
                </div>
              </div>
            </div>
            <div className="pt-16 pb-8 px-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-1">{user.name}</h2>
                  <p className="text-indigo-600 font-medium flex items-center gap-2">
                    {isStudent ? <Award size={16} /> : <Shield size={16} />}
                    {user.role}
                  </p>
                </div>
                <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
                  <Edit3 size={18} />
                  Edit Profile
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="p-2.5 bg-white text-slate-400 rounded-xl border border-slate-200 shadow-sm">
                    <Mail size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Email Address</p>
                    <p className="text-slate-800 font-semibold truncate">{user.email}</p>
                  </div>
                </div>

                {isStudent && (
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="p-2.5 bg-white text-slate-400 rounded-xl border border-slate-200 shadow-sm">
                      <BookOpen size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Roll Number</p>
                      <p className="text-slate-800 font-semibold">{user.rollNumber}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="p-2.5 bg-white text-slate-400 rounded-xl border border-slate-200 shadow-sm">
                    <MapPin size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Department/Branch</p>
                    <p className="text-slate-800 font-semibold">{user.branch || 'Information Technology'}</p>
                  </div>
                </div>

                {isStudent && (
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="p-2.5 bg-white text-slate-400 rounded-xl border border-slate-200 shadow-sm">
                      <Calendar size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Academic Year</p>
                      <p className="text-slate-800 font-semibold">{user.year}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <FileText size={22} className="text-indigo-600" />
              Recent Contributions
            </h3>
            {userDocs.length > 0 ? (
              <div className="space-y-4">
                {userDocs.slice(0, 3).map(doc => (
                  <div key={doc.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50 transition-colors border border-slate-100 group">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white text-indigo-600 rounded-xl shadow-sm border border-slate-100">
                        <FileText size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{doc.fileName}</p>
                        <p className="text-xs text-slate-500">{doc.subject} • {doc.uploadDate}</p>
                      </div>
                    </div>
                    <button className="p-2 text-slate-400 group-hover:text-indigo-600 hover:bg-white rounded-lg transition-all">
                      <ChevronRight size={20} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-slate-400 text-sm italic">No documents uploaded yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Cards */}
        <div className="space-y-8">
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 text-center">
            <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-indigo-100 shadow-sm">
              <Award size={40} />
            </div>
            <h4 className="text-xl font-bold text-slate-900 mb-2">Academic Rank</h4>
            <p className="text-sm text-slate-500 mb-6 px-4">Based on your uploads and resource ratings.</p>
            <div className="py-2 px-6 bg-indigo-600 text-white rounded-full inline-block font-bold text-sm shadow-lg shadow-indigo-100">
              Gold Contributor
            </div>
          </div>

          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
            <h4 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Settings size={20} className="text-slate-400" />
              Quick Settings
            </h4>
            <div className="space-y-2">
              <button className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all font-medium text-slate-700">
                Email Notifications
                <div className="w-10 h-6 bg-indigo-600 rounded-full relative shadow-inner">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow"></div>
                </div>
              </button>
              <button className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all font-medium text-slate-700">
                Two-Factor Auth
                <div className="w-10 h-6 bg-slate-200 rounded-full relative">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow"></div>
                </div>
              </button>
              <button className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all font-medium text-slate-700">
                Public Profile
                <div className="w-10 h-6 bg-indigo-600 rounded-full relative shadow-inner">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow"></div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
