import { Eye, EyeOff, MessageSquare, User, Lock, Loader2 } from "lucide-react";
import { useAuthStore } from "../Store/UseAuthStore";
import { useState } from "react";
import { Link } from "react-router-dom";
import AuthImagePattern from "../components/AuthImagePattern";
import toast from "react-hot-toast";

const SignupPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState(null);

    const { signUp, isSignUp } = useAuthStore();

    const validateForm = (e) => {
        e.preventDefault();
        if (!formData.fullname.trim()) {
            toast.error("Full name is required");
            return false; // Stop the function
        }
        if (!formData.email.trim()) {
            toast.error("Email is required");
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            toast.error("Invalid email format");
            return false;
        }
        if (!formData.password.trim()) {
            toast.error("Password is required");
            return false;
        }
        if (formData.password.length < 6) {
            toast.error("Password must be more than 6 characters");
            return false;
        }
        return true; // Return true if everything is correct
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        const success = validateForm(e); // Call validation
        if (success) {
            console.log("Sending data to signup:", formData); // Debug log
            signUp(formData);
        }
    };
    
    

    return (
        <div className="min-h-screen grid lg:grid-cols-2  mt-16">
            <div className="flex flex-col p-6 sm:p-12 justify-center items-center">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center mb-8">
                        <div className="flex flex-col items-center gap-2 group">
                            <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <MessageSquare className="size-6 text-primary" />
                            </div>
                            <h1 className="text-2xl font-bold mt-2">Create Account</h1>
                            <p className="text-base-content/60">Get started with your free account</p>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Full Name</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="size-5 text-base-content/40" />
                                </div>
                                <input 
                                    type="text"
                                    className="input input-bordered w-full pl-10"
                                    placeholder="Idowu Joseph"
                                    value={formData.fullname}
                                    onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Email</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="size-5 text-base-content/40" />
                                </div>
                                <input 
                                    type="email"
                                    className="input input-bordered w-full pl-10"
                                    placeholder="idowujo@gmail.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Password</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="size-5 text-base-content/40" />
                                </div>
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    className="input input-bordered w-full pl-10"
                                    placeholder="**********"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <button 
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center" 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <EyeOff className="size-5 text-base-content/40"/>
                                    ) : (
                                        <Eye className="size-5 text-base-content/40"/>
                                    )}
                                </button>
                            </div>
                        </div>
                        {error && <div className="text-red-500 text-sm">{error}</div>}
                        <button type="submit" className="btn btn-primary w-full text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary" onClick={handleSubmit}>
                            {isSignUp ? (
                                <>
                                    <Loader2 className="size-5 animate-spin"/>
                                    Loading ...
                                </>
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </form>
                    <div className="text-center">
                        <p className="text-base-content/60">
                            Already have an account? {''}
                            <Link to="/login" className="link link-primary">
                                Signin
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
            <AuthImagePattern
            title="Join our community"
            subtitle="Connect with friends, share moments, and stay in touch with Loved ones"
            />

        </div>
    );
};

export default SignupPage;