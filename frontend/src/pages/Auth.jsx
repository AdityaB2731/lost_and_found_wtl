import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const AuthPageLayout = ({ children }) => (
  <div className="mx-auto flex max-w-6xl items-center justify-center py-6 md:py-12">
    {children}
  </div>
);

const AuthCard = ({ mode }) => {
  const { signIn, signUp, isSignedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const destination = location.state?.from || '/';

  useEffect(() => {
    if (isSignedIn) {
      navigate(destination, { replace: true });
    }
  }, [destination, isSignedIn, navigate]);

  useEffect(() => {
    if (mode === 'signin' && location.state?.prefillEmail) {
      setFormData((current) => ({ ...current, email: location.state.prefillEmail }));
    }
  }, [location.state, mode]);

  const handleChange = (event) => {
    if (errorMessage) {
      setErrorMessage('');
    }

    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const validateForm = () => {
    if (mode === 'signup' && formData.fullName.trim().length < 3) {
      return 'Full name must be at least 3 characters long.';
    }

    if (!formData.email.trim()) {
      return 'Email is required.';
    }

    if (formData.password.length < 4) {
      return 'Password must be at least 4 characters long.';
    }

    return '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const credentials = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      };

      if (mode === 'signup') {
        await signUp(credentials);
        navigate('/sign-in', { state: { prefillEmail: formData.email } });
      } else {
        await signIn(credentials);
        navigate(destination, { replace: true });
      }
    } catch (error) {
      console.error('Auth error:', error);
      alert(error.response?.data?.message || 'Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-surface grid w-full overflow-hidden rounded-[2rem] md:grid-cols-[1.15fr_0.85fr]">
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-sky-500 p-8 text-white md:p-11">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/20 blur-xl" />
        <div className="absolute -bottom-10 -left-8 h-40 w-40 rounded-full bg-cyan-200/30 blur-2xl" />
        <p className="text-xs uppercase tracking-[0.34em] text-blue-100">Lost & Found Network</p>
        <h1 className="mt-5 text-4xl font-bold leading-tight md:text-5xl">
          {mode === 'signup' ? 'Start Helping Locally' : 'Welcome Back'}
        </h1>
        <p className="mt-4 max-w-md text-sm leading-6 text-blue-50/95">
          {mode === 'signup'
            ? 'Create your dummy account and post found items in a redesigned, frontend-only workspace.'
            : 'Sign in to continue managing your listings, claims, and notifications.'}
        </p>

        <div className="mt-10 grid gap-3 text-sm">
          <div className="rounded-xl bg-white/15 px-4 py-3">Login And Signup</div>
          <div className="rounded-xl bg-white/15 px-4 py-3">Use Proper Email</div>
          {/* <div className="rounded-xl bg-white/15 px-4 py-3"></div> */}
        </div>
      </div>

      <div className="p-8 md:p-10">
        <div className="mb-8 flex gap-2 rounded-full bg-blue-50 p-1 text-sm font-semibold">
          <div className={`flex-1 rounded-full px-4 py-2 text-center ${mode === 'signin' ? 'bg-white text-blue-800 shadow-sm' : 'text-blue-500'}`}>
            Sign In
          </div>
          <div className={`flex-1 rounded-full px-4 py-2 text-center ${mode === 'signup' ? 'bg-white text-blue-800 shadow-sm' : 'text-blue-500'}`}>
            Sign Up
          </div>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="fullName">
                Full name
              </label>
              <input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                minLength={3}
                className="w-full rounded-xl border border-blue-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="Jane Doe"
              />
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-blue-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={4}
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-xl border border-blue-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="At least 4 characters"
            />
          </div>

          {errorMessage && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600" role="alert">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="brand-button w-full rounded-xl px-4 py-3 font-semibold disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Working...' : mode === 'signup' ? 'Create account' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          {mode === 'signup' ? 'Already have a local session?' : 'Need a local session?'}{' '}
          <Link
            to={mode === 'signup' ? '/sign-in' : '/sign-up'}
            className="font-semibold text-blue-700 hover:text-blue-800"
          >
            {mode === 'signup' ? 'Sign in' : 'Sign up'}
          </Link>
        </p>
      </div>
    </div>
  );
};

export const SignInPage = () => (
  <AuthPageLayout>
    <AuthCard mode="signin" />
  </AuthPageLayout>
);

export const SignUpPage = () => (
  <AuthPageLayout>
    <AuthCard mode="signup" />
  </AuthPageLayout>
);