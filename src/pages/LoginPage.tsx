import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckSquare, Mail, Lock, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

export const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  
  const { login, register, forgotPassword: requestPasswordReset } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!forgotPassword) {
      if (!password) {
        newErrors.password = 'Password is required';
      } else if (password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
    }
    
    if (!isLogin && !forgotPassword && !name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      if (forgotPassword) {
        await requestPasswordReset(email);
        // Show success message or redirect
        alert('Password reset instructions sent to your email.');
        setForgotPassword(false);
      } else if (isLogin) {
        await login(email, password);
        navigate('/dashboard');
      } else {
        await register(email, password, name);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      alert('Authentication failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  const formTitle = forgotPassword 
    ? 'Reset Password' 
    : isLogin 
      ? 'Sign In' 
      : 'Create Account';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="card max-w-md w-full p-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <CheckSquare size={40} className="text-primary-600 dark:text-primary-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Remainder</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Your personal task management app</p>
        </motion.div>
        
        <motion.h2 variants={itemVariants} className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          {formTitle}
        </motion.h2>
        
        <motion.form onSubmit={handleSubmit} className="space-y-5" variants={containerVariants}>
          {!isLogin && !forgotPassword && (
            <motion.div variants={itemVariants}>
              <Input
                id="name"
                label="Full Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                error={errors.name}
                autoComplete="name"
              />
            </motion.div>
          )}
          
          <motion.div variants={itemVariants}>
            <Input
              id="email"
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              error={errors.email}
              autoComplete="email"
              icon={<Mail className="h-5 w-5 text-gray-400" />}
            />
          </motion.div>
          
          {!forgotPassword && (
            <motion.div variants={itemVariants}>
              <Input
                id="password"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isLogin ? "Enter your password" : "Choose a password"}
                error={errors.password}
                autoComplete={isLogin ? "current-password" : "new-password"}
                icon={<Lock className="h-5 w-5 text-gray-400" />}
              />
            </motion.div>
          )}
          
          {isLogin && !forgotPassword && (
            <motion.div variants={itemVariants} className="text-right">
              <button
                type="button"
                onClick={() => setForgotPassword(true)}
                className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-500 dark:hover:text-primary-400"
              >
                Forgot password?
              </button>
            </motion.div>
          )}
          
          <motion.div variants={itemVariants}>
            <Button
              type="submit"
              className="w-full"
              isLoading={isSubmitting}
            >
              {isSubmitting
                ? 'Processing...'
                : forgotPassword
                  ? 'Send Reset Instructions'
                  : isLogin
                    ? 'Sign In'
                    : 'Create Account'}
              {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </motion.div>
        </motion.form>
        
        <motion.div variants={itemVariants} className="mt-6 text-center">
          {forgotPassword ? (
            <button
              onClick={() => setForgotPassword(false)}
              className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-500 dark:hover:text-primary-400"
            >
              Back to login
            </button>
          ) : (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary-600 hover:text-primary-700 dark:text-primary-500 dark:hover:text-primary-400 font-medium"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};