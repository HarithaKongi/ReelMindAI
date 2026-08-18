<<<<<<< HEAD
# ReelMind AI

**Turn scrolling into learning.**

ReelMind AI is an interest-inference engine for short-form video. It does not try to stop students from scrolling. It reads a handful of anonymized Reel interactions, infers the *latent* technology or career interest underneath the memes, and recommends **one** high-value educational reel.

This is a hackathon MVP: React client, Gemini reasoning, no database, no login.

---

## Problem

Students already spend hours on short-form feeds. Most recommenders treat that as a keyword problem:

> Java meme → recommend more Java.

That misses the point. A joke about `NullPointerException`, a software-engineer lifestyle clip, a coding-interview meme, and a developer laptop comparison are not four unrelated videos. Together they are a **career identity signal**. Clickbait like “10 AI tools that will get you a job” is noise — especially when the student skipped it.

The product problem is not “more content.” It is *better interpretation of existing behavior*.

---

## Solution

ReelMind AI analyzes 8 fictional Reel interactions and returns a structured interest profile:

| Field | Meaning |
| --- | --- |
| Current Reel | Most behaviorally significant clip in the cluster |
| Interest Detected | Latent domain / career interest, not a single keyword |
| Why | Concise evidence-based explanation |
| Recommended Tech Reel | One educational follow-up |
| Category / Difficulty / Confidence | How to place the recommendation |
| Evidence Signals | Supporting and rejected signals |
| Hype Filter | Pass/fail with why the pick is educational |

A visual **Interest Profile** then maps supporting topics (Java, interviews, hardware, …) onto the inferred interest (Software Engineering) with a lightweight SVG relationship graph.

Three demo student profiles ship with the app so judges can switch feeds without an account:

- Software Engineering
- AI Enthusiast
- Cybersecurity Learner

---

## Innovation

1. **Latent-interest inference, not keyword matching.** The engine is instructed to treat memes as context, not labels. “Java Developer Problems” plus interview humor plus engineer lifestyle should resolve to *Software Engineering / Programming Career*, not “Java.”
2. **Behavioral weighting.** `saved > replayed > liked > high completion > normal watch > skipped`. A skipped hype reel is a rejection, not a weak positive.
3. **Cross-reel pattern finding.** Recommendations are produced only after the model looks at relationships across the whole feed.
4. **Hype filter as a first-class product surface.** Clickbait and salary-guarantee content is rejected unless genuine educational value is present. The UI shows `PASSED` with “Low hype risk • High educational value.”
5. **Demo-proof fallback.** If Gemini is missing, slow, or errors, the UI still completes the analysis animation and shows a high-fidelity mock result so the live demo never dies.

---

## Architecture

```
src/
  App.jsx                 Orchestrates profile, analysis flow, results
  components/             Dashboard UI (feed, analysis, graph, results)
  data/profiles.js        Three fictional student feeds
  services/gemini.js      Prompt construction + Gemini REST call
  services/fallback.js    Profile-specific demo results
  utils/behavior.js       Client-side signal weights for the feed UI
```

**Runtime flow**

1. User selects a demo profile. The feed of 8 Reels updates immediately.
2. **Analyze My Interests** starts a six-step analysis sequence in the UI.
3. In parallel, `analyzeReels()` calls Gemini (`gemini-2.0-flash`) with a strict JSON schema.
4. If the API key is missing or the call fails, `fallback.js` supplies a profile-matched result.
5. The dashboard renders the required fields, evidence, hype filter, and SVG graph.

Server-side proxy available for production: the app calls `/api/generate` which forwards prompts to Gemini using a server-side API key (set GENERATIVE_API_KEY in your hosting environment). Local dev still works without a key using the curated fallback.

---

## Prompt engineering strategy

The system prompt forbids keyword matching and chain-of-thought leakage. It asks the model to:

1. Understand each Reel semantically (topic, format, context).
2. Weight interactions in the order above.
3. Separate entertainment from genuine interest.
4. Find patterns *across* Reels.
5. Propose latent interests, then pick the strongest one.
6. Generate candidate educational recommendations.
7. Run a hype/clickbait filter.
8. Return **one** recommendation plus a short evidence-based why.

The user prompt serializes every Reel with title, category, format, watch %, interaction, and a context blurb. JSON is requested with `responseMimeType: application/json`. The client still extracts JSON defensively (fenced blocks, first `{`…`}`) and validates required fields against the fallback so a messy model response cannot blank the UI.

Explanations are required to cite Reel titles and behaviors. Internal scoring math is not shown.

---

## Hype filtering

The product treats hype as a **reject class**, not a ranking penalty that still wins.

Automatically suspicious:

- “10 AI tools that will get you a job”
- “Become an AI engineer in 7 days”
- “Guaranteed 30 LPA with this one skill”

Preferred:

- DSA concepts used in real interviews
- Software engineering practice
- AI concepts (e.g. how transformers work)
- Cloud, cybersecurity, system design
- Programming and real engineering demonstrations

In the Software Engineering demo, the student **skips** the AI-tools listicle at 22% watch. That skip is evidence. The recommended reel is a practical DSA/interview piece, and the Hype Filter card reports `PASSED`.

---

## Tech stack

- React 19
- Vite
- Tailwind CSS v4 (`@tailwindcss/vite`)
- JavaScript (no TypeScript required)
- Gemini API (`gemini-2.0-flash` via REST)
- Lucide icons
- CSS/SVG for the relationship graph (no chart library)

---

## How to run

**Requirements:** Node.js 18+ recommended.

```bash
npm install
```

Copy the env template and add a Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey):

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Set a server-side API key for production (Vercel):

```
GENERATIVE_API_KEY=your_server_side_generative_api_key_here
```

Start the app locally (no key required for the demo fallback):

```bash
npm run dev
```

Open the printed local URL (typically `http://localhost:5173`).

The app **runs without a key**. Analysis still completes using the built-in fallback so a hackathon demo cannot fail on network or quota issues.

Production build:

```bash
npm run build
npm run preview
```

Deploy to Vercel:

1. Create a new Vercel project and point it to this repository (or deploy from the root).
2. In Project Settings → Environment Variables add a server-side key:
   - Key: `GENERATIVE_API_KEY`
   - Value: (your Google Generative API key)
   - Target: Production (and Preview if you want)
3. Vercel uses `npm run build` and the `dist` folder by default via the included `vercel.json`.

Notes:
- The API key is kept server-side by the `/api/generate` function; the browser no longer embeds the key in built assets.
- The demo still runs without a key using the curated fallback response, so you can demo the app even if the model key is not configured.

---

## Future improvements

- Connect a real (opt-in) watch-history export instead of demo profiles
- On-device embedding cluster as a pre-filter before the LLM call
- Multi-recommendation playlists with spaced repetition
- Teacher / counselor view of cohort interest maps (privacy-preserving)
- A/B the hype classifier against human-labeled educational quality
- Persist sessions only after adding auth and explicit consent

---

## License

Built as a hackathon MVP. Sample Reels are fictional and anonymized.
=======
# ReelMindAI
ReelMindAI
>>>>>>> 58b4b4f990433ca9ceb8962b9852ee3196f0ad34
