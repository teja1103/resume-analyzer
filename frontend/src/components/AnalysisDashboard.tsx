import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
} from "recharts";
import {
  TrendingUp,
  CheckCircle,
  XCircle,
  Award,
  Target,
  Lightbulb,
} from "lucide-react";

interface AnalysisDashboardProps {
  data: {
    analysis: any;
    insights: any;
    ats_score: any;
  };
}

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ data }) => {
  const { analysis, insights, ats_score } = data;

  // Prepare chart data
  const skillsData = [
    {
      name: "Matching Skills",
      value: analysis.matching_skills?.length || 0,
      fill: "#10b981",
    },
    {
      name: "Missing Skills",
      value: analysis.missing_skills?.length || 0,
      fill: "#ef4444",
    },
  ];

  const experienceScore = analysis.experience_match?.match_percentage || 0;
  const roleScore = analysis.role_compatibility?.score || 0;
  const overallAtsScore = ats_score.overall_score || 0;

  const scoreData = [
    { name: "Experience Match", score: experienceScore, fill: "#3b82f6" },
    { name: "Role Compatibility", score: roleScore, fill: "#8b5cf6" },
    { name: "ATS Score", score: overallAtsScore, fill: "#06b6d4" },
  ];

  const radialData = [
    { name: "ATS Score", value: overallAtsScore, fill: "#3b82f6" },
  ];

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Award className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-3xl font-bold text-blue-600">
              {overallAtsScore}%
            </span>
          </div>
          <h3 className="font-semibold text-slate-700">ATS Score</h3>
          <p className="text-sm text-slate-500">Overall compatibility</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-3xl font-bold text-green-600">
              {analysis.matching_skills?.length || 0}
            </span>
          </div>
          <h3 className="font-semibold text-slate-700">Matching Skills</h3>
          <p className="text-sm text-slate-500">Skills that align</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-3xl font-bold text-red-600">
              {analysis.missing_skills?.length || 0}
            </span>
          </div>
          <h3 className="font-semibold text-slate-700">Missing Skills</h3>
          <p className="text-sm text-slate-500">Areas to improve</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-3xl font-bold text-purple-600">
              {roleScore}%
            </span>
          </div>
          <h3 className="font-semibold text-slate-700">Role Match</h3>
          <p className="text-sm text-slate-500">Compatibility score</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Skills Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">
            Skills Analysis
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={skillsData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {skillsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-slate-600">Matching</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm text-slate-600">Missing</span>
            </div>
          </div>
        </div>

        {/* Score Comparison */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">
            Score Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={scoreData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="score" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ATS Score Radial */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">
            ATS Compatibility
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="40%"
              outerRadius="80%"
              data={radialData}
            >
              <RadialBar dataKey="value" cornerRadius={10} fill="#3b82f6" />
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-slate-900 text-2xl font-bold"
              >
                {overallAtsScore}%
              </text>
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="text-center mt-4">
            <p className="text-sm text-slate-600">
              {overallAtsScore >= 80
                ? "Excellent"
                : overallAtsScore >= 60
                ? "Good"
                : "Needs Improvement"}
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Analysis */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Strengths & Weaknesses */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Strengths & Weaknesses
          </h3>

          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-green-700 mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Strengths
              </h4>
              <div className="space-y-2">
                {insights.strengths
                  ?.slice(0, 3)
                  .map((strength: string, index: number) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-slate-700">{strength}</p>
                    </div>
                  ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-red-700 mb-3 flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                Areas for Improvement
              </h4>
              <div className="space-y-2">
                {insights.weaknesses
                  ?.slice(0, 3)
                  .map((weakness: string, index: number) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-slate-700">{weakness}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
            Recommendations
          </h3>

          <div className="space-y-4">
            {insights.recommendations
              ?.slice(0, 4)
              .map((rec: any, index: number) => (
                <div
                  key={index}
                  className="border border-slate-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-slate-900">
                      {rec.category}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        rec.priority === "High"
                          ? "bg-red-100 text-red-700"
                          : rec.priority === "Medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {rec.priority}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">{rec.suggestion}</p>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Skills Lists */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-100">
          <h3 className="text-lg font-semibold text-green-700 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Matching Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {analysis.matching_skills?.map((skill: string, index: number) => (
              <span
                key={index}
                className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-100">
          <h3 className="text-lg font-semibold text-red-700 mb-4 flex items-center gap-2">
            <XCircle className="w-5 h-5" />
            Missing Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {analysis.missing_skills?.map((skill: string, index: number) => (
              <span
                key={index}
                className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisDashboard;
