import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Upload, Mic, MapPin, Thermometer, Droplets, Bug, Leaf } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';

interface FieldReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const reportSchema = yup.object({
  crop_status: yup.string().required('Crop status is required'),
  weather_conditions: yup.string().required('Weather conditions are required'),
  soil_moisture: yup.number().min(0).max(100).required('Soil moisture is required'),
  growth_stage: yup.string().required('Growth stage is required'),
  pest_issues: yup.array().of(yup.string()),
  notes: yup.string()
});

export default function FieldReportModal({ isOpen, onClose }: FieldReportModalProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue
  } = useForm({
    resolver: yupResolver(reportSchema),
    defaultValues: {
      pest_issues: []
    }
  });

  const cropStatuses = ['Excellent', 'Good', 'Fair', 'Poor', 'Critical'];
  const weatherConditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Heavy Rain', 'Drought'];
  const growthStages = ['Seedling', 'Vegetative', 'Flowering', 'Fruiting', 'Maturity'];
  const commonPests = ['Aphids', 'Caterpillars', 'Whiteflies', 'Thrips', 'Mites', 'Beetles', 'Fungal Disease', 'Bacterial Disease'];

  const selectedPests = watch('pest_issues') || [];

  const togglePest = (pest: string) => {
    const newPests = selectedPests.includes(pest)
      ? selectedPests.filter(p => p !== pest)
      : [...selectedPests, pest];
    setValue('pest_issues', newPests);
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      // In a real app, you would upload these to a storage service
      const newPhotos = Array.from(files).map(file => URL.createObjectURL(file));
      setPhotos(prev => [...prev, ...newPhotos]);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In a real app, this would start/stop voice recording
    if (!isRecording) {
      toast.success('Voice recording started');
      setTimeout(() => {
        setIsRecording(false);
        toast.success('Voice note recorded successfully');
      }, 3000);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      // In a real app, this would submit to your backend
      console.log('Field report data:', { ...data, photos });
      
      toast.success('Field report submitted successfully!');
      reset();
      setPhotos([]);
      onClose();
    } catch (error) {
      toast.error('Failed to submit field report');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Leaf size={32} className="text-blue-200" />
                  <div>
                    <h2 className="text-2xl font-bold">Field Report</h2>
                    <p className="text-blue-200">Share your field observations</p>
                  </div>
                </div>
                <motion.button
                  onClick={onClose}
                  className="p-2 hover:bg-blue-500 rounded-full transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={24} />
                </motion.button>
              </div>
            </div>

            {/* Form */}
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Location */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <MapPin className="text-gray-600" size={20} />
                    <span className="font-medium text-gray-800">Current Location</span>
                  </div>
                  <p className="text-gray-600">GPS coordinates will be automatically captured</p>
                </div>

                {/* Crop Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Overall Crop Status
                  </label>
                  <select
                    {...register('crop_status')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select crop status</option>
                    {cropStatuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  {errors.crop_status && (
                    <p className="text-red-500 text-sm mt-1">{errors.crop_status.message}</p>
                  )}
                </div>

                {/* Weather Conditions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Thermometer size={16} className="inline mr-2" />
                    Current Weather Conditions
                  </label>
                  <select
                    {...register('weather_conditions')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select weather conditions</option>
                    {weatherConditions.map(condition => (
                      <option key={condition} value={condition}>{condition}</option>
                    ))}
                  </select>
                  {errors.weather_conditions && (
                    <p className="text-red-500 text-sm mt-1">{errors.weather_conditions.message}</p>
                  )}
                </div>

                {/* Soil Moisture */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Droplets size={16} className="inline mr-2" />
                    Soil Moisture Level (%)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    {...register('soil_moisture')}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <span>Dry (0%)</span>
                    <span>Optimal (50%)</span>
                    <span>Saturated (100%)</span>
                  </div>
                  {errors.soil_moisture && (
                    <p className="text-red-500 text-sm mt-1">{errors.soil_moisture.message}</p>
                  )}
                </div>

                {/* Growth Stage */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Growth Stage
                  </label>
                  <select
                    {...register('growth_stage')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select growth stage</option>
                    {growthStages.map(stage => (
                      <option key={stage} value={stage}>{stage}</option>
                    ))}
                  </select>
                  {errors.growth_stage && (
                    <p className="text-red-500 text-sm mt-1">{errors.growth_stage.message}</p>
                  )}
                </div>

                {/* Pest Issues */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Bug size={16} className="inline mr-2" />
                    Observed Pest Issues (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {commonPests.map(pest => (
                      <motion.button
                        key={pest}
                        type="button"
                        onClick={() => togglePest(pest)}
                        className={`p-2 text-sm rounded-lg border transition-colors ${
                          selectedPests.includes(pest)
                            ? 'bg-red-100 border-red-500 text-red-700'
                            : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {pest}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Photo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Camera size={16} className="inline mr-2" />
                    Field Photos
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label
                      htmlFor="photo-upload"
                      className="cursor-pointer flex flex-col items-center space-y-2"
                    >
                      <Upload className="text-gray-400" size={32} />
                      <span className="text-gray-600">Click to upload photos</span>
                      <span className="text-sm text-gray-500">or drag and drop</span>
                    </label>
                  </div>
                  
                  {photos.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-4">
                      {photos.map((photo, index) => (
                        <img
                          key={index}
                          src={photo}
                          alt={`Field photo ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Voice Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mic size={16} className="inline mr-2" />
                    Voice Notes
                  </label>
                  <motion.button
                    type="button"
                    onClick={toggleRecording}
                    className={`w-full p-4 rounded-lg border-2 border-dashed transition-colors ${
                      isRecording
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Mic className={`mx-auto mb-2 ${isRecording ? 'text-red-500' : 'text-gray-400'}`} size={24} />
                    {isRecording ? 'Recording... Tap to stop' : 'Tap to record voice notes'}
                  </motion.button>
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    {...register('notes')}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Any additional observations or concerns..."
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? 'Submitting Report...' : 'Submit Field Report'}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}