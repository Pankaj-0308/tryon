import React from 'react';
import { Loader2, Sparkles, Zap, CheckCircle } from 'lucide-react';

interface LoadingScreenProps {
  isVisible: boolean;
  progress: number;
  currentStep: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isVisible, progress, currentStep }) => {
  if (!isVisible) return null;

  const steps = [
    'Analyzing person body structure...',
    'Detecting existing clothing...',
    'Segmenting body regions...',
    'Extracting clothing patterns...',
    'Matching fabric textures...',
    'Applying realistic draping...',
    'Adjusting lighting and shadows...',
    'Generating final result...'
  ];

  const currentStepIndex = steps.findIndex(step => step === currentStep);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border border-white/20">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center animate-pulse">
              <Sparkles className="w-8 h-8 text-white animate-bounce" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
              <Zap className="w-3 h-3 text-white animate-pulse" />
            </div>
          </div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            AI Processing
          </h3>
          <p className="text-gray-600">Creating your virtual try-on experience</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-bold text-purple-600">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="h-3 rounded-full transition-all duration-700 ease-out progress-bar"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Current Step */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <Loader2 className="w-4 h-4 text-white animate-spin" />
            </div>
            <span className="text-sm font-medium text-gray-700">Current Step</span>
          </div>
          <p className="text-gray-600 text-sm pl-11">{currentStep}</p>
        </div>

        {/* Step Indicators */}
        <div className="space-y-2">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-300 ${
                index < currentStepIndex
                  ? 'bg-green-50 border border-green-200'
                  : index === currentStepIndex
                  ? 'bg-blue-50 border border-blue-200'
                  : 'bg-gray-50 border border-gray-200'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  index < currentStepIndex
                    ? 'bg-green-500'
                    : index === currentStepIndex
                    ? 'bg-blue-500'
                    : 'bg-gray-300'
                }`}
              >
                {index < currentStepIndex ? (
                  <CheckCircle className="w-4 h-4 text-white" />
                ) : index === currentStepIndex ? (
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                ) : (
                  <span className="text-xs text-white font-bold">{index + 1}</span>
                )}
              </div>
              <span
                className={`text-sm ${
                  index < currentStepIndex
                    ? 'text-green-700 font-medium'
                    : index === currentStepIndex
                    ? 'text-blue-700 font-medium'
                    : 'text-gray-500'
                }`}
              >
                {step}
              </span>
            </div>
          ))}
        </div>

        {/* Loading Animation */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-gray-500">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span>Processing...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen; 