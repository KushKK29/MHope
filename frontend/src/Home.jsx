import React, { useState, useEffect } from "react";
import {
  Brain,
  Bone,
  Heart,
  Activity,
  Calendar,
  Users,
  Award,
  Clock,
  Shield,
  ArrowRight,
  Stethoscope,
  Zap,
  CheckCircle,
  Star,
  Quote,
  Play,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  TrendingUp,
  Globe,
  Microscope,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import h1 from "./assets/h1.jpeg";
import h2 from "./assets/h2.jpeg";
import h3 from "./assets/h3.jpeg";
import h4 from "./assets/h4.jpeg";

const HomeNavbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-blue-700">MHope</span>
        </div>
        <button
          onClick={() => navigate("/login")}
          className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
        >
          Login
        </button>
      </div>
    </nav>
  );
};

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const navigate = useNavigate();

  // Use local images
  const heroImages = [h1, h2, h3, h4];

  const carouselSlides = [
    {
      title: "AI-Powered Medical Diagnostics",
      subtitle: "Revolutionizing Healthcare with Artificial Intelligence",
      description:
        "Advanced AI algorithms providing instant, accurate medical diagnoses with 99.2% precision for better patient outcomes and faster treatment decisions.",
      image: heroImages[0],
      cta: "Start Free Trial",
      highlight: "Trusted by 500+ Hospitals",
    },
    {
      title: "Pneumonia Detection System",
      subtitle: "Instant Chest X-Ray Analysis",
      description:
        "Our AI system analyzes chest X-rays in under 30 seconds, detecting pneumonia with medical-grade accuracy, reducing diagnostic time by 75%.",
      image: heroImages[1],
      cta: "Try Detection",
      highlight: "30-Second Analysis",
    },
    {
      title: "Bone Fracture Analysis",
      subtitle: "Advanced Orthopedic AI Diagnostics",
      description:
        "Comprehensive bone fracture detection and classification using state-of-the-art deep learning models trained on millions of medical images.",
      image: heroImages[2],
      cta: "Analyze Now",
      highlight: "95% Accuracy Rate",
    },
    {
      title: "Comprehensive Health Monitoring",
      subtitle: "Multi-Modal AI Health Assessment",
      description:
        "From emotion detection to blood analysis, our integrated AI platform provides complete health insights with real-time monitoring capabilities.",
      image: heroImages[3],
      cta: "Book Consultation",
      highlight: "24/7 Monitoring",
    },
  ];

  const aiFeatures = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Pneumonia Detection",
      description:
        "AI-powered chest X-ray analysis providing instant pneumonia diagnosis with clinical-grade accuracy and detailed confidence scoring.",
      features: [
        "Instant Results",
        "DICOM Compatible",
        "Clinical Grade",
        "Multi-language Support",
      ],
      color: "from-blue-600 to-blue-800",
      stats: { accuracy: "95%", speed: "30s", processed: "50K+" },
    },
    {
      icon: <Bone className="w-8 h-8" />,
      title: "Bone Fracture Analysis",
      description:
        "Advanced fracture detection system identifying and classifying bone injuries with precise location mapping and severity assessment.",
      features: [
        "Multi-bone Detection",
        "Severity Assessment",
        "Treatment Recommendations",
        "3D Visualization",
      ],
      color: "from-purple-600 to-purple-800",
      stats: { accuracy: "92%", speed: "45s", processed: "35K+" },
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Emotion Prediction",
      description:
        "Facial analysis technology for emotional state assessment supporting mental health diagnosis and patient care optimization.",
      features: [
        "Real-time Analysis",
        "7 Emotion Categories",
        "Privacy Protected",
        "Bias-free Algorithm",
      ],
      color: "from-red-600 to-red-800",
      stats: { accuracy: "89%", speed: "2s", processed: "100K+" },
    },
    {
      icon: <Activity className="w-8 h-8" />,
      title: "Blood Report Analysis",
      description:
        "Automated comprehensive blood report analysis with pattern recognition for early disease detection and health monitoring.",
      features: [
        "Lab Integration",
        "Trend Analysis",
        "Risk Assessment",
        "Personalized Insights",
      ],
      color: "from-green-600 to-green-800",
      stats: { accuracy: "97%", speed: "15s", processed: "75K+" },
    },
  ];

  const stats = [
    {
      number: "250K+",
      label: "Diagnoses Completed",
      icon: <Stethoscope className="w-6 h-6" />,
      growth: "+45%",
    },
    {
      number: "99.2%",
      label: "Diagnostic Accuracy",
      icon: <Award className="w-6 h-6" />,
      growth: "Industry Leading",
    },
    {
      number: "24/7",
      label: "AI Availability",
      icon: <Clock className="w-6 h-6" />,
      growth: "Global Access",
    },
    {
      number: "100%",
      label: "HIPAA Compliant",
      icon: <Shield className="w-6 h-6" />,
      growth: "Secure Platform",
    },
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Johnson",
      role: "Chief Radiologist",
      hospital: "Metropolitan Medical Center",
      image:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      quote:
        "MHope's AI diagnostics have revolutionized our radiology department. The accuracy and speed are unprecedented, allowing us to serve more patients with better outcomes.",
      rating: 5,
    },
    {
      name: "Dr. Michael Chen",
      role: "Emergency Medicine Director",
      hospital: "City General Hospital",
      image:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      quote:
        "In emergency situations, every second counts. MHope's instant pneumonia detection has helped us make critical decisions faster and save more lives.",
      rating: 5,
    },
    {
      name: "Dr. Emily Williams",
      role: "Orthopedic Surgeon",
      hospital: "Advanced Bone & Joint Institute",
      image:
        "https://images.unsplash.com/photo-1594824804732-ca8db4748a38?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      quote:
        "The bone fracture analysis tool is incredibly detailed. It's like having a senior radiologist available 24/7, providing consistent and reliable assessments.",
      rating: 5,
    },
  ];

  const redirectToLogin = () => {
    navigate("/login");
  };

  useEffect(() => {
    setIsVisible(true);
    const carouselTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 6000);
    const testimonialTimer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => {
      clearInterval(carouselTimer);
      clearInterval(testimonialTimer);
    };
  }, [carouselSlides.length, testimonials.length]);

  return (
    <div className="min-h-screen bg-white">
      <HomeNavbar />
      {/* Hero Carousel - minimal, no arrows, smaller text/buttons/icons */}
      <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <div
          className="flex transition-transform duration-1000 ease-in-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {carouselSlides.map((slide, index) => (
            <div key={index} className="min-w-full h-full relative">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/50"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
              </div>
              <div className="relative z-10 h-full flex items-center">
                <div className="container mx-auto px-4 md:px-8">
                  <div className="max-w-2xl">
                    <div
                      className={`transform transition-all duration-1000 ${
                        currentSlide === index
                          ? "translate-x-0 opacity-100"
                          : "translate-x-4 opacity-0"
                      }`}
                    >
                      <div className="inline-flex items-center gap-2 bg-blue-600/20 backdrop-blur-sm text-blue-200 px-3 py-1.5 rounded-full text-xs font-medium mb-4 border border-blue-400/30">
                        <Zap className="w-3 h-3" />
                        {slide.highlight}
                      </div>
                    </div>
                    <h1
                      className={`text-2xl md:text-4xl font-bold text-white mb-3 leading-tight transform transition-all duration-1000 ${
                        currentSlide === index
                          ? "translate-x-0 opacity-100"
                          : "translate-x-4 opacity-0"
                      }`}
                      style={{ transitionDelay: "200ms" }}
                    >
                      {slide.title}
                    </h1>
                    <h2
                      className={`text-base md:text-lg text-blue-300 mb-3 font-medium transform transition-all duration-1000 ${
                        currentSlide === index
                          ? "translate-x-0 opacity-100"
                          : "translate-x-4 opacity-0"
                      }`}
                      style={{ transitionDelay: "400ms" }}
                    >
                      {slide.subtitle}
                    </h2>
                    <p
                      className={`text-sm md:text-base text-gray-300 mb-4 max-w-xl leading-relaxed transform transition-all duration-1000 ${
                        currentSlide === index
                          ? "translate-x-0 opacity-100"
                          : "translate-x-4 opacity-0"
                      }`}
                      style={{ transitionDelay: "600ms" }}
                    >
                      {slide.description}
                    </p>
                    <div
                      className={`flex flex-col sm:flex-row gap-3 transform transition-all duration-1000 ${
                        currentSlide === index
                          ? "translate-x-0 opacity-100"
                          : "translate-x-4 opacity-0"
                      }`}
                      style={{ transitionDelay: "800ms" }}
                    >
                      <button
                        onClick={redirectToLogin}
                        className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-cyan-700 transform transition-all duration-300 hover:scale-105 shadow flex items-center justify-center gap-2"
                      >
                        {slide.cta}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Dots Indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {carouselSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-500 border border-white/50 ${
                currentSlide === index
                  ? "bg-white w-6"
                  : "bg-white/30 w-2 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Stats Section - smaller cards */}
      <div className="py-10 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Trusted by Healthcare Professionals
            </h2>
            <p className="text-base text-gray-600 max-w-xl mx-auto">
              Real results from real medical institutions using our AI platform
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`text-center bg-white rounded-xl p-4 shadow hover:shadow-md transition-all duration-500 transform hover:-translate-y-1 border border-gray-100 ${
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="bg-gradient-to-br from-blue-600 to-cyan-600 w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2 text-white shadow">
                  {stat.icon}
                </div>
                <div className="text-lg font-bold text-gray-900 mb-1">
                  {stat.number}
                </div>
                <div className="text-gray-600 text-xs mb-1">{stat.label}</div>
                <div className="inline-flex items-center gap-1 text-green-600 text-xs font-medium">
                  <TrendingUp className="w-3 h-3" />
                  {stat.growth}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Features Section - smaller cards */}
      <div id="features" className="py-10 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-xs font-medium mb-4">
              <Brain className="w-4 h-4" />
              AI-Powered Medical Solutions
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Advanced Medical AI Features
            </h2>
            <p className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Leverage cutting-edge artificial intelligence for precise medical
              diagnostics, comprehensive health monitoring, and accelerated
              patient care delivery
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {aiFeatures.map((feature, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl border border-gray-100 hover:border-gray-200 p-5 shadow hover:shadow-md transform transition-all duration-500 hover:-translate-y-1 group ${
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`bg-gradient-to-r ${feature.color} w-10 h-10 rounded-lg flex items-center justify-center text-white shadow group-hover:scale-110 transition-transform duration-300`}
                  >
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 mb-3 leading-relaxed text-sm">
                      {feature.description}
                    </p>
                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-2 mb-3 p-2 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <div className="text-base font-bold text-gray-900">
                          {feature.stats.accuracy}
                        </div>
                        <div className="text-xs text-gray-600">Accuracy</div>
                      </div>
                      <div className="text-center">
                        <div className="text-base font-bold text-gray-900">
                          {feature.stats.speed}
                        </div>
                        <div className="text-xs text-gray-600">Time</div>
                      </div>
                      <div className="text-center">
                        <div className="text-base font-bold text-gray-900">
                          {feature.stats.processed}
                        </div>
                        <div className="text-xs text-gray-600">Processed</div>
                      </div>
                    </div>
                    <div className="space-y-1 mb-3">
                      {feature.features.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-xs text-gray-700"
                        >
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          <span className="font-medium">{item}</span>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={redirectToLogin}
                      className="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-4 py-2 rounded-lg font-semibold hover:from-gray-800 hover:to-gray-700 transition-all duration-300 flex items-center gap-2 group-hover:gap-3 shadow"
                    >
                      Access Feature
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section - wrap in fragment to fix JSX error */}
      <div
        id="testimonials"
        className="py-10 bg-gradient-to-b from-gray-50 to-gray-100"
      >
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              What Healthcare Professionals Say
            </h2>
            <p className="text-base text-gray-600 max-w-xl mx-auto">
              Trusted by leading medical institutions and healthcare
              professionals worldwide
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow p-6 relative overflow-hidden">
              <Quote className="w-8 h-8 text-blue-600 mb-4 opacity-20" />
              <div className="relative">
                {testimonials.map((testimonial, index) => (
                  <React.Fragment key={index}>
                    {activeTestimonial === index && (
                      <div className="transition-all duration-500 opacity-100 translate-x-0">
                        <p className="text-lg text-gray-700 leading-relaxed mb-4 italic">
                          "{testimonial.quote}"
                        </p>
                        <div className="flex items-center gap-4">
                          <img
                            src={testimonial.image}
                            alt={testimonial.name}
                            className="w-12 h-12 rounded-full object-cover shadow"
                          />
                          <div>
                            <h4 className="text-base font-bold text-gray-900">
                              {testimonial.name}
                            </h4>
                            <p className="text-blue-600 font-medium text-xs">
                              {testimonial.role}
                            </p>
                            <p className="text-gray-600 text-xs">
                              {testimonial.hospital}
                            </p>
                            <div className="flex gap-1 mt-1">
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <Star
                                  key={i}
                                  className="w-4 h-4 text-yellow-400 fill-current"
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
              <div className="flex justify-center gap-2 mt-4">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      activeTestimonial === index
                        ? "bg-blue-600 w-6"
                        : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section - smaller */}
      <div className="py-10 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-8 text-center relative z-10">
          <div className="max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-600/20 backdrop-blur-sm text-blue-300 px-3 py-1.5 rounded-full text-xs font-medium mb-4">
              <Globe className="w-4 h-4" />
              Join 500+ Healthcare Institutions
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">
              Ready to Transform Healthcare with AI?
            </h2>
            <p className="text-base text-blue-200 mb-6 leading-relaxed max-w-xl mx-auto">
              Join healthcare professionals worldwide who trust our AI-powered
              diagnostic platform for accurate, fast, and reliable medical
              insights. Start your free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <button
                onClick={redirectToLogin}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-cyan-700 transform transition-all duration-300 hover:scale-105 shadow flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Start Free Trial
              </button>
              <button
                onClick={redirectToLogin}
                className="bg-white/15 backdrop-blur-sm border-2 border-white/30 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-white/25 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Users className="w-4 h-4" />
                Book Demo
              </button>
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-blue-200 text-xs">
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-400" />
                No credit card required
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-400" />
                30-day free trial
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-400" />
                Setup in 5 minutes
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
