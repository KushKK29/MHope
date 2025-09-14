# 🌱 MHope — AI-Powered Healthcare Platform

**MHope** is a comprehensive healthcare management platform built to streamline interactions between **patients**, **doctors**, and **administrators**.  
It combines **real-time communication**, **AI-powered disease prediction**, **medical imaging analysis**, and secure medical record management to make care faster, safer, and more accessible.

---

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](#license) [![Built with MERN](https://img.shields.io/badge/Stack-MERN-blue.svg)](#) [![Realtime: Socket.io](https://img.shields.io/badge/Realtime-Socket.io-orange.svg)](#)

---

## ✨ Key Features

- **Role-Based Dashboards**  
  Tailored interfaces for Patients, Doctors, and Admins — over 15 pages to manage appointments, records, prescriptions, analytics, and more.

- **AI-Powered Disease Prediction**  
  Integrated ML model that predicts likely diseases (reported up to ~85% precision depending on model/data). Designed to assist clinicians — not replace them.

- **Intelligent Chatbot Support**  
  AI-driven conversational assistant to help users navigate the app, answer FAQs, and gather symptom information.

- **Medical Imaging Analysis**  
  Processing of X-ray / CT-like images to detect anomalies and present model confidence to clinicians.

- **Real-Time Appointments & Notifications**  
  Book, confirm, and receive updates instantly via Socket.io powered real-time flows.

- **Secure Medical Records**  
  Encrypted, role-based access to patient records with audit trail support.

---

## 🛠 Tech Stack

- **Frontend:** React.js  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB Atlas  
- **Realtime:** Socket.io  
- **Auth / Security:** JWT 
- **Deployment:** Vercel (frontend) / Render (backend)

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js (v16+ recommended) & npm
- MongoDB (local or Atlas)
- Git

### 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/KushKK29/MHope.git
   cd MHope

2. Install Frontend Dependencies:
   ```
   cd frontend
   npm install
   ```

3. Install Backend Dependencies:
   ```
   cd bakend
   npm install
   ```

4. Set Up Environment Variables

5. Run Frontend Server:
   ```
   npm run dev
   ```
   
6. Run Backend Server:
   ```
   node server.js
   ```
