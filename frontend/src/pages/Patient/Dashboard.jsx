import { useState, useEffect } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  Calendar,
  Clock,
  FileText,
  Pill,
  User,
  Activity,
  Bell,
  ChevronRight,
  Stethoscope,
  Brain,
  Heart,
  LineChart,
  AlertTriangle,
  Microscope,
  BarChart3,
  PieChart,
  TrendingUp,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";

const Dashboard = () => {
  const [stats, setStats] = useState({
    upcomingAppointments: 0,
    prescriptions: 0,
    medicalRecords: 0,
    pendingBills: 0,
    healthScore: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Simulated ML predictions
  const [predictions, setPredictions] = useState({
    diabetesRisk: 12,
    heartDiseaseRisk: 8,
    mentalHealthScore: 85,
    sleepQuality: 78,
  });

  useEffect(() => {
    setTimeout(() => {
      setStats({
        upcomingAppointments: 2,
        prescriptions: 5,
        medicalRecords: 8,
        pendingBills: 1,
        healthScore: 85,
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  const StatCard = ({ title, value, icon: Icon, color, delay, subtitle }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <Card className="p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center space-x-4">
          <div
            className={`p-3 rounded-full ${color} transform transition-transform hover:scale-110`}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold">
              {isLoading ? (
                <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                value
              )}
            </h3>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );

  const PredictionCard = ({ title, value, risk, icon: Icon, color }) => (
    <Card className="p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div
          className={`px-3 py-1 rounded-full text-sm ${
            risk === "high"
              ? "bg-red-100 text-red-600"
              : risk === "medium"
              ? "bg-yellow-100 text-yellow-600"
              : "bg-green-100 text-green-600"
          }`}
        >
          {risk.charAt(0).toUpperCase() + risk.slice(1)} Risk
        </div>
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="flex items-center space-x-2">
        <div className="text-3xl font-bold">{value}%</div>
        <TrendingUp className="w-4 h-4 text-green-500" />
      </div>
      <p className="text-sm text-muted-foreground mt-2">
        Based on recent health data analysis
      </p>
    </Card>
  );

  const HealthMetricsCard = () => (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-6">Health Metrics Analysis</h3>
      <div className="space-y-4">
        {[
          { label: "Blood Pressure", value: "120/80", status: "normal" },
          { label: "Blood Sugar", value: "95 mg/dL", status: "normal" },
          { label: "Heart Rate", value: "72 bpm", status: "normal" },
          { label: "Oxygen Level", value: "98%", status: "good" },
        ].map((metric) => (
          <div
            key={metric.label}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <span className="font-medium">{metric.label}</span>
            <div className="flex items-center space-x-2">
              <span
                className={`px-2 py-1 rounded-full text-sm ${
                  metric.status === "normal"
                    ? "bg-green-100 text-green-600"
                    : metric.status === "good"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-yellow-100 text-yellow-600"
                }`}
              >
                {metric.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );

  const MLInsightsSection = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-6">AI Health Assistant</h3>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <Brain className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-600">
                  Health Insights
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Based on your recent health data, our AI suggests:
              </p>
              <ul className="mt-3 space-y-2">
                <li className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Maintain current exercise routine</span>
                </li>
                <li className="flex items-center space-x-2 text-sm">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  <span>Consider reducing sodium intake</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-6">Predictive Analytics</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <PredictionCard
                title="Diabetes Risk"
                value={predictions.diabetesRisk}
                risk="low"
                icon={Activity}
                color="bg-green-500"
              />
              <PredictionCard
                title="Heart Health"
                value={predictions.heartDiseaseRisk}
                risk="medium"
                icon={Heart}
                color="bg-blue-500"
              />
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6 max-w-7xl">
      {/* Header with Health Score */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Health Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            AI-Powered Health Monitoring & Predictions
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-xl text-white">
            <p className="text-sm opacity-90">Overall Health Score</p>
            <div className="text-2xl font-bold">{stats.healthScore}/100</div>
          </div>
          <Button variant="outline" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
              3
            </span>
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-4 border-b mb-6">
        {[
          { id: "overview", label: "Overview", icon: BarChart3 },
          { id: "predictions", label: "ML Predictions", icon: Brain },
          { id: "metrics", label: "Health Metrics", icon: LineChart },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Main Content based on active tab */}
      {activeTab === "overview" && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
            <StatCard
              title="ML Health Score"
              value={`${stats.healthScore}%`}
              icon={Brain}
              color="bg-purple-500"
              delay={0.1}
              subtitle="Based on AI analysis"
            />
            <StatCard
              title="Risk Factors"
              value="Low"
              icon={AlertTriangle}
              color="bg-green-500"
              delay={0.2}
              subtitle="AI-powered assessment"
            />
            <StatCard
              title="Health Trends"
              value="+15%"
              icon={TrendingUp}
              color="bg-blue-500"
              delay={0.3}
              subtitle="Month over month"
            />
            <StatCard
              title="Next Checkup"
              value="7 days"
              icon={Calendar}
              color="bg-indigo-500"
              delay={0.4}
              subtitle="Recommended by AI"
            />
          </div>

          {/* ML Insights Section */}
          <MLInsightsSection />
        </>
      )}

      {activeTab === "predictions" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <PredictionCard
            title="Diabetes Risk Assessment"
            value={predictions.diabetesRisk}
            risk="low"
            icon={Activity}
            color="bg-green-500"
          />
          <PredictionCard
            title="Heart Disease Risk"
            value={predictions.heartDiseaseRisk}
            risk="medium"
            icon={Heart}
            color="bg-blue-500"
          />
          <PredictionCard
            title="Mental Health Score"
            value={predictions.mentalHealthScore}
            risk="low"
            icon={Brain}
            color="bg-purple-500"
          />
        </div>
      )}

      {activeTab === "metrics" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <HealthMetricsCard />
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-6">Lab Results Analysis</h3>
            <div className="space-y-4">
              {[
                {
                  label: "Cholesterol",
                  value: "180 mg/dL",
                  status: "normal",
                  trend: "stable",
                },
                {
                  label: "Hemoglobin",
                  value: "14 g/dL",
                  status: "normal",
                  trend: "improving",
                },
                {
                  label: "Vitamin D",
                  value: "35 ng/mL",
                  status: "low",
                  trend: "decreasing",
                },
              ].map((result) => (
                <div
                  key={result.label}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <span className="font-medium">{result.label}</span>
                    <p className="text-sm text-muted-foreground">
                      Trend: {result.trend}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        result.status === "normal"
                          ? "bg-green-100 text-green-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {result.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
