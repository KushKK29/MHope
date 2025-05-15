import { FaUserDoctor } from "react-icons/fa6";
import { MdPerson2 } from "react-icons/md";
import { CiViewTimeline } from "react-icons/ci";
import { MdOutlineAttachMoney } from "react-icons/md";
import { MdAppRegistration } from "react-icons/md";
import StatCard from "../../components/StatCard";
import { Line, Bar, Pie } from "react-chartjs-2";
import Sidebar from "./Sidebar";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  Title,
} from "chart.js";
import { useAdmin } from "../../context/adminContext";
import { useEffect, useState } from "react";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const registrationData = [
  { day: "Mon", users: 12 },
  { day: "Tue", users: 19 },
  { day: "Wed", users: 10 },
  { day: "Thu", users: 22 },
  { day: "Fri", users: 15 },
  { day: "Sat", users: 9 },
  { day: "Sun", users: 11 },
];

const appointmentsData = [
  { date: "Mon", count: 30 },
  { date: "Tue", count: 45 },
  { date: "Wed", count: 28 },
  { date: "Thu", count: 60 },
  { date: "Fri", count: 50 },
  { date: "Sat", count: 40 },
  { date: "Sun", count: 35 },
];

const departmentWiseData = [
  { department: "Cardiology", count: 40 },
  { department: "Neurology", count: 25 },
  { department: "Pediatrics", count: 30 },
  { department: "Orthopedics", count: 20 },
  { department: "Dermatology", count: 15 },
];

const BarChartComponent = ({ data }) => {
  const chartData = {
    labels: data.map((d) => d.date),
    datasets: [
      {
        label: "Registrations",
        data: data.map(
          (d) =>
            d.adminCount + d.doctorCount + d.patientCount + d.receptionistCount
        ),
        backgroundColor: "rgba(59, 130, 246, 0.7)",
        borderRadius: 8,
        barThickness: 24,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (ctx) {
            const i = ctx.dataIndex;
            const d = data[i];
            return [
              `Admins: ${d.adminCount}`,
              `Doctors: ${d.doctorCount}`,
              `Patients: ${d.patientCount}`,
              `Receptionists: ${d.receptionistCount}`,
            ];
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 5,
          color: "#4B5563",
        },
        grid: {
          color: "rgba(156, 163, 175, 0.2)",
        },
      },
      x: {
        ticks: {
          color: "#4B5563",
        },
        grid: {
          display: false,
        },
      },
    },
    animation: {
      duration: 1000,
      easing: "easeOutBounce",
      // easing: "easeInOutCubic",
    },
    
  };

  return <Bar data={chartData} options={options} className="max-h-64" />;
};

const LineChartComponent = ({ data }) => {
  const chartData = {
    labels: data.map((item) => item.date),
    datasets: [
      {
        label: "Appointments",
        data: data.map((item) => item.count),
        fill: false,
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        borderColor: "#3b82f6",
        tension: 0.3,
        pointBackgroundColor: "#1E40AF",
        pointBorderColor: "#fff",
        pointRadius: 4,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: "#f59e0b",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 12,
          },
          color: "#4B5563",
        },
      },
      tooltip: {
        backgroundColor: "rgba(17, 24, 39, 0.8)",
        padding: 12,
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "#4B5563",
        },
        grid: {
          color: "rgba(156, 163, 175, 0.2)",
        },
      },
      x: {
        ticks: {
          color: "#4B5563",
        },
        grid: {
          display: false,
        },
      },
    },
    animation: {
      duration: 1500,
      easing: "easeOutBounce",
    },
  };

  return <Line data={chartData} options={options} className="max-h-64" />;
};

const PieChartComponent = ({ data }) => {
  const chartData = {
    labels: data.map((item) => item.department),
    datasets: [
      {
        label: "Appointments",
        data: data.map((item) => item.count),
        backgroundColor: [
          "#3b82f6", // blue-500
          "#10b981", // green-500
          "#f59e0b", // amber-500
          "#ef4444", // red-500
          "#6366f1", // indigo-500
        ],
        borderWidth: 1,
        borderColor: "#ffffff",
        hoverOffset: 15,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "right",
        labels: {
          font: {
            size: 12,
          },
          color: "#4B5563",
          padding: 15,
        },
      },
    },
    animation: {
      animateRotate: true,
      duration: 800,
      easing: "easeInOutCubic",
    },
  };

  return <Pie data={chartData} options={options} className="max-h-64" />;
};

const Dashboard = () => {
  const { getOverview, last7daysAppointment, departmentWise, newRegistration } =
    useAdmin();
  const [data, setData] = useState({});
  const [appointments1Data, setAppointments1Data] = useState([]);
  const [departmentwise, setdepartmentwise] = useState([]);
  const [registration1Data, setRegistration1Data] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      setData(await getOverview());
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchAppointmentsData = async () => {
      const data = await last7daysAppointment();
      setAppointments1Data(data);
    };

    fetchAppointmentsData();
  }, []);

  useEffect(() => {
    const fetchdepartmentwiseData = async () => {
      setdepartmentwise(await departmentWise());
    };
    fetchdepartmentwiseData();
  }, []);

  useEffect(() => {
    const fetchnewRegistrationData = async () => {
      const data = await newRegistration();
      setRegistration1Data(data);
    };
    fetchnewRegistrationData();
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 p-4 md:p-6 lg:p-8 bg-gradient-to-br from-blue-50 to-sky-50">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 border-b pb-3">
            Welcome to the Admin Dashboard
          </h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            <StatCard
              title="Total Patients"
              value={data?.totalPatients || "0"}
              icon={<MdPerson2 size={18} />}
            />
            <StatCard
              title="Total Doctors"
              value={data?.totalDoctors || "0"}
              icon={<FaUserDoctor size={18} />}
            />
            <StatCard
              title="Total Appointments"
              value={data?.totalAppointments || "0"}
              icon={<CiViewTimeline size={18} />}
            />
            <StatCard
              title="Monthly Revenue"
              value={`₹ ${data?.totalRevenue || "0"}`}
              icon={<MdOutlineAttachMoney size={18} />}
            />
            {/* <StatCard
              title="New Registrations"
              value="89"
              icon={<MdAppRegistration size={18} />}
            /> */}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white shadow-md rounded-xl p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-semibold mb-4 text-gray-800">
                📅 Appointments (Last 7 Days)
              </h2>
              <div className="h-64">
                <LineChartComponent
                  data={
                    appointments1Data && appointments1Data.length > 0
                      ? appointments1Data
                      : appointmentsData
                  }
                />
              </div>
            </div>
            <div className="bg-white shadow-md rounded-xl p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-semibold mb-4 text-gray-800">
                📊 Department-wise Appointments
              </h2>
              <div className="h-64">
                <PieChartComponent
                  data={
                    departmentwise && departmentwise.length > 0
                      ? departmentwise
                      : departmentWiseData
                  }
                />
              </div>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-xl p-4 md:p-6 mb-8">
            <h2 className="text-lg md:text-xl font-semibold mb-4 text-gray-800">
              🧾 New Registrations This Month
            </h2>
            <div className="h-64">
              <BarChartComponent
                data={registration1Data.registrationsPerDay || []}
              />
            </div>
          </div>

          {/* Recent Activity Table */}
          <div className="bg-white shadow-md rounded-xl overflow-hidden">
            <div className="p-4 bg-blue-600 text-white">
              <h2 className="text-lg md:text-xl font-semibold">
                Recent Activities
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">Patient Name</th>
                    <th className="px-4 py-3">Action</th>
                    <th className="px-4 py-3">Time Stamp</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-gray-50 transition-colors text-black">
                    <td className="px-4 py-3">1</td>
                    <td className="px-4 py-3 font-medium">Rahul Verma</td>
                    <td className="px-4 py-3">
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                        Booked apt.
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">2 mins ago</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50 transition-colors text-black">
                    <td className="px-4 py-3">2</td>
                    <td className="px-4 py-3 font-medium">Dr. Sharma</td>
                    <td className="px-4 py-3">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                        Updated profile
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">10 mins ago</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors text-black">
                    <td className="px-4 py-3">3</td>
                    <td className="px-4 py-3 font-medium">Ankit Jain</td>
                    <td className="px-4 py-3">
                      <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded">
                        Registered
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">30 mins ago</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
