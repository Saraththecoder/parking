import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layout, Landmark, User, Mail, Phone, Lock, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('seeker');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !phone || !password) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (!agree) {
      toast.error("You must agree to the Terms of Service.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Account registered successfully! Please log in.");
      navigate(`/login?role=${role}`);
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
          <h2 className="mt-6 text-3xl font-extrabold text-slate-900 tracking-tight">Create your account</h2>
        </div>

        {/* Register Card */}
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl shadow-premium border border-slate-200">
          
          {/* Role selector */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 text-center">I want to register as a</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('seeker')}
                className={`py-3 px-2 text-sm font-bold rounded-xl border transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                  role === 'seeker'
                    ? 'border-parkgreen bg-green-50 text-parkgreen'
                    : 'border-slate-200 text-slate-500 hover:border-slate-300'
                }`}
              >
                <Layout size={18} />
                <span>Driver (Search spots)</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('owner')}
                className={`py-3 px-2 text-sm font-bold rounded-xl border transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                  role === 'owner'
                    ? 'border-parkgreen bg-green-50 text-parkgreen'
                    : 'border-slate-200 text-slate-500 hover:border-slate-300'
                }`}
              >
                <Landmark size={18} />
                <span>Host (Rent out space)</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <User size={16} />
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Arjun Malhotra"
                  className="pl-10 w-full px-3 py-2.5 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-parkgreen rounded-xl text-sm outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="arjun@email.com"
                  className="pl-10 w-full px-3 py-2.5 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-parkgreen rounded-xl text-sm outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Phone Number</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Phone size={16} />
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="+91 98765 43210"
                  className="pl-10 w-full px-3 py-2.5 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-parkgreen rounded-xl text-sm outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="pl-10 w-full px-3 py-2.5 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-parkgreen rounded-xl text-sm outline-none transition-all"
                />
              </div>
            </div>

            {/* Agree Checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 text-xs text-slate-500 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="rounded border-slate-300 text-parkgreen focus:ring-parkgreen mt-0.5"
                />
                <span className="leading-tight">
                  I agree to Plantopark's <a href="#" className="font-semibold text-parkgreen hover:underline">Terms of Service</a>,{' '}
                  <a href="#" className="font-semibold text-parkgreen hover:underline">Privacy Policy</a>, and Host Rules.
                </span>
              </label>
            </div>

            {/* Register button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-parkgreen hover:bg-parkgreen-hover text-white text-sm font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Registering...</span>
                </>
              ) : (
                <span>Register Account</span>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-parkgreen hover:underline">
              Sign in
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Register;
