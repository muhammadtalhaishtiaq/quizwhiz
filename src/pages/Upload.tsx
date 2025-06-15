import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Upload as UploadIcon, FileText, Link as LinkIcon, Clock, Youtube } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import UploadForm from "./upload/UploadForm";
import GeneratedResults from "./upload/GeneratedResults";
import UploadProcessing from "./upload/UploadProcessing";
import Footer from "@/components/Footer";
import { getDocument } from 'pdfjs-dist';

const processingQuotes = [
  "🧠 Did you know? Spaced repetition increases retention by up to 90%!",
  "📚 Fun fact: The average person forgets 50% of new information within an hour!",
  "⚡ AI tip: Active recall is 3x more effective than passive reading!",
  "🎯 Study smart: Breaking content into chunks improves comprehension!",
  "🚀 Almost done! Great things take time to perfect.",
];

const Upload = () => {
  const [uploadMethod, setUploadMethod] = useState<'file' | 'youtube'>('file');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [mcqs, setMcqs] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const [currentQuote, setCurrentQuote] = useState(0);

  // Check if YouTube URL was passed from homepage
  useEffect(() => {
    if (location.state?.youtubeUrl) {
      setYoutubeUrl(location.state.youtubeUrl);
      setUploadMethod('youtube');
      // Auto-submit if URL was passed from homepage
      handleYoutubeSubmit(location.state.youtubeUrl);
    }
  }, [location.state]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setError(null);

    // File size restriction: max 2MB
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      setError("File size must not exceed 2 MB.");
      return;
    }

    console.log('File size in MB ', file.size / (1024 * 1024) + 'MB');

    setIsProcessing(true);
    setProcessingProgress(0);
    setMcqs([]);
    setFlashcards([]);

    // Simulate progress while processing
    let progressVal = 0;
    const interval = setInterval(() => {
      progressVal += 5;
      if (progressVal >= 95) { clearInterval(interval); }
      setProcessingProgress(Math.min(progressVal, 95));
    }, 180);

    console.log('File type : ' + file.name.toLowerCase());

    // Handle PDF files
    if (file.name.toLowerCase().endsWith('.pdf')) {
      try {
        console.log('Starting PDF text extraction...');
        const fileReader = new FileReader();
        
        fileReader.onload = async function() {
          try {
            const typedarray = new Uint8Array(this.result as ArrayBuffer);
            
            console.log('Loading PDF document...');
            // Configure PDF.js to disable worker completely
            const loadingTask = getDocument({
              data: typedarray,
              disableAutoFetch: true,
              disableStream: true
            });
            
            const pdf = await loadingTask.promise;
            console.log(`PDF loaded successfully. Pages: ${pdf.numPages}`);
            
            let textContent = '';
            
            // Extract text from all pages
            for (let i = 1; i <= pdf.numPages; i++) {
              console.log(`Extracting text from page ${i}...`);
              const page = await pdf.getPage(i);
              const content = await page.getTextContent();
              const strings = content.items.map((item: any) => item.str);
              textContent += strings.join(' ') + '\n';
            }
            
            console.log(`Extracted text length: ${textContent.length} characters`);
            
            if (textContent.trim().length === 0) {
              clearInterval(interval);
              setIsProcessing(false);
              setError("No text content found in the PDF. Please ensure the PDF contains readable text.");
              return;
            }
            
            // Create a new text file from the extracted content
            const textBlob = new Blob([textContent], { type: 'text/plain' });
            const textFile = new File([textBlob], 'converted.txt', { type: 'text/plain' });
            
            console.log('PDF converted to text successfully, uploading to API...');
            
            // Upload the converted text file
            await uploadFileToSupabase(textFile, interval);
          } catch (pdfError) {
            console.error('Error during PDF processing:', pdfError);
            clearInterval(interval);
            setIsProcessing(false);
            setError("Error processing PDF file. Please try again or use a different PDF.");
          }
        };
        
        fileReader.onerror = function() {
          console.error('FileReader error');
          clearInterval(interval);
          setIsProcessing(false);
          setError("Error reading PDF file. Please try again.");
        };
        
        fileReader.readAsArrayBuffer(file);
        return;
      } catch (error) {
        console.error('Error setting up PDF conversion:', error);
        clearInterval(interval);
        setIsProcessing(false);
        setError("Error setting up PDF conversion. Please try again.");
        return;
      }
    }
    
    // Check file type - only allow .txt files for direct upload
    if (!file.name.toLowerCase().endsWith('.txt')) {
      clearInterval(interval);
      setIsProcessing(false);
      setError("Only .txt and PDF files are currently supported.");
      return;
    }
    
    await uploadFileToSupabase(file, interval);
  };

  // Helper function to handle file upload to Supabase
  const uploadFileToSupabase = async (file: File, existingInterval?: NodeJS.Timeout) => {
    // Only set up processing state if not already set up
    if (!existingInterval) {
      setIsProcessing(true);
      setProcessingProgress(0);
      setMcqs([]);
      setFlashcards([]);
    }

    let interval = existingInterval;
    if (!interval) {
      let progressVal = 0;
      interval = setInterval(() => {
        progressVal += 5;
        if (progressVal >= 95) { clearInterval(interval!); }
        setProcessingProgress(Math.min(progressVal, 95));
      }, 180);
    }

    const SUPABASE_EDGE_URL = "https://vbbghlxtzohqjxxkqrfq.supabase.co/functions/v1/generate-quiz";
    try {    
      console.log('Attempting to upload file to:', SUPABASE_EDGE_URL);
      const form = new FormData();
      form.append("file", file);
      console.log('File being uploaded:', file.name, 'Size:', file.size, 'Type:', file.type);
      
      const resp = await fetch(SUPABASE_EDGE_URL, {
        method: "POST",
        body: form,
      });
      console.log('Response status:', resp.status);
      console.log('Response headers:', Object.fromEntries(resp.headers.entries()));
      
      clearInterval(interval);
      setProcessingProgress(100);

      if (!resp.ok) {
        const err = await resp.json();
        console.error('Error response:', err);
        setError(err.error || "Failed to generate quiz.");
        setIsProcessing(false);
        return;
      }
      const data = await resp.json();
      setMcqs((data.mcqs && Array.isArray(data.mcqs)) ? data.mcqs : []);
      setFlashcards((data.flashcards && Array.isArray(data.flashcards)) ? data.flashcards : []);
      setTimeout(() => setIsProcessing(false), 800);

      // Redirect to study-mode with mcqs & flashcards!
      navigate("/study-mode", { 
        state: { 
          mcqs: data.mcqs, 
          flashcards: data.flashcards,
          category: data.category || "General" // Include category from AI response
        } 
      });
    } catch (e: any) {
      clearInterval(interval);
      setIsProcessing(false);
      setError(e.message || "Something went wrong.");
    }
  };

  const handleYoutubeSubmit = async (urlToProcess?: string) => {
    const url = urlToProcess || youtubeUrl;
    if (!url.trim()) return;
    
    setError(null);
    setIsProcessing(true);
    setProcessingProgress(0);
    setMcqs([]);
    setFlashcards([]);

    // Start progress simulation
    let progressVal = 0;
    const interval = setInterval(() => {
      progressVal += 3;
      if (progressVal >= 95) { clearInterval(interval); }
      setProcessingProgress(Math.min(progressVal, 95));
      
      // Update quote every 20% progress
      if (progressVal % 20 === 0) {
        setCurrentQuote(Math.floor(progressVal / 20) - 1);
      }
    }, 200);

    const YOUTUBE_EDGE_URL = "https://vbbghlxtzohqjxxkqrfq.supabase.co/functions/v1/youtube-quiz";
    
    try {
      console.log('Processing YouTube URL:', url);
      
      const response = await fetch(YOUTUBE_EDGE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ youtubeUrl: url }),
      });
      
      console.log('Response status:', response.status);
      
      clearInterval(interval);
      setProcessingProgress(100);

      if (!response.ok) {
        const err = await response.json();
        console.error('Error response:', err);
        setError(err.error || "Failed to process YouTube video.");
        setIsProcessing(false);
        return;
      }

      const data = await response.json();
      setMcqs((data.mcqs && Array.isArray(data.mcqs)) ? data.mcqs : []);
      setFlashcards((data.flashcards && Array.isArray(data.flashcards)) ? data.flashcards : []);
      
      setTimeout(() => {
        setIsProcessing(false);
        // Navigate to study-mode with the generated content
        navigate("/study-mode", { 
          state: { 
            mcqs: data.mcqs, 
            flashcards: data.flashcards,
            category: data.category || "YouTube Video"
          } 
        });
      }, 800);

    } catch (e: any) {
      clearInterval(interval);
      setIsProcessing(false);
      setError(e.message || "Something went wrong processing the YouTube video.");
      console.error('YouTube processing error:', e);
    }
  };

  const startProcessing = () => {
    setIsProcessing(true);
    setProcessingProgress(0);

    // Simulate AI processing with progress updates
    const interval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            navigate('/flashcards');
          }, 1000);
          return 100;
        }

        // Update quote every 20% progress
        const newProgress = prev + 2;
        if (newProgress % 20 === 0) {
          setCurrentQuote(Math.floor(newProgress / 20) - 1);
        }

        return newProgress;
      });
    }, 100);
  };

  if (isProcessing) {
    return (
      <UploadProcessing
        processingProgress={processingProgress}
        currentQuote={processingQuotes[currentQuote]}
      />
    );
  }

  return (
    <div className="min-h-screen bg-quiz-bg">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-2 sm:px-3 lg:px-4 pt-20 pb-16">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="font-poppins font-bold text-4xl md:text-5xl text-quiz-text mb-4">
            Upload Your Study Material
          </h1>
          <p className="text-xl text-gray-600">
            Choose how you'd like to get started with AI-powered studying
          </p>
        </div>
        {error && (
          <div className="bg-red-100 text-red-800 p-4 rounded mb-6 mt-4">{error}</div>
        )}
        
        {/* --- Responsive Side-by-side Layout --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center items-start">
          {/* Upload Section */}
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <UploadForm
                uploadMethod={uploadMethod}
                setUploadMethod={setUploadMethod}
                onFileUpload={handleFileUpload}
                youtubeUrl={youtubeUrl}
                setYoutubeUrl={setYoutubeUrl}
                onYoutubeSubmit={() => handleYoutubeSubmit()}
              />
            </div>
          </div>
          
          {/* What You'll Get Card */}
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <Card className="quiz-card animate-scale-in bg-white" style={{ animationDelay: '0.2s' }}>
                <CardHeader>
                  <CardTitle className="font-poppins text-center">
                    What You'll Get
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-quiz-purple/10 rounded-lg">
                      <div className="w-8 h-8 bg-quiz-purple rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm">📚</span>
                      </div>
                      <div>
                        <p className="font-medium text-quiz-text">Smart Flashcards</p>
                        <p className="text-sm text-gray-600">AI-generated from key concepts</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-quiz-teal/10 rounded-lg">
                      <div className="w-8 h-8 bg-quiz-teal rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm">❓</span>
                      </div>
                      <div>
                        <p className="font-medium text-quiz-text">MCQ Quizzes</p>
                        <p className="text-sm text-gray-600">Multiple choice questions with explanations</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-quiz-peach/10 rounded-lg">
                      <div className="w-8 h-8 bg-quiz-peach rounded-lg flex items-center justify-center">
                        <span className="text-quiz-text text-sm">🧠</span>
                      </div>
                      <div>
                        <p className="font-medium text-quiz-text">Memory Coaching</p>
                        <p className="text-sm text-gray-600">Personalized spaced repetition schedule</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-100 rounded-lg">
                      <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm">🎯</span>
                      </div>
                      <div>
                        <p className="font-medium text-quiz-text">Topic Tags</p>
                        <p className="text-sm text-gray-600">Organized by chapters and concepts</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        {/* Pro Tips */}
        <Card className="quiz-card mt-8 animate-slide-up bg-white">
          <CardContent className="p-6">
            <h3 className="font-poppins font-semibold text-xl text-quiz-text mb-4 text-center">
              💡 Pro Tips for Better Results
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="font-medium text-quiz-text mb-2">Clear Content</p>
                <p className="text-sm text-gray-600">Upload high-quality PDFs with readable text</p>
              </div>
              <div>
                <p className="font-medium text-quiz-text mb-2">Organized Material</p>
                <p className="text-sm text-gray-600">Well-structured content yields better flashcards</p>
              </div>
              <div>
                <p className="font-medium text-quiz-text mb-2">Educational Videos</p>
                <p className="text-sm text-gray-600">Lectures work better than casual YouTube videos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Results and Errors */}
        {((mcqs.length > 0 || flashcards.length > 0) && (
          <GeneratedResults mcqs={mcqs} flashcards={flashcards} />
        ))}
        
      </div>
      <Footer />
    </div>
  );
};

export default Upload;
