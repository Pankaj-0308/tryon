import React, { useState, useRef, useEffect } from 'react';
import { Upload, Camera, Wand2, Download, Share2, Loader2, RefreshCw, Image as ImageIcon, Sparkles, Zap, CheckCircle, ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import LoadingScreen from './LoadingScreen';

// Predefined result mappings - 4 combinations
const RESULT_MAPPINGS = {
  'people1_cloth1': '/images/updated1.jpg',
  'people2_cloth2': '/images/updated2.jpg',
  'people3_cloth3': '/images/updated3.jpg',
  'people4_cloth4': '/images/updated4.jpg',
};

// Valid combinations that will show results
const VALID_COMBINATIONS = [
  'people1_cloth1',
  'people2_cloth2',
  'people3_cloth3',
  'people4_cloth4'
];

const VirtualTryOn: React.FC = () => {
  const [personImage, setPersonImage] = useState<File | null>(null);
  const [clothingImage, setClothingImage] = useState<File | null>(null);
  const [personPreview, setPersonPreview] = useState<string>('');
  const [clothingPreview, setClothingPreview] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string>('');
  const [processingStep, setProcessingStep] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [combinationKey, setCombinationKey] = useState<string>('');
  const [showFeatures, setShowFeatures] = useState(false);

  // Mock processing steps for realistic experience
  const processingSteps = [
    'Analyzing person body structure...',
    'Detecting existing clothing...',
    'Segmenting body regions...',
    'Extracting clothing patterns...',
    'Matching fabric textures...',
    'Applying realistic draping...',
    'Adjusting lighting and shadows...',
    'Generating final result...'
  ];

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'person' | 'clothing'
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file (JPEG, PNG, WebP)');
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size should be less than 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (type === 'person') {
        setPersonImage(file);
        setPersonPreview(result);
      } else {
        setClothingImage(file);
        setClothingPreview(result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Check if the uploaded images match any predefined combination
  const checkCombination = async (personFile: File, clothingFile: File): Promise<string | null> => {
    // Simple file size check for the 4 valid combinations
    const personSize = personFile.size;
    const clothingSize = clothingFile.size;
    
    // Check if sizes roughly match our predefined images
    // people1.jpg: 105737, cloth1.jpg: 51698
    if (personSize > 100000 && personSize < 110000 && clothingSize > 50000 && clothingSize < 53000) {
      return 'people1_cloth1';
    } 
    // people2.jpg: 68683, cloth2.jpg: 63285
    else if (personSize > 65000 && personSize < 72000 && clothingSize > 60000 && clothingSize < 65000) {
      return 'people2_cloth2';
    } 
    // people3.jpg: 400946, cloth3.jpg: 180284
    else if (personSize > 390000 && personSize < 410000 && clothingSize > 175000 && clothingSize < 185000) {
      return 'people3_cloth3';
    } 
    // people4.jpg: 277446, cloth4.jpg: 574708
    else if (personSize > 270000 && personSize < 285000 && clothingSize > 570000 && clothingSize < 580000) {
      return 'people4_cloth4';
    }
    
    return null;
  };

  const generateTryOn = async () => {
    if (!personImage || !clothingImage) {
      toast.error('Please upload both person and clothing images');
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setProcessingStep('');

    try {
      // Check if the uploaded images match any predefined combination
      const detectedCombination = await checkCombination(personImage, clothingImage);
      
      // Simulate processing steps with realistic timing
      for (let i = 0; i < processingSteps.length; i++) {
        setProcessingStep(processingSteps[i]);
        setProgress(((i + 1) / processingSteps.length) * 100);
        
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 500));
      }

      if (detectedCombination && VALID_COMBINATIONS.includes(detectedCombination)) {
        // Show the predefined result
        const resultImage = RESULT_MAPPINGS[detectedCombination as keyof typeof RESULT_MAPPINGS];
        setResult(resultImage);
        setCombinationKey(detectedCombination);
        toast.success('Virtual try-on completed! 🎉');
      } else {
        // No matching combination found
        setResult('');
        setCombinationKey('');
        toast.error('No predefined result available for this combination. Please try different images.');
      }

    } catch (error) {
      console.error('Error processing virtual try-on:', error);
      toast.error('Failed to process virtual try-on. Please try again.');
    } finally {
      setIsProcessing(false);
      setProgress(0);
      setProcessingStep('');
    }
  };

  const downloadResult = () => {
    if (!result) return;
    
    const link = document.createElement('a');
    link.href = result;
    link.download = 'virtual-tryon-result.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Image downloaded successfully!');
  };

  const shareResult = async () => {
    if (!result) return;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'My Virtual Try-On Result',
          text: 'Check out how this outfit looks on me!',
          url: result
        });
      } else {
        await navigator.clipboard.writeText(result);
        toast.success('Image URL copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('Failed to share image');
    }
  };

  const resetAll = () => {
    setPersonImage(null);
    setClothingImage(null);
    setPersonPreview('');
    setClothingPreview('');
    setResult('');
    setProcessingStep('');
    setProgress(0);
    setCombinationKey('');
  };

  return (
    <div className="flex-1 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6">
        {/* Enhanced Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg mb-6">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <span className="text-sm font-medium text-gray-700">AI-Powered Virtual Try-On</span>
            <Sparkles className="w-5 h-5 text-purple-500" />
          </div>
          
          <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6 leading-tight">
            Virtual Try-On
            <span className="block text-4xl mt-2 bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              AI Studio
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Transform your fashion experience with cutting-edge AI technology. 
            See how clothes look on you instantly with our advanced virtual try-on system.
          </p>

          {/* Feature highlights */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {[
              { icon: Zap, text: "Instant Results" },
              { icon: CheckCircle, text: "Realistic Rendering" },
              { icon: Star, text: "High Quality" }
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                <feature.icon className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-gray-700">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
          {/* Enhanced Upload Section */}
          <div className="space-y-8 animate-slide-up">
            {/* Person Image Upload */}
            <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm hover:shadow-3xl transition-all duration-500 group">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                  Upload Your Photo
                </CardTitle>
                <CardDescription className="text-base">
                  Upload a clear, full-body photo for the best results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-center w-full">
                    <Label
                      htmlFor="person-upload"
                      className="flex flex-col items-center justify-center w-full h-72 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gradient-to-br from-gray-50 to-gray-100 hover:from-blue-50 hover:to-purple-50 transition-all duration-300 group-hover:border-blue-400"
                    >
                      {personPreview ? (
                        <div className="relative w-full h-full">
                          <img
                            src={personPreview}
                            alt="Person preview"
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="bg-white/90 backdrop-blur-sm p-3 rounded-full">
                              <Upload className="w-6 h-6 text-gray-700" />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center pt-8 pb-6">
                          <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4">
                            <Camera className="w-8 h-8 text-white" />
                          </div>
                          <p className="mb-2 text-base font-semibold text-gray-700">
                            Click to upload your photo
                          </p>
                          <p className="text-sm text-gray-500 text-center">
                            Drag and drop or click to browse
                          </p>
                          <p className="text-xs text-gray-400 mt-2">PNG, JPG, WEBP up to 10MB</p>
                        </div>
                      )}
                    </Label>
                    <Input
                      id="person-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, 'person')}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Clothing Image Upload */}
            <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm hover:shadow-3xl transition-all duration-500 group">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg">
                    <ImageIcon className="w-5 h-5 text-white" />
                  </div>
                  Upload Clothing Item
                </CardTitle>
                <CardDescription className="text-base">
                  Upload the clothing item you want to try on
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-center w-full">
                    <Label
                      htmlFor="clothing-upload"
                      className="flex flex-col items-center justify-center w-full h-72 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gradient-to-br from-gray-50 to-gray-100 hover:from-pink-50 hover:to-rose-50 transition-all duration-300 group-hover:border-pink-400"
                    >
                      {clothingPreview ? (
                        <div className="relative w-full h-full">
                          <img
                            src={clothingPreview}
                            alt="Clothing preview"
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="bg-white/90 backdrop-blur-sm p-3 rounded-full">
                              <Upload className="w-6 h-6 text-gray-700" />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center pt-8 pb-6">
                          <div className="p-4 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full mb-4">
                            <ImageIcon className="w-8 h-8 text-white" />
                          </div>
                          <p className="mb-2 text-base font-semibold text-gray-700">
                            Click to upload clothing
                          </p>
                          <p className="text-sm text-gray-500 text-center">
                            Drag and drop or click to browse
                          </p>
                          <p className="text-xs text-gray-400 mt-2">PNG, JPG, WEBP up to 10MB</p>
                        </div>
                      )}
                    </Label>
                    <Input
                      id="clothing-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, 'clothing')}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Generate Button */}
            <Button
              onClick={generateTryOn}
              disabled={!personImage || !clothingImage || isProcessing}
              className="w-full h-16 text-xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 text-white shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-xl group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative flex items-center justify-center">
                {isProcessing ? (
                  <>
                    <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                    Generate Virtual Try-On
                    <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </div>
            </Button>

            {/* Reset Button */}
            <Button
              onClick={resetAll}
              variant="outline"
              className="w-full h-12 text-base font-medium border-2 hover:bg-gray-50 transition-all duration-300 rounded-xl"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Reset All
            </Button>
          </div>

          {/* Enhanced Result Section */}
          <div className="space-y-8 animate-slide-up">


            {/* Result Display */}
            {result && (
              <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                      <Wand2 className="w-5 h-5 text-white" />
                    </div>
                    Your Virtual Try-On Result
                  </CardTitle>
                  <CardDescription className="text-base">
                    Here's how the clothing looks on you!
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="relative group">
                      <img
                        src={result}
                        alt="Virtual try-on result"
                        className="w-full h-auto rounded-xl shadow-lg group-hover:shadow-2xl transition-all duration-500 transform group-hover:scale-[1.02]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-500" />
                    </div>
                    
                    <div className="flex gap-3">
                      <Button
                        onClick={downloadResult}
                        className="flex-1 h-12 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <Download className="w-5 h-5 mr-2" />
                        Download
                      </Button>
                      <Button
                        onClick={shareResult}
                        variant="outline"
                        className="flex-1 h-12 font-medium border-2 hover:bg-gray-50 transition-all duration-300 rounded-xl"
                      >
                        <Share2 className="w-5 h-5 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Enhanced Instructions */}
            {!result && !isProcessing && (
              <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    How It Works
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { step: "1", text: "Upload a clear photo of yourself", icon: Camera },
                      { step: "2", text: "Upload the clothing item you want to try on", icon: ImageIcon },
                      { step: "3", text: "Click 'Generate Virtual Try-On'", icon: Wand2 },
                      { step: "4", text: "Wait for AI processing to complete", icon: Loader2 },
                      { step: "5", text: "Download or share your result", icon: Download }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {item.step}
                        </div>
                        <div className="flex items-center gap-3 flex-1">
                          <item.icon className="w-5 h-5 text-gray-500" />
                          <span className="text-gray-700 font-medium">{item.text}</span>
                        </div>
                      </div>
                    ))}
                    

                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      
      {/* Loading Screen */}
      <LoadingScreen 
        isVisible={isProcessing}
        progress={progress}
        currentStep={processingStep}
      />
    </div>
  );
};

export default VirtualTryOn; 