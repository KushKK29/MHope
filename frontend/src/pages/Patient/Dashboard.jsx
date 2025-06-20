import React, { useRef, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useAdmin } from "../../context/adminContext";
import { useDoctor } from "../../context/doctorContext";
import StatCard from "../../components/StatCard";
import {
  HiUserCircle,
  HiCalendar,
  HiClock,
  HiAdjustments,
} from "react-icons/hi";
import {
  MdDashboard,
  MdFace,
  MdPlayCircle,
  MdMedicalServices,
} from "react-icons/md";
import FaceAI from "../../components/FaceAI";
import { Button, Card } from "flowbite-react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "flowbite-react";
import { Client, handle_file } from "@gradio/client";
import { Label, FileInput, HelperText } from "flowbite-react";

const Dashboard = () => {
  const { admin } = useAdmin();
  const { getAppointmentsByid, appointments } = useDoctor();
  const [profileLoading, setProfileLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [openBoneIframe, setOpenBoneIframe] = useState(false);
  const [openXrayIframe, setOpenXrayIframe] = useState(false);
  const [xrayImage, setXrayImage] = useState(null);
  const [xrayResult, setXrayResult] = useState("");
  const [xrayLoading, setXrayLoading] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      setProfileLoading(true);
      const user = JSON.parse(localStorage.getItem("user")) || admin;
      if (user && user._id) {
        await getAppointmentsByid(user._id);
      }
      setProfileLoading(false);
    };
    fetchAppointments();
    // eslint-disable-next-line
  }, []);

  // --- Appointment Stats ---
  const now = new Date();
  const totalAppointments = appointments?.length || 0;
  const pastAppointments =
    appointments?.filter((a) => {
      const date = new Date(a.appointmentDate);
      return date < now;
    }).length || 0;
  const upcomingAppointments =
    appointments?.filter((a) => {
      const date = new Date(a.appointmentDate);
      return date >= now;
    }).length || 0;

  // --- StatCard Icons ---
  const totalIcon = <HiCalendar className="text-2xl" />;
  const pastIcon = <HiClock className="text-2xl" />;
  const upcomingIcon = <MdDashboard className="text-2xl" />;

  const Kard = () => {
    return (
      <Card className="max-w-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-lg">
            <MdFace className="text-white text-2xl" />
          </div>
          <div className="bg-green-100 px-3 py-1 rounded-full">
            <span className="text-green-800 text-xs font-semibold">ACTIVE</span>
          </div>
        </div>
        <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
          Face AI Detection System
        </h5>
        <p className="font-normal text-gray-700 dark:text-gray-400 mb-4">
          Advanced real-time face detection with age estimation and emotion
          analysis using cutting-edge AI technology.
        </p>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-100 px-2 py-1 rounded text-xs text-blue-800">
              Age Detection
            </div>
            <div className="bg-purple-100 px-2 py-1 rounded text-xs text-purple-800">
              Emotion
            </div>
          </div>
        </div>
        <Button
          onClick={() => setOpenModal(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        >
          Launch Face AI
          <MdPlayCircle className="ml-2 h-4 w-4" />
        </Button>
      </Card>
    );
  };

  const Mode = () => {
    return (
      <Modal
        dismissible
        show={openModal}
        onClose={() => setOpenModal(false)}
        size="4xl"
        className="backdrop-blur-sm"
      >
        <ModalHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <MdFace className="text-white text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Face AI Detection</h2>
              <p className="text-blue-100 text-sm">
                Real-time Age & Emotion Analysis
              </p>
            </div>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-6">
            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600 font-medium">
                  AI Model Active
                </span>
              </div>
              <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                Position your face in front of the camera for real-time
                analysis. The AI will detect your age and current emotion with
                high accuracy.
              </p>
            </div>

            {/* Face AI Component Container */}
            <div className="bg-gray-50 rounded-xl p-4 border">
              <FaceAI />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">
                How it works:
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Allow camera access when prompted</li>
                <li>• Position your face clearly in the camera view</li>
                <li>
                  • AI will analyze and display age estimation and emotion in
                  real-time
                </li>
                <li>• Results are processed locally for privacy</li>
              </ul>
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="bg-gray-50 border-t">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Age Detection</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Emotion Analysis</span>
              </div>
            </div>
            <Button
              color="gray"
              onClick={() => setOpenModal(false)}
              className="font-medium"
            >
              Close
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    );
  };

  // Bone Fracture Analyzer Iframe Card
  const BoneIframeCard = () => (
    <Card className="max-w-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <div className="bg-gradient-to-r from-yellow-500 to-orange-600 p-3 rounded-lg">
          <MdMedicalServices className="text-white text-2xl" />
        </div>
        <div className="bg-green-100 px-3 py-1 rounded-full">
          <span className="text-green-800 text-xs font-semibold">ACTIVE</span>
        </div>
      </div>
      <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
        pneumonia Checker
      </h5>
      <p className="text-gray-700 dark:text-gray-400 mb-4">
        Use the embedded Hugging Face Space for Pneumonia Analyser
      </p>
      <Button
        onClick={() => setOpenBoneIframe(true)}
        className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700"
      >
        Open Pneumonia Analyzer
        <MdPlayCircle className="ml-2 h-4 w-4" />
      </Button>
    </Card>
  );

  const BoneIframeModal = () => (
    <Modal
      dismissible
      show={openBoneIframe}
      onClose={() => {
        setOpenBoneIframe(false);
        setXrayImage(null);
        setXrayResult("");
        setXrayLoading(false);
      }}
      size="2xl"
      className="backdrop-blur-sm"
    >
      <ModalHeader className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <MdMedicalServices className="text-white text-xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Pneumonia Analyzer</h2>
            <p className="text-orange-100 text-sm">
              Upload a chest X-ray for AI-powered pneumonia analysis
            </p>
          </div>
        </div>
      </ModalHeader>
      <ModalBody>
        <div className="space-y-6">
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600 font-medium">
                AI Model Active
              </span>
            </div>
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              Upload a chest X-ray image to get an instant AI-powered
              prediction.
            </p>
          </div>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!xrayImage) {
                setXrayResult("Please upload an image before submitting.");
                return;
              }
              setXrayLoading(true);
              setXrayResult("");
              try {
                // Connect to the Gradio client
                const client = await Client.connect("m-rafayali/chest_xray");
                // Make prediction using the uploaded image
                const result = await client.predict("/predict", {
                  img: xrayImage,
                });
                // Extract the prediction result
                const output = result.data?.[0] || "No prediction available";
                setXrayResult(output);
              } catch (err) {
                setXrayResult("Error: " + err.message);
              } finally {
                setXrayLoading(false);
              }
            }}
            className="space-y-4"
          >
            <Label className="mb-2 block" htmlFor="file-upload-helper-text">
              Upload file
            </Label>
            <FileInput
              id="file-upload-helper-text"
              accept="image/*"
              onChange={(e) => setXrayImage(e.target.files[0])}
            />
            <HelperText className="mt-1">
              SVG, PNG, JPG or GIF (MAX. 800x400px).
            </HelperText>
            {/* Image Preview */}
            {xrayImage && (
              <div className="mt-4 flex flex-col items-center">
                <img
                  src={URL.createObjectURL(xrayImage)}
                  alt="Xray Preview"
                  className="max-h-64 rounded-lg border shadow"
                  style={{ maxWidth: "100%", objectFit: "contain" }}
                />
                <span className="text-xs text-gray-500 mt-2">Preview</span>
              </div>
            )}
            <Button
              type="submit"
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
              disabled={xrayLoading || !xrayImage}
            >
              {xrayLoading ? "Analyzing..." : "Analyze Xray"}
            </Button>
          </form>
          {xrayResult && (
            <div className="bg-blue-50 p-4 rounded-lg mt-4">
              <span className="font-semibold text-blue-900">🩺 Result:</span>{" "}
              {typeof xrayResult === "string" ? (
                xrayResult
              ) : xrayResult && typeof xrayResult === "object" ? (
                <div>
                  {xrayResult.label && (
                    <div>
                      <b>Label:</b> {xrayResult.label}
                    </div>
                  )}
                  {xrayResult.confidences &&
                    Array.isArray(xrayResult.confidences) && (
                      <div className="mt-2">
                        <b>Confidences:</b>
                        <ul className="list-disc ml-6">
                          {xrayResult.confidences.map((conf, idx) => (
                            <li key={idx}>
                              {conf.label}: {(conf.confidence * 100).toFixed(2)}
                              %
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                </div>
              ) : null}
            </div>
          )}
        </div>
      </ModalBody>
      <ModalFooter className="bg-gray-50 border-t">
        <Button
          color="gray"
          onClick={() => setOpenBoneIframe(false)}
          className="font-medium"
        >
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );

  // Chest Xray AI Iframe Card
  const XrayIframeCard = () => (
    <Card className="max-w-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-3 rounded-lg">
          <MdMedicalServices className="text-white text-2xl" />
        </div>
        <div className="bg-green-100 px-3 py-1 rounded-full">
          <span className="text-green-800 text-xs font-semibold">ACTIVE</span>
        </div>
      </div>
      <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
        Xray AI (Embed)
      </h5>
      <p className="text-gray-700 dark:text-gray-400 mb-4">
        Use the embedded Hugging Face Space for bone fracture detection.
      </p>
      <Button
        onClick={() => setOpenXrayIframe(true)}
        className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
      >
        Open Xray Scanner
        <MdPlayCircle className="ml-2 h-4 w-4" />
      </Button>
    </Card>
  );

  const XrayIframeModal = () => (
    <Modal
      dismissible
      show={openXrayIframe}
      onClose={() => setOpenXrayIframe(false)}
      size="5xl"
      className="backdrop-blur-sm"
    >
      <ModalHeader className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <MdMedicalServices className="text-white text-xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Xray AI (Embed)</h2>
            <p className="text-blue-100 text-sm">
              Powered by Hugging Face Space
            </p>
          </div>
        </div>
      </ModalHeader>
      <ModalBody>
        <div className="flex flex-col items-center">
          <iframe
            src="https://m12faiez-yolo-bone-fracture-detection-mc2.hf.space"
            frameBorder="0"
            width="850"
            height="450"
            title="Chest Xray AI"
            style={{ borderRadius: "12px", boxShadow: "0 2px 16px #0001" }}
          ></iframe>
          {/* Interpretation Points */}
          <div className="mt-6 w-full max-w-2xl bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              How to interpret the results:
            </h3>
            <ul className="list-disc ml-6 text-blue-800 text-sm space-y-1">
              <li>
                <b>Positive</b>: Fracture present
              </li>
              <li>
                <b>Negative</b>: No fracture detected
              </li>
              <li>
                Ensure the X-ray image is clear and properly oriented for best
                results.
              </li>
              <li>
                This tool is for informational purposes only. Always consult a
                medical professional for a diagnosis.
              </li>
            </ul>
          </div>
        </div>
      </ModalBody>
      <ModalFooter className="bg-gray-50 border-t">
        <Button
          color="gray"
          onClick={() => setOpenXrayIframe(false)}
          className="font-medium"
        >
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );

  // --- HIV Prediction AI Card ---
  const HIVPredictionCard = () => {
    const [inputs, setInputs] = useState({
      age: "",
      sex: "Female",
      cd4_count: "",
      viral_load: "",
      wbc_count: "",
      hemoglobin: "",
      platelet_count: "",
    });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setInputs((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setResult(null);
      setError(null);
      try {
        const { Client } = await import("@gradio/client");
        const client = await Client.connect(
          "DeepFieldML/Sentinel-P1_HIV_Prediction_Model"
        );
        const response = await client.predict("/predict", {
          age: Number(inputs.age),
          sex: inputs.sex,
          cd4_count: Number(inputs.cd4_count),
          viral_load: Number(inputs.viral_load),
          wbc_count: Number(inputs.wbc_count),
          hemoglobin: Number(inputs.hemoglobin),
          platelet_count: Number(inputs.platelet_count),
        });
        setResult(response.data);
      } catch (err) {
        setError(err.message || "Prediction failed");
      } finally {
        setLoading(false);
      }
    };

    return (
      <>
        <Card className="max-w-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gradient-to-r from-pink-500 to-red-600 p-3 rounded-lg">
              <MdMedicalServices className="text-white text-2xl" />
            </div>
            <div className="bg-green-100 px-3 py-1 rounded-full">
              <span className="text-green-800 text-xs font-semibold">
                ACTIVE
              </span>
            </div>
          </div>
          <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
            HIV Prediction Model
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400 mb-4">
            Predict HIV status using clinical parameters with an advanced AI
            model.
          </p>
          <Button
            className="w-full bg-gradient-to-r from-pink-500 to-red-600 text-white"
            onClick={() => setOpenModal(true)}
          >
            Open HIV Prediction Model
          </Button>
        </Card>
        <Modal
          dismissible
          show={openModal}
          onClose={() => setOpenModal(false)}
          size="md"
          className="backdrop-blur-sm"
        >
          <ModalHeader className="bg-gradient-to-r from-pink-500 to-red-600 text-white">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <MdMedicalServices className="text-white text-xl" />
              </div>
              <div>
                <h2 className="text-xl font-bold">HIV Prediction Model</h2>
                <p className="text-pink-100 text-sm">
                  Enter blood report values to estimate HIV risk
                </p>
              </div>
            </div>
          </ModalHeader>
          <ModalBody>
            <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded text-blue-900 text-sm">
              <b>Enter blood report values to estimate HIV risk.</b> This is a
              demonstration model and should not be used for medical advice.
              <br />
              <span className="block mt-2">
                <b>Low risk:</b> &lt;1% probability of HIV infection
                <br />
                <b>Moderate risk:</b> 1% to 5% probability
                <br />
                <b>High risk:</b> &gt;5% probability
              </span>
            </div>
            <form onSubmit={handleSubmit} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="number"
                  name="age"
                  value={inputs.age}
                  onChange={handleChange}
                  placeholder="Age"
                  className="w-1/2 px-2 py-1 border rounded"
                  min="0"
                  required
                />
                <select
                  name="sex"
                  value={inputs.sex}
                  onChange={handleChange}
                  className="w-1/2 px-2 py-1 border rounded"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                </select>
              </div>
              <input
                type="number"
                name="cd4_count"
                value={inputs.cd4_count}
                onChange={handleChange}
                placeholder="CD4 Count"
                className="w-full px-2 py-1 border rounded"
                min="0"
                required
              />
              <input
                type="number"
                name="viral_load"
                value={inputs.viral_load}
                onChange={handleChange}
                placeholder="Viral Load"
                className="w-full px-2 py-1 border rounded"
                min="0"
                required
              />
              <input
                type="number"
                name="wbc_count"
                value={inputs.wbc_count}
                onChange={handleChange}
                placeholder="WBC Count"
                className="w-full px-2 py-1 border rounded"
                min="0"
                required
              />
              <input
                type="number"
                name="hemoglobin"
                value={inputs.hemoglobin}
                onChange={handleChange}
                placeholder="Hemoglobin"
                className="w-full px-2 py-1 border rounded"
                min="0"
                required
              />
              <input
                type="number"
                name="platelet_count"
                value={inputs.platelet_count}
                onChange={handleChange}
                placeholder="Platelet Count"
                className="w-full px-2 py-1 border rounded"
                min="0"
                required
              />
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-red-600 text-white"
                disabled={loading}
              >
                {loading ? "Predicting..." : "Predict"}
              </Button>
            </form>
            {result && (
              <div className="mt-3 p-2 bg-green-50 rounded text-green-800 text-sm">
                <b>Prediction Result:</b> {JSON.stringify(result)}
              </div>
            )}
            {error && (
              <div className="mt-3 p-2 bg-red-50 rounded text-red-800 text-sm">
                {error}
              </div>
            )}
          </ModalBody>
          <ModalFooter className="bg-gray-50 border-t">
            <Button
              color="gray"
              onClick={() => setOpenModal(false)}
              className="font-medium"
            >
              Close
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  };

  // --- AI Doctor Card ---
  const AIDoctorCard = () => {
    const [openModal, setOpenModal] = useState(false);
    return (
      <>
        <Card className="max-w-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gradient-to-r from-indigo-500 to-blue-700 p-3 rounded-lg">
              <MdMedicalServices className="text-white text-2xl" />
            </div>
            <div className="bg-green-100 px-3 py-1 rounded-full">
              <span className="text-green-800 text-xs font-semibold">ACTIVE</span>
            </div>
          </div>
          <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
            AI Doctor
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400 mb-4">
            Upload medical images and details for instant AI-powered case analysis.
          </p>
          <Button
            className="w-full bg-gradient-to-r from-indigo-500 to-blue-700 text-white"
            onClick={() => setOpenModal(true)}
          >
            Open AI Doctor
          </Button>
        </Card>
        <Modal
          dismissible
          show={openModal}
          onClose={() => setOpenModal(false)}
          size="5xl"
          className="backdrop-blur-sm"
        >
          <ModalHeader className="bg-gradient-to-r from-indigo-500 to-blue-700 text-white">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <MdMedicalServices className="text-white text-xl" />
              </div>
              <div>
                <h2 className="text-xl font-bold">AI Doctor</h2>
                <p className="text-blue-100 text-sm">
                  Powered by Hugging Face Space
                </p>
              </div>
            </div>
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-col items-center">
              <iframe
                src="https://walaa2022-medicalmodel.hf.space"
                frameBorder="0"
                width="850"
                height="450"
                title="AI Doctor"
                style={{ borderRadius: "12px", boxShadow: "0 2px 16px #0001" }}
              ></iframe>
              <div className="mt-6 w-full max-w-2xl bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  How to use:
                </h3>
                <ul className="list-disc ml-6 text-blue-800 text-sm space-y-1">
                  <li>Upload medical images and fill in the required details.</li>
                  <li>Click Analyze to get instant AI-powered case analysis.</li>
                  <li>This tool is for informational purposes only. Always consult a medical professional for a diagnosis.</li>
                </ul>
              </div>
            </div>
          </ModalBody>
          <ModalFooter className="bg-gray-50 border-t">
            <Button
              color="gray"
              onClick={() => setOpenModal(false)}
              className="font-medium"
            >
              Close
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  };

  return (
    <>
      <div className="flex flex-col md:flex-row min-h-screen bg-blue-600">
        <Sidebar />
        <div className="flex-1 p-4 md:p-6 lg:p-8 bg-gradient-to-br from-blue-50 to-sky-100">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold mt-3 mb-9 text-gray-800 border-b pb-3">
              Welcome <span className="text-blue-500">{admin?.fullName}</span>
            </h1>
            {/* Stat Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
              <StatCard
                title="Total Appointments"
                value={totalAppointments}
                icon={totalIcon}
              />
              <StatCard
                title="Past Appointments"
                value={pastAppointments}
                icon={pastIcon}
              />
              <StatCard
                title="Upcoming Appointments"
                value={upcomingAppointments}
                icon={upcomingIcon}
              />
            </div>
            {/* AI Feature Cards + Coming Soon Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              <Kard />
              <XrayIframeCard />
              <BoneIframeCard />
              <HIVPredictionCard />
              <AIDoctorCard />
              {/* Coming Soon Cards */}
              <Card className="max-w-sm opacity-50">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-gradient-to-r from-green-500 to-teal-600 p-3 rounded-lg">
                    <MdDashboard className="text-white text-2xl" />
                  </div>
                  <div className="bg-yellow-100 px-3 py-1 rounded-full">
                    <span className="text-yellow-800 text-xs font-semibold">
                      COMING SOON
                    </span>
                  </div>
                </div>
                <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
                  Voice AI Assistant
                </h5>
                <p className="font-normal text-gray-700 dark:text-gray-400 mb-4">
                  Advanced voice recognition and natural language processing for
                  seamless interactions.
                </p>
                <Button disabled className="cursor-not-allowed">
                  Coming Soon
                </Button>
              </Card>
              <Card className="max-w-sm opacity-50">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-gradient-to-r from-orange-500 to-red-600 p-3 rounded-lg">
                    <HiAdjustments className="text-white text-2xl" />
                  </div>
                  <div className="bg-yellow-100 px-3 py-1 rounded-full">
                    <span className="text-yellow-800 text-xs font-semibold">
                      COMING SOON
                    </span>
                  </div>
                </div>
                <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
                  Smart Analytics
                </h5>
                <p className="font-normal text-gray-700 dark:text-gray-400 mb-4">
                  AI-powered data analysis and insights generation for better
                  decision making.
                </p>
                <Button disabled className="cursor-not-allowed">
                  Coming Soon
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </div>
      {/* Modal Component */}
      <Mode />
      <XrayIframeModal />
      <BoneIframeModal />
    </>
  );
};

export default Dashboard;
