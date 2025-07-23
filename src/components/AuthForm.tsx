import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Sprout, Mail, Lock, User, MapPin, Phone, Globe } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

type SignUpFormData = {
  name: string;
  email: string;
  password: string;
  location: string;
  farm_size: number;
  phone: string;
  primary_crops: string[];
  preferred_language: string;
};

type SignInFormData = {
  email: string;
  password: string;
};

const signUpSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  location: yup.string().required('Location is required'),
  farm_size: yup.number().positive('Farm size must be positive').required('Farm size is required'),
  phone: yup.string().required('Phone number is required'),
  primary_crops: yup.array().of(yup.string()).required('Select at least one crop'),
  preferred_language: yup.string().required('Select preferred language')
});

const signInSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required')
});

export default function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const { signIn, signUp } = useAuth();

  const {
  register,
  handleSubmit,
  formState: { errors, isSubmitting },
  watch,
  setValue
} = useForm<SignUpFormData | SignInFormData>({
  resolver: yupResolver(isSignUp ? signUpSchema : signInSchema)
});

  const crops = ['Corn', 'Rice', 'Wheat', 'Tomatoes', 'Potatoes', 'Beans', 'Cassava', 'Sorghum'];
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'sw', name: 'Kiswahili' },
    { code: 'hi', name: 'हिंदी' },
    { code: 'ar', name: 'العربية' }
  ];

  const selectedCrops = watch('primary_crops') || [];

  const toggleCrop = (crop: string) => {
    const newCrops = selectedCrops.includes(crop)
      ? selectedCrops.filter(c => c !== crop)
      : [...selectedCrops, crop];
    setValue('primary_crops', newCrops);
  };

  const onSubmit = async (data: any) => {
    try {
      if (isSignUp) {
        await signUp(data.email, data.password, {
          name: data.name,
          location: data.location,
          farm_size: data.farm_size,
          phone: data.phone,
          primary_crops: data.primary_crops,
          preferred_language: data.preferred_language
        });
        toast.success('Account created successfully!');
      } else {
        await signIn(data.email, data.password);
        toast.success('Welcome back!');
      }
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <motion.div 
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block"
          >
            <Sprout size={48} className="text-green-500 mx-auto mb-4" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-800">AgriPulse</h1>
          <p className="text-gray-600">AI Climate-Smart Farming</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {isSignUp && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User size={16} className="inline mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  {...register('name')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter your full name"
                />
                {errors.name?.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.name?.message as string}</p>
                )}

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin size={16} className="inline mr-2" />
                  Location
                </label>
                <input
                  type="text"
                  {...register('location')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="e.g., Kisumu, Kenya"
                />
                {errors.location && (
                  <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Farm Size (acres)
                </label>
                <input
                  type="number"
                  step="0.1"
                  {...register('farm_size')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="e.g., 2.5"
                />
                {errors.farm_size && (
                  <p className="text-red-500 text-sm mt-1">{errors.farm_size.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone size={16} className="inline mr-2" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  {...register('phone')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="e.g., +254 700 123 456"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Crops
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {crops.map((crop) => (
                    <motion.button
                      key={crop}
                      type="button"
                      onClick={() => toggleCrop(crop)}
                      className={`p-2 text-sm rounded-lg border transition-colors ${
                        selectedCrops.includes(crop)
                          ? 'bg-green-100 border-green-500 text-green-700'
                          : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {crop}
                    </motion.button>
                  ))}
                </div>
                {errors.primary_crops && (
                  <p className="text-red-500 text-sm mt-1">{errors.primary_crops.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Globe size={16} className="inline mr-2" />
                  Preferred Language
                </label>
                <select
                  {...register('preferred_language')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select language</option>
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
                {errors.preferred_language && (
                  <p className="text-red-500 text-sm mt-1">{errors.preferred_language.message}</p>
                )}
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail size={16} className="inline mr-2" />
              Email Address
            </label>
            <input
              type="email"
              {...register('email')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Lock size={16} className="inline mr-2" />
              Password
            </label>
            <input
              type="password"
              {...register('password')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <motion.button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSubmitting ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
          </motion.button>
        </form>

        {/* Toggle */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          </p>
          <motion.button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-green-500 hover:text-green-600 font-medium mt-2"
            whileHover={{ scale: 1.05 }}
          >
            {isSignUp ? 'Sign In' : 'Create Account'}
          </motion.button>
        </div>

        {/* Demo Access */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800 text-center">
            <strong>Demo Access:</strong> Use any email and password to explore the platform
          </p>
        </div>
      </motion.div>
    </div>
  );
}