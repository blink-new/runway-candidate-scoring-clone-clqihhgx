import { useState, useCallback } from 'react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Textarea } from './ui/textarea'
import { Progress } from './ui/progress'
import { Badge } from './ui/badge'
import { 
  Upload, 
  FileText, 
  X, 
  ArrowLeft, 
  ArrowRight,
  Zap,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface UploadInterfaceProps {
  onUploadComplete: (jobDescription: string, files: File[]) => void
  onBack: () => void
}

export function UploadInterface({ onUploadComplete, onBack }: UploadInterfaceProps) {
  const [step, setStep] = useState(1)
  const [jobDescription, setJobDescription] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    console.log('Files dropped:', e.dataTransfer.files)
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type === 'application/pdf' || 
      file.name.toLowerCase().endsWith('.pdf') ||
      file.name.toLowerCase().endsWith('.doc') ||
      file.name.toLowerCase().endsWith('.docx') ||
      file.name.toLowerCase().endsWith('.txt')
    )
    
    console.log('Filtered dropped PDF files:', files)
    
    if (files.length > 0) {
      setUploadedFiles(prev => [...prev, ...files].slice(0, 50))
      console.log('Dropped files added to state')
    } else {
      console.log('No valid PDF files in drop')
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File input triggered', e.target.files)
    const files = Array.from(e.target.files || []).filter(file => 
      file.type === 'application/pdf' || 
      file.name.toLowerCase().endsWith('.pdf') ||
      file.name.toLowerCase().endsWith('.doc') ||
      file.name.toLowerCase().endsWith('.docx') ||
      file.name.toLowerCase().endsWith('.txt')
    )
    
    console.log('Filtered PDF files:', files)
    
    if (files.length > 0) {
      setUploadedFiles(prev => [...prev, ...files].slice(0, 50))
      console.log('Files added to state')
    } else {
      console.log('No valid PDF files found')
    }
    
    // Reset the input value so the same file can be selected again
    e.target.value = ''
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleNext = () => {
    if (step === 1 && jobDescription.trim()) {
      setStep(2)
    } else if (step === 2 && uploadedFiles.length > 0) {
      setIsProcessing(true)
      // Simulate processing
      const interval = setInterval(() => {
        setProcessingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            setTimeout(() => {
              onUploadComplete(jobDescription, uploadedFiles)
            }, 500)
            return 100
          }
          return prev + 10
        })
      }, 200)
    }
  }

  const canProceed = step === 1 ? jobDescription.trim().length > 0 : uploadedFiles.length > 0

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Zap className="w-8 h-8 text-primary animate-pulse" />
          </div>
          <h2 className="text-2xl font-semibold mb-4">Processing Candidates</h2>
          <p className="text-muted-foreground mb-6">
            Our AI is analyzing {uploadedFiles.length} resumes against your job requirements...
          </p>
          <Progress value={processingProgress} className="mb-4" />
          <p className="text-sm text-muted-foreground">
            {processingProgress}% complete
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-semibold">Runway</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {step > 1 ? <CheckCircle className="w-4 h-4" /> : '1'}
                </div>
                <span className={`text-sm ${step >= 1 ? 'text-foreground' : 'text-muted-foreground'}`}>
                  Job Description
                </span>
              </div>
              <div className="w-8 h-px bg-border"></div>
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  2
                </div>
                <span className={`text-sm ${step >= 2 ? 'text-foreground' : 'text-muted-foreground'}`}>
                  Upload Resumes
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {step === 1 && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4">
                Describe the role you're hiring for
              </h1>
              <p className="text-xl text-muted-foreground">
                Paste your job description or key requirements to help our AI understand what you're looking for.
              </p>
            </div>

            <Card className="p-8">
              <div className="space-y-4">
                <label className="text-sm font-medium">Job Description *</label>
                <Textarea
                  placeholder="Paste your job description here... Include key requirements, skills, experience level, and any specific qualifications you're looking for."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="min-h-[300px] resize-none"
                />
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>
                    {jobDescription.length > 0 && `${jobDescription.length} characters`}
                  </span>
                  <span>Minimum 50 characters recommended</span>
                </div>
              </div>
            </Card>

            <div className="flex justify-end">
              <Button 
                onClick={handleNext} 
                disabled={!canProceed}
                size="lg"
                className="px-8"
              >
                Continue to Upload
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4">
                Upload candidate resumes
              </h1>
              <p className="text-xl text-muted-foreground">
                Upload up to 50 resume files to get AI-powered candidate rankings and insights.
              </p>
            </div>

            <Card className="p-8">
              <div
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                  isDragging 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Drag and drop resume files here
                </h3>
                <p className="text-muted-foreground mb-4">
                  or click to browse your computer
                </p>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <Button 
                  variant="outline" 
                  className="cursor-pointer"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  Choose Files
                </Button>
                <p className="text-xs text-muted-foreground mt-4">
                  PDF, DOC, DOCX, TXT files • Up to 50 files • Max 10MB per file
                </p>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold">
                      Uploaded Files ({uploadedFiles.length}/50)
                    </h4>
                    <Badge variant="secondary">
                      {uploadedFiles.length} candidate{uploadedFiles.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                  <div className="grid gap-3 max-h-60 overflow-y-auto">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-5 h-5 text-red-600" />
                          <div>
                            <p className="font-medium text-sm">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {uploadedFiles.length >= 50 && (
                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                  <p className="text-sm text-amber-800">
                    You've reached the maximum of 50 files. Remove some files to add more.
                  </p>
                </div>
              )}
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Job Description
              </Button>
              <Button 
                onClick={handleNext} 
                disabled={!canProceed}
                size="lg"
                className="px-8"
              >
                Analyze Candidates
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}