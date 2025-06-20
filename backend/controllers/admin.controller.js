import Appointment from "../model/appointment.model.js";
import Doctor from "../model/Doctor.model.js";
import Patient from "../model/Patient.model.js";
import User from "../model/user.model.js";

export const overViewStats = async (req, res) => {
  try {
    const totalAppointments = await Appointment.countDocuments();
    const totalPatients = await Patient.countDocuments();
    const totalDoctors = await Doctor.countDocuments();
    const totalRevenue = await Appointment.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$fee" },
        },
      },
    ]);
    const totalRevenueAmount = totalRevenue[0]
      ? totalRevenue[0].totalRevenue
      : 0;
    res.status(200).json({
      totalAppointments,
      totalPatients,
      totalDoctors,
      totalRevenue: totalRevenueAmount,
    });
  } catch (error) {
    
    res.status(500).json({ message: "Internal server error" });
  }
};

export const last7daysApointment = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const rawResults = await Appointment.aggregate([
      {
        $match: {
          createdAt: {
            $gte: sevenDaysAgo,
            $lte: today,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Create full list of past 7 dates
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(sevenDaysAgo);
      date.setDate(sevenDaysAgo.getDate() + i);
      dates.push(date.toISOString().split("T")[0]);
    }

    // Map rawResults to full 7-day range
    const appointmentsPerDay = dates.map((date) => {
      const found = rawResults.find((d) => d._id === date);
      return {
        date,
        count: found ? found.count : 0,
      };
    });

    res.status(200).json(appointmentsPerDay);
  } catch (error) {
    
    res.status(500).json({ message: "Internal server error" });
  }
};

export const departmentwiseData = async (req, res) => {
    try {
        const departmentWiseData = await Appointment.aggregate([
          {
            $group: {
              _id: "$diagnosis",
              count: { $sum: 1 },
            },
          },
          {
            $project: {
              _id: 0,
              department: "$_id",
              count: 1,
            },
          },
          {
            $sort: { count: -1 }, // Optional: sort by highest count
          },
        ]);
        res.status(200).json(departmentWiseData);
    } catch (error) {
        
        res.status(500).json({ message: "Internal server error" });
    }
};

export const newRegistrations = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 30);

    const [admin, doctor, patient] = await Promise.all([
      User.aggregate([
        { $match: { createdAt: { $gte: sevenDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            adminCount: { $sum: 1 },
          },
        },
      ]),
      Doctor.aggregate([
        { $match: { createdAt: { $gte: sevenDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            doctorCount: { $sum: 1 },
          },
        },
      ]),
      Patient.aggregate([
        { $match: { createdAt: { $gte: sevenDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            patientCount: { $sum: 1 },
          },
        },
      ]),
      
    ]);

    const mergedMap = new Map();

    const mergeData = (data, key) => {
      data.forEach((item) => {
        const date = item._id;
        if (!mergedMap.has(date)) mergedMap.set(date, { date });
        mergedMap.get(date)[key] = item[key] || 0;
      });
    };

    mergeData(admin, "adminCount");
    mergeData(doctor, "doctorCount");
    mergeData(patient, "patientCount");
    

    const finalData = Array.from(mergedMap.values()).map((entry) => ({
      date: entry.date,
      adminCount: entry.adminCount || 0,
      doctorCount: entry.doctorCount || 0,
      patientCount: entry.patientCount || 0,
      
    }));

    // Sort by date
    finalData.sort((a, b) => new Date(a.date) - new Date(b.date));

    res.status(200).json({ registrationsPerDay: finalData });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching data", error: err.message });
  }
};
