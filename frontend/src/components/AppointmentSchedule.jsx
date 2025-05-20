// components/Appointment_Schedule.jsx
"use client";
import {
  Timeline,
  TimelineBody,
  TimelineContent,
  TimelineItem,
  TimelinePoint,
  TimelineTime,
  TimelineTitle,
  Button,
} from "flowbite-react";
import { HiCalendar, HiArrowNarrowRight } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

const Appointment_Schedule = ({ data }) => {
  const navigate = useNavigate();

  const handleViewProfile = (patientId) => {
    navigate(`/patient/${patientId}`);
  };

  return (
    <Timeline>
      {data.map((item, index) => (
        <TimelineItem key={index}>
          <TimelinePoint icon={HiCalendar} />
          <TimelineContent>
            <TimelineTime>
              {new Date(item.appointmentDate).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </TimelineTime>
            <TimelineTitle>{item.department}</TimelineTitle>
            <TimelineBody>{item.service}</TimelineBody>
            <div className="mt-2 space-y-1">
              <p className="text-sm font-medium text-gray-700">
                Patient: {item.patientName}
              </p>
              <p className="text-sm text-gray-600">
                Phone: {item.patientPhone}
              </p>
              <p className="text-sm text-gray-600">
                Email: {item.patientEmail}
              </p>
              <p className="text-sm font-medium text-blue-600">
                Status: {item.status}
              </p>
            </div>

            <Button
              color="gray"
              className="mt-3"
              onClick={() => handleViewProfile(item._id)}
            >
              View Patient Profile
              <HiArrowNarrowRight className="ml-2 h-3 w-3" />
            </Button>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
};

export default Appointment_Schedule;
