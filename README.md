# ReelMind AI

**Turn scrolling into learning.**

ReelMind AI is a hackathon MVP that analyzes a small set of fictional, anonymized short-form video interactions to infer an underlying technology or career interest and recommend one educational reel.

> **Designed and Developed by Haritha Kongi**

## 🎯 Problem

Short-form video interactions can contain signals about a learner's interests beyond simple keywords. ReelMind AI explores how multiple interactions can be interpreted together to identify a broader technology or career interest.

## 💡 Solution

The application analyzes 8 fictional Reel interactions and produces a structured interest profile containing:

- Current Reel
- Interest detected
- Evidence-based explanation
- One educational recommendation
- Category and difficulty
- Confidence
- Supporting and rejected signals
- Hype-filter result

The interface also visualizes relationships between supporting topics and the inferred interest.

## 👥 Demo Profiles

The project includes three fictional demo profiles:

- Software Engineering
- AI Enthusiast
- Cybersecurity Learner

No account is required for the demo.

## 🧠 Key Ideas

- Latent-interest inference instead of simple keyword matching
- Behavioral weighting across interactions
- Cross-Reel pattern analysis
- Educational-value / hype filtering
- Curated fallback results when the AI service is unavailable

## 🏗️ Architecture

```text
src/
├── App.jsx
├── components/
├── data/profiles.js
├── services/gemini.js
├── services/fallback.js
└── utils/behavior.js
```

Runtime flow:

1. Select a demo profile.
2. Review the fictional Reel feed.
3. Start the interest analysis.
4. The application sends the interaction context to Gemini when configured.
5. A curated fallback result is used if the model call is unavailable.
6. The dashboard displays the inferred interest, evidence, recommendation and relationship graph.

## 🔐 API Key Handling

For production, the Gemini API key is kept server-side through the `/api/generate` function using the `GENERATIVE_API_KEY` environment variable.

The application also supports a curated fallback so the demo can run without an API key.

## 🛠️ Tech Stack

- React 19
- Vite
- Tailwind CSS v4
- JavaScript
- Gemini API
- Lucide
- CSS / SVG

## 🚀 Getting Started

Requirements: Node.js 18+ recommended.

```bash
npm install
npm run dev
```

For a local environment with the API configured, create a `.env` file from `.env.example` and provide the required server-side configuration.

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Build for production:

```bash
npm run build
npm run preview
```

## 🚀 Deployment

The project is structured for deployment on Vercel. Configure `GENERATIVE_API_KEY` as a server-side environment variable when AI analysis is required in production.

## 🔮 Future Improvements

- Opt-in real watch-history data
- Embedding-based clustering
- Multi-recommendation learning playlists
- Privacy-preserving cohort insights
- Evaluation of the hype classifier with human-labeled data
- Authentication and consent before persistent user data

## 👤 Author

**Haritha Kongi**

- GitHub: https://github.com/HarithaKongi

---

⭐ Built as a hackathon MVP exploring AI-assisted interest inference.
