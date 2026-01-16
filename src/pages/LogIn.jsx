// import React, { useState, useEffect, useContext } from 'react';
// import { Link, useNavigate, useSearchParams } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { AuthContext } from '../context/AuthContext.jsx';
// import axios from "../axios.js";

// export default function LogIn() {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [loading, setLoading] = useState(false);
//     const navigate = useNavigate();
//     const [searchParams] = useSearchParams();
//     const { logIn } = useContext(AuthContext);

//     const redirectByRole = (user) => {
//         if (user?.role === "admin") navigate('/admin');
//         else if (user?.role === "seller") navigate('/your-products');
//         else navigate('/');
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);

//         try {
//             const resp = await axios.post("/api/auth/log-in", { email, password });
//             if (resp.status === 200 && resp.data.user) {
//                 logIn(resp.data.user);
//                 toast.success('Logged in successfully');
//                 redirectByRole(resp.data.user);
//             }
//         } catch (err) {
//             if (err.response?.data?.message) toast.error(err.response.data.message);
//             else toast.error("Unexpected error during login");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         const token = searchParams.get('token');
    
//         if (token) {
//             document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24}`;
    
//             (async () => {
//                 try {
//                     const me = await axios.get(
//                         "/api/auth/me",
//                         { withCredentials: true }
//                     );
    
//                     logIn(me.data.user);
//                     toast.success('Logged in successfully');
//                     redirectByRole(me.data.user);
    
//                 } catch (err) {
//                     console.error(err);
//                     toast.error("Failed to fetch user info after login.");
//                     navigate('/');
//                 }
//             })();
//         }
//     }, [searchParams]);
    

//     return (
//         <div className="flex flex-col justify-center items-center h-screen p-4">
//             <h1 className="text-3xl font-bold mb-6">Log In</h1>

//             <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-md gap-4">
//                 <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="border-2 border-gray-400 rounded p-2"/>
//                 <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="border-2 border-gray-400 rounded p-2"/>
//                 <button type="submit" disabled={loading} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition">
//                     {loading ? 'Logging in...' : 'Log In'}
//                 </button>
//             </form>

//             <div className="my-4">
//                 <a href={`${import.meta.env.VITE_API_BASE_PROD}/auth/google`} className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition">
//                     Continue with Google
//                 </a>
//             </div>

//             <p>
//                 Don't have an account? <Link className="text-blue-500" to="/sign-up">Sign up</Link>
//             </p>
//         </div>
//     );
// }
import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext.jsx';
import { ThemeContext } from '../context/ThemeContext.jsx';
import { Mail, Lock, LogIn as LogInIcon, Chrome } from 'lucide-react';
import axios from "../axios.js";

export default function LogIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { logIn } = useContext(AuthContext);
    const { theme } = useContext(ThemeContext);

    const redirectByRole = (user) => {
        if (user?.role === "admin") navigate('/admin');
        else if (user?.role === "seller") navigate('/your-products');
        else navigate('/');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const resp = await axios.post("/api/auth/log-in",
                { email, password },
                { withCredentials: true } // important
            );

            if (resp.status === 200 && resp.data.user) {
                logIn(resp.data.user);
                toast.success('Logged in successfully');
                redirectByRole(resp.data.user);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Unexpected error during login");
        } finally {
            setLoading(false);
        }
    };

    // handle token from OAuth / redirect
    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24}`;
            (async () => {
                try {
                    const me = await axios.get("/api/auth/me", { withCredentials: true });
                    logIn(me.data.user);
                    toast.success('Logged in successfully');
                    redirectByRole(me.data.user);
                } catch (err) {
                    console.error(err);
                    toast.error("Failed to fetch user info after login.");
                    navigate('/');
                }
            })();
        }
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
            <div
                className="w-full max-w-md p-8 rounded-2xl shadow-2xl backdrop-blur-sm relative z-10 transform transition-all duration-500 hover:scale-105"
                style={{
                    background: theme === 'dark'
                        ? 'rgba(31, 41, 55, 0.8)'
                        : 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: theme === 'dark'
                        ? '1px solid rgba(75, 85, 99, 0.3)'
                        : '1px solid rgba(209, 213, 219, 0.3)'
                }}
            >
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Welcome Back</h1>
                    <p className="text-indigo-100">Sign in to your account</p>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="relative group">
                        <Mail className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${theme === 'dark' ? 'text-gray-400 group-focus-within:text-indigo-400' : 'text-gray-500 group-focus-within:text-indigo-600'}`} />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            className={`w-full pl-12 pr-4 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 ${
                                theme === 'dark'
                                    ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:bg-gray-700'
                                    : 'bg-white/50 border-gray-300 text-gray-900 placeholder-gray-500 focus:bg-white'
                            }`}
                        />
                    </div>
                    <div className="relative group">
                        <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${theme === 'dark' ? 'text-gray-400 group-focus-within:text-indigo-400' : 'text-gray-500 group-focus-within:text-indigo-600'}`} />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            className={`w-full pl-12 pr-4 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 ${
                                theme === 'dark'
                                    ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:bg-gray-700'
                                    : 'bg-white/50 border-gray-300 text-gray-900 placeholder-gray-500 focus:bg-white'
                            }`}
                        />
                    </div>
                    {error && <p className="text-red-400 text-sm text-center bg-red-500/10 rounded-lg py-2">{error}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none overflow-hidden relative"
                    >
                        <span className="relative z-10 flex items-center justify-center space-x-2">
                            <LogInIcon className="w-5 h-5" />
                            <span>{loading ? 'Logging in...' : 'Log In'}</span>
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-700 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                </form>
                <div className="my-8 flex items-center">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>
                    <span className="px-4 text-gray-300 font-medium">or</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>
                </div>
                <a
                    href={`${import.meta.env.VITE_API_BASE_PROD}/auth/google`}
                    className="w-full flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm text-white py-4 rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105 border border-white/20"
                >
                    <Chrome className="w-5 h-5" />
                    Continue with Google
                </a>
                <p className="text-center mt-8 text-indigo-100">
                    Don't have an account? <Link className="text-white font-semibold hover:underline hover:text-indigo-200 transition-colors duration-300" to="/sign-up">Sign up</Link>
                </p>
            </div>
        </div>
    );
}
