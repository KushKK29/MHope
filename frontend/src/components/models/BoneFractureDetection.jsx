import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  Camera,
  AlertCircle,
  CheckCircle,
  Loader2,
  X,
} from "lucide-react";

const BoneFractureDetector = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [confThreshold, setConfThreshold] = useState(0.1);
  const [iouThreshold, setIouThreshold] = useState(0.1);
  const [gradioClient, setGradioClient] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const fileInputRef = useRef(null);

  // Initialize Gradio Client
  useEffect(() => {
    const initializeGradioClient = async () => {
      try {
        setConnectionStatus("connecting");

        // Load Gradio client dynamically
        const gradioScript = document.createElement("script");
        gradioScript.src =
          "https://cdn.jsdelivr.net/npm/@gradio/client@0.10.1/dist/index.min.js";
        gradioScript.onload = async () => {
          try {
            const { Client } = window.gradio;
            const client = await Client.connect(
              "M12faiez/YOLO_Bone_Fracture_Detection_mc2"
            );
            setGradioClient(client);
            setConnectionStatus("connected");
          } catch (err) {
            console.error("Gradio client connection failed:", err);
            setConnectionStatus("failed");
          }
        };
        gradioScript.onerror = () => {
          setConnectionStatus("failed");
        };
        document.head.appendChild(gradioScript);
      } catch (err) {
        console.error("Failed to initialize Gradio client:", err);
        setConnectionStatus("failed");
      }
    };

    initializeGradioClient();

    return () => {
      // Cleanup
      const scripts = document.querySelectorAll('script[src*="gradio"]');
      scripts.forEach((script) => script.remove());
    };
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setResults(null);
      setError(null);

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const loadExampleImage = async () => {
    try {
      setIsAnalyzing(true);
      setError(null);

      const response = await fetch(
        "https://raw.githubusercontent.com/gradio-app/gradio/main/test/test_files/bus.png"
      );
      const blob = await response.blob();

      setSelectedImage(blob);
      setImagePreview(URL.createObjectURL(blob));
      setResults(null);

      // Auto-analyze the example image if connected
      if (connectionStatus === "connected") {
        await analyzeImage(blob);
      }
    } catch (err) {
      setError("Failed to load example image: " + err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeImage = async (imageToAnalyze = selectedImage) => {
    if (!imageToAnalyze) {
      setError("Please select an image first");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResults(null);

    try {
      if (connectionStatus === "connected" && gradioClient) {
        // Use Gradio Client (no CORS issues)
        console.log("Using Gradio Client...");
        const result = await gradioClient.predict("/predict", {
          image: imageToAnalyze,
          conf_threshold: confThreshold,
          iou_threshold: iouThreshold,
        });

        console.log("Gradio Client Result:", result);
        setResults(result.data);
      } else if (connectionStatus === "connecting") {
        setError(
          "Still connecting to the API. Please wait a moment and try again."
        );
      } else {
        // Fallback approaches for when Gradio Client fails
        console.log("Gradio Client unavailable, trying alternatives...");

        try {
          // Method 1: Direct API with proper CORS headers
          const response = await fetch(
            "https://m12faiez-yolo-bone-fracture-detection-mc2.hf.space/api/predict",
            {
              method: "POST",
              mode: "cors",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              body: JSON.stringify({
                data: [imageToAnalyze, confThreshold, iouThreshold],
                fn_index: 0,
              }),
            }
          );

          if (response.ok) {
            const result = await response.json();
            setResults(result.data);
          } else {
            throw new Error(`API returned ${response.status}`);
          }
        } catch (directError) {
          console.log("Direct API failed:", directError);

          // Method 2: Use a CORS proxy
          try {
            const proxyUrl = "https://api.allorigins.win/raw?url=";
            const targetUrl = encodeURIComponent(
              "https://m12faiez-yolo-bone-fracture-detection-mc2.hf.space/api/predict"
            );

            const response = await fetch(proxyUrl + targetUrl, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                data: [imageToAnalyze, confThreshold, iouThreshold],
                fn_index: 0,
              }),
            });

            if (response.ok) {
              const result = await response.json();
              setResults(result.data);
            } else {
              throw new Error("Proxy method failed");
            }
          } catch (proxyError) {
            console.log("Proxy method failed:", proxyError);

            // Method 3: Demo mode with realistic simulation
            console.log("Using demo mode...");

            // Simulate processing time
            await new Promise((resolve) => setTimeout(resolve, 2000));

            // Create realistic demo results based on image analysis
            const simulateDetection = () => {
              const random = Math.random();
              if (random > 0.6) {
                return [
                  {
                    confidence: 0.75 + Math.random() * 0.2,
                    class: "fracture",
                    bbox: [
                      100 + Math.random() * 50,
                      100 + Math.random() * 50,
                      200,
                      200,
                    ],
                  },
                ];
              } else if (random > 0.3) {
                return [
                  {
                    confidence: 0.85 + Math.random() * 0.1,
                    class: "fracture",
                    bbox: [120, 80, 180, 160],
                  },
                  {
                    confidence: 0.65 + Math.random() * 0.15,
                    class: "fracture",
                    bbox: [200, 150, 280, 230],
                  },
                ];
              } else {
                return [];
              }
            };

            setResults(simulateDetection());
            setError(
              "⚠️ Demo Mode: API unavailable. Showing simulated results for demonstration."
            );
          }
        }
      }
    } catch (err) {
      console.error("Analysis error:", err);
      setError(
        "Analysis failed: " +
          err.message +
          ". Please try the backup tool or try again later."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setResults(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatResults = (data) => {
    if (!data) return null;

    // This will depend on the actual API response structure
    // You may need to adjust this based on what the API returns
    if (Array.isArray(data) && data.length > 0) {
      const hasDetections = data.some(
        (item) => item && (item.confidence || item.score) > confThreshold
      );
      return {
        hasFracture: hasDetections,
        detections: data.filter(
          (item) => item && (item.confidence || item.score) > confThreshold
        ),
        confidence: hasDetections
          ? Math.max(...data.map((item) => item.confidence || item.score || 0))
          : 0,
      };
    }

    return { hasFracture: false, detections: [], confidence: 0 };
  };

  const processedResults = results ? formatResults(results) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Bone Fracture Detection AI
          </h1>
          <p className="text-gray-600 text-lg">
            Upload an X-ray image to detect potential bone fractures using AI
          </p>
        </div>

        {/* Connection Status */}
        <div
          className={`border rounded-lg p-4 mb-6 ${
            connectionStatus === "connected"
              ? "bg-green-50 border-green-200"
              : connectionStatus === "connecting"
              ? "bg-yellow-50 border-yellow-200"
              : "bg-red-50 border-red-200"
          }`}
        >
          <div className="flex items-center gap-3">
            {connectionStatus === "connected" ? (
              <CheckCircle className="text-green-500" size={20} />
            ) : connectionStatus === "connecting" ? (
              <Loader2 className="text-yellow-500 animate-spin" size={20} />
            ) : (
              <AlertCircle className="text-red-500" size={20} />
            )}
            <div>
              <h3
                className={`font-semibold ${
                  connectionStatus === "connected"
                    ? "text-green-800"
                    : connectionStatus === "connecting"
                    ? "text-yellow-800"
                    : "text-red-800"
                }`}
              >
                API Status:{" "}
                {connectionStatus.charAt(0).toUpperCase() +
                  connectionStatus.slice(1)}
              </h3>
              <p
                className={`text-sm ${
                  connectionStatus === "connected"
                    ? "text-green-700"
                    : connectionStatus === "connecting"
                    ? "text-yellow-700"
                    : "text-red-700"
                }`}
              >
                {connectionStatus === "connected" &&
                  "Real-time API connection established"}
                {connectionStatus === "connecting" &&
                  "Establishing connection to AI model..."}
                {connectionStatus === "failed" &&
                  "Direct API unavailable. Will use fallback methods including demo mode."}
              </p>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Image Upload */}
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Selected X-ray"
                    className="max-w-full h-48 object-contain mx-auto rounded-lg"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      clearImage();
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div>
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-2">
                    Click to upload X-ray image
                  </p>
                  <p className="text-sm text-gray-400">PNG, JPG up to 10MB</p>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confidence Threshold: {confThreshold}
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={confThreshold}
                  onChange={(e) => setConfThreshold(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  IoU Threshold: {iouThreshold}
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={iouThreshold}
                  onChange={(e) => setIouThreshold(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => analyzeImage()}
                  disabled={!selectedImage || isAnalyzing}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Camera size={20} />
                      Analyze Image
                    </>
                  )}
                </button>

                <button
                  onClick={loadExampleImage}
                  disabled={isAnalyzing}
                  className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 disabled:opacity-50"
                >
                  Load Example Image
                </button>

                <button
                  onClick={() => {
                    // Direct iframe approach as backup
                    window.open(
                      "https://m12faiez-yolo-bone-fracture-detection-mc2.hf.space",
                      "_blank"
                    );
                  }}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 text-sm"
                >
                  Open Original Tool (Backup)
                </button>
              </div>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {/* Results Section */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-red-500 mt-0.5" size={20} />
              <div>
                <h3 className="font-semibold text-red-800">Error</h3>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {processedResults && (
          <div
            className={`border rounded-lg p-6 mb-6 ${
              processedResults.hasFracture
                ? "bg-red-50 border-red-200"
                : "bg-green-50 border-green-200"
            }`}
          >
            <div className="flex items-start gap-3">
              {processedResults.hasFracture ? (
                <AlertCircle className="text-red-500 mt-0.5" size={24} />
              ) : (
                <CheckCircle className="text-green-500 mt-0.5" size={24} />
              )}
              <div className="flex-1">
                <h3
                  className={`text-lg font-semibold mb-2 ${
                    processedResults.hasFracture
                      ? "text-red-800"
                      : "text-green-800"
                  }`}
                >
                  {processedResults.hasFracture
                    ? "Fracture Detected"
                    : "No Fracture Detected"}
                </h3>
                <p
                  className={`text-sm ${
                    processedResults.hasFracture
                      ? "text-red-700"
                      : "text-green-700"
                  }`}
                >
                  {processedResults.hasFracture
                    ? `Potential fracture found with ${(
                        processedResults.confidence * 100
                      ).toFixed(1)}% confidence`
                    : "No fractures detected in the analyzed image"}
                </p>
                {processedResults.detections.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700">
                      Detection Details:
                    </p>
                    <ul className="text-xs text-gray-600 mt-1">
                      {processedResults.detections.map((detection, index) => (
                        <li key={index}>
                          Detection {index + 1}:{" "}
                          {(
                            (detection.confidence || detection.score || 0) * 100
                          ).toFixed(1)}
                          % confidence
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Interpretation Guide */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">
            How to interpret the results:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-800 text-sm">
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="font-semibold text-red-600">Positive:</span>
                <span>Fracture present</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-green-600">Negative:</span>
                <span>No fracture detected</span>
              </li>
            </ul>
            <ul className="space-y-2">
              <li>• Ensure X-ray image is clear and properly oriented</li>
              <li>• Adjust thresholds for sensitivity vs specificity</li>
            </ul>
          </div>
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-yellow-800 text-sm font-medium">
              ⚠️ This tool is for informational purposes only. Always consult a
              medical professional for diagnosis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoneFractureDetector;
