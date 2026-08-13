# Secure Gemini API Integration with Vite + React + AWS Amplify Gen 2

This repository demonstrates a **secure, production-ready architecture** for calling the Google Gemini API (`gemini-1.5-flash`) from a Vite + React + TypeScript web application hosted on **AWS Amplify Gen 2**.

## 🔒 Security Architecture

Calling the Gemini API directly from browser code exposes your private `GEMINI_API_KEY` in client network requests, leading to rate limit exhaustion or unauthorized usage.

This project solves that issue by proxying requests through a serverless backend function:

```
┌────────────────────────────────┐         ┌──────────────────────────────────────┐         ┌────────────────────────┐
│   Browser / React Frontend     │         │   AWS Amplify Backend Function       │         │   Google Gemini API    │
│   (No API Key in Client)       │ ──────> │   (/api/gemini POST Handler)         │ ──────> │   (gemini-1.5-flash)   │
│   Uses browser fetch() ONLY    │ <────── │   Reads process.env.GEMINI_API_KEY   │ <────── │                        │
└────────────────────────────────┘         └──────────────────────────────────────┘         └────────────────────────┘
```

---

## 📁 Directory Structure

```
.
├── amplify/
│   ├── functions/
│   │   └── gemini/
│   │       ├── handler.ts        # AWS Lambda function calling @google/generative-ai
│   │       └── resource.ts       # Amplify Gen 2 function resource definition
│   └── backend.ts                # Main Amplify backend configuration
├── src/
│   ├── components/
│   │   └── GeminiChat.tsx        # React frontend chat component (uses fetch only)
│   ├── App.tsx                   # Main React application entry
│   └── main.tsx
├── server.ts                     # Local Express development proxy server
├── .env.example                  # Environment variable reference
├── .gitignore                    # Prevents leaking .env secrets
├── package.json
└── README.md
```

---

## 🚀 Quick Start (Local Development)

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Local Environment Variables
Copy `.env.example` to `.env` and insert your Gemini API Key:
```bash
cp .env.example .env
```

Edit `.env`:
```env
GEMINI_API_KEY="YOUR_ACTUAL_GEMINI_API_KEY_HERE"
```

### 3. Run Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser. The frontend will communicate with the local Express server proxy at `/api/gemini`.

---

## ☁️ Deploying to AWS Amplify Gen 2

### Step 1: Add GEMINI_API_KEY to AWS Amplify Environment Variables
1. Log into the [AWS Management Console](https://console.aws.amazon.com/amplify).
2. Open your AWS Amplify App project.
3. In the left navigation menu, navigate to **App settings** -> **Environment variables**.
4. Click **Manage variables** -> **Add variable**.
5. Set:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: `AIzaSy...` *(Your Gemini API key)*
6. Click **Save**.

---

### Step 2: Deploying via Git (Amplify Hosting)
1. Push this project to GitHub / GitLab / AWS CodeCommit:
   ```bash
   git add .
   git commit -m "Add AWS Amplify Gen 2 Gemini API backend integration"
   git push origin main
   ```
2. Connect your branch in the AWS Amplify Console.
3. Amplify will automatically detect the Gen 2 backend definition inside `/amplify/backend.ts` and provision the serverless Lambda function for `/api/gemini`.

---

### Step 3: Deploying via Amplify Sandbox (CLI Dev)
To test backend function deployments locally using the AWS Amplify Sandbox CLI:
```bash
npx ampx sandbox
```
This deploys ephemeral backend resources into your AWS account and injects environment variables.

---

## 🧪 Testing the API Endpoint

You can test the backend function endpoint directly with `curl`:

```bash
curl -X POST http://localhost:3000/api/gemini \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Hello Gemini! Explain AWS Amplify in two sentences."}'
```

Expected JSON Response:
```json
{
  "text": "AWS Amplify is a set of purpose-built tools and features that lets frontend web and mobile developers quickly build full-stack applications on AWS. It automates backend resource provisioning and provides seamless client integration."
}
```

---

## 📄 License & Security
- **Frontend Code**: `src/` uses standard `fetch()` and never imports `@google/generative-ai`.
- **Backend Code**: `amplify/functions/gemini/handler.ts` handles API authentication server-side.
- Never commit `.env` files or API key strings to version control.
