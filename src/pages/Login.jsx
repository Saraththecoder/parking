import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Mail, Lock, ShieldCheck, Landmark, Layout, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { users, setCurrentUser } = useApp();

  // Role selections: seeker, owner, admin
  const [selectedRole, setSelectedRole] = useState('seeker');
  const [email, setEmail] = useState('arjun@plantopark.in');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);

  // Check if role is pre-passed as query param
  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam && ['seeker', 'owner', 'admin'].includes(roleParam)) {
      setSelectedRole(roleParam);
      // Pre-fill corresponding email
      const matched = users.find(u => u.role === roleParam);
      if (matched) setEmail(matched.email);
    }
  }, [searchParams, users]);

  // Adjust prefilled credentials when role is toggled
  const handleRoleChange = (role) => {
    setSelectedRole(role);
    const matched = users.find(u => u.role === role);
    if (matched) {
      setEmail(matched.email);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      setIsLoading(false);
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.role === selectedRole);

      if (user) {
        setCurrentUser(user);
        toast.success(`Welcome back, ${user.name}!`);
        
        // Navigate to appropriate panel
        if (user.role === 'seeker') {
          navigate('/seeker/dashboard');
        } else if (user.role === 'owner') {
          navigate('/owner/dashboard');
        } else if (user.role === 'admin') {
          navigate('/admin/dashboard');
        }
      } else {
        toast.error("Invalid credentials or role selection.");
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        
        {/* Brand header */}
        <div className="text-center">
          <Link to="/" className="inline-block">
            <span className="text-2xl font-extrabold text-parkgreen tracking-tight">Plantopark</span>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Smart Park. Smart Earn.</p>
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-slate-900 tracking-tight">Sign in to your account</h2>
        </div>

        {/* Login Card */}
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl shadow-premium border border-slate-200">
          
          {/* Role selector tabs */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 text-center">Select Your Account Type</label>
            <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => handleRoleChange('seeker')}
                className={`py-2 px-1 text-xs font-bold rounded-lg transition-all flex flex-col items-center gap-1 cursor-pointer ${
                  selectedRole === 'seeker'
                    ? 'bg-white text-parkgreen shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Layout size={14} />
                <span>Driver</span>
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('owner')}
                className={`py-2 px-1 text-xs font-bold rounded-lg transition-all flex flex-col items-center gap-1 cursor-pointer ${
                  selectedRole === 'owner'
                    ? 'bg-white text-parkgreen shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Landmark size={14} />
                <span>Host/Owner</span>
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('admin')}
                className={`py-2 px-1 text-xs font-bold rounded-lg transition-all flex flex-col items-center gap-1 cursor-pointer ${
                  selectedRole === 'admin'
                    ? 'bg-white text-parkgreen shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <ShieldCheck size={14} />
                <span>Admin</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 w-full px-3 py-2.5 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-parkgreen rounded-xl text-sm outline-none transition-all"
                  placeholder="name@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 w-full px-3 py-2.5 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-parkgreen rounded-xl text-sm outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-slate-300 text-parkgreen focus:ring-parkgreen" />
                <span>Remember me</span>
              </label>
              <a href="#" className="font-semibold text-parkgreen hover:underline">Forgot password?</a>
            </div>

            {/* Login button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-parkgreen hover:bg-parkgreen-hover text-white text-sm font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-parkgreen hover:underline">
              Create an account
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
