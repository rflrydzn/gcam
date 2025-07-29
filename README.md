# GCam: Assistive GCash Transaction Relay System

## 🎯 Project Context

This project was built to help my dad handle GCash transactions at his store even when I'm away. Customers usually write their GCash details on paper. With one press of a button, my dad can capture the paper using an ESP32-CAM. The image is sent to me through the Pushover app. I complete the transaction remotely and update its status through a web dashboard. If a receipt is needed, I upload a screenshot that appears on my dad’s small TFT screen connected to the ESP32. This ensures accessibility and independence for him, especially since he's not comfortable using smartphones.

🖥️ **URL**: [https://gcam.vercel.app](https://gcam.vercel.app)  
📩 **Want a demo?** Email me at **kuhaku.blank.rd@gmail.com**

---

## 🛠 Tech Stack

### 🔌 Hardware

- **ESP32-CAM** – captures transaction notes and sends images via Flask
- **TFT ILI9488 SPI Display** – displays status and receipt image when uploaded
- **Pushbuttons + LED** – input system for triggering camera or confirming receipt

### 🌐 Backend

- **Flask (PythonAnywhere)** – handles image upload, pushes notifications via Pushover, stores image URLs
- **Firebase Realtime Database** – real-time syncing of transaction records and receipt URLs
- **Google Gemini** – extracts text like GCash number and amount from captured images for quick review
- **Pushover API** – notifies my phone when a new transaction is created

### 💻 Frontend

- **Next.js (React)** – mobile-first web app for managing transactions
- **Tailwind CSS** – clean and responsive UI
- **Firebase Client SDK** – for real-time data rendering and state updates
