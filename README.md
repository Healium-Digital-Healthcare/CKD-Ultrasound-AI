<a href="#">
  <img
    alt="Healium CKD AI Analysis App – AI-powered Chronic Kidney Disease analysis platform"
    src="/opengraph-image.png"
  />
  <h1 align="center">Healium – CKD AI Analysis App</h1>
</a>

<p align="center">
  AI-powered platform for Chronic Kidney Disease (CKD) analysis, monitoring, and clinical decision support
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#tech-stack"><strong>Tech Stack</strong></a> ·
  <a href="#demo"><strong>Demo</strong></a> ·
  <a href="#deploy-to-vercel"><strong>Deploy</strong></a> ·
  <a href="#run-locally"><strong>Run Locally</strong></a> ·
  <a href="#feedback-and-support"><strong>Support</strong></a>
</p>

<br/>

## 🩺 About Healium

**Healium** is an AI-driven clinical analysis platform designed to support healthcare professionals in the **early detection, monitoring, and analysis of Chronic Kidney Disease (CKD)**.

The app combines:
- Secure medical data handling
- AI-assisted insights
- Modern clinical UI/UX
- Scalable cloud architecture

> ⚠️ Healium is a **clinical support tool**, not a replacement for medical diagnosis.

---

## ✨ Features

- 🔐 **Secure Authentication**
  - Supabase Auth (cookie-based)
  - Role-based access (doctors, clinicians, admins)

- 📊 **CKD Data Analysis**
  - Lab value tracking (eGFR, Creatinine, Albumin, etc.)
  - AI-assisted pattern recognition and risk indicators
  - Patient history and longitudinal trends

- 🤖 **AI-Powered Insights**
  - CKD stage estimation support
  - Risk flagging and trend summaries
  - Explainable AI outputs (clinician-friendly)

- 🧾 **Patient Records Management**
  - Secure patient profiles
  - Medical reports and attachments
  - Audit-friendly data handling

- 🎨 **Modern Medical UI**
  - Tailwind CSS
  - shadcn/ui components
  - Clean, distraction-free clinical layout

- ⚡ **Full Next.js Support**
  - App Router
  - Server Components
  - Client Components
  - Middleware
  - API Routes & Server Actions

---

## 🧱 Tech Stack

- **Frontend**: Next.js (App Router)
- **Backend**: Supabase (Postgres, Auth, Storage)
- **Authentication**: supabase-ssr (cookie-based)
- **UI**: Tailwind CSS + shadcn/ui
- **AI Layer**: Modular AI services (LLM-ready)
- **Deployment**: Vercel + Supabase Integration

---

## 🚀 Demo

A live demo will be available soon.

> Internal clinical demos can be deployed securely for hospitals or research teams.

---

## ☁️ Deploy to Vercel

Healium supports seamless deployment using **Vercel + Supabase Integration**.

During deployment:
- Supabase project is automatically connected
- Environment variables are injected securely
- Auth and database are production-ready

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

---

## 🧑‍💻 Run Locally

### 1. Create a Supabase project
Create a new project via the Supabase dashboard:
https://database.new

---

### 2. Clone the repository

```bash
git clone https://github.com/your-org/healium-ckd-ai.git
cd healium-ckd-ai