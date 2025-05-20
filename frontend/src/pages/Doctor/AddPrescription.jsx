import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { Label, TextInput, Textarea, Button, Select } from "flowbite-react";
import { useDoctor } from "../../context/doctorContext";
import axios from "axios";
import { toast } from "react-hot-toast";

const AddPrescription = () => {
  const { getAppointmentsByid, appointments, doctor, AddPrescription } =
    useDoctor();
  const [patientId, setPatientId] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [medicines, setMedicines] = useState([
    { name: "", dosage: "", frequency: "", duration: "" },
  ]);
  const [advice, setAdvice] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch appointments when doctor ID is available
  useEffect(() => {
    const fetchAppointments = async () => {
      if (doctor?._id) {
        try {
          await getAppointmentsByid(doctor._id);
        } catch (error) {
          toast.error("Failed to fetch appointments");
        }
      }
    };

    fetchAppointments();
  }, [doctor?._id]); // Include getAppointmentsByid in dependencies

  // Handle adding a new medicine to the form
  const handleAddMedicine = () => {
    setMedicines([
      ...medicines,
      { name: "", dosage: "", frequency: "", duration: "" },
    ]);
  };

  // Handle medicine field changes
  const handleMedicineChange = (index, field, value) => {
    const newMedicines = [...medicines];
    newMedicines[index][field] = value;
    setMedicines(newMedicines);
  };

  // Handle removing a medicine from the form
  const handleRemoveMedicine = (index) => {
    const newMedicines = medicines.filter((_, i) => i !== index);
    setMedicines(newMedicines);
  };

  // Submit prescription form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const prescriptionData = {
      patientId,
      doctorId: doctor._id,
      diagnosis,
      medicines,
      advice,
      doctorName: doctor.fullName,
      doctorEmail: doctor.email,
      doctorPhone: doctor.phone,
      doctorDepartment: doctor.department,
      date: new Date().toISOString(),
    };

    try {
      const response = await AddPrescription(prescriptionData);
      if (response.data.success) {
        toast.success("Prescription saved and sent to patient's email!");
        setPatientId("");
        setDiagnosis("");
        setMedicines([{ name: "", dosage: "", frequency: "", duration: "" }]);
        setAdvice("");
      } else {
        toast.error(response.data.message || "Failed to save prescription");
      }
    } catch (err) {
      toast.error("Error in sending the prescription PDF");
    } finally {
      setIsLoading(false);
      setPatientId("");
      setDiagnosis("");
      setMedicines([{ name: "", dosage: "", frequency: "", duration: "" }]);
      setAdvice("");
    }
  };

  // Extract unique patients from appointments
  const patients = Array.from(
    new Map(
      appointments.map((appointment) => [
        appointment._id,
        {
          id: appointment._id,
          name: appointment.patientName,
          email: appointment.patientEmail,
          phone: appointment.patientPhone,
          gender: appointment.patientGender,
          lastVisit: new Date(appointment.appointmentDate).toLocaleDateString(),
          service: appointment.service,
          status: appointment.status,
          department: appointment.department,
        },
      ])
    ).values()
  );

  const selectedPatientDetails = patients.find((p) => p.id === patientId);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-blue-600">
      <Sidebar />
      <div className="flex-1 p-4 md:p-6 lg:p-8 bg-gradient-to-br from-blue-50 to-sky-100">
        <div className="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-xl">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 border-b pb-4 mb-8">
            Add New Prescription
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Patient Selector Section */}
            <div>
              <Label
                htmlFor="patient"
                value="Select Patient"
                className="text-lg font-medium text-gray-700 mb-2 block"
              />
              <Select
                id="patient"
                required
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Patient</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name}
                  </option>
                ))}
              </Select>
              {selectedPatientDetails && (
                <div className="mt-2 p-3 bg-slate-100 rounded-md text-sm text-gray-600">
                  <p>
                    <strong>Patient ID:</strong> {selectedPatientDetails.id}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedPatientDetails.email}
                  </p>
                  <p>
                    <strong>Gender:</strong> {selectedPatientDetails.gender}
                  </p>
                  <p>
                    <strong>Status:</strong> {selectedPatientDetails.status}
                  </p>
                </div>
              )}
            </div>

            {/* Diagnosis Input Section */}
            <div>
              <Label
                htmlFor="diagnosis"
                value="Diagnosis"
                className="text-lg font-medium text-gray-700 mb-2 block"
              />
              <Textarea
                id="diagnosis"
                placeholder="Enter diagnosis details..."
                required
                rows={4}
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                className="focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Medicine List Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-3">
                Medicines
              </h2>
              {medicines.map((med, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-4 p-3 border rounded-lg bg-slate-50"
                >
                  <div className="md:col-span-2">
                    <Label
                      htmlFor={`medName-${index}`}
                      value="Medicine Name"
                      className="text-sm font-medium text-gray-600 mb-1 block"
                    />
                    <TextInput
                      id={`medName-${index}`}
                      type="text"
                      placeholder="e.g., Paracetamol"
                      value={med.name}
                      onChange={(e) =>
                        handleMedicineChange(index, "name", e.target.value)
                      }
                      required
                      className="focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor={`dosage-${index}`}
                      value="Dosage"
                      className="text-sm font-medium text-gray-600 mb-1 block"
                    />
                    <TextInput
                      id={`dosage-${index}`}
                      type="text"
                      placeholder="e.g., 2 tablets"
                      value={med.dosage}
                      onChange={(e) =>
                        handleMedicineChange(index, "dosage", e.target.value)
                      }
                      required
                      className="focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor={`frequency-${index}`}
                      value="Frequency"
                      className="text-sm font-medium text-gray-600 mb-1 block"
                    />
                    <TextInput
                      id={`frequency-${index}`}
                      type="text"
                      placeholder="e.g., Twice a day"
                      value={med.frequency}
                      onChange={(e) =>
                        handleMedicineChange(index, "frequency", e.target.value)
                      }
                      required
                      className="focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor={`duration-${index}`}
                      value="Duration"
                      className="text-sm font-medium text-gray-600 mb-1 block"
                    />
                    <TextInput
                      id={`duration-${index}`}
                      type="text"
                      placeholder="e.g., 5 days"
                      value={med.duration}
                      onChange={(e) =>
                        handleMedicineChange(index, "duration", e.target.value)
                      }
                      required
                      className="focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  {medicines.length > 1 && (
                    <div className="flex items-end">
                      <Button
                        type="button"
                        color="failure"
                        size="sm"
                        onClick={() => handleRemoveMedicine(index)}
                        className="self-end h-10"
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </div>
              ))}
              <Button
                type="button"
                onClick={handleAddMedicine}
                color="blue"
                className="mt-2"
              >
                ➕ Add Another Medicine
              </Button>
            </div>

            {/* Advice / Notes Section */}
            <div>
              <Label
                htmlFor="advice"
                value="Advice / Notes (Optional)"
                className="text-lg font-medium text-gray-700 mb-2 block"
              />
              <Textarea
                id="advice"
                placeholder="Enter any additional advice or notes..."
                rows={3}
                value={advice}
                onChange={(e) => setAdvice(e.target.value)}
                className="focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Save Button */}
            <div className="flex justify-end mt-8">
              <Button
                type="submit"
                size="lg"
                color="success"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Prescription"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPrescription;
