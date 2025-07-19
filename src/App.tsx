import { useState, useEffect } from 'react'
import { blink } from './blink/client'
import { LandingPage } from './components/LandingPage'
import { UploadInterface } from './components/UploadInterface'
import { ResultsDashboard } from './components/ResultsDashboard'

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState<'landing' | 'upload' | 'results'>('landing')
  const [jobDescription, setJobDescription] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [results, setResults] = useState(null)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Temporarily bypass auth for testing
  // if (!user) {
  //   return (
  //     <div className="min-h-screen bg-background flex items-center justify-center">
  //       <div className="text-center max-w-md mx-auto p-6">
  //         <h1 className="text-2xl font-semibold mb-4">Welcome to Runway</h1>
  //         <p className="text-muted-foreground mb-6">
  //           AI-powered candidate scoring platform for modern recruiters
  //         </p>
  //         <button
  //           onClick={() => blink.auth.login()}
  //           className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
  //         >
  //           Sign In to Continue
  //         </button>
  //       </div>
  //     </div>
  //   )
  // }

  const handleStartScoring = () => {
    setCurrentStep('upload')
  }

  const handleUploadComplete = (description: string, files: File[]) => {
    setJobDescription(description)
    setUploadedFiles(files)
    // Simulate processing and move to results
    setTimeout(() => {
      setCurrentStep('results')
      // Mock results data
      setResults({
        candidates: files.map((file, index) => {
          const candidateName = file.name.replace('.pdf', '').replace(/[-_]/g, ' ')
          const score = Math.floor(Math.random() * 40) + 60
          return {
            id: index + 1,
            name: candidateName,
            email: `${candidateName.toLowerCase().replace(/\s+/g, '.')}@email.com`,
            score: score,
            matchPercentage: Math.floor(Math.random() * 30) + 70,
            overview: `${candidateName} demonstrates ${score >= 80 ? 'excellent' : score >= 70 ? 'strong' : 'adequate'} alignment with the role requirements. Shows ${score >= 80 ? 'exceptional' : 'solid'} technical competencies and relevant experience. ${score >= 80 ? 'Highly recommended for interview.' : score >= 70 ? 'Good candidate worth considering.' : 'May require additional evaluation.'}`,
            qualifications: [
              `${Math.floor(Math.random() * 8) + 2}+ years of relevant experience`,
              'Bachelor\'s degree in related field',
              'Strong technical skills in required technologies',
              'Proven track record of successful projects'
            ],
            redFlags: Math.random() > 0.7 ? ['Missing required experience', 'Gap in employment history'] : [],
            strengths: ['Strong technical background', 'Relevant industry experience', 'Good communication skills', 'Problem-solving abilities'],
            interviewQuestions: [
              'Tell me about your experience with the technologies mentioned in your resume.',
              'How do you handle challenging projects with tight deadlines?',
              'What interests you most about this role and our company?',
              'Describe a complex problem you solved and your approach.'
            ],
            fileName: file.name
          }
        })
      })
    }, 3000)
  }

  const handleBackToUpload = () => {
    setCurrentStep('upload')
    setResults(null)
  }

  const handleNewAnalysis = () => {
    setCurrentStep('landing')
    setJobDescription('')
    setUploadedFiles([])
    setResults(null)
  }

  return (
    <div className="min-h-screen bg-background">
      {currentStep === 'landing' && (
        <LandingPage onStartScoring={handleStartScoring} />
      )}
      {currentStep === 'upload' && (
        <UploadInterface 
          onUploadComplete={handleUploadComplete}
          onBack={() => setCurrentStep('landing')}
        />
      )}
      {currentStep === 'results' && results && (
        <ResultsDashboard 
          results={results}
          jobDescription={jobDescription}
          onBack={handleBackToUpload}
          onNewAnalysis={handleNewAnalysis}
        />
      )}
    </div>
  )
}