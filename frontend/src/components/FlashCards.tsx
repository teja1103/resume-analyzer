import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Brain,
  Star,
  AlertCircle,
} from "lucide-react";

interface FlashCard {
  question: string;
  answer: string;
  category: string;
  difficulty: string;
}

interface FlashCardsProps {
  flashcards: FlashCard[];
}

const FlashCards: React.FC<FlashCardsProps> = ({ flashcards }) => {
  console.log("Flashcards received:", flashcards);
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [filter, setFilter] = useState("All");

  // Ensure we have valid flashcards
  const validFlashcards = flashcards && flashcards.length > 0 ? flashcards : [];

  const categories = [
    "All",
    ...Array.from(new Set(validFlashcards.map((card) => card.category))),
  ];
  const difficulties = [
    "All",
    ...Array.from(new Set(validFlashcards.map((card) => card.difficulty))),
  ];

  const filteredCards = validFlashcards.filter((card) => {
    return (
      filter === "All" || card.category === filter || card.difficulty === filter
    );
  });

  const nextCard = () => {
    setCurrentCard((prev) => (prev + 1) % filteredCards.length);
    setIsFlipped(false);
  };

  const prevCard = () => {
    setCurrentCard(
      (prev) => (prev - 1 + filteredCards.length) % filteredCards.length
    );
    setIsFlipped(false);
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-700 border-green-200";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "hard":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "technical":
        return "💻";
      case "behavioral":
        return "🤝";
      case "situational":
        return "🎯";
      default:
        return "📝";
    }
  };

  // Show error state if no flashcards
  if (filteredCards.length === 0 && validFlashcards.length === 0) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-amber-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            Flashcards Not Available
          </h3>
          <p className="text-slate-600 mb-6">
            We encountered an issue generating your interview flashcards. This might be due to:
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 max-w-md mx-auto">
            <ul className="text-left text-sm text-amber-800 space-y-1">
              <li>• Complex resume formatting</li>
              <li>• API processing limitations</li>
              <li>• Temporary service issues</li>
            </ul>
          </div>
          <div className="mt-6">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show filter message if no cards match filter
  if (filteredCards.length === 0) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4 flex items-center justify-center gap-3">
            <Brain className="w-8 h-8 text-blue-600" />
            Interview Preparation
          </h2>
          <p className="text-slate-600">
            Practice with AI-generated questions based on your resume
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-100">
          <div className="flex flex-wrap gap-4 items-center">
            <span className="font-medium text-slate-700">Filter by:</span>
            <div className="flex flex-wrap gap-2">
              {[...categories, ...difficulties.filter((d) => d !== "All")].map(
                (filterOption) => (
                  <button
                    key={filterOption}
                    onClick={() => {
                      setFilter(filterOption);
                      setCurrentCard(0);
                      setIsFlipped(false);
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      filter === filterOption
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {filterOption}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        <div className="text-center py-12">
          <Brain className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600">
            No flashcards match your current filter "{filter}".
          </p>
          <button
            onClick={() => setFilter("All")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Show All Cards
          </button>
        </div>
      </div>
    );
  }

  const card = filteredCards[currentCard];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-4 flex items-center justify-center gap-3">
          <Brain className="w-8 h-8 text-blue-600" />
          Interview Preparation
        </h2>
        <p className="text-slate-600">
          Practice with AI-generated questions based on your resume
        </p>
      </div>

      {/* Show notification if using fallback data */}
      {validFlashcards.length <= 5 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-900">Limited Flashcards Available</h4>
              <p className="text-sm text-blue-700 mt-1">
                We've generated a basic set of interview questions. For more comprehensive preparation, 
                try uploading your resume again or ensure it's in a clear, standard format.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-100">
        <div className="flex flex-wrap gap-4 items-center">
          <span className="font-medium text-slate-700">Filter by:</span>
          <div className="flex flex-wrap gap-2">
            {[...categories, ...difficulties.filter((d) => d !== "All")].map(
              (filterOption) => (
                <button
                  key={filterOption}
                  onClick={() => {
                    setFilter(filterOption);
                    setCurrentCard(0);
                    setIsFlipped(false);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filter === filterOption
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {filterOption}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Card Counter */}
      <div className="text-center">
        <span className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-lg border border-slate-200">
          <Star className="w-4 h-4 text-yellow-500" />
          <span className="font-medium text-slate-700">
            {currentCard + 1} of {filteredCards.length}
          </span>
        </span>
      </div>

      {/* 3D Flashcard */}
      <div
        className="relative perspective-1000 mx-auto"
        style={{ maxWidth: "600px", height: "400px" }}
      >
        <div
          className={`relative w-full h-full duration-700 preserve-3d cursor-pointer ${
            isFlipped ? "rotate-y-180" : ""
          }`}
          onClick={flipCard}
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Front of card (Question) */}
          <div
            className="absolute w-full h-full backface-hidden bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-2xl p-8 flex flex-col justify-between"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    {getCategoryIcon(card.category)}
                  </span>
                  <span className="text-white/90 font-medium">
                    {card.category}
                  </span>
                </div>
                <div
                  className={`px-3 py-1 rounded-full border text-sm font-medium ${getDifficultyColor(
                    card.difficulty
                  )} bg-white/20 text-white border-white/30`}
                >
                  {card.difficulty}
                </div>
              </div>

              <h3 className="text-white text-xl font-semibold mb-4">
                Question
              </h3>
              <p className="text-white/95 text-lg leading-relaxed">
                {card.question}
              </p>
            </div>

            <div className="flex items-center justify-center pt-6">
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <RotateCcw className="w-4 h-4" />
                Click to reveal answer
              </div>
            </div>
          </div>

          {/* Back of card (Answer) */}
          <div
            className="absolute w-full h-full backface-hidden bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl shadow-2xl p-8 flex flex-col justify-between"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">💡</span>
                  <span className="text-white/90 font-medium">Answer</span>
                </div>
                <div
                  className={`px-3 py-1 rounded-full border text-sm font-medium ${getDifficultyColor(
                    card.difficulty
                  )} bg-white/20 text-white border-white/30`}
                >
                  {card.difficulty}
                </div>
              </div>

              <h3 className="text-white text-xl font-semibold mb-4">
                Suggested Response
              </h3>
              <p className="text-white/95 text-lg leading-relaxed">
                {card.answer}
              </p>
            </div>

            <div className="flex items-center justify-center pt-6">
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <RotateCcw className="w-4 h-4" />
                Click to see question
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={prevCard}
          disabled={filteredCards.length <= 1}
          className="flex items-center gap-2 px-6 py-3 bg-white rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5" />
          Previous
        </button>

        <button
          onClick={flipCard}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all font-medium"
        >
          <RotateCcw className="w-5 h-5 mx-auto" />
        </button>

        <button
          onClick={nextCard}
          disabled={filteredCards.length <= 1}
          className="flex items-center gap-2 px-6 py-3 bg-white rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-2">💡 Interview Tips</h4>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>• Take your time to think before answering</li>
          <li>
            • Use the STAR method (Situation, Task, Action, Result) for
            behavioral questions
          </li>
          <li>• Practice speaking your answers out loud</li>
          <li>• Prepare specific examples from your experience</li>
        </ul>
      </div>
    </div>
  );
};

export default FlashCards;
