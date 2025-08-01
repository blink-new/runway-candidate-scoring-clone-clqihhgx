import { useState } from 'react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { 
  ArrowLeft, 
  Download, 
  Star, 
  AlertTriangle, 
  CheckCircle, 
  FileText,
  Zap,
  TrendingUp,
  Users,
  Target,
  MessageSquare,
  Mail,
  User,
  Award,
  Eye
} from 'lucide-react'

interface Candidate {
  id: number
  name: string
  email: string
  score: number
  matchPercentage: number
  overview: string
  qualifications: string[]
  redFlags: string[]
  strengths: string[]
  interviewQuestions: string[]
  fileName: string
}

interface ResultsDashboardProps {
  results: {
    candidates: Candidate[]
  }
  jobDescription: string
  onBack: () => void
  onNewAnalysis: () => void
}

export function ResultsDashboard({ results, jobDescription, onBack, onNewAnalysis }: ResultsDashboardProps) {
  const [selectedTab, setSelectedTab] = useState('match-results')
  
  const sortedCandidates = [...results.candidates].sort((a, b) => b.score - a.score)
  const averageScore = Math.round(results.candidates.reduce((sum, c) => sum + c.score, 0) / results.candidates.length)
  const topCandidates = sortedCandidates.filter(c => c.score >= 80).length
  const candidatesWithRedFlags = sortedCandidates.filter(c => c.redFlags.length > 0).length

  // Extract role title from job description (first line or first sentence)
  const roleTitle = jobDescription.split('\n')[0].split('.')[0].trim() || 'Position'

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-amber-600'
    return 'text-red-600'
  }

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default'
    if (score >= 60) return 'secondary'
    return 'destructive'
  }

  const exportToExcel = () => {
    console.log('Exporting to Excel format...')
    
    // Create comprehensive Excel-style CSV content
    const csvHeaders = [
      'Ranking',
      'Candidate Name',
      'Email Address', 
      'Rating Score (%)',
      'Overview',
      'Qualifications',
      'Red Flags',
      'Suggested Interview Questions'
    ]
    
    const csvRows = sortedCandidates.map((candidate, index) => [
      index + 1,
      `"${candidate.name}"`,
      `"${candidate.email}"`,
      candidate.score,
      `"${candidate.overview.replace(/"/g, '""')}"`,
      `"${candidate.qualifications.join('; ').replace(/"/g, '""')}"`,
      `"${candidate.redFlags.length > 0 ? candidate.redFlags.join('; ').replace(/"/g, '""') : 'None identified'}"`,
      `"${candidate.interviewQuestions.join('; ').replace(/"/g, '""')}"`
    ])
    
    const csvContent = [
      `"Role: ${roleTitle}"`,
      `"Total Candidates: ${results.candidates.length}"`,
      `"Export Date: ${new Date().toLocaleDateString()}"`,
      '',
      csvHeaders.join(','),
      ...csvRows.map(row => row.join(','))
    ].join('\n')
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${roleTitle.toLowerCase().replace(/\s+/g, '-')}-candidate-analysis-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    console.log('Excel export completed!')
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={onBack} className="text-gray-300 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Upload
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-semibold text-white">Runway</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" onClick={exportToExcel} className="border-gray-600 text-gray-300 hover:text-white hover:border-gray-500">
                <Download className="w-4 h-4 mr-2" />
                Export to Excel
              </Button>
              <Button onClick={onNewAnalysis} size="sm" className="bg-blue-600 hover:bg-blue-700">
                New Analysis
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Role Title and Candidate Count */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{roleTitle}</h1>
          <p className="text-blue-400 text-lg">{results.candidates.length} Candidates</p>
        </div>

        {/* Tabs Navigation */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800 border-gray-700">
            <TabsTrigger value="match-results" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Star className="w-4 h-4 mr-2" />
              Match Results
            </TabsTrigger>
            <TabsTrigger value="qualifications" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Award className="w-4 h-4 mr-2" />
              Qualifications
            </TabsTrigger>
            <TabsTrigger value="concerns" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Potential Concerns
            </TabsTrigger>
            <TabsTrigger value="interview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <MessageSquare className="w-4 h-4 mr-2" />
              Suggested Interview Questions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="match-results" className="mt-8">
            <Card className="bg-gray-800 border-gray-700">
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Star className="w-6 h-6 text-blue-400" />
                  <div>
                    <h2 className="text-xl font-semibold text-white">Candidate Ranking Overview</h2>
                    <p className="text-gray-400">Match Results</p>
                  </div>
                </div>

                {/* Table Header */}
                <div className="grid grid-cols-4 gap-4 p-4 border-b border-gray-700 text-gray-300 font-medium">
                  <div>Ranking</div>
                  <div>Candidate</div>
                  <div>Rating</div>
                  <div>Overview</div>
                </div>

                {/* Candidate Rows */}
                <div className="space-y-0">
                  {sortedCandidates.map((candidate, index) => (
                    <div key={candidate.id} className="grid grid-cols-4 gap-4 p-4 border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                      {/* Ranking */}
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-600/20 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-400">{index + 1}</span>
                        </div>
                      </div>

                      {/* Candidate Info */}
                      <div className="flex items-center space-x-3">
                        <div>
                          <h3 className="font-semibold text-white">{candidate.name}</h3>
                          <div className="flex items-center space-x-1 text-gray-400 text-sm">
                            <Mail className="w-3 h-3" />
                            <span>{candidate.email}</span>
                          </div>
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white mb-1">{candidate.score}%</div>
                          <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-300 ${
                                candidate.score >= 80 ? 'bg-green-500' : 
                                candidate.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${candidate.score}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Overview */}
                      <div className="flex items-center">
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {candidate.overview}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="qualifications" className="mt-8">
            <Card className="bg-gray-800 border-gray-700">
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Award className="w-6 h-6 text-blue-400" />
                  <div>
                    <h2 className="text-xl font-semibold text-white">Candidate Qualifications</h2>
                    <p className="text-gray-400">Key qualifications and experience</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {sortedCandidates.map((candidate, index) => (
                    <div key={candidate.id} className="border-b border-gray-700/50 pb-6 last:border-b-0">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-8 h-8 bg-blue-600/20 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-400">{index + 1}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{candidate.name}</h3>
                          <p className="text-gray-400 text-sm">{candidate.email}</p>
                        </div>
                        <Badge variant={getScoreBadgeVariant(candidate.score)} className="ml-auto">
                          {candidate.score}%
                        </Badge>
                      </div>
                      <div className="ml-11 space-y-2">
                        {candidate.qualifications.map((qualification, qIndex) => (
                          <div key={qIndex} className="flex items-start space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-300 text-sm">{qualification}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="concerns" className="mt-8">
            <Card className="bg-gray-800 border-gray-700">
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                  <div>
                    <h2 className="text-xl font-semibold text-white">Potential Concerns</h2>
                    <p className="text-gray-400">Red flags and areas of concern</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {sortedCandidates.map((candidate, index) => (
                    <div key={candidate.id} className="border-b border-gray-700/50 pb-6 last:border-b-0">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-8 h-8 bg-blue-600/20 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-400">{index + 1}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{candidate.name}</h3>
                          <p className="text-gray-400 text-sm">{candidate.email}</p>
                        </div>
                        <Badge variant={getScoreBadgeVariant(candidate.score)} className="ml-auto">
                          {candidate.score}%
                        </Badge>
                      </div>
                      <div className="ml-11">
                        {candidate.redFlags.length > 0 ? (
                          <div className="space-y-2">
                            {candidate.redFlags.map((flag, fIndex) => (
                              <div key={fIndex} className="flex items-start space-x-2">
                                <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-300 text-sm">{flag}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2 text-green-400">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm">No red flags identified</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="interview" className="mt-8">
            <Card className="bg-gray-800 border-gray-700">
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <MessageSquare className="w-6 h-6 text-blue-400" />
                  <div>
                    <h2 className="text-xl font-semibold text-white">Suggested Interview Questions</h2>
                    <p className="text-gray-400">Tailored questions for each candidate</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {sortedCandidates.map((candidate, index) => (
                    <div key={candidate.id} className="border-b border-gray-700/50 pb-6 last:border-b-0">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-8 h-8 bg-blue-600/20 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-400">{index + 1}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{candidate.name}</h3>
                          <p className="text-gray-400 text-sm">{candidate.email}</p>
                        </div>
                        <Badge variant={getScoreBadgeVariant(candidate.score)} className="ml-auto">
                          {candidate.score}%
                        </Badge>
                      </div>
                      <div className="ml-11 space-y-3">
                        {candidate.interviewQuestions.map((question, qIndex) => (
                          <div key={qIndex} className="flex items-start space-x-2">
                            <MessageSquare className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-300 text-sm">{question}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}