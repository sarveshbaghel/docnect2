
import React, { useState } from 'react';
import { UserRole } from '../types';
import { 
  BookOpen, 
  GraduationCap, 
  Briefcase, 
  ArrowLeft, 
  Mail, 
  Lock, 
  User as UserIcon,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface LoginProps {
  onLogin: (role: UserRole) => void;
}

type AuthView = 'selection' | 'student' | 'professor';

const Auth: React.FC<LoginProps> = ({ onLogin }) => {
  const [view, setView] = useState<AuthView>('selection');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      setIsLoading(false);
      onLogin(view === 'student' ? UserRole.STUDENT : UserRole.PROFESSOR);
    }, 1200);
  };

  const handleBack = () => {
    setView('selection');
    setFormData({ identifier: '', password: '' });
  };

  const renderSelection = () => (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500 flex flex-col justify-center space-y-6">
      <h2 className="text-xl font-bold text-slate-800 text-center mb-4">Choose Your Role to Continue</h2>
      
      <button 
        onClick={() => setView('student')}
        className="group w-full p-6 rounded-2xl border-2 border-slate-100 hover:border-indigo-500 hover:bg-indigo-50 transition-all text-left flex items-center gap-4 focus:ring-4 focus:ring-indigo-500/10 outline-none"
      >
        <div className="p-4 rounded-xl bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
          <GraduationCap size={28} />
        </div>
        <div className="flex-1">
          <div className="font-bold text-lg text-slate-800 flex items-center justify-between">
            I am a Student
            <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
          </div>
          <div className="text-sm text-slate-500">Access notes, upload assignments, and track progress.</div>
        </div>
      </button>

      <button 
        onClick={() => setView('professor')}
        className="group w-full p-6 rounded-2xl border-2 border-slate-100 hover:border-indigo-500 hover:bg-indigo-50 transition-all text-left flex items-center gap-4 focus:ring-4 focus:ring-indigo-500/10 outline-none"
      >
        <div className="p-4 rounded-xl bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
          <Briefcase size={28} />
        </div>
        <div className="flex-1">
          <div className="font-bold text-lg text-slate-800 flex items-center justify-between">
            I am a Professor
            <ChevronRight size={18} className="text-slate-300 group-hover:text-purple-500 transition-colors" />
          </div>
          <div className="text-sm text-slate-500">Review submissions, manage course content, and analyze data.</div>
        </div>
      </button>

      <div className="text-center pt-4">
        <p className="text-xs text-slate-400">
          By continuing, you agree to our <span className="underline cursor-pointer hover:text-indigo-600">Terms of Service</span> and <span className="underline cursor-pointer hover:text-indigo-600">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );

  const renderLoginForm = (role: 'student' | 'professor') => {
    const isStudent = role === 'student';
    return (
      <div className="animate-in fade-in slide-in-from-left-4 duration-500 flex flex-col h-full">
        <button 
          onClick={handleBack}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors text-sm font-medium mb-8 w-fit group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to selection
        </button>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            {isStudent ? 'Student Login' : 'Professor Login'}
          </h2>
          <p className="text-slate-500 text-sm">
            Please enter your university credentials to access the repository.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 block">
              {isStudent ? 'University Email or Roll Number' : 'University Email'}
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                {isStudent ? <UserIcon size={20} /> : <Mail size={20} />}
              </div>
              <input 
                type={isStudent ? "text" : "email"}
                required
                placeholder={isStudent ? "e.g. CS2021-042" : "name@university.edu"}
                value={formData.identifier}
                onChange={(e) => setFormData({...formData, identifier: e.target.value})}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-slate-700 block">Password</label>
              <button type="button" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">Forgot?</button>
            </div>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                <Lock size={20} />
              </div>
              <input 
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input type="checkbox" id="remember" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
            <label htmlFor="remember" className="text-sm text-slate-600 cursor-pointer select-none font-medium">Remember me on this device</label>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className={`
              w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2
              ${isLoading 
                ? 'bg-slate-400 cursor-not-allowed' 
                : (isStudent ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100' : 'bg-purple-600 hover:bg-purple-700 shadow-purple-100')}
            `}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <ShieldCheck size={20} />
                Sign In to Repository
              </>
            )}
          </button>
        </form>

        <div className="mt-auto pt-8 text-center">
          <p className="text-sm text-slate-500">
            Don't have an account? <span className="font-bold text-indigo-600 cursor-pointer hover:underline">Contact Administration</span>
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      {/* Background patterns */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-200 rounded-full blur-[120px]"></div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-white p-4 md:p-8 w-full max-w-5xl flex flex-col md:flex-row gap-12 relative z-10 overflow-hidden">
        {/* Left Side: Branding and Info */}
        <div className="flex-1 p-4 md:p-8 flex flex-col">
          <div className="flex items-center gap-3 text-indigo-600 mb-12">
            <div className="p-2 bg-indigo-600 text-white rounded-xl">
              <BookOpen size={24} />
            </div>
            <span className="font-bold text-2xl tracking-tight text-slate-900">AcademiaRepo</span>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-[1.15] tracking-tight">
              The Hub for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Academic Excellence</span>.
            </h1>
            <p className="text-slate-600 text-lg mb-10 leading-relaxed max-w-md">
              Centralize your course materials, assignments, and research papers. 
              Seamless collaboration between students and professors powered by AI insights.
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="p-5 rounded-3xl bg-slate-50 border border-slate-100">
                <div className="text-indigo-600 font-bold text-3xl mb-1">2k+</div>
                <div className="text-slate-500 text-sm font-medium">Documents Shared</div>
              </div>
              <div className="p-5 rounded-3xl bg-indigo-50 border border-indigo-100">
                <div className="text-indigo-600 font-bold text-3xl mb-1">15+</div>
                <div className="text-slate-500 text-sm font-medium">Departments Active</div>
              </div>
            </div>
          </div>
          
          <div className="mt-12 hidden md:block">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-widest">
              <ShieldCheck size={14} />
              Trusted by leading universities worldwide
            </div>
          </div>
        </div>

        {/* Right Side: Auth Forms */}
        <div className="flex-1 bg-white md:bg-slate-50/50 rounded-[2rem] p-6 md:p-10 border border-slate-100 flex flex-col">
          {view === 'selection' && renderSelection()}
          {view === 'student' && renderLoginForm('student')}
          {view === 'professor' && renderLoginForm('professor')}
        </div>
      </div>
    </div>
  );
};

export default Auth;
