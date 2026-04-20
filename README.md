# 🏟️ FlowOS: The Smart Stadium Platform
**Optimizing 100k+ Attendee Experiences in Real-Time**

FlowOS is a premium, cloud-native digital infrastructure designed to solve the chaos of stadium management. By combining real-time Firebase synchronization with Google Cloud's scalable infrastructure, FlowOS ensures fans spend less time in lines and more time enjoying the game.

---

## 🚀 Live Demo
**Fan Experience:** [https://flowos-stadium-756507287965.us-central1.run.app](https://flowos-stadium-756507287965.us-central1.run.app)  
**Admin Twin (Command Center):** [https://flowos-stadium-756507287965.us-central1.run.app/admin](https://flowos-stadium-756507287965.us-central1.run.app/admin)

## ☁️ Google Cloud & Firebase Integration
FlowOS leverages the full power of the Google Cloud ecosystem to provide a stable, scalable, and secure experience:

- **Google Cloud Run:** Hosts our containerized frontend with auto-scaling to handle stadium-sized traffic (up to 100k+ concurrent users).
- **Google Cloud Firestore:** A real-time, NoSQL database that powers the **Digital Twin** sync and attendee feedback loop.
- **Google Maps Distance Matrix API:** Provides real-time travel durations and traffic data for the **Smart Exit** optimization engine.
- **Google Cloud Build:** Automates the CI/CD pipeline, building and deploying our Docker containers from source.
- **Google Artifact Registry:** Securely manages our production container images.
- **Google Cloud IAM & Restrictions:** Secures our infrastructure through API Key domain-locking and least-privileged service accounts.

---

## 👨‍⚖️ Judge's Testing Guide
To fully experience the power of the **FlowOS Digital Twin**, please follow these steps:

### 1. The "Magic" of Real-Time Feedback
1. Open the **Fan Experience** on your phone (or a browser tab).
2. Click the **Floating Feedback Icon** (bottom right) and submit a 5-star rating with a comment.
3. Observe the **Admin Twin** dashboard—you will see your feedback pop up **instantly** without refreshing, powered by Firebase Firestore.

### 2. Simulating Stadium Lifecycle
1. In the **Admin Twin**, toggle the **Event State** from `Pre-Game` to `Post-Game`.
2. Look at the **Fan Experience** Home page.
3. Notice how the "Plan Your Arrival" card magically transforms into the **"Smart Exit Planner"**—complete with live Google Maps transit wait times.

### 3. Weather-Aware Routing
1. In the **Admin Twin**, change the weather to `Rain`.
2. On the **Fan Experience**, a high-priority warning banner will appear.
3. If you navigate to an exit, the **Routing Engine** will automatically recalculate paths to prioritize indoor/covered concourses.

### 4. Congestion Management
1. In the **Admin Twin**, adjust the **Congestion Levels** for specific gates.
2. Watch the **Heatmap** on the Home page update in real-time. The system uses these weights to steer fans away from crowded bottlenecks.

---

## 🛠️ Technology Stack
- **Frontend:** React + TypeScript + Vite
- **Styling:** Tailwind CSS (Glassmorphism & High-Contrast Support)
- **Backend/Database:** Firebase Firestore (Real-time NoSQL)
- **Deployment:** Google Cloud Run (Fully Containerized)
- **Maps API:** Google Maps Distance Matrix API (Live Transit Logic)
- **Testing:** Playwright (E2E) & Vitest (Unit)

---

## 🏗️ Architecture Highlights
- **Digital Twin Sync:** Uses a centralized state management system synced with Firestore, allowing admins to control 100,000+ devices simultaneously.
- **Smart Exit Logic:** Integrated with Google Maps to provide actual transit wait times from the stadium (Narendra Modi Stadium example) to nearest stations.
- **Accessibility First:** Includes a high-contrast mode and haptic feedback simulations for WCAG 2.1 compliance.

---
*Created for Google Prompt Wars Virtual Edition.*
