export const fallbackResults = {
  'software-engineering': {
    currentReel: 'Java Streams Explained in 30 Seconds',
    interestDetected: 'Software Engineering / Programming Career',
    why: 'Cross-reel pattern: saved Java Streams tutorial, replayed interview humor, liked engineer lifestyle, watched developer-hardware comparison. Surface “Java” appears twice, but behavior clusters around career identity and interview prep — not language trivia. Skipped hype listicle reinforces rejection of shallow career content.',
    recommendedTechReel: 'How DSA Is Actually Used in Software Engineering Interviews',
    category: 'Software Engineering',
    whyThisRecommendation:
      'Adjacent to the inferred career interest: the student already saved a Java micro-lesson, so the next step is interview-ready DSA practice — the skill behind the interview meme — rather than another Java clip or a job-guarantee listicle.',
    difficulty: 'Intermediate',
    confidence: 92,
    evidenceSignals: [
      { label: 'Coding interviews', present: true },
      { label: 'Developer lifestyle', present: true },
      { label: 'Programming', present: true },
      { label: 'Developer hardware', present: true },
      { label: 'Hype career listicles', present: false },
    ],
    hypeFilter: {
      status: 'PASSED',
      summary: 'Low hype risk • High educational value',
      explanation:
        'Rejected “10 AI Tools That Will Get You a Job” (skipped at 22%). Selected a concept-first interview skill reel with transferable engineering value.',
    },
    graph: {
      center: 'Software Engineering',
      nodes: ['Java', 'Programming', 'Coding Interview', 'Career', 'Hardware'],
    },
  },
  'ai-enthusiast': {
    currentReel: 'How AI Coding Assistants Actually Edit Files',
    interestDetected: 'Applied AI / Machine Learning Engineering',
    why: 'Cross-reel pattern: saved AI coding-assistant deep-dive, liked ML pipeline walkthrough, replayed LLM-failure humor, watched live computer-vision demo. Skipped overnight-career pitch. Latent interest is applied ML systems — not tool collecting.',
    recommendedTechReel: 'How Transformers Process Language — A Visual Walkthrough',
    category: 'AI Concepts',
    whyThisRecommendation:
      'Adjacent next step: the student saved how assistants edit files, so fundamentals behind LLMs/agents/hallucinations matter more than another tool roundup or meme replay.',
    difficulty: 'Intermediate',
    confidence: 90,
    evidenceSignals: [
      { label: 'AI agents', present: true },
      { label: 'Python ML', present: true },
      { label: 'LLMs', present: true },
      { label: 'Computer vision', present: true },
      { label: 'Overnight AI careers', present: false },
    ],
    hypeFilter: {
      status: 'PASSED',
      summary: 'Low hype risk • High educational value',
      explanation:
        'Rejected “Become an AI Engineer in 7 Days” (skipped at 16%). Preferred a fundamentals reel over tool spam or salary guarantees.',
    },
    graph: {
      center: 'Applied AI Engineering',
      nodes: ['AI Agents', 'Python ML', 'LLMs', 'Computer Vision', 'AI Tools'],
    },
  },
  'cybersecurity-learner': {
    currentReel: 'Why Password Managers Beat Sticky Notes',
    interestDetected: 'Cybersecurity / Defensive Security Career',
    why: 'Cross-reel pattern: saved password-hygiene lesson, replayed CTF humor, liked SOC lifestyle reel, watched firewall packet inspection. Skipped salary-guarantee pitch. Latent interest is defensive security operations — not hacker aesthetic alone.',
    recommendedTechReel: 'How Real SOC Analysts Investigate a Phishing Alert',
    category: 'Cybersecurity',
    whyThisRecommendation:
      'Adjacent next step: CTF replay plus SOC lifestyle point to investigative triage. A phishing-alert walkthrough extends saved credential hygiene into real analyst workflow.',
    difficulty: 'Intermediate',
    confidence: 91,
    evidenceSignals: [
      { label: 'Ethical hacking community', present: true },
      { label: 'CTF practice', present: true },
      { label: 'Network security', present: true },
      { label: 'Password security', present: true },
      { label: 'Salary-guarantee hype', present: false },
    ],
    hypeFilter: {
      status: 'PASSED',
      summary: 'Low hype risk • High educational value',
      explanation:
        'Rejected “Guaranteed 30 LPA with this one skill” (skipped at 12%). Selected an operational SOC workflow with clear educational value.',
    },
    graph: {
      center: 'Cybersecurity',
      nodes: ['Ethical Hacking', 'CTF', 'Network Security', 'Passwords', 'SOC Career'],
    },
  },
}

export function getFallbackResult(profileId) {
  return fallbackResults[profileId] ?? fallbackResults['software-engineering']
}
