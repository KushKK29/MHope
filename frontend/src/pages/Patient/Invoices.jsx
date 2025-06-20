import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import Sidebar from "./Sidebar";

const Invoices = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const response = await axios.get(
          `https://mhope.onrender.com/api/prescription/patient/${user._id}`
        );
        setPrescriptions(response.data.prescriptions || []);
      } catch (error) {
        toast.error("Failed to fetch prescriptions");
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  const handleDownload = async (prescriptionId) => {
    try {
      const response = await axios.get(
        `https://mhope.onrender.com/api/prescription/download/${prescriptionId}`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `prescription-${prescriptionId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error("Failed to download prescription");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Prescriptions
          </h2>

          {prescriptions.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-600">No prescriptions found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {prescriptions.map((prescription) => (
                <div
                  key={prescription._id}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Prescription #{prescription._id}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(
                          prescription.date || prescription.createdAt
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {prescription.doctorId?.fullName || "Doctor"}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">
                        Diagnosis
                      </h4>
                      <p className="mt-1 text-gray-600">
                        {prescription.diagnosis}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">
                        Medicines
                      </h4>
                      <ul className="mt-1 text-gray-600 list-disc list-inside">
                        {prescription.medicines.map((med, idx) => (
                          <li key={idx}>
                            {med.name} - {med.dosage}, {med.frequency},{" "}
                            {med.duration}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {prescription.advice && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700">
                          Advice
                        </h4>
                        <p className="mt-1 text-gray-600">
                          {prescription.advice}
                        </p>
                      </div>
                    )}
                    <div className="flex justify-end mt-4">
                      <button
                        onClick={() => handleDownload(prescription._id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        Download Prescription
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Invoices;
