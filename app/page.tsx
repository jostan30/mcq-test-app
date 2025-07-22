'use client'
import React, { useState, useEffect } from 'react';
import { signIn, signOut, useSession } from "next-auth/react";
import axios from "axios";
import { Brain, Trophy, Target, Zap, ChevronRight, Star, Users, BookOpen, Loader2 } from 'lucide-react';

type Question = {
  question: string;
  options: string[];
  correct: number;
};

export default function ModernQuizApp() {
  const { data: session } = useSession();
  const [topic, setTopic] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([]);
  const [showAnswers, setShowAnswers] = useState<boolean[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  // Load saved topic from localStorage
  useEffect(() => {
    const savedTopic = localStorage.getItem("lastTopic");
    if (savedTopic) setTopic(savedTopic);
  }, []);

  const handleTopicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTopic(e.target.value);
    localStorage.setItem("lastTopic", e.target.value);
  };

  const fetchQuestions = async () => {
    if (!topic.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await axios.post("/api/get-questions", { topic });
      setQuestions(response.data.questions);
      setSelectedAnswers(new Array(response.data.questions.length).fill(null));
      setShowAnswers(new Array(response.data.questions.length).fill(false));
      setScore(null);
    } catch (error) {
      console.error('Error fetching questions:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionChange = (questionIndex: number, optionIndex: number) => {
    const updated = [...selectedAnswers];
    updated[questionIndex] = optionIndex;
    setSelectedAnswers(updated);
  };

  const handleShowAnswer = (index: number) => {
    const updated = [...showAnswers];
    updated[index] = true;
    setShowAnswers(updated);
  };

  const handleSubmit = () => {
    let total = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct) total++;
    });
    setScore(total);
  };

  const resetQuiz = () => {
    setQuestions([]);
    setTopic("");
    setScore(null);
    setShowSummary(false);
    setSelectedAnswers([]);
    setShowAnswers([]);
  };

  // Landing Page Component
  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute top-40 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10">
          {/* Header */}
          <header className="px-6 py-4 flex justify-between items-center backdrop-blur-sm">
            <div className="flex items-center space-x-2">
              <Brain className="w-8 h-8 text-purple-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                QuizMaster AI
              </span>
            </div>
            <button
              onClick={() => signIn("google")}
              className="px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 text-sm font-medium"
            >
              Login
            </button>
          </header>

          {/* Hero Section */}
          <section className="px-6 py-20 text-center">
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 mb-6">
                <Zap className="w-4 h-4 mr-2 text-yellow-400" />
                <span className="text-sm font-medium">AI-Powered Quiz Generation</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent leading-tight">
                Master Any Topic
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  Instantly
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                Generate personalized quizzes on any subject with AI. Perfect for exam prep, 
                interviews, and knowledge testing.
              </p>

              <button
                onClick={() => signIn("google")}
                className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-purple-500/25"
              >
                Get Started with Google
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </section>

          {/* Features Section */}
          <section className="px-6 py-20">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  Why Choose QuizMaster?
                </h2>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                  Experience the future of learning with our cutting-edge features
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="group p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-300">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-white">AI-Generated Questions</h3>
                  <p className="text-slate-400 leading-relaxed">
                    Our advanced AI creates unique, relevant questions tailored to your specific topic and difficulty level.
                  </p>
                </div>

                <div className="group p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-300">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-white">Instant Feedback</h3>
                  <p className="text-slate-400 leading-relaxed">
                    Get immediate results and explanations to help you learn from mistakes and improve faster.
                  </p>
                </div>

                <div className="group p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-300">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-white">Track Progress</h3>
                  <p className="text-slate-400 leading-relaxed">
                    Monitor your learning journey with detailed analytics and performance insights.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="px-6 py-20 border-t border-white/10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                <div>
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                    10K+
                  </div>
                  <p className="text-slate-400">Questions Generated</p>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                    500+
                  </div>
                  <p className="text-slate-400">Happy Users</p>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-400 to-red-400 bg-clip-text text-transparent mb-2">
                    95%
                  </div>
                  <p className="text-slate-400">Success Rate</p>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="px-6 py-8 border-t border-white/10 text-center">
            <p className="text-slate-400">
              © 2024 QuizMaster AI. Powered by artificial intelligence.
            </p>
          </footer>
        </div>
      </div>
    );
  }

  // Quiz Application (when logged in)
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <Brain className="w-8 h-8 text-purple-400" />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Welcome back, {session.user?.name}
              </h1>
              <p className="text-slate-400 text-sm">Ready to challenge yourself?</p>
            </div>
          </div>
          <button
            onClick={() => signOut()}
            className="px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-all duration-300 text-sm"
          >
            Logout
          </button>
        </div>

        {/* Topic Input Section */}
        {!questions.length && !isLoading && (
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-8">
            <div className="text-center mb-8">
              <BookOpen className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Start Your Quiz Journey
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                📘 This quiz generates 10 curated multiple-choice questions on your chosen topic. 
                Perfect for interview prep, exams, or testing your knowledge.
              </p>
            </div>

            <div className="max-w-md mx-auto space-y-4">
              <input
                type="text"
                value={topic}
                onChange={handleTopicChange}
                className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500/50 focus:bg-white/20 transition-all duration-300"
                placeholder="Enter topic (e.g., Operating Systems, React, Python...)"
              />
              <button
                onClick={fetchQuestions}
                disabled={!topic.trim()}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100"
              >
                🚀 Start Quiz
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-12 text-center">
            <Loader2 className="w-12 h-12 text-purple-400 mx-auto mb-4 animate-spin" />
            <h3 className="text-xl font-semibold mb-2">Generating Your Quiz...</h3>
            <p className="text-slate-400">Our AI is crafting personalized questions for "{topic}"</p>
          </div>
        )}

        {/* Quiz Questions */}
        {questions.length > 0 && (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {topic} Quiz
                </h2>
                <div className="text-sm text-slate-400">
                  {questions.length} Questions
                </div>
              </div>

              {questions.map((q, idx) => (
                <div key={idx} className="mb-8 p-6 bg-white/5 rounded-xl border border-white/10">
                  <h3 className="text-lg font-semibold mb-4 text-white">
                    <span className="text-purple-400">Q{idx + 1}.</span> {q.question}
                  </h3>
                  
                  <div className="space-y-2 mb-4">
                    {q.options.map((opt, optIdx) => (
                      <label
                        key={optIdx}
                        className={`flex items-center p-4 rounded-lg cursor-pointer border transition-all duration-300 ${
                          selectedAnswers[idx] === optIdx
                            ? "bg-purple-600/30 border-purple-400/50 text-white"
                            : "bg-white/5 border-white/20 hover:border-purple-400/30 hover:bg-white/10"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`q${idx}`}
                          className="mr-3 accent-purple-500"
                          checked={selectedAnswers[idx] === optIdx}
                          onChange={() => handleOptionChange(idx, optIdx)}
                        />
                        <span className="text-sm">{opt}</span>
                      </label>
                    ))}
                  </div>

                  <button
                    onClick={() => handleShowAnswer(idx)}
                    className="text-sm text-yellow-400 hover:text-yellow-300 hover:underline transition-colors"
                  >
                    💡 Show Answer
                  </button>
                  
                  {showAnswers[idx] && (
                    <div className="mt-3 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                      <p className="text-green-400 text-sm">
                        ✅ Correct Answer: {q.options[q.correct]}
                      </p>
                    </div>
                  )}
                </div>
              ))}

              {/* Submit/Results Section */}
              <div className="text-center pt-6 border-t border-white/10">
                {score === null ? (
                  <button
                    onClick={handleSubmit}
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                  >
                    📊 Submit Quiz
                  </button>
                ) : !showSummary ? (
                  <div className="space-y-4">
                    <div className="p-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl">
                      <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
                      <h3 className="text-2xl font-bold text-green-400 mb-2">
                        Quiz Complete! 🎉
                      </h3>
                      <p className="text-3xl font-bold text-white mb-1">
                        {score}/{questions.length}
                      </p>
                      <p className="text-slate-300 mb-4">
                        {((score / questions.length) * 100).toFixed(0)}% Score
                      </p>
                      
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                          onClick={() => setShowSummary(true)}
                          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl transition-all duration-300 font-medium"
                        >
                          📋 View Test Summary
                        </button>
                        <button
                          onClick={resetQuiz}
                          className="px-6 py-3 bg-white/10 border border-white/20 hover:bg-white/20 rounded-xl transition-all duration-300"
                        >
                          🔄 Take Another Quiz
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="p-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl">
                      <h3 className="text-2xl font-bold text-blue-400 mb-4 flex items-center justify-center">
                        📋 Test Summary
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        <div className="text-center p-4 bg-white/5 rounded-lg">
                          <div className="text-2xl font-bold text-green-400">{score}</div>
                          <div className="text-sm text-slate-300">Correct</div>
                        </div>
                        <div className="text-center p-4 bg-white/5 rounded-lg">
                          <div className="text-2xl font-bold text-red-400">{questions.length - score}</div>
                          <div className="text-sm text-slate-300">Incorrect</div>
                        </div>
                        <div className="text-center p-4 bg-white/5 rounded-lg">
                          <div className="text-2xl font-bold text-purple-400">{((score / questions.length) * 100).toFixed(0)}%</div>
                          <div className="text-sm text-slate-300">Score</div>
                        </div>
                      </div>
                    </div>

                    {/* Detailed Summary */}
                    <div className="space-y-4">
                      <h4 className="text-xl font-semibold text-white text-center mb-6">Question by Question Analysis</h4>
                      {questions.map((q, idx) => {
                        const userAnswer = selectedAnswers[idx];
                        const isCorrect = userAnswer === q.correct;
                        
                        return (
                          <div 
                            key={idx} 
                            className={`p-6 rounded-xl border-2 ${
                              isCorrect 
                                ? 'bg-green-500/10 border-green-500/30' 
                                : 'bg-red-500/10 border-red-500/30'
                            }`}
                          >
                            <div className="flex items-start justify-between mb-4">
                              <h5 className="font-semibold text-white flex-1 pr-4">
                                <span className="text-slate-400">Q{idx + 1}.</span> {q.question}
                              </h5>
                              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                                isCorrect 
                                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
                              }`}>
                                {isCorrect ? '✅ Correct' : '❌ Incorrect'}
                              </div>
                            </div>
                            
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center">
                                <span className="text-green-400 font-medium mr-2">✓ Correct Answer:</span>
                                <span className="text-white">{q.options[q.correct]}</span>
                              </div>
                              
                              {!isCorrect && userAnswer !== null && (
                                <div className="flex items-center">
                                  <span className="text-red-400 font-medium mr-2">✗ Your Answer:</span>
                                  <span className="text-slate-300">{q.options[userAnswer]}</span>
                                </div>
                              )}
                              
                              {userAnswer === null && (
                                <div className="flex items-center">
                                  <span className="text-yellow-400 font-medium mr-2">⚠ Your Answer:</span>
                                  <span className="text-slate-300">Not answered</span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Performance Insights */}
                    <div className="p-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl">
                      <h4 className="text-lg font-semibold text-purple-400 mb-3 flex items-center">
                        🎯 Performance Insights
                      </h4>
                      <div className="space-y-2 text-sm">
                        {score === questions.length && (
                          <p className="text-green-400">🌟 Perfect score! Excellent knowledge of {topic}!</p>
                        )}
                        {score >= questions.length * 0.8 && score < questions.length && (
                          <p className="text-blue-400">🎉 Great job! You have a strong understanding of {topic}.</p>
                        )}
                        {score >= questions.length * 0.6 && score < questions.length * 0.8 && (
                          <p className="text-yellow-400">💪 Good effort! Consider reviewing some key concepts in {topic}.</p>
                        )}
                        {score < questions.length * 0.6 && (
                          <p className="text-orange-400">📚 Keep studying! Focus on the fundamentals of {topic}.</p>
                        )}
                        
                        <p className="text-slate-300">
                          You answered {score} out of {questions.length} questions correctly.
                          {questions.length - score > 0 && (
                            ` Review the ${questions.length - score} incorrect answer${questions.length - score === 1 ? '' : 's'} above to improve your understanding.`
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button
                        onClick={() => setShowSummary(false)}
                        className="px-6 py-3 bg-slate-600 hover:bg-slate-500 rounded-xl transition-all duration-300"
                      >
                        ← Back to Results
                      </button>
                      <button
                        onClick={resetQuiz}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl transition-all duration-300 font-medium"
                      >
                        🔄 Take Another Quiz
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}