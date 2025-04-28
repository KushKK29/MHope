import mongoose from "mongoose";
import User from "./model/user.model";
import Doctor from "./model/doctor.model";
import Patient from "./model/patient.model";
import Receptionist from "./model/receptionist.model";

const doctor = [
  {
    fullName: "Dr. Aryan Khanna",
    email: "aryan.khanna@hospital.com",
    password: "Aryan@123",
    role: "doctor",
  },
  {
    fullName: "Dr. Meera Sinha",
    email: "meera.sinha@hospital.com",
    password: "Meera@123",
    role: "doctor",
  },
  {
    fullName: "Dr. Rakesh Bansal",
    email: "rakesh.bansal@hospital.com",
    password: "Rakesh@123",
    role: "doctor",
  },
  {
    fullName: "Dr. Neha Kapoor",
    email: "neha.kapoor@hospital.com",
    password: "Neha@123",
    role: "doctor",
  },
  {
    fullName: "Dr. Akash Malhotra",
    email: "akash.malhotra@hospital.com",
    password: "Akash@123",
    role: "doctor",
  },
  {
    fullName: "Dr. Ritu Sharma",
    email: "ritu.sharma@hospital.com",
    password: "Ritu@123",
    role: "doctor",
  },
  {
    fullName: "Dr. Sandeep Yadav",
    email: "sandeep.yadav@hospital.com",
    password: "Sandeep@123",
    role: "doctor",
  },
  {
    fullName: "Dr. Alok Verma",
    email: "alok.verma@hospital.com",
    password: "Alok@123",
    role: "doctor",
  },
  {
    fullName: "Dr. Isha Mehta",
    email: "isha.mehta@hospital.com",
    password: "Isha@123",
    role: "doctor",
  },
  {
    fullName: "Dr. Kunal Roy",
    email: "kunal.roy@hospital.com",
    password: "Kunal@123",
    role: "doctor",
  },
];

const patient = [
  {
    fullName: "Ananya Gupta",
    email: "ananya.gupta@hospital.com",
    password: "Ananya@123",
    role: "patient",
  },
  {
    fullName: "Rahul Sharma",
    email: "rahul.sharma@hospital.com",
    password: "Rahul@123",
    role: "patient",
  },
  {
    fullName: "Simran Verma",
    email: "simran.verma@hospital.com",
    password: "Simran@123",
    role: "patient",
  },
  {
    fullName: "Vikram Thakur",
    email: "vikram.thakur@hospital.com",
    password: "Vikram@123",
    role: "patient",
  },
  {
    fullName: "Sneha Reddy",
    email: "sneha.reddy@hospital.com",
    password: "Sneha@123",
    role: "patient",
  },
  {
    fullName: "Aman Joshi",
    email: "aman.joshi@hospital.com",
    password: "Aman@123",
    role: "patient",
  },
  {
    fullName: "Pooja Yadav",
    email: "pooja.yadav@hospital.com",
    password: "Pooja@123",
    role: "patient",
  },
  {
    fullName: "Rohan Singh",
    email: "rohan.singh@hospital.com",
    password: "Rohan@123",
    role: "patient",
  },
  {
    fullName: "Tanya Bhatia",
    email: "tanya.bhatia@hospital.com",
    password: "Tanya@123",
    role: "patient",
  },
  {
    fullName: "Karan Mehta",
    email: "karan.mehta@hospital.com",
    password: "Karan@123",
    role: "patient",
  },
];

const receptionist = [
  {
    fullName: "Riya Sharma",
    email: "riya.sharma@hospital.com",
    password: "Riya@123",
    role: "receptionist",
  },
  {
    fullName: "Nikhil Verma",
    email: "nikhil.verma@hospital.com",
    password: "Nikhil@123",
    role: "receptionist",
  },
  {
    fullName: "Kritika Singh",
    email: "kritika.singh@hospital.com",
    password: "Kritika@123",
    role: "receptionist",
  },
  {
    fullName: "Sahil Bansal",
    email: "sahil.bansal@hospital.com",
    password: "Sahil@123",
    role: "receptionist",
  },
  {
    fullName: "Neeraj Chauhan",
    email: "neeraj.chauhan@hospital.com",
    password: "Neeraj@123",
    role: "receptionist",
  },
  {
    fullName: "Anjali Mishra",
    email: "anjali.mishra@hospital.com",
    password: "Anjali@123",
    role: "receptionist",
  },
  {
    fullName: "Deepak Saini",
    email: "deepak.saini@hospital.com",
    password: "Deepak@123",
    role: "receptionist",
  },
  {
    fullName: "Prachi Jain",
    email: "prachi.jain@hospital.com",
    password: "Prachi@123",
    role: "receptionist",
  },
  {
    fullName: "Mohit Rana",
    email: "mohit.rana@hospital.com",
    password: "Mohit@123",
    role: "receptionist",
  },
  {
    fullName: "Divya Rawat",
    email: "divya.rawat@hospital.com",
    password: "Divya@123",
    role: "receptionist",
  },
];