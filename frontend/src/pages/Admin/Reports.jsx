import React, { useState, useEffect, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
  ComposedChart,
  Area,
} from "recharts";
import {
  FaFileDownload,
  FaCalendarAlt,
  FaUserMd,
  FaClipboardList,
  FaChartLine,
  FaMoneyBillWave,
} from "react-icons/fa";
import {
  IoAnalytics,
  IoStatsChart,
  IoTrendingUp,
  IoTrendingDown,
} from "react-icons/io5";
import Papa from "papaparse";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import Sidebar from "./Sidebar";
import { useAdmin } from "../../context/adminContext";

const Reports = () => {
  const [dateRange, setDateRange] = useState("week");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // State for data with default values
  const [appointmentData, setAppointmentData] = useState([
    { status: "Pending", count: 0, color: "#3B82F6" },
    { status: "Completed", count: 0, color: "#10B981" },
    { status: "Cancelled", count: 0, color: "#EF4444" },
  ]);

  const [doctorData, setDoctorData] = useState([
    { specialization: "General", patients: 0, revenue: 0 },
  ]);

  const [revenueData, setRevenueData] = useState([]);

  // Track whether we've received any real data from the backend
  const [hasData, setHasData] = useState({
    appointments: false,
    doctors: false,
    revenue: false,
  });

  const { overviewStats, revenueStats, doctorStats, appointmentStat } =
    useAdmin();

  // Calculate total appointments
  const totalAppointments = useMemo(() => {
    return appointmentData.reduce((sum, item) => sum + (item.count || 0), 0);
  }, [appointmentData]);

  // Calculate total doctors
  const totalDoctors = useMemo(() => {
    // Check if we have doctor data from the API
    if (hasData.doctors) {
      return doctorData.reduce((sum, item) => sum + (item.patients || 0), 0);
    }
    // If no API data, use the length of the array
    return doctorData.length;
  }, [doctorData, hasData.doctors]);

  // Calculate total revenue with useMemo for performance
  const totalRevenue = useMemo(() => {
    if (!Array.isArray(revenueData) || revenueData.length === 0) {
      return 0;
    }
    return revenueData.reduce((sum, item) => sum + (item.revenue || 0), 0);
  }, [revenueData]);

  // Export functions
  const exportToCSV = (data, filename) => {
    setIsLoading(true);
    try {
      const csv = Papa.unparse(data);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportToPDF = (data, filename, title) => {
    setIsLoading(true);
    try {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text(title, 14, 22);

      doc.autoTable({
        startY: 30,
        head: [Object.keys(data[0])],
        body: data.map((item) => Object.values(item)),
        theme: "striped",
        headStyles: {
          fillColor: [52, 152, 219],
          textColor: 255,
        },
      });

      doc.save(filename);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Reusable Chart Card Component
  const ChartCard = ({
    title,
    icon: Icon,
    children,
    onExportCSV,
    onExportPDF,
    className = "",
  }) => (
    <div
      className={`bg-white rounded-2xl shadow-lg overflow-hidden ${className}`}
    >
      <div className="p-4 border-b border-gray-100 bg-gray-50">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
            <Icon className="text-blue-500 w-6 h-6" />
            {title}
          </h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={onExportCSV}
              disabled={isLoading}
              className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
            >
              <FaFileDownload /> CSV
            </button>
            <button
              onClick={onExportPDF}
              disabled={isLoading}
              className="px-3 py-1.5 text-sm bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors flex items-center justify-center gap-2"
            >
              <FaFileDownload /> PDF
            </button>
          </div>
        </div>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );

  // Tab Navigation
  const TabNavigation = () => (
    <div className="bg-white rounded-xl shadow-md mb-6">
      <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-hide">
        {[
          { id: "overview", label: "Overview", icon: IoAnalytics },
          { id: "appointments", label: "Appointments", icon: FaClipboardList },
          { id: "doctors", label: "Doctors", icon: FaUserMd },
          { id: "revenue", label: "Revenue", icon: FaMoneyBillWave },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-shrink-0 flex items-center justify-center p-4 transition-colors min-w-[120px] ${
              activeTab === tab.id
                ? "bg-blue-50 text-blue-600 border-b-2 border-blue-500"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <tab.icon className="mr-2" />
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
          </button>
        ))}
      </div>
    </div>
  );

  // Component for empty chart states
  const EmptyChartState = ({ message }) => (
    <div className="h-64 flex flex-col items-center justify-center text-gray-500">
      <IoStatsChart className="w-12 h-12 mb-2 text-gray-300" />
      {message || "No data available for the selected period"}
    </div>
  );

  // Render Content Based on Active Tab
  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                label: "Total Appointments",
                value: totalAppointments,
                icon: FaClipboardList,
                color: "bg-blue-50",
                textColor: "text-blue-600",
              },
              {
                label: "Success Rate",
                value: (() => {
                  const completed =
                    appointmentData.find((item) => item.status === "Completed")
                      ?.count || 0;
                  return totalAppointments > 0
                    ? `${Math.round((completed / totalAppointments) * 100)}%`
                    : "0%";
                })(),
                icon: IoTrendingUp,
                color: "bg-green-50",
                textColor: "text-green-600",
              },
              {
                label: "Total Doctors",
                value: totalDoctors,
                icon: FaUserMd,
                color: "bg-purple-50",
                textColor: "text-purple-600",
              },
              {
                label: "Avg. Monthly Revenue",
                value: `$${Math.round(
                  totalRevenue / (revenueData.length || 1)
                ).toLocaleString()}`,
                icon: FaMoneyBillWave,
                color: "bg-amber-50",
                textColor: "text-amber-600",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className={`${stat.color} rounded-2xl p-5 shadow-md flex items-center`}
              >
                <div className={`p-3 rounded-full ${stat.color} mr-4`}>
                  <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.textColor}`}>
                    {stat.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        );
      case "appointments":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard
              title="Appointment Status"
              icon={FaClipboardList}
              onExportCSV={() =>
                exportToCSV(appointmentData, "appointment_status.csv")
              }
              onExportPDF={() =>
                exportToPDF(
                  appointmentData,
                  "appointment_status.pdf",
                  "Appointment Status Report"
                )
              }
            >
              {totalAppointments > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={appointmentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {appointmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <EmptyChartState message="No appointment data available" />
              )}
            </ChartCard>
            <ChartCard
              title="Appointment Trends"
              icon={IoStatsChart}
              onExportCSV={() =>
                exportToCSV(revenueData, "appointment_trends.csv")
              }
              onExportPDF={() =>
                exportToPDF(
                  revenueData,
                  "appointment_trends.pdf",
                  "Appointment Trends Report"
                )
              }
            >
              {revenueData.length > 0 && hasData.revenue ? (
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={revenueData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="patients"
                      fill="#8884d8"
                      stroke="#8884d8"
                    />
                    <Line type="monotone" dataKey="patients" stroke="#ff7300" />
                  </ComposedChart>
                </ResponsiveContainer>
              ) : (
                <EmptyChartState message="No appointment trend data available" />
              )}
            </ChartCard>
          </div>
        );
      case "doctors":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard
              title="Patients by Specialization"
              icon={FaUserMd}
              onExportCSV={() =>
                exportToCSV(doctorData, "specialization_data.csv")
              }
              onExportPDF={() =>
                exportToPDF(
                  doctorData,
                  "specialization_data.pdf",
                  "Specialization Report"
                )
              }
            >
              {doctorData.length > 0 && hasData.doctors ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={doctorData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="specialization"
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                    />
                    <YAxis tickLine={false} />
                    <Tooltip />
                    <Bar
                      dataKey="patients"
                      fill="#3B82F6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <EmptyChartState message="No doctor specialization data available" />
              )}
            </ChartCard>
            <ChartCard
              title="Revenue by Specialization"
              icon={FaMoneyBillWave}
              onExportCSV={() =>
                exportToCSV(doctorData, "specialization_revenue.csv")
              }
              onExportPDF={() =>
                exportToPDF(
                  doctorData,
                  "specialization_revenue.pdf",
                  "Specialization Revenue Report"
                )
              }
            >
              {doctorData.length > 0 && hasData.doctors ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={doctorData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="specialization"
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                    />
                    <YAxis
                      tickLine={false}
                      tickFormatter={(value) => `$${value.toLocaleString()}`}
                    />
                    <Tooltip
                      formatter={(value) => [
                        `$${value.toLocaleString()}`,
                        "Revenue",
                      ]}
                    />
                    <Bar
                      dataKey="revenue"
                      fill="#10B981"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <EmptyChartState message="No revenue by specialization data available" />
              )}
            </ChartCard>
          </div>
        );
      case "revenue":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard
              title="Monthly Revenue Trend"
              icon={FaChartLine}
              onExportCSV={() => exportToCSV(revenueData, "revenue_trend.csv")}
              onExportPDF={() =>
                exportToPDF(
                  revenueData,
                  "revenue_trend.pdf",
                  "Revenue Trend Report"
                )
              }
            >
              {revenueData.length > 0 && hasData.revenue ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                    />
                    <YAxis
                      tickLine={false}
                      tickFormatter={(value) => `$${value.toLocaleString()}`}
                    />
                    <Tooltip
                      formatter={(value) => [
                        `$${value.toLocaleString()}`,
                        "Revenue",
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#10B981"
                      strokeWidth={2}
                      dot={{ fill: "#10B981" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <EmptyChartState message="No revenue trend data available" />
              )}
            </ChartCard>
            <ChartCard
              title="Patients vs Revenue"
              icon={IoTrendingUp}
              onExportCSV={() =>
                exportToCSV(revenueData, "patients_revenue.csv")
              }
              onExportPDF={() =>
                exportToPDF(
                  revenueData,
                  "patients_revenue.pdf",
                  "Patients vs Revenue Report"
                )
              }
            >
              {revenueData.length > 0 && hasData.revenue ? (
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={revenueData}>
                    <XAxis dataKey="month" />
                    <YAxis
                      yAxisId="left"
                      orientation="left"
                      stroke="#10B981"
                      tickFormatter={(value) => `$${value.toLocaleString()}`}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="#3B82F6"
                    />
                    <Tooltip
                      formatter={(value, name) =>
                        name === "patients"
                          ? [value, "Patients"]
                          : [`$${value.toLocaleString()}`, "Revenue"]
                      }
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="patients"
                      barSize={20}
                      fill="#3B82F6"
                      radius={[4, 4, 0, 0]}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="revenue"
                      stroke="#10B981"
                      strokeWidth={2}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              ) : (
                <EmptyChartState message="No patients vs revenue data available" />
              )}
            </ChartCard>
          </div>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        // Fetch all data
        const [overview, appointments, doctors, revenue] = await Promise.all([
          overviewStats(dateRange),
          appointmentStat(dateRange),
          doctorStats(dateRange),
          revenueStats(dateRange),
        ]);

        console.log("API Responses:", {
          overview,
          appointments,
          doctors,
          revenue,
        });

        // Handle appointment data
        if (appointments?.data?.byStatus) {
          const apptData = appointments.data.byStatus;
          const newAppointmentData = [
            {
              status: "Pending",
              count: Number(apptData.pending || 0),
              color: "#3B82F6",
            },
            {
              status: "Completed",
              count: Number(apptData.completed || 0),
              color: "#10B981",
            },
            {
              status: "Cancelled",
              count: Number(apptData.cancelled || 0),
              color: "#EF4444",
            },
          ];

          // Set the data and track that we have real data
          setAppointmentData(newAppointmentData);
          setHasData((prev) => ({ ...prev, appointments: true }));
        }

        // Handle doctor data
        if (
          doctors?.data?.bySpecialization &&
          doctors.data.bySpecialization.length > 0
        ) {
          const formattedDoctorData = doctors.data.bySpecialization.map(
            (spec) => ({
              specialization: spec._id || "Unknown",
              patients: Number(spec.count || 0),
              revenue: Number(spec.revenue || 0),
            })
          );

          if (formattedDoctorData.length > 0) {
            setDoctorData(formattedDoctorData);
            setHasData((prev) => ({ ...prev, doctors: true }));
          }
        }

        // Handle performance data from doctors
        if (doctors?.data?.performance && doctors.data.performance.length > 0) {
          // If we have performance data but no specialization data
          if (!hasData.doctors) {
            const performanceData = doctors.data.performance.map((doc) => ({
              specialization: doc.doctor[0]?.name || "Unknown",
              patients: Number(doc.totalAppointments || 0),
              revenue: Number(doc.revenue || 0),
            }));

            if (performanceData.length > 0) {
              setDoctorData(performanceData);
              setHasData((prev) => ({ ...prev, doctors: true }));
            }
          }
        }

        // Handle revenue data
        if (revenue?.data) {
          if (Array.isArray(revenue.data) && revenue.data.length > 0) {
            const formattedRevenueData = revenue.data.map((item) => ({
              month: item._id
                ? new Date(item._id.year, item._id.month - 1).toLocaleString(
                    "default",
                    { month: "short" }
                  )
                : "Unknown",
              revenue: Number(item.revenue || 0),
              patients: Number(item.appointments || 0),
            }));

            setRevenueData(formattedRevenueData);
            setHasData((prev) => ({ ...prev, revenue: true }));
          } else {
            // Create default revenue data for the last 6 months
            const currentDate = new Date();
            const defaultRevenueData = Array.from({ length: 6 }, (_, i) => {
              const date = new Date(currentDate);
              date.setMonth(date.getMonth() - i);
              return {
                month: date.toLocaleString("default", { month: "short" }),
                revenue: 0,
                patients: 0,
              };
            }).reverse();
            setRevenueData(defaultRevenueData);
            // We have default data, but not real data
            setHasData((prev) => ({ ...prev, revenue: false }));
          }
        }

        // For appointments data, if the API gives empty data, check if we have any appointments in overview
        if (overview?.data?.appointments) {
          const totalAppointments = overview.data.appointments.total || 0;

          // If we have appointments in overview but not in the appointments section
          if (
            totalAppointments > 0 &&
            (!appointments?.data?.byStatus ||
              (appointments.data.byStatus.pending === 0 &&
                appointments.data.byStatus.completed === 0 &&
                appointments.data.byStatus.cancelled === 0))
          ) {
            // Create appointment data based on overview total
            setAppointmentData([
              {
                status: "Pending",
                count: Number(overview.data.appointments.pending || 0),
                color: "#3B82F6",
              },
              {
                status: "Completed",
                count: Number(overview.data.appointments.completed || 0),
                color: "#10B981",
              },
              {
                status: "Cancelled",
                count: Number(overview.data.appointments.cancelled || 0),
                color: "#EF4444",
              },
            ]);
            setHasData((prev) => ({ ...prev, appointments: true }));
          }
        }

        // Set doctors count if available in overview
        if (overview?.data?.doctors?.total) {
          const totalDoctors = Number(overview.data.doctors.total || 0);

          // If we have doctors in overview but no doctor data with patients
          if (
            totalDoctors > 0 &&
            (!hasData.doctors || doctorData.every((d) => d.patients === 0))
          ) {
            // If we have doctors by specialization in overview
            if (
              overview.data.doctors.bySpecialization &&
              overview.data.doctors.bySpecialization.length > 0
            ) {
              const specData = overview.data.doctors.bySpecialization.map(
                (spec) => ({
                  specialization: spec._id || "Unknown",
                  patients: Number(spec.count || 0),
                  revenue: 0, // We don't have revenue in overview
                })
              );

              if (specData.length > 0) {
                setDoctorData(specData);
                setHasData((prev) => ({ ...prev, doctors: true }));
              }
            }
          }
        }
      } catch (error) {
        console.error("Error loading reports data:", error);
        // Keep default values set in state initialization
        setHasData({
          appointments: false,
          doctors: false,
          revenue: false,
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [dateRange, overviewStats, appointmentStat, doctorStats, revenueStats]);

  // Debug logs
  useEffect(() => {
    console.log("Current State:", {
      appointmentData,
      doctorData,
      revenueData,
      hasData,
    });
  }, [appointmentData, doctorData, revenueData, hasData]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <div className="md:ml-64 p-6">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Reports & Analytics
            </h1>
            <p className="text-gray-600">
              Comprehensive insights into hospital operations
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <FaCalendarAlt />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="year">Last Year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <TabNavigation />

        {/* Loading state */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-600">Loading data...</span>
          </div>
        ) : (
          /* Dynamic Content */
          <div className="space-y-6">{renderContent()}</div>
        )}
      </div>
    </div>
  );
};

export default Reports;
