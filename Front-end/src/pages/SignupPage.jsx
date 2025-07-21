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
    const [errors, setErrors] = useState({
        fullname: '',
        email: '',
        password: ''
    });

    const { signup, isSignUp } = useAuthStore();

    const validateField = (name, value) => {
        let error = '';
        
        switch(name) {
            case 'fullname':
                if (!value.trim()) error = 'Full name is required';
                else if (value.trim().length < 3) error = 'Name must be at least 3 characters';
                break;
            case 'email':
                if (!value.trim()) error = 'Email is required';
                else if (!/\S+@\S+\.\S+/.test(value)) error = 'Invalid email format';
                break;
            case 'password':
                if (!value.trim()) error = 'Password is required';
                else if (value.length < 6) error = 'Password must be at least 6 characters';
                break;
            default:
                break;
        }

        return error;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = { ...errors };

        Object.keys(formData).forEach(key => {
            const error = validateField(key, formData[key]);
            if (error) {
                newErrors[key] = error;
                isValid = false;
            }
        });

        setErrors(newErrors);
        return isValid;
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        try {
            await signup(formData);
        } catch (error) {
            toast.error(error.message || "Signup failed. Please try again.");
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 mt-16">
            <div className="flex flex-col p-6 sm:p-12 justify-center items-center">
                <div className="w-full max-w-md space-y-6">
                    <div className="text-center mb-8">
                        <div className="flex flex-col items-center gap-2 group">
                            <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <MessageSquare className="size-6 text-primary" />
                            </div>
                            <h1 className="text-2xl font-bold mt-2">Create Account</h1>
                            <p className="text-base-content/60">Get started with your free account</p>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
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
                                    name="fullname"
                                    className={`input input-bordered w-full pl-10 ${errors.fullname ? 'input-error' : ''}`}
                                    placeholder="Full Name"
                                    value={formData.fullname}
                                    onChange={handleChange}
                                    disabled={isSignUp}
                                />
                            </div>
                            {errors.fullname && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.fullname}</span>
                                </label>
                            )}
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
                                    name="email"
                                    className={`input input-bordered w-full pl-10 ${errors.email ? 'input-error' : ''}`}
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={isSignUp}
                                />
                            </div>
                            {errors.email && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.email}</span>
                                </label>
                            )}
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
                                    name="password"
                                    className={`input input-bordered w-full pl-10 ${errors.password ? 'input-error' : ''}`}
                                    placeholder="**********"
                                    value={formData.password}
                                    onChange={handleChange}
                                    disabled={isSignUp}
                                />
                                <button 
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center" 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    disabled={isSignUp}
                                >
                                    {showPassword ? (
                                        <EyeOff className="size-5 text-base-content/40"/>
                                    ) : (
                                        <Eye className="size-5 text-base-content/40"/>
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.password}</span>
                                </label>
                            )}
                        </div>
                        
                        <button 
                            type="submit" 
                            className="btn btn-primary w-full mt-6"
                            disabled={isSignUp}
                        >
                            {isSignUp ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </form>
                    
                    <div className="text-center pt-4">
                        <p className="text-base-content/60">
                            Already have an account? {''}
                            <Link to="/login" className="link link-primary font-medium">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
            <AuthImagePattern
                title="Join our community"
                subtitle="Connect with friends, share moments, and stay in touch with loved ones"
            />
        </div>
    );
};

export default SignupPage;