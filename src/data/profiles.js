export const ANALYSIS_STEPS = [
  'Analyzing Reel context...',
  'Analyzing behavioral signals...',
  'Finding cross-Reel patterns...',
  'Inferring latent interests...',
  'Filtering low-value content...',
  'Selecting best recommendation...',
]

export const profiles = [
  {
    id: 'software-engineering',
    name: 'Software Engineering',
    shortLabel: 'SWE',
    description: 'Career-curious programmer with interview and tooling signals.',
    reels: [
      {
        id: 'se-1',
        title: 'Java Developer Problems 😂',
        category: 'Programming',
        watchPercentage: 94,
        interaction: 'Watched',
        format: 'meme',
        description:
          'Comedy sketch about NullPointerExceptions, boilerplate, and enterprise Java memes. Entertainment-first, not a tutorial.',
        gradient: ['#1d4ed8', '#1e1b4b'],
      },
      {
        id: 'se-2',
        title: 'Day in the Life of a Software Engineer',
        category: 'Career',
        watchPercentage: 88,
        interaction: 'Liked',
        format: 'lifestyle',
        description:
          'Aspirational lifestyle reel: standups, code reviews, office/remote mix, identity around being an engineer.',
        gradient: ['#6d28d9', '#312e81'],
      },
      {
        id: 'se-3',
        title: 'Coding Interview Be Like...',
        category: 'Programming',
        watchPercentage: 97,
        interaction: 'Replayed',
        format: 'meme',
        description:
          'Interview humor about whiteboarding, DSA puzzles, and nervous candidates. High replay suggests identity + anxiety, not just a joke.',
        gradient: ['#2563eb', '#4c1d95'],
      },
      {
        id: 'se-4',
        title: 'MacBook vs Windows Laptop for Developers',
        category: 'Hardware',
        watchPercentage: 91,
        interaction: 'Watched',
        format: 'comparison',
        description:
          'Practical comparison of developer machines, battery, Unix tooling, and compile performance. Purchase-intent adjacent.',
        gradient: ['#0f766e', '#164e63'],
      },
      {
        id: 'se-5',
        title: '10 AI Tools That Will Get You a Job',
        category: 'AI/Career',
        watchPercentage: 22,
        interaction: 'Skipped',
        format: 'clickbait',
        description:
          'Hype listicle promising job outcomes from random AI tools. Low completion is a rejection signal.',
        gradient: ['#9f1239', '#431407'],
      },
      {
        id: 'se-6',
        title: 'Java Streams Explained in 30 Seconds',
        category: 'Java',
        watchPercentage: 100,
        interaction: 'Saved',
        format: 'tutorial',
        description:
          'Micro-lesson on map/filter/reduce. Saved + full completion is the strongest learning intent in the feed.',
        gradient: ['#c2410c', '#7c2d12'],
      },
      {
        id: 'se-7',
        title: 'Gaming Setup Transformation',
        category: 'Gaming',
        watchPercentage: 65,
        interaction: 'Watched',
        format: 'lifestyle',
        description:
          'RGB desk makeover. Moderate watch, no save/like — entertainment, not a career cluster.',
        gradient: ['#15803d', '#14532d'],
      },
      {
        id: 'se-8',
        title: 'Software Engineer Salary Expectations',
        category: 'Career',
        watchPercentage: 55,
        interaction: 'Watched',
        format: 'career',
        description:
          'Compensation ranges and leveling talk. Partial watch — curious about outcomes, not the primary signal.',
        gradient: ['#5b21b6', '#1e1b4b'],
      },
    ],
  },
  {
    id: 'ai-enthusiast',
    name: 'AI Enthusiast',
    shortLabel: 'AI',
    description: 'Hands-on ML curiosity with agents, LLMs, and tooling.',
    reels: [
      {
        id: 'ai-1',
        title: 'When Your AI Agent Loops Forever 😂',
        category: 'AI Agents',
        watchPercentage: 93,
        interaction: 'Watched',
        format: 'meme',
        description:
          'Humor about autonomous agents retrying the same tool call. Entertainment wrapping a real systems problem.',
        gradient: ['#7c3aed', '#1e1b4b'],
      },
      {
        id: 'ai-2',
        title: 'Python ML Pipeline in 45 Seconds',
        category: 'Python ML',
        watchPercentage: 96,
        interaction: 'Liked',
        format: 'tutorial',
        description:
          'Quick walkthrough of loading data, training a model, and evaluating. Genuine learning signal.',
        gradient: ['#2563eb', '#0f172a'],
      },
      {
        id: 'ai-3',
        title: 'LLM Hallucinations Be Like...',
        category: 'LLMs',
        watchPercentage: 98,
        interaction: 'Replayed',
        format: 'meme',
        description:
          'Replay-heavy joke about confident wrong answers. Signals interest in how models actually fail.',
        gradient: ['#4f46e5', '#581c87'],
      },
      {
        id: 'ai-4',
        title: 'Computer Vision Detecting Objects Live',
        category: 'Computer Vision',
        watchPercentage: 90,
        interaction: 'Watched',
        format: 'demo',
        description:
          'Real-time object detection demo on a webcam. Engineering demonstration, not a product ad.',
        gradient: ['#0e7490', '#134e4a'],
      },
      {
        id: 'ai-5',
        title: 'Become an AI Engineer in 7 Days',
        category: 'AI/Career',
        watchPercentage: 16,
        interaction: 'Skipped',
        format: 'clickbait',
        description:
          'Overnight-career pitch with no curriculum depth. Strong rejection of hype.',
        gradient: ['#9f1239', '#431407'],
      },
      {
        id: 'ai-6',
        title: 'How AI Coding Assistants Actually Edit Files',
        category: 'AI Tools',
        watchPercentage: 100,
        interaction: 'Saved',
        format: 'tutorial',
        description:
          'Saved full-watch on repo-aware coding assistants. Practical builder intent, not tool-spam.',
        gradient: ['#6d28d9', '#1e3a8a'],
      },
      {
        id: 'ai-7',
        title: 'Gaming Setup Transformation',
        category: 'Gaming',
        watchPercentage: 48,
        interaction: 'Watched',
        format: 'lifestyle',
        description:
          'Unrelated entertainment. Weak signal, should not drive the latent interest.',
        gradient: ['#15803d', '#14532d'],
      },
      {
        id: 'ai-8',
        title: 'What ML Engineers Actually Do All Day',
        category: 'Career',
        watchPercentage: 82,
        interaction: 'Liked',
        format: 'lifestyle',
        description:
          'Role-reality reel: experiments, data quality, evals — not just "prompting ChatGPT".',
        gradient: ['#5b21b6', '#312e81'],
      },
    ],
  },
  {
    id: 'cybersecurity-learner',
    name: 'Cybersecurity Learner',
    shortLabel: 'Cyber',
    description: 'Defensive-security curiosity with CTF and network signals.',
    reels: [
      {
        id: 'cy-1',
        title: 'Ethical Hacker Problems 😂',
        category: 'Ethical Hacking',
        watchPercentage: 92,
        interaction: 'Watched',
        format: 'meme',
        description:
          'Meme about scope creep, broken labs, and "try harder". Identity humor, not an exploit tutorial.',
        gradient: ['#047857', '#052e16'],
      },
      {
        id: 'cy-2',
        title: 'Day in the Life of a SOC Analyst',
        category: 'Career',
        watchPercentage: 87,
        interaction: 'Liked',
        format: 'lifestyle',
        description:
          'Alert queues, triage, and shift work. Career-identity signal toward defensive security.',
        gradient: ['#0f766e', '#164e63'],
      },
      {
        id: 'cy-3',
        title: 'CTF Challenge Be Like...',
        category: 'CTF',
        watchPercentage: 99,
        interaction: 'Replayed',
        format: 'meme',
        description:
          'High-replay humor about rabbit holes and flag formats. Strong practice-community affinity.',
        gradient: ['#b45309', '#7f1d1d'],
      },
      {
        id: 'cy-4',
        title: 'How Firewalls Actually Inspect Packets',
        category: 'Network Security',
        watchPercentage: 94,
        interaction: 'Watched',
        format: 'tutorial',
        description:
          'Conceptual demo of stateful inspection. Real networking education, high completion.',
        gradient: ['#1d4ed8', '#0f172a'],
      },
      {
        id: 'cy-5',
        title: 'Guaranteed 30 LPA with this one skill',
        category: 'Career',
        watchPercentage: 12,
        interaction: 'Skipped',
        format: 'clickbait',
        description:
          'Salary-guarantee clickbait. Explicit rejection of hype career content.',
        gradient: ['#9f1239', '#431407'],
      },
      {
        id: 'cy-6',
        title: 'Why Password Managers Beat Sticky Notes',
        category: 'Password Security',
        watchPercentage: 100,
        interaction: 'Saved',
        format: 'tutorial',
        description:
          'Saved full-watch on credential hygiene. Practical security literacy, not fear-mongering.',
        gradient: ['#4f46e5', '#1e1b4b'],
      },
      {
        id: 'cy-7',
        title: 'Cybersecurity Memes That Hit Too Hard',
        category: 'Cybersecurity',
        watchPercentage: 78,
        interaction: 'Liked',
        format: 'meme',
        description:
          'In-group memes about phishing and patch Tuesday. Community belonging, supporting signal.',
        gradient: ['#166534', '#14532d'],
      },
      {
        id: 'cy-8',
        title: 'Gaming Setup Transformation',
        category: 'Gaming',
        watchPercentage: 51,
        interaction: 'Watched',
        format: 'lifestyle',
        description:
          'Unrelated entertainment. Should not dominate the inferred interest.',
        gradient: ['#15803d', '#0f172a'],
      },
    ],
  },
]

export function getProfile(id) {
  return profiles.find((profile) => profile.id === id) ?? profiles[0]
}
