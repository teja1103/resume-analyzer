import React, { useState, useCallback } from "react";
import {
  Upload,
  FileText,
  Brain,
  Target,
  TrendingUp,
  Lightbulb,
  BarChart3,
} from "lucide-react";
import AnalysisDashboard from "./components/AnalysisDashboard";
import FlashCards from "./components/FlashCards";
import axios from "axios";
import LoadingSpinner from "./components/LoadingSpinner";

interface AnalysisData {
  analysis: any;
  insights: any;
  flashcards: any[];
  ats_score: any;
  resume_preview: string;
}

const App = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  console.log("App analysisData:", analysisData);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file && file.type === "application/pdf") {
        setSelectedFile(file);
        setError(null);
      } else {
        setError("Please select a valid PDF file");
      }
    },
    []
  );

  const handleAnalyze = async () => {
    if (!selectedFile || !jobDescription.trim()) {
      setError("Please provide both resume and job description");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    const formData = new FormData();
    formData.append("resume", selectedFile);
    formData.append("job_description", jobDescription);

    try {
      // const response = await fetch("http://localhost:5000/analyze-resume", {
      //   method: "POST",
      //   body: formData,
      // });

      const response = await axios.post(
        "http://localhost:5000/analyze-resume",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const result = response.data;

      console.log("Data Analysis result:", result.data);
      if (result.success) {
        setAnalysisData(result.data);
        setActiveTab("dashboard");
      } else {
        setError(result.error || "Analysis failed");
      }
    } catch (err) {
      console.error("Error during analysis:", err);
      setError("Failed to connect to analysis service");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const tabs = [
    { id: "dashboard", label: "Analysis Dashboard", icon: BarChart3 },
    { id: "flashcards", label: "Interview Prep", icon: Brain },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                Resume Analyzer
              </h1>
            </div>

            {analysisData && (
              <nav className="flex gap-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                        activeTab === tab.id
                          ? "bg-blue-600 text-white shadow-lg"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!analysisData ? (
          /* Upload Section */
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">
                Unlock Your Resume's Potential
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Get AI-powered insights, ATS optimization, and personalized
                interview preparation
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* File Upload */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Upload Resume (PDF)
                  </label>
                  <div
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                      selectedFile
                        ? "border-green-300 bg-green-50"
                        : "border-slate-300 hover:border-blue-400 hover:bg-blue-50"
                    }`}
                  >
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="resume-upload"
                    />
                    <label htmlFor="resume-upload" className="cursor-pointer">
                      <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                      {selectedFile ? (
                        <div>
                          <p className="text-green-700 font-medium">
                            {selectedFile.name}
                          </p>
                          <p className="text-sm text-green-600">
                            Click to change file
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-slate-700 font-medium mb-2">
                            Drop your resume here
                          </p>
                          <p className="text-sm text-slate-500">
                            or click to browse
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Job Description */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Job Description
                  </label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description you're applying for..."
                    className="w-full h-48 p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>

              {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              <div className="mt-8 text-center">
                <button
                  onClick={handleAnalyze}
                  disabled={
                    isAnalyzing || !selectedFile || !jobDescription.trim()
                  }
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                >
                  {isAnalyzing ? (
                    <div className="flex items-center gap-3">
                      <LoadingSpinner />
                      Analyzing Resume...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Analyze Resume
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-4 gap-6">
              {[
                {
                  icon: TrendingUp,
                  title: "ATS Score",
                  desc: "Optimize for applicant tracking systems",
                },
                {
                  icon: Target,
                  title: "Skill Matching",
                  desc: "See how your skills align with the job",
                },
                {
                  icon: Lightbulb,
                  title: "Career Insights",
                  desc: "Get personalized improvement tips",
                },
                {
                  icon: Brain,
                  title: "Interview Prep",
                  desc: "3D flashcards for practice questions",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg w-fit mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Analysis Results */
          <div>
            {activeTab === "dashboard" && (
              <AnalysisDashboard data={analysisData} />
            )}
            {activeTab === "flashcards" && (
              <FlashCards flashcards={analysisData.flashcards} />
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
