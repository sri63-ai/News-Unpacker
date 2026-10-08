// ==================== CONFIGURATION & BACKEND ENDPOINTS ====================
const API_KEY = "AQ.Ab8RN6Jy4n1Ey9XKPl_W7MkT8K_geI41Ww2j667e14XRosiE_A";

// Separate Endpoints for Authentication vs Billing
const AUTH_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxTpt_57anfxQY0cWfXg91qokYOZFCUUFSAt6mbJxrpjzPjJujaIIOSEHBquiMTp-Sl/exec";
const BILLING_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxTpt_57anfxQY0cWfXg91qokYOZFCUUFSAt6mbJxrpjzPjJujaIIOSEHBquiMTp-Sl/exec";

const PRE_LAUNCH_END_DATE = new Date("2027-01-01T23:59:59");

function getPasswordResetUrl(email) {
  const currentBaseUrl = window.location.href.split('index.html')[0].split('?')[0];
  return `${currentBaseUrl}resetpassword.html?email=${encodeURIComponent(email || "")}`;
}

let isSpeaking = false;
let currentLanguage = "en-US";
let currentToolMode = "unpack_news";
let currentVoiceUtterance = null;
let activeSessionUser = null;
let pendingRegistrationUser = null;
let isClaimingEventPass = false;

// 1. Comprehensive Tool Configuration Registry
const toolConfigMap = {
  unpack_news: {
    title: "Unpack News Engine",
    desc: "Deconstruct convoluted news stories into objective, transparent reality.",
    placeholder: "Paste multi-page political essays, circulars, or breaking reports here...",
    btnText: "Unpack News",
    badge: "SYNTACTIC DECOMPRESSION AND FACT ISOLATION",
    lead: "The 'Unpack News' engine within the News Unpacker platform operates based on this very approach; it strips away media commentary and sensationalism from lengthy articles, presenting the objective, core facts—who, what, and when—directly to the reader.",
    box1: "Strips loaded adjectives, editorial hyperbole, and speculation.",
    box2: "Presents neutral, unvarnished ground reality in seconds.",
    aiPrompt: "Deconstruct this news story objectively. Strip emotional adjectives, passive voice evasions, and speculative hyperbole. Deliver an objective factual breakdown between 500 and 800 characters."
  },
  factcheck: {
    title: "Fact and Bias Check",
    desc: "Scan breaking reports to detect propaganda patterns, unverified claims, and narrative slant.",
    placeholder: "Paste controversial media commentary, viral posts, or claims to verify...",
    btnText: "Check for Facts",
    badge: "DISINFORMATION FORENSICS AND SLANT DETECTION",
    lead: "The Fact and Bias Check engine operates as an automated linguistic and analytical audit layer across raw media streams, targeting the systemic distortions commonly introduced between field reporting and digital publication.",
    box1: "Media bias often operates through selective filtering. The engine cross-references timeline data to detect slant.",
    box2: "Subjective framing relies on semantically charged vocabulary to provoke emotional bias before factual evaluation.",
    aiPrompt: "Audit this text for misinformation, partisan slant, unverified assertions, and emotional framing. Explicitly outline what is verifiable evidence versus what is subjective commentary."
  },
  eli5: {
    title: "Explain Like I'm 5",
    desc: "Break down ultra-complex financial regulations, court verdicts, and policies into simple prose.",
    placeholder: "Paste complex regulatory policies, court judgments, or economic budgets...",
    btnText: "Explain in Simple Lines",
    badge: "JARGON DECONSTRUCTION AND ANALOGY SYNTHESIS",
    lead: "The Explain Like I'm 5 (ELI5) engine operates as an automated semantic simplification layer within News Unpacker.",
    box1: "Deconstructs intricate legislative bills and regulatory filings into direct cause-and-effect statements.",
    box2: "Transforms dense geopolitical treaties and constitutional amendments into intuitive everyday conceptual models.",
    aiPrompt: "Explain this topic as if explaining to a 5-year-old child or beginner. Convert dense jargon, statutory clauses, or high-tech concepts into crystal-clear everyday analogies without losing accuracy."
  },
  bullet_points: {
    title: "Bullet Points & Key Briefs",
    desc: "Condense multi-page write-ups and lengthy reads into sharp, 60-second executive summaries.",
    placeholder: "Paste long investigative journalism, policy documents, or press releases...",
    btnText: "Extract Bullet Points",
    badge: "HIGH-SPEED EXECUTIVE EXTRACTION",
    lead: "The Bullet Points & Key Briefs engine acts as an information distillation pipeline within News Unpacker.",
    lead2: "Cuts reading duration by up to 80% by eliminating repetitive contextual restatements and rhetorical questions.",
    box1: "Cuts reading time by 80% while retaining critical details.",
    box2: "Instant clarity for executives, professionals, and students.",
    aiPrompt: "Condense this document into 4 to 5 high-priority, crisp, actionable bullet points highlighting metrics, dates, and core resolutions."
  },
  news_to_speech: {
    title: "News to Speech Engine",
    desc: "Convert lengthy news dispatches, reports, and circulars into natural spoken audio.",
    placeholder: "Paste articles, memos, or circulars to convert into speech...",
    btnText: "Convert to Speech",
    badge: "NEURAL ACOUSTIC CADENCE AND SPEECH OPTIMIZATION",
    lead: "The News to Speech Engine transforms dense news articles, reports, and editorial analysis into clear, natural audio briefings with flexible playback speeds.",
    box1: "Hands-free listening optimized for commutes and multitasking.",
    box2: "Eliminates screen fatigue while keeping you completely updated.",
    aiPrompt: "Format and optimize this news text for spoken acoustic delivery. Smooth awkward punctuation, expand statutory abbreviations, and create a fluent, broadcast-ready script."
  },
  short_to_depth: {
    title: "Short News to In-Depth Converter",
    desc: "Expand brief social media updates and one-line breaking alerts into comprehensive analytical briefs.",
    placeholder: "Paste 1-2 sentence breaking alerts, flash news tweets, or wire snippets...",
    btnText: "Unpack to Deep Story",
    badge: "CONTEXTUAL EXPANSION AND HISTORICAL CORRELATION",
    lead: "The Short News to In-Depth Converter transforms brief alerts into comprehensive, structured contextual dossiers.",
    lead2: "Bridges the gap between quick updates and deep analysis to eliminate speculative noise.",
    box1: "Correlates breaking alerts with preceding institutional milestones.",
    box2: "Provides 360-degree perspective beyond sensational headlines.",
    aiPrompt: "Expand this short breaking headline or brief alert into an in-depth analytical dossier. Detail the background context, underlying causes, key stakeholders involved, and forward-looking implications."
  },
  news_translator: {
    title: "News Translator Engine",
    desc: "Translate complex national and global news updates seamlessly into local languages with preserved factual nuance.",
    placeholder: "Paste global or national news dispatches to translate...",
    btnText: "Translate News",
    badge: "SEMANTIC TRANSLATION AND CONTEXT PRESERVATION",
    lead: "The News Translator Engine is designed to transpose news coverage seamlessly across regional languages without losing accuracy.",
    box1: "Maintains absolute semantic neutrality across languages.",
    box2: "Preserves administrative titles and subtle factual nuances intact.",
    aiPrompt: "Translate this news report accurately while strictly preserving journalistic neutrality, official titles, and administrative terminology."
  },
  politics: {
    title: "Political News Decoder",
    desc: "Analyze electoral dynamics, legislative amendments, and public policy impacts with strict neutrality.",
    placeholder: "Paste election speeches, parliamentary bills, cabinet resolutions, or political reporting...",
    btnText: "Analyze Political Points",
    badge: "LEGISLATIVE DECODING AND CIVIC POLICY INTELLIGENCE",
    lead: "The Political News Decoder cuts through political noise by filtering out campaign rhetoric, media spin, and partisan bias.",
    lead2: "Provides citizens, researchers, and voters with a clear, fact-based breakdown of how legislative decisions affect governance.",
    box1: "Evaluates governance metrics without partisan bias.",
    box2: "Analyzes actual policy execution against political promises.",
    aiPrompt: "Analyze this political news piece by decoupling partisan rhetoric from verifiable governance actions. Detail the statutory amendments, policy impacts, and voting milestones neutrally."
  },
  business: {
    title: "Business & Economy Decoder",
    desc: "Unpack corporate earnings, GDP indicators, stock market trends, and monetary policies.",
    placeholder: "Paste corporate reports, quarterly earnings, trade dispatches, or central bank minutes...",
    btnText: "Extract Business Insights",
    badge: "MACROECONOMIC ANALYSIS AND FINANCIAL FORENSICS",
    lead: "The Business & Economy Decoder decodes complex fiscal indices and corporate earnings into straightforward commercial takeaways.",
    box1: "Isolates revenue metrics, net debt, and forward guidance.",
    box2: "Connects monetary policy directly to consumer purchasing power.",
    aiPrompt: "Analyze this financial/economic report. Extract quarterly balance sheet numbers, inflation indices, central bank interest impacts, and commercial consumer consequences simply."
  },
  tech: {
    title: "Technology & AI Decoder",
    desc: "Clarifies technical specs, AI benchmarks, software updates, and user privacy impacts without excessive industry jargon.",
    placeholder: "Paste tech announcements, research whitepapers, or cybersecurity notices...",
    btnText: "Decode Tech Updates",
    badge: "TECHNICAL BENCHMARKING AND SECURITY ANALYSIS",
    lead: "Simplifies machine learning breakthroughs, semiconductor architectures, and platform regulatory shifts.",
    box1: "Cuts through tech marketing hype to focus strictly on real-world utility.",
    box2: "Evaluates critical user privacy implications and emerging cybersecurity vectors.",
    aiPrompt: "Deconstruct this technology/AI announcement. Highlight practical consumer/enterprise utility, architectural benchmarks, and data security or privacy impacts without marketing fluff."
  },
  crime_legal: {
    title: "Crime & Legal Updates",
    desc: "Clarifies court verdicts, constitutional clauses, charges, and ongoing trials objectively.",
    placeholder: "Paste court orders, police FIR filings, legal arguments, or statutory notices...",
    btnText: "Clarify Legal Points",
    badge: "JURISPRUDENCE AND STATUTORY CLARITY",
    lead: "The Crime & Legal Updates engine translates complex court orders and statutory charges into plain, neutral language.",
    lead2: "Isolates procedural facts to deliver an accurate, objective summary of the legal process.",
    box1: "Focuses strictly on verified evidentiary submissions rather than speculative claims.",
    box2: "Removes courtroom melodrama and dramatic sensationalism to present pure facts.",
    aiPrompt: "Explain this legal proceeding or court verdict neutrally. Outline the formal statutory charges, procedural findings, constitutional implications, and legal rights objectively."
  },
  education: {
    title: "Education & Career Intelligence",
    desc: "Summarizes exam updates, notification eligibility criteria, and workforce shifts.",
    placeholder: "Paste educational notifications, exam circulars, syllabus updates, or job drives...",
    btnText: "Extract Career Points",
    badge: "ACADEMIC AND RECRUITMENT CLARITY",
    lead: "Transforms lengthy educational gazettes and exam notifications into structured, actionable takeaways.",
    box1: "Pinpoints cutoffs, exam timelines, and syllabus priorities.",
    box2: "Saves preparation time with structured study takeaways.",
    aiPrompt: "Extract the core takeaways from this educational or recruitment notification. Clearly outline eligibility requirements, application milestones, exam patterns, and career implications."
  },
  health: {
    title: "Health & Lifestyle Verification",
    desc: "Extracts verified medical study conclusions, diet myths, and public health guidelines.",
    placeholder: "Paste medical publications, health advisories, clinical trial conclusions...",
    btnText: "Verify Health Data",
    badge: "CLINICAL EVIDENCE AND PUBLIC HEALTH STANDARDS",
    lead: "Distinguishes clinical empirical evidence from commercial wellness trends and pseudo-scientific marketing claims.",
    box1: "Cross-checks sample sizes and verified medical trials.",
    box2: "Summarizes actionable public health guidelines cleanly.",
    aiPrompt: "Analyze this health/medical article. Differentiate peer-reviewed clinical findings from wellness speculation. State the proven conclusions, sample limitations, and actionable advisories."
  },
  entertainment: {
    title: "Entertainment & Box Office",
    desc: "Delivers factual movie industry updates, box-office data, and industry reports minus gossip.",
    placeholder: "Paste entertainment trade dispatches, box office earnings, or legal releases...",
    btnText: "Extract Entertainment Facts",
    badge: "COMMERCIAL MEDIA METRICS AND INDUSTRY REPORTING",
    lead: "Provides a clean, fact-based overview of the entertainment industry by focusing on commercial deals and box-office receipts.",
    lead2: "Filters out unconfirmed celebrity rumors, promotional fluff, and speculative tabloid gossip.",
    box1: "Cross-verifies financial performance and box office figures directly from authenticated trade sources.",
    box2: "Delivers a purely objective breakdown of the commercial entertainment business.",
    aiPrompt: "Summarize this entertainment dispatch focusing strictly on audited box office revenue, distribution agreements, technical credits, and verified industry milestones without gossip."
  },
  sports: {
    title: "Sports Analytics & Briefs",
    desc: "Condenses match analyses, tournament standings, stats, and rule changes.",
    placeholder: "Paste match reports, tournament points tables, athlete statements, or rule updates...",
    btnText: "Extract Sports Briefs",
    badge: "ATHLETIC METRICS AND TOURNAMENT AUDIT",
    lead: "Delivers pure, data-driven match intelligence by isolating tactical formations, verified scorelines, and performance metrics.",
    lead2: "Cuts through fan commentary and emotional media bias to present an objective breakdown.",
    box1: "Evaluates qualification scenarios, group tables, and tournament progression probabilities.",
    box2: "Summarizes matches factually, filtering out managerial mind games and transfer rumors.",
    aiPrompt: "Synthesize this sports dispatch into a factual analytical brief. Detail the official final score, critical tactical turnarounds, individual statistics, and tournament standings."
  },
  environment: {
    title: "Weather & Climate Intelligence",
    desc: "Decodes meteorological forecasts, pollution indexes, and environment shifts.",
    placeholder: "Paste meteorological bulletins, Air Quality Index advisories, or disaster circulars...",
    btnText: "Decode Climate Alert",
    badge: "METEOROLOGICAL FORECASTING AND AQI ADVISORY",
    lead: "Converts atmospheric telemetry, satellite updates, and air pollution indices into clear, actionable safety precautions.",
    lead2: "Translates raw meteorological data into simple advisories for communities and travelers.",
    box1: "Pinpoints clear localized impact coordinates and storm trajectories.",
    box2: "Strips panic-inducing adjectives and clickbait headlines from weather reporting.",
    aiPrompt: "Break down this weather or climate advisory. State the affected geographic coordinates, air quality metrics, rainfall/wind projections, and official safety precautions clearly."
  },
  kids: {
    title: "Kids & Students Mode",
    desc: "Safe, educational news breakdowns with age-appropriate vocabulary and no graphic elements.",
    placeholder: "Paste news stories to reformat for children or classroom discussion...",
    btnText: "Reformat for Students",
    badge: "EDUCATIONAL ADAPTATION AND SAFE CONTENT SHIELD",
    lead: "Restructures complex national and global developments using age-appropriate educational vocabulary.",
    box1: "Completely filters graphic violence and disturbing narratives.",
    box2: "Explains global geography and civic science context gently.",
    aiPrompt: "Rewrite this news story so that it is 100% safe, educational, and inspiring for kids and school students. Use accessible vocabulary, explain civic terms, and strictly eliminate graphic details or violence."
  },
  hard_news: {
    title: "Hard News Analyzer",
    desc: "Timely, factual stories about major events like governance, critical incidents, and global events.",
    placeholder: "Paste breaking news dispatches, wire agency reports, or official statements...",
    btnText: "Isolate Critical Incident",
    badge: "CRITICAL INCIDENT AUDIT AND 5W-1H EXTRACTION",
    lead: "Focuses strictly on the core fundamental pillars of journalism: Who, What, When, Where, Why, and How.",
    lead2: "Eliminates subjective fluff to ensure pure, unadulterated facts.",
    box1: "Strips away narrative tangents and personal author opinions to isolate the core event.",
    box2: "Rapidly presents verifiable ground status so readers grasp crucial developments in seconds.",
    aiPrompt: "Perform a hard news forensic analysis on this text. Deliver a strictly factual account answering Who, What, Where, When, and Why without editorializing or filler."
  },
  local: {
    title: "Local News",
    desc: "Community reports, civic issues, regional events, and city-level updates simplified.",
    placeholder: "Paste municipal notices, local collectorate circulars, or neighborhood reports...",
    btnText: "Extract Civic Points",
    badge: "MUNICIPAL GOVERNANCE AND REGIONAL DISPATCH",
    lead: "Focuses strictly on essential hyper-local updates, including municipal utilities, road closures, and zoning notices.",
    lead2: "Cuts through broad national coverage to prioritize developments affecting daily routines.",
    box1: "Details immediate neighborhood repercussions regarding infrastructure shifts.",
    box2: "Translates complex administrative bureaucracy into simple public notices.",
    aiPrompt: "Summarize this local civic news item. Highlight the affected municipal wards, timeline of infrastructure disruptions, official grievance contacts, and citizen advisories."
  },
  soft_news: {
    title: "Soft News",
    desc: "Feature stories, human-interest narratives, culture, and positive lifestyle updates.",
    placeholder: "Paste cultural features, human achievements, arts, or lifestyle profiles...",
    btnText: "Extract Feature Story",
    badge: "CULTURAL PROFILE AND HUMAN-INTEREST SYNTHESIS",
    lead: "Preserves constructive narrative arcs while removing clickbait padding and sensational headlines.",
    lead2: "Highlights positive human achievements without compromising journalistic substance.",
    box1: "Spotlights community innovation, social impact, and human resilience.",
    box2: "Delivers an engaging reading flow that informs and inspires.",
    aiPrompt: "Condense this feature/soft news piece into an engaging human-interest summary. Emphasize cultural elements, inspiring initiatives, and community impact smoothly."
  },
  editorial: {
    title: "Opinion & Editorial",
    desc: "Decodes columns, expert commentaries, and subjective viewpoints from hard facts.",
    placeholder: "Paste editorial op-eds, guest columns, or political think-tank essays...",
    btnText: "Dissect Editorial Stance",
    badge: "RHETORICAL DISSECTION AND THESIS EVALUATION",
    lead: "Isolates the author's primary thesis, examines supporting data points, and spotlights counter-arguments.",
    box1: "Distinguishes personal ideological stances from baseline facts.",
    box2: "Evaluates whether conclusions are logically substantiated by verifiable evidence.",
    aiPrompt: "Dissect this editorial column. Identify the author's central thesis, evaluate the factual evidence cited, identify logical fallacies or biases, and summarize the alternative perspective."
  },
  geo_scope: {
    title: "Local vs. International Scope",
    desc: "Stories framed by geographic scope, comparing grassroots local impacts with global geopolitics.",
    placeholder: "Paste foreign policy updates, bilateral treaties, or global trade reports...",
    btnText: "Compare Local and Global Scope",
    badge: "GEOPOLITICAL MAPPING AND GRASSROOTS COMPARISON",
    lead: "Bridges macro-level global events with everyday micro-level realities, connecting treaties to local economic impacts.",
    lead2: "Explains how decisions made in foreign capitals directly affect regional industry dynamics.",
    box1: "Traces international diplomatic cause-and-effect paths through domestic supply networks.",
    box2: "Calculates precise local grassroots consequences of global policy shifts.",
    aiPrompt: "Analyze this story through a dual lens: first, explain the broad international diplomatic or macroeconomic reality; second, detail the direct ground-level impact on local citizens and businesses."
  },
  devotional: {
    title: "Devotional & Cultural Traditions",
    desc: "Horoscopes, festival highlights, and worship rituals presented with clarity and respect.",
    placeholder: "Paste temple trust circulars, festival schedules, or traditional commentary...",
    btnText: "Summarize Sacred Traditions",
    badge: "CULTURAL HERITAGE AND FESTIVAL CHRONOLOGY",
    lead: "Extracts festival dates, temple trust crowd advisories, ritual timings, and philosophical significance neutrally.",
    box1: "Focuses on authentic cultural and historical traditions without imposing theological bias.",
    box2: "Details operational visitor guidelines, queue management, and ritual timelines.",
    aiPrompt: "Summarize this devotional and cultural text with dignity. Clearly outline the festival muhurat/timings, historical or philosophical significance, and temple visitor guidelines."
  },
  travel: {
    title: "Travel & Tourism",
    desc: "Global travel advisories, route policies, eco-tourism insights, and destination updates.",
    placeholder: "Paste airline circulars, immigration updates, tourism advisories, or route maps...",
    btnText: "Extract Travel Advisory",
    badge: "TRANSIT LOGISTICS AND IMMIGRATION CLEARANCE",
    lead: "Isolates visa protocol revisions, airline baggage regulations, transit advisories, and destination safety updates.",
    lead2: "Streamlines cross-border travel planning by synthesizing complex international travel policies.",
    box1: "Lists official entry requirements and passport validity norms directly from authorized portals.",
    box2: "Highlights real-time route disruptions, security delays, and localized safety advisories.",
    aiPrompt: "Extract the actionable travel takeaways from this advisory. Detail the visa or immigration criteria, transit disruption schedules, safety notices, and traveler recommendations."
  }
};

// 2. Dynamic Profile Initial Display Function
function updateProfileAvatarLetter() {
  const avatarBtn = document.getElementById("userProfileBtn");
  const avatarText = document.getElementById("userAvatarText");
  if (!avatarBtn) return;

  if (activeSessionUser && activeSessionUser.name) {
    const firstLetter = activeSessionUser.name.trim().charAt(0).toUpperCase();
    if (avatarText) {
      avatarText.innerText = firstLetter;
    } else {
      avatarBtn.innerText = firstLetter;
    }
    if (activeSessionUser.subscribed) {
      avatarBtn.classList.add("subscribed");
    } else {
      avatarBtn.classList.remove("subscribed");
    }
  } else {
    if (avatarText) {
      avatarText.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      `;
    }
    avatarBtn.classList.remove("subscribed");
  }
}

function openWorkspace(toolKey) {
  if (typeof stopVoice === "function") {
    try {
      stopVoice();
    } catch (e) {
      console.warn("stopVoice failed safely:", e);
    }
  }

  let normalizedKey = toolKey ? toolKey.toLowerCase() : "unpack_news";
  if (normalizedKey === "summary") normalizedKey = "unpack_news";

  currentToolMode = normalizedKey;
  const config = toolConfigMap[currentToolMode] || toolConfigMap.unpack_news;

  // Views Toggle
  const dashboard = document.getElementById("toolsDashboard");
  const aboutSection = document.getElementById("aboutSection");
  const socialSection = document.getElementById("socialSection");
  const infoSection = document.querySelector(".info-section");
  const enterpriseSection = document.getElementById("enterpriseSection");
  const workspace = document.getElementById("workspaceArea");

  if (dashboard) dashboard.classList.add("hidden");
  if (aboutSection) aboutSection.classList.add("hidden");
  if (socialSection) socialSection.classList.add("hidden");
  if (infoSection) infoSection.classList.add("hidden");
  if (enterpriseSection) enterpriseSection.classList.add("hidden");

  if (workspace) {
    workspace.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const titleEl = document.getElementById("workspaceTitle");
  const descEl = document.getElementById("workspaceDesc");
  const inputEl = document.getElementById("newsInput");
  const procBtn = document.getElementById("processBtn");

  if (titleEl) titleEl.innerText = config.title;
  if (descEl) descEl.innerText = config.desc;
  if (inputEl) {
    inputEl.placeholder = config.placeholder;
    inputEl.value = "";
  }
  if (procBtn) procBtn.innerText = config.btnText;

  const speedContainer = document.getElementById("speechSpeedContainer");
  if (speedContainer) {
    if (currentToolMode === "news_to_speech") {
      speedContainer.classList.remove("hidden");
    } else {
      speedContainer.classList.add("hidden");
    }
  }

  const outputCard = document.getElementById("outputCard");
  if (outputCard) outputCard.classList.add("hidden");

  // Dynamic Overview Injection
  const overviewEl = document.getElementById("dynamicToolOverview");
  if (overviewEl) {
    overviewEl.innerHTML = `
      <div style="margin-top: 30px; padding-top: 24px; border-top: 1.5px solid #e2e8f0; text-align: left;">
        <span style="display:inline-block; font-size:0.75rem; font-weight:800; letter-spacing:1px; color:#2563eb; background:#eff6ff; border:1px solid #bfdbfe; padding:4px 12px; border-radius:16px; margin-bottom:10px;">
          ${config.badge}
        </span>
        <h3 style="font-size:1.35rem; font-weight:800; color:#0f172a; margin:0 0 10px;">
          ${config.title}: Operational Architecture & AI Processing
        </h3>
        <p style="color:#475569; font-size:0.95rem; line-height:1.65; margin-bottom:12px;">
          ${config.lead}
        </p>
        ${config.lead2 ? `
        <p style="color:#475569; font-size:0.95rem; line-height:1.65; margin-bottom:18px;">
          ${config.lead2}
        </p>
        ` : ''}
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:16px;">
          <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:10px; padding:16px; box-shadow:0 2px 8px rgba(0,0,0,0.02);">
            <h4 style="margin:0 0 8px; font-size:0.96rem; color:#0f172a; font-weight:700;">System Principles</h4>
            <p style="margin:0; font-size:0.88rem; color:#64748b; line-height:1.5;">${config.box1}</p>
          </div>
          <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:10px; padding:16px; box-shadow:0 2px 8px rgba(0,0,0,0.02);">
            <h4 style="margin:0 0 8px; font-size:0.96rem; color:#0f172a; font-weight:700;">Objective Outcome</h4>
            <p style="margin:0; font-size:0.88rem; color:#64748b; line-height:1.5;">${config.box2}</p>
          </div>
        </div>
      </div>
    `;
  }
}

// 3. Caching Subsystem (24 Hours TTL)
function generateTextHash(text, mode = "") {
  let hash = 0;
  const cleanStr = (mode + "_" + text).trim().toLowerCase();
  for (let i = 0; i < cleanStr.length; i++) {
    const char = cleanStr.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return "cache_nu_" + Math.abs(hash);
}

function getCachedSummary(key) {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;
    const parsed = JSON.parse(item);
    if (Date.now() - parsed.timestamp > 24 * 60 * 60 * 1000) {
      localStorage.removeItem(key);
      return null;
    }
    return parsed.data;
  } catch (e) {
    return null;
  }
}

function setCachedSummary(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify({ timestamp: Date.now(), data }));
  } catch (e) {
    console.warn("Storage quota exceeded or disabled:", e);
  }
}

// 4. Dynamic Guest Usage & Quota Subsystem
function getDynamicDailyLimit() {
  const now = new Date();
  const isPreLaunch = now <= PRE_LAUNCH_END_DATE;
  const streakDays = parseInt(localStorage.getItem("nu_active_streak") || "1", 10);

  if (isPreLaunch) {
    return streakDays >= 3 ? 15 : 7;
  } else {
    return 5;
  }
}

function checkAndUpdateGuestQuota() {
  const today = new Date().toDateString();
  const storedDate = localStorage.getItem("nu_usage_date");
  let usageCount = parseInt(localStorage.getItem("nu_daily_usage") || "0", 10);

  if (storedDate !== today) {
    const lastDate = storedDate ? new Date(storedDate) : null;
    let streak = parseInt(localStorage.getItem("nu_active_streak") || "0", 10);
    
    if (lastDate && (new Date() - lastDate) < 48 * 60 * 60 * 1000) {
      streak += 1;
    } else {
      streak = 1;
    }
    
    localStorage.setItem("nu_active_streak", streak.toString());
    localStorage.setItem("nu_usage_date", today);
    localStorage.setItem("nu_daily_usage", "0");
    usageCount = 0;
  }

  const limit = getDynamicDailyLimit();
  return {
    used: usageCount,
    limit: limit,
    remaining: Math.max(0, limit - usageCount),
    isExhausted: usageCount >= limit
  };
}

function incrementGuestArticleUsage() {
  const today = new Date().toDateString();
  let usageCount = parseInt(localStorage.getItem("nu_daily_usage") || "0", 10);
  usageCount += 1;
  localStorage.setItem("nu_daily_usage", usageCount.toString());
  localStorage.setItem("nu_usage_date", today);
  updateQuotaBannerUI();
}

function updateQuotaBannerUI() {
  const quota = checkAndUpdateGuestQuota();
  const quotaText = document.getElementById("guestQuotaText");
  const strip = document.getElementById("guestDailyUsageStrip");

  if (activeSessionUser && activeSessionUser.subscribed) {
    if (strip) strip.style.display = "none";
    return;
  }

  if (strip) strip.style.display = "flex";
  if (quotaText) {
    const isSpecial = quota.limit >= 15;
    quotaText.innerHTML = `${quota.remaining} / ${quota.limit} free summaries left today ${isSpecial ? '<span style="color:#d97706; font-weight:800;">(⭐ Frequent Reader Bonus Active)</span>' : ''}`;
  }
}

// 5. Unified Primary Processing Pipeline
async function startProcessing() {
  const inputEl = document.getElementById("newsInput");
  const text = inputEl ? inputEl.value.trim() : "";

  if (!text) {
    showAlert("Please paste the news article or report before processing.", "Input Required");
    return;
  }

  // A. Logged-in Subscription & Lifetime Quota Checks
  if (activeSessionUser) {
    if (typeof activeSessionUser.articleQuotaRemaining === "number") {
      if (activeSessionUser.articleQuotaRemaining <= 0) {
        activeSessionUser.subscribed = false;
        activeSessionUser.plan = "Lifetime Quota Exhausted";
        localStorage.setItem("news_unpacker_active_user", JSON.stringify(activeSessionUser));
        showCustomModalAlert("Quota Exhausted", "Your 120-article quota has been completed. Please renew your plan to continue.");
        window.location.href = "subscription.html";
        return;
      }
    } else if (activeSessionUser.expiryDate) {
      if (new Date() > new Date(activeSessionUser.expiryDate)) {
        activeSessionUser.subscribed = false;
        localStorage.setItem("news_unpacker_active_user", JSON.stringify(activeSessionUser));
        showCustomModalAlert("Pass Expired", "Your access pass has expired. Please upgrade or renew your plan.");
        window.location.href = "subscription.html";
        return;
      }
    } else if (!activeSessionUser.subscribed) {
      window.location.href = "subscription.html";
      return;
    }
  } else {
    // B. Guest User Quota Check
    const quota = checkAndUpdateGuestQuota();
    if (quota.isExhausted) {
      showCustomModalAlert(
        "Daily Free Quota Exhausted", 
        `Your daily free limit of ${quota.limit} summaries has been reached. Please log in or create an account for uninterrupted access.`
      );
      setTimeout(() => {
        openAuthModal();
        switchAuthView("register");
      }, 1200);
      return;
    }
  }

  const loader = document.getElementById("loader");
  const loaderText = document.getElementById("loaderText");
  const outputCard = document.getElementById("outputCard");
  const processBtn = document.getElementById("processBtn");
  const newsTitle = document.getElementById("newsTitle");
  const newsBody = document.getElementById("newsBody");
  const charCount = document.getElementById("charCount");
  const config = toolConfigMap[currentToolMode] || toolConfigMap.unpack_news;

  // C. Local Cache Verification
  const cacheKey = generateTextHash(text, currentToolMode);
  const cachedData = getCachedSummary(cacheKey);

  if (cachedData) {
    stopVoice();
    if (loader) loader.classList.add("hidden");
    if (processBtn) processBtn.disabled = false;

    currentLanguage = cachedData.detected_lang || "en-US";
    if (newsTitle) newsTitle.innerText = cachedData.title;

    renderFormattedNewsBody(newsBody, cachedData.content);

    if (charCount) {
      charCount.innerText = `Character count: ${cachedData.content.length} | Mode: ${config.btnText} (Cached)`;
    }

    if (outputCard) outputCard.classList.remove("hidden");
    outputCard.scrollIntoView({ behavior: "smooth", block: "nearest" });

    applyQuotaDeduction();
    return;
  }

  // D. Live Gemini API Execution
  stopVoice();
  if (loader) loader.classList.remove("hidden");
  if (outputCard) outputCard.classList.add("hidden");
  if (processBtn) processBtn.disabled = true;

  if (loaderText) {
    loaderText.innerText = `Executing: ${config.btnText}... analyzing content, please wait...`;
  }

  const prompt = `
Analyze the provided source text according to the following instructions:
${config.aiPrompt}

Rules:
1. Detect the source text language automatically. Output strictly in that SAME language (Telugu or English).
2. Maintain rigorous factual integrity without sensationalism or editorial bias.
3. Return strictly valid raw JSON without markdown backticks:
{"detected_lang": "te-IN or en-US", "title": "Relevant Concise Headline", "content": "Processed response text"}

Source Text:
${text}
`;

  try {
    const data = await callGeminiAPI(prompt);
    let rawText = data.candidates[0].content.parts[0].text.trim();
    rawText = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();

    const result = JSON.parse(rawText);
    currentLanguage = result.detected_lang || "en-US";

    setCachedSummary(cacheKey, result);

    if (newsTitle) newsTitle.innerText = result.title;
    renderFormattedNewsBody(newsBody, result.content);

    if (charCount) {
      charCount.innerText = `Character count: ${result.content.length} | Mode: ${config.btnText}`;
    }

    if (loader) loader.classList.add("hidden");
    if (outputCard) outputCard.classList.remove("hidden");
    if (processBtn) processBtn.disabled = false;

    outputCard.scrollIntoView({ behavior: "smooth", block: "nearest" });

    applyQuotaDeduction();

  } catch (error) {
    if (loader) loader.classList.add("hidden");
    if (processBtn) processBtn.disabled = false;
    showAlert("Processing error: " + error.message, "Execution Error");
  }
}

function renderFormattedNewsBody(containerEl, content) {
  if (!containerEl) return;
  if (currentToolMode === "bullet_points" || currentToolMode === "education") {
    const bulletLines = content.split("\n").filter(l => l.trim().length > 0);
    containerEl.innerHTML = `
      <ul style="padding-left:20px; line-height:1.75; color:#334155;">
        ${bulletLines.map(line => `<li>${escapeHTML(line.replace(/^[•\-\*]\s*/, ''))}</li>`).join('')}
      </ul>
    `;
  } else if (currentToolMode === "news_to_speech") {
    containerEl.innerHTML = `
      <p style="color:#059669; font-weight:700; margin-bottom:10px;">Acoustic Speech Synthesis Ready. Click 'Listen' above to play audio.</p>
      <p style="line-height:1.65; color:#334155;">${escapeHTML(content)}</p>
    `;
  } else {
    containerEl.innerHTML = `<p style="line-height:1.65; color:#334155;">${escapeHTML(content)}</p>`;
  }
}

function applyQuotaDeduction() {
  if (activeSessionUser) {
    if (typeof activeSessionUser.articleQuotaRemaining === "number") {
      activeSessionUser.articleQuotaRemaining -= 1;
      localStorage.setItem("news_unpacker_active_user", JSON.stringify(activeSessionUser));

      let users = JSON.parse(localStorage.getItem("news_unpacker_users")) || [];
      let idx = users.findIndex(u => u.email === activeSessionUser.email);
      if (idx !== -1) {
        users[idx].articleQuotaRemaining = activeSessionUser.articleQuotaRemaining;
        localStorage.setItem("news_unpacker_users", JSON.stringify(users));
      }
    }
  } else {
    incrementGuestArticleUsage();
  }
}

// 6. Gemini Flash API Caller (Updated to gemini-3.8-flash)
async function callGeminiAPI(promptText) {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: promptText }] }]
    })
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  return data;
}

// 7. Text Condenser
async function makeShorter() {
  const newsBody = document.getElementById("newsBody");
  const currentContent = newsBody ? newsBody.innerText.trim() : "";
  const loader = document.getElementById("loader");
  const loaderText = document.getElementById("loaderText");
  const charCount = document.getElementById("charCount");

  if (!currentContent) return;

  stopVoice();
  if (loader) loader.classList.remove("hidden");
  if (loaderText) loaderText.innerText = "Condensing into an ultra-brief summary...";

  const prompt = `
Condense the following text into an ultra-brief summary under 250 characters in the SAME language.
Return strictly valid raw JSON without markdown formatting:
{"content": "Short version under 250 characters"}

Text:
${currentContent}
`;

  try {
    const data = await callGeminiAPI(prompt);
    let rawText = data.candidates[0].content.parts[0].text.trim();
    rawText = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();

    const result = JSON.parse(rawText);
    newsBody.innerHTML = `<p style="line-height:1.65; color:#334155;">${escapeHTML(result.content)}</p>`;
    if (charCount) charCount.innerText = `Character count: ${result.content.length} | Condensed Brief`;
    if (loader) loader.classList.add("hidden");
  } catch (error) {
    if (loader) loader.classList.add("hidden");
    showAlert("Error shortening content: " + error.message, "Shorten Error");
  }
}

// 8. Acoustic Speech Synthesis
function toggleVoice() {
  const voiceBtn = document.getElementById("voiceBtn");
  const newsTitle = document.getElementById("newsTitle");
  const newsBody = document.getElementById("newsBody");

  const titleText = newsTitle ? newsTitle.innerText : "";
  const bodyText = newsBody ? newsBody.innerText : "";
  const fullText = (titleText + ". " + bodyText).trim();

  if (!("speechSynthesis" in window)) {
    showAlert("Speech Synthesis is not supported in this browser.", "Audio Error");
    return;
  }

  if (isSpeaking) {
    stopVoice();
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(fullText);
  const voices = window.speechSynthesis.getVoices();

  const matchingVoice = voices.find(v => v.lang.includes("te") || v.lang.toLowerCase().includes("telugu"));
  if (matchingVoice && currentLanguage.includes("te")) {
    utterance.voice = matchingVoice;
    utterance.lang = "te-IN";
  } else {
    utterance.lang = currentLanguage || "en-US";
  }

  const speedSelect = document.getElementById("playbackSpeedSelect");
  utterance.rate = speedSelect ? (parseFloat(speedSelect.value) || 1.0) : 1.0;

  utterance.onend = () => stopVoice();
  utterance.onerror = () => stopVoice();

  window.speechSynthesis.speak(utterance);
  isSpeaking = true;
  if (voiceBtn) voiceBtn.innerText = "Stop";
}

// Safe stopVoice function
function stopVoice() {
  try {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  } catch (err) {
    console.warn("Speech synthesis cancel error:", err);
  }

  isSpeaking = false;

  const voiceBtn = document.getElementById("voiceBtn");
  if (voiceBtn) {
    voiceBtn.innerText = "Listen";
  }
}

// 9. Multilingual Translation
async function quickTranslate(targetLang, element) {
  if (!targetLang) return;

  const currentTitle = document.getElementById("newsTitle").innerText;
  const currentContent = document.getElementById("newsBody").innerText;
  const loader = document.getElementById("loader");
  const loaderText = document.getElementById("loaderText");
  const newsTitle = document.getElementById("newsTitle");
  const newsBody = document.getElementById("newsBody");
  const charCount = document.getElementById("charCount");

  if (!currentContent) return;

  document.querySelectorAll(".lang-pill").forEach(p => p.classList.remove("active"));
  if (element && element.classList.contains("lang-pill")) {
    element.classList.add("active");
  }

  stopVoice();
  if (loader) loader.classList.remove("hidden");
  if (loaderText) loaderText.innerText = `Translating into ${targetLang}...`;

  const prompt = `
Translate this news headline and story into fluent, natural ${targetLang}.
Preserve factual accuracy, names, numbers, and context.
Return strictly valid raw JSON without markdown formatting:
{"title": "Translated Headline", "content": "Translated Content"}

Headline:
${currentTitle}

Content:
${currentContent}
`;

  try {
    const data = await callGeminiAPI(prompt);
    let rawText = data.candidates[0].content.parts[0].text.trim();
    rawText = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();

    const result = JSON.parse(rawText);

    newsTitle.innerText = result.title;
    newsBody.innerHTML = `<p style="line-height:1.65; color:#334155;">${escapeHTML(result.content)}</p>`;
    charCount.innerText = `Character count: ${result.content.length} | Translated: ${targetLang}`;

    if (targetLang === "English") currentLanguage = "en-US";
    else if (targetLang === "Hindi") currentLanguage = "hi-IN";
    else if (targetLang === "Telugu") currentLanguage = "te-IN";
    else currentLanguage = "en-US";

    if (loader) loader.classList.add("hidden");
  } catch (error) {
    if (loader) loader.classList.add("hidden");
    showAlert("Translation failed: " + error.message, "Translation Error");
  }
}

function openGoogleTranslate() {
  const title = document.getElementById("newsTitle").innerText;
  const body = document.getElementById("newsBody").innerText;
  const fullText = `${title}\n\n${body}`.trim();

  if (!fullText) {
    showAlert("No content available to translate.", "Notice");
    return;
  }

  const encodedText = encodeURIComponent(fullText);
  window.open(`https://translate.google.com/?sl=auto&tl=en&text=${encodedText}&op=translate`, "_blank");
}

// 10. Dashboard & View Switching Helpers
function backToDashboard() {
  stopVoice();

  const socialSection = document.getElementById("socialSection");
  const aboutSection = document.getElementById("aboutSection");
  const workspace = document.getElementById("workspaceArea");
  const dashboard = document.getElementById("toolsDashboard");
  const infoSection = document.querySelector(".info-section");
  const enterpriseSection = document.getElementById("enterpriseSection");

  if (socialSection) socialSection.classList.add("hidden");
  if (aboutSection) aboutSection.classList.add("hidden");
  if (workspace) workspace.classList.add("hidden");

  if (dashboard) dashboard.classList.remove("hidden");
  if (infoSection) infoSection.classList.remove("hidden");
  if (enterpriseSection) enterpriseSection.classList.remove("hidden");

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function openAboutSection() {
  stopVoice();

  const dashboard = document.getElementById("toolsDashboard");
  const workspace = document.getElementById("workspaceArea");
  const socialSection = document.getElementById("socialSection");
  const infoSection = document.querySelector(".info-section");
  const enterpriseSection = document.getElementById("enterpriseSection");
  const aboutSection = document.getElementById("aboutSection");

  if (dashboard) dashboard.classList.add("hidden");
  if (workspace) workspace.classList.add("hidden");
  if (socialSection) socialSection.classList.add("hidden");
  if (infoSection) infoSection.classList.add("hidden");
  if (enterpriseSection) enterpriseSection.classList.add("hidden");

  if (aboutSection) {
    aboutSection.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function openSocialSection() {
  stopVoice();

  const dashboard = document.getElementById("toolsDashboard");
  const workspace = document.getElementById("workspaceArea");
  const aboutSection = document.getElementById("aboutSection");
  const infoSection = document.querySelector(".info-section");
  const enterpriseSection = document.getElementById("enterpriseSection");
  const socialSection = document.getElementById("socialSection");

  if (dashboard) dashboard.classList.add("hidden");
  if (workspace) workspace.classList.add("hidden");
  if (aboutSection) aboutSection.classList.add("hidden");
  if (infoSection) infoSection.classList.add("hidden");
  if (enterpriseSection) enterpriseSection.classList.add("hidden");

  if (socialSection) {
    socialSection.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function scrollToFeedback() {
  const fb = document.getElementById("feedbackSection");
  if (fb) fb.scrollIntoView({ behavior: "smooth" });
}

function scrollToGuideSection(e) {
  if (e) e.preventDefault();
  const guide = document.getElementById("guideRoadmap");
  if (guide) guide.scrollIntoView({ behavior: "smooth" });
}

function clearOutput() {
  const outputCard = document.getElementById("outputCard");
  const inputEl = document.getElementById("newsInput");
  if (outputCard) outputCard.classList.add("hidden");
  if (inputEl) inputEl.value = "";
  stopVoice();
}

function showAlert(message, title = "News Unpacker") {
  const modal = document.getElementById("customAlert");
  if (modal) {
    document.getElementById("modalTitle").innerText = title;
    document.getElementById("modalMsg").innerText = message;
    modal.classList.remove("hidden");
  } else {
    alert(`${title}: ${message}`);
  }
}

function closeCustomAlert() {
  const modal = document.getElementById("customAlert");
  if (modal) modal.classList.add("hidden");
}

function showCustomModalAlert(title, message) {
  showAlert(message, title);
}

function escapeHTML(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// 11. Feedback Management
function checkOtherOption(selectElement) {
  const customGroup = document.getElementById("customToolGroup");
  const customInput = document.getElementById("fbCustomTool");

  if (selectElement.value === "other") {
    customGroup.classList.remove("hidden");
    customInput.setAttribute("required", "required");
    customInput.focus();
  } else {
    customGroup.classList.add("hidden");
    customInput.removeAttribute("required");
    customInput.value = "";
  }
}

function handleFeedbackSubmit(event) {
  event.preventDefault();

  const name = document.getElementById("fbName").value.trim();
  const email = document.getElementById("fbEmail").value.trim();
  const toolSelect = document.getElementById("fbTool").value;
  const customTool = document.getElementById("fbCustomTool").value.trim();
  const rating = document.querySelector('input[name="rating"]:checked') ? document.querySelector('input[name="rating"]:checked').value : '5';
  const message = document.getElementById("fbMessage").value.trim();

  const selectedTool = toolSelect === "other" ? (customTool || "Other (Not specified)") : toolSelect;

  const newFeedback = {
    id: "FB-" + Date.now().toString().slice(-6),
    date: new Date().toLocaleString(),
    name,
    email,
    tool: selectedTool,
    rating,
    message
  };

  let feedbackList = JSON.parse(localStorage.getItem("sriram_user_feedbacks")) || [];
  feedbackList.unshift(newFeedback);
  localStorage.setItem("sriram_user_feedbacks", JSON.stringify(feedbackList));

  const submitBtn = document.getElementById("fbSubmitBtn");
  const successBox = document.getElementById("feedbackSuccessMsg");

  submitBtn.disabled = true;
  submitBtn.innerText = "Forwarding to Desk...";

  setTimeout(() => {
    submitBtn.classList.add("hidden");
    successBox.classList.remove("hidden");
    document.getElementById("userFeedbackForm").reset();
    document.getElementById("customToolGroup").classList.add("hidden");

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<span>Send Feedback to Desk</span>`;
      submitBtn.classList.remove("hidden");
      successBox.classList.add("hidden");
    }, 4000);
  }, 1000);
}

// 12. User Authentication & Database Subsystem
function initUserAuthDB() {
  if (!localStorage.getItem("news_unpacker_users")) {
    localStorage.setItem("news_unpacker_users", JSON.stringify([]));
  }
}

async function dispatchRealEmailOtp(email, name, otp) {
  try {
    await fetch(AUTH_APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        action: "send_otp",
        email,
        name,
        otp
      })
    });
    return true;
  } catch (err) {
    console.error("OTP Delivery Network Error:", err);
    return false;
  }
}

function openAuthModal() {
  const overlay = document.getElementById("userAuthOverlay");
  if (overlay) {
    overlay.classList.remove("hidden");
    overlay.style.setProperty("display", "flex", "important");
    switchAuthView("login");
  }
}

function closeAuthModal() {
  const overlay = document.getElementById("userAuthOverlay");
  if (overlay) {
    overlay.classList.add("hidden");
    overlay.style.setProperty("display", "none", "important");
  }
}

function switchAuthView(viewName) {
  const views = ["authLoginView", "authRegisterView", "authOtpView", "authForgotView"];
  views.forEach(v => {
    const el = document.getElementById(v);
    if (el) el.classList.add("hidden");
  });

  const target = document.getElementById(
    viewName === "login" ? "authLoginView" :
    viewName === "register" ? "authRegisterView" :
    viewName === "otp" ? "authOtpView" : "authForgotView"
  );

  if (target) target.classList.remove("hidden");

  if (viewName === "otp") {
    setTimeout(() => {
      const firstBox = document.querySelector(".otp-digit-box");
      if (firstBox) {
        firstBox.focus();
        document.querySelectorAll(".otp-digit-box").forEach(b => {
          b.value = "";
          b.classList.remove("filled");
        });
        const hiddenOtp = document.getElementById("otpCodeInput");
        if (hiddenOtp) hiddenOtp.value = "";
      }
    }, 150);
  }
}

function togglePassView(fieldId, btnEl) {
  const input = document.getElementById(fieldId);
  if (!input) return;
  const isPass = input.type === "password";
  input.type = isPass ? "text" : "password";
  if (btnEl) btnEl.style.color = isPass ? "#2563eb" : "#94a3b8";
}

function validatePasswordStrength(pass) {
  const hasLength = pass.length >= 8;
  const hasUpper = /[A-Z]/.test(pass);
  const hasLower = /[a-z]/.test(pass);
  const hasNumber = /[0-9]/.test(pass);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass);

  toggleRuleClass("ruleLength", hasLength);
  toggleRuleClass("ruleUpper", hasUpper);
  toggleRuleClass("ruleLower", hasLower);
  toggleRuleClass("ruleNumber", hasNumber);
  toggleRuleClass("ruleSpecial", hasSpecial);

  return hasLength && hasUpper && hasLower && hasNumber && hasSpecial;
}

function toggleRuleClass(elemId, isValid) {
  const el = document.getElementById(elemId);
  if (el) {
    if (isValid) el.classList.add("valid");
    else el.classList.remove("valid");
  }
}

async function handleUserRegister(e) {
  if (e) e.preventDefault();
  initUserAuthDB();

  const name = document.getElementById("regName").value.trim();
  const email = document.getElementById("regEmail").value.trim().toLowerCase();
  const phone = document.getElementById("regPhone").value.trim();
  const password = document.getElementById("regPassword").value.trim();
  const confirmPassword = document.getElementById("regConfirmPassword").value.trim();
  const submitBtn = document.getElementById("regSubmitBtn");

  if (!name || !email || !phone || !password || !confirmPassword) {
    showAlert("Please fill in all the details.", "Missing Fields");
    return;
  }

  if (!validatePasswordStrength(password)) {
    showAlert("Password must be at least 8 characters long and include an Uppercase letter, Lowercase letter, Number, and Special character.", "Weak Password");
    return;
  }

  if (password !== confirmPassword) {
    showAlert("Passwords do not match. Please re-enter identical passwords.", "Password Mismatch");
    return;
  }

  const users = JSON.parse(localStorage.getItem("news_unpacker_users")) || [];
  if (users.some(u => u.email.toLowerCase() === email)) {
    showAlert("An account with this email already exists. Please Sign In.", "Account Exists");
    switchAuthView("login");
    return;
  }

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerText = "Dispatching OTP...";
  }

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  pendingRegistrationUser = { name, email, phone, password, generatedOtp: otpCode };

  await dispatchRealEmailOtp(email, name, otpCode);

  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.innerText = "Send 6-Digit Verification OTP";
  }

  const otpTarget = document.getElementById("otpTargetEmail");
  if (otpTarget) otpTarget.innerText = email;

  switchAuthView("otp");
  showAlert(`Verification code dispatched to ${email}. Please check your Inbox and Spam folder.`, "Code Dispatched");
}

// Variable to prevent double click and duplicate entries
let isVerifyingOtp = false;

async function handleOtpVerification(e) {
  if (e) e.preventDefault();
  if (isVerifyingOtp) return; // Stop duplicate execution

  const enteredOtp = document.getElementById("otpCodeInput").value.trim();
  if (!pendingRegistrationUser || enteredOtp !== pendingRegistrationUser.generatedOtp) {
    showAlert("Invalid verification code. Please check your email.", "Verification Failed");
    return;
  }

  isVerifyingOtp = true;
  const submitBtn = document.getElementById("otpVerifyBtn");
  if (submitBtn) submitBtn.disabled = true;

  // 1. Call Users_Auth Apps Script (Creates user account once)
  let generatedUserId = "SRG-" + Math.floor(10000 + Math.random() * 90000);
  try {
    const authRes = await fetch(AUTH_APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        action: "save_subscriber",
        name: pendingRegistrationUser.name,
        email: pendingRegistrationUser.email,
        phone: pendingRegistrationUser.phone
      })
    });
    const authData = await authRes.json();
    if (authData.userId) generatedUserId = authData.userId;
  } catch (err) {
    console.warn("Auth sync notice:", err);
  }

  // 2. Call Subscribers_Billing Apps Script (Adds 90-Day Free Pass to billing sheet)
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 90);

  try {
    fetch(BILLING_APPS_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        action: "add_free_pass",
        userId: generatedUserId,
        name: pendingRegistrationUser.name,
        email: pendingRegistrationUser.email,
        plan: "Pre-Release 90-Day Free Pass",
        amount: 0
      })
    });
  } catch (err) {
    console.warn("Billing sync notice:", err);
  }

  // Save in local registered users database
  const users = JSON.parse(localStorage.getItem("news_unpacker_users")) || [];
  users.push({
    userId: generatedUserId,
    name: pendingRegistrationUser.name,
    email: pendingRegistrationUser.email,
    phone: pendingRegistrationUser.phone,
    password: pendingRegistrationUser.password,
    subscribed: true,
    plan: "Pre-Release 90-Day Free Pass",
    expiryDate: expiry.toISOString(),
    articleQuotaRemaining: "unlimited"
  });
  localStorage.setItem("news_unpacker_users", JSON.stringify(users));

  // 3. LocalStorage Session Update
  activeSessionUser = {
    userId: generatedUserId,
    name: pendingRegistrationUser.name,
    email: pendingRegistrationUser.email,
    phone: pendingRegistrationUser.phone,
    subscribed: true,
    plan: "Pre-Release 90-Day Free Pass",
    expiryDate: expiry.toISOString(),
    articleQuotaRemaining: "unlimited"
  };
  localStorage.setItem("news_unpacker_active_user", JSON.stringify(activeSessionUser));

  closeAuthModal();
  updateProfileHeader();
  renderProfileDropdown();

  // 4. Trigger Flower/Confetti Shower animation on Free Pass activation
  triggerFlowerShower();

  showAlert(
    `Congratulations ${pendingRegistrationUser.name}!\n\nYour 3-Month Free VIP Pass has been activated.\nUser ID: ${generatedUserId}\nValid till: ${expiry.toLocaleDateString()}`,
    "VIP Pass Activated"
  );

  isVerifyingOtp = false;
  pendingRegistrationUser = null;
  if (submitBtn) submitBtn.disabled = false;
}

// Confetti Flower Shower Function
function triggerFlowerShower() {
  if (typeof confetti === "function") {
    const end = Date.now() + 3.5 * 1000;
    (function frame() {
      confetti({ particleCount: 6, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#2563eb', '#10b981', '#f59e0b', '#ec4899'] });
      confetti({ particleCount: 6, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#2563eb', '#f59e0b', '#10b981', '#ec4899'] });
      if (Date.now() < end) requestAnimationFrame(frame);
    }());
  }
}

async function resendRealOtp() {
  if (!pendingRegistrationUser) return;
  const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
  pendingRegistrationUser.generatedOtp = newOtp;
  await dispatchRealEmailOtp(pendingRegistrationUser.email, pendingRegistrationUser.name, newOtp);
  showAlert("A fresh OTP has been dispatched to your email.", "OTP Resent");
}

function handleUserLogin(event) {
  event.preventDefault();
  initUserAuthDB();

  const email = document.getElementById("userEmailInput").value.trim().toLowerCase();
  const pass = document.getElementById("userPasswordInput").value;

  const users = JSON.parse(localStorage.getItem("news_unpacker_users")) || [];
  const found = users.find(u => u.email === email && u.password === pass);

  if (!found) {
    showAlert("Invalid email or password. Please verify your details.", "Sign In Failed");
    return;
  }

  activeSessionUser = {
    userId: found.userId || ("SRG-" + Math.floor(10000 + Math.random() * 90000)),
    name: found.name,
    email: found.email,
    phone: found.phone || "",
    subscribed: found.subscribed || false,
    plan: found.plan || "Standard Free Account",
    expiryDate: found.expiryDate || null,
    articleQuotaRemaining: found.articleQuotaRemaining || null
  };

  localStorage.setItem("news_unpacker_active_user", JSON.stringify(activeSessionUser));
  updateProfileHeader();
  renderProfileDropdown();
  closeAuthModal();

  showAlert("Signed in successfully. AI intelligence engines are active.", "Authenticated");
}

function logoutUser() {
  activeSessionUser = null;
  localStorage.removeItem("news_unpacker_active_user");
  updateProfileHeader();
  renderProfileDropdown();
  showAlert("Signed out successfully.", "Logged Out");
}

// 13. Password Reset Workflow (Redirects to reset-password.html)
async function handlePasswordRecovery(event) {
  event.preventDefault();
  const emailInput = document.getElementById("forgotEmailInput").value.trim().toLowerCase();
  const btn = document.getElementById("resetReqSubmitBtn");

  const users = JSON.parse(localStorage.getItem("news_unpacker_users")) || [];
  const foundUser = users.find(u => u.email === emailInput);

  if (!foundUser) {
    showCustomModalAlert("Account Not Found", "No account registered with this email address. Please check and re-enter.");
    return;
  }

  btn.disabled = true;
  btn.innerText = "Sending Link...";

  const secureResetUrl = getPasswordResetUrl(emailInput);

  try {
    await fetch(AUTH_APPS_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        action: "send_reset_link",
        email: emailInput,
        name: foundUser.name,
        resetLink: secureResetUrl
      })
    });

    showCustomModalAlert(
      "Reset Link Sent!",
      `A secure password reset link has been dispatched to ${emailInput}.\nPlease click the link to set your new password.`
    );
    closeAuthModal();
  } catch (error) {
    console.error("Reset Link Error:", error);
    showCustomModalAlert("Delivery Error", "Failed to dispatch email link. Please try again.");
  } finally {
    btn.disabled = false;
    btn.innerText = "Send Reset Link (Enter ↵)";
  }
}

// 14. Profile Header and Dropdown UI
function updateProfileHeader() {
  updateProfileAvatarLetter();
}

function toggleProfileDropdown() {
  const dropdown = document.getElementById("profileDropdownCard");
  if (!dropdown) return;

  if (dropdown.classList.contains("hidden")) {
    renderProfileDropdown();
    dropdown.classList.remove("hidden");
  } else {
    dropdown.classList.add("hidden");
  }
}

function renderProfileDropdown() {
  const container = document.getElementById("profileDropdownCard");
  if (!container) return;

  if (!activeSessionUser) {
    updateProfileAvatarLetter();
    container.innerHTML = `
      <div class="profile-user-info">
        <h4>Guest User</h4>
        <p>Not Signed In</p>
        <span class="sub-status-pill sub-inactive">No Active Pass</span>
      </div>
      <div class="profile-actions-list" style="margin-top:10px;">
        <button type="button" class="profile-action-item" onclick="toggleProfileDropdown(); openAuthModal(); switchAuthView('login');" style="width:100%; border:none; cursor:pointer;">
          <span>Sign In / Create Account</span>
        </button>
      </div>
    `;
    return;
  }

  const users = JSON.parse(localStorage.getItem("news_unpacker_users")) || [];
  const fullUser = users.find(u => u.email === activeSessionUser.email) || activeSessionUser;
  const savedPhoto = localStorage.getItem("profile_photo_" + fullUser.email);
  const avatarLetter = fullUser.name ? fullUser.name.trim().charAt(0).toUpperCase() : "U";

  let daysRemaining = 0;
  let isPassActive = false;

  if (fullUser.articleQuotaRemaining === "unlimited" || fullUser.subscribed) {
    if (fullUser.expiryDate) {
      const timeDiff = new Date(fullUser.expiryDate).getTime() - new Date().getTime();
      daysRemaining = Math.max(0, Math.ceil(timeDiff / (1000 * 60 * 60 * 24)));
      isPassActive = daysRemaining > 0;
    } else if (typeof fullUser.articleQuotaRemaining === "number") {
      isPassActive = fullUser.articleQuotaRemaining > 0;
    } else {
      isPassActive = true;
    }
  }

  let passHTML = "";
  if (isPassActive) {
    const quotaInfo = typeof fullUser.articleQuotaRemaining === "number" ? `${fullUser.articleQuotaRemaining} Articles Left` : `${daysRemaining} Days Left`;
    passHTML = `
      <div style="background: #f0fdf4; border: 1.5px solid #bbf7d0; border-radius: 12px; padding: 12px; margin: 10px 0;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <strong style="color: #15803d; font-size: 0.82rem; font-weight:800;">ACTIVE PLAN</strong>
          <span style="background: #dcfce7; color: #166534; font-size: 0.72rem; font-weight: 800; padding: 2px 8px; border-radius: 10px;">VERIFIED</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: #475569;">
          <span>${fullUser.plan}</span>
          <strong style="color: #16a34a;">${quotaInfo}</strong>
        </div>
      </div>
    `;
  } else {
    passHTML = `
      <div style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 12px; margin: 10px 0;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <strong style="color: #64748b; font-size: 0.82rem; font-weight:800;">NO ACTIVE PLAN</strong>
          <span style="background: #fee2e2; color: #b91c1c; font-size: 0.72rem; font-weight: 800; padding: 2px 8px; border-radius: 10px;">INACTIVE</span>
        </div>
        <p style="font-size: 0.78rem; color: #94a3b8; margin: 6px 0 0 0;">Upgrade to continue unmetered access.</p>
      </div>
    `;
  }

  container.innerHTML = `
    <div style="display:flex; align-items:center; gap:12px; border-bottom:1px solid #f1f5f9; padding-bottom:12px;">
      <div style="position:relative; width:46px; height:46px; flex-shrink:0;">
        <div id="dropdownAvatarBox" style="width:46px; height:46px; border-radius:50%; background:#2563eb; color:#fff; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:1.2rem; overflow:hidden; border:2px solid #93c5fd;">
          ${savedPhoto ? `<img src="${savedPhoto}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">` : avatarLetter}
        </div>
        <label for="profilePhotoInput" style="position:absolute; bottom:-3px; right:-3px; background:#ffffff; border:1px solid #cbd5e1; border-radius:50%; width:20px; height:20px; font-size:11px; display:flex; align-items:center; justify-content:center; cursor:pointer;" title="Upload Photo">📷</label>
        <input type="file" id="profilePhotoInput" accept="image/*" style="display:none;" onchange="handleProfilePhotoUpload(event)">
      </div>
      <div style="overflow:hidden;">
        <h4 style="margin:0; font-size:1rem; color:#0f172a; font-weight:800; white-space:nowrap; text-overflow:ellipsis; overflow:hidden;">${fullUser.name}</h4>
        <p style="margin:2px 0 0; font-size:0.8rem; color:#64748b; white-space:nowrap; text-overflow:ellipsis; overflow:hidden;">${fullUser.email}</p>
      </div>
    </div>

    ${passHTML}

    <div style="display:flex; flex-direction:column; gap:8px;">
      <div class="profile-action-item" onclick="showUserProfileModal()" style="cursor:pointer;">
        <span>My Profile & Account</span>
      </div>

      <div class="profile-action-item" onclick="openSubscriptionPage()" style="cursor:pointer; background:#eff6ff; border-color:#bfdbfe; color:#1d4ed8; font-weight:700;">
        <span>Manage / Upgrade Subscription</span>
      </div>

      <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:8px 10px;">
        <span style="font-size:0.76rem; font-weight:700; color:#475569;">Redeem Promo Code</span>
        <div class="code-redeem-row" style="display:flex; gap:6px; margin-top:4px;">
          <input type="text" id="promoCodeInput" placeholder="ENTER CODE" style="flex:1; padding:6px 8px; border:1px solid #cbd5e1; border-radius:6px; font-size:0.82rem; text-transform:uppercase;">
          <button type="button" onclick="redeemAccessCode()" style="background:#059669; color:#fff; border:none; border-radius:6px; padding:6px 12px; font-weight:700; cursor:pointer; font-size:0.8rem;">Apply</button>
        </div>
      </div>

      <button type="button" class="profile-action-item logout-item-btn" onclick="toggleProfileDropdown(); logoutUser();" style="width:100%; border:none; cursor:pointer; margin-top:4px;">
        <span>Sign Out</span>
      </button>
    </div>
  `;

  updateProfileAvatarLetter();
}

function handleProfilePhotoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  if (file.size > 2 * 1024 * 1024) {
    showAlert("Image size should be less than 2MB.", "File Too Large");
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const base64Img = e.target.result;
    localStorage.setItem("profile_photo_" + activeSessionUser.email, base64Img);
    renderProfileDropdown();
  };
  reader.readAsDataURL(file);
}

function showUserProfileModal() {
  const users = JSON.parse(localStorage.getItem("news_unpacker_users")) || [];
  const fullUser = users.find(u => u.email === activeSessionUser.email) || activeSessionUser;
  
  const profileDetails = 
    `User ID: ${fullUser.userId || 'SRG-VERIFIED'}\n` +
    `Name: ${fullUser.name}\n` +
    `Email: ${fullUser.email}\n` +
    `Phone: ${fullUser.phone || 'N/A'}\n` +
    `Tier: ${fullUser.plan || 'Standard Account'}\n` +
    `Powered by: Sriram Groups Official`;

  showCustomModalAlert("Account Profile Details", profileDetails);
}

function openSubscriptionPage() {
  window.location.href = "subscription.html";
}

function redeemAccessCode() {
  const input = document.getElementById("promoCodeInput");
  if (!input) return;
  const val = input.value.trim().toUpperCase();

  if (val === "SRIRAM2027" || val === "NEWSVIP") {
    showCustomModalAlert("Access Pass Activated", "1 Year Unlimited VIP Subscription Pass has been activated!");
    if (activeSessionUser) {
      activeSessionUser.subscribed = true;
      activeSessionUser.plan = "1-Year VIP Pass";
      const exp = new Date();
      exp.setDate(exp.getDate() + 365);
      activeSessionUser.expiryDate = exp.toISOString();
      activeSessionUser.articleQuotaRemaining = "unlimited";
      localStorage.setItem("news_unpacker_active_user", JSON.stringify(activeSessionUser));
      renderProfileDropdown();
      updateProfileHeader();
    }
  } else {
    showCustomModalAlert("Invalid Code", "The entered access code is invalid or expired.");
  }
}

// 15. Event Poster & Floating Badge Controls
function showEventPoster() {
  const overlay = document.getElementById("eventPosterOverlay");
  const badge = document.getElementById("floatingEventBadge");
  if (overlay) {
    overlay.style.display = "flex";
    overlay.classList.remove("hidden", "minimized");
  }
  if (badge) badge.classList.add("hidden");
}

function minimizeEventPoster() {
  const overlay = document.getElementById("eventPosterOverlay");
  const badge = document.getElementById("floatingEventBadge");
  if (overlay) {
    overlay.style.display = "none";
    overlay.classList.add("hidden", "minimized");
  }
  if (badge) badge.classList.remove("hidden");
}

function maximizeEventPoster() {
  showEventPoster();
}

function triggerEventPassClaim() {
  if (activeSessionUser) {
    const now = new Date();
    const expiry = new Date();
    expiry.setDate(now.getDate() + 90);

    activeSessionUser.subscribed = true;
    activeSessionUser.plan = "Pre-Release 90-Day Free Pass";
    activeSessionUser.expiryDate = expiry.toISOString();
    activeSessionUser.articleQuotaRemaining = "unlimited";

    localStorage.setItem("news_unpacker_active_user", JSON.stringify(activeSessionUser));

    let users = JSON.parse(localStorage.getItem("news_unpacker_users")) || [];
    let idx = users.findIndex(u => u.email === activeSessionUser.email);
    if (idx !== -1) {
      users[idx].subscribed = true;
      users[idx].plan = "Pre-Release 90-Day Free Pass";
      users[idx].expiryDate = expiry.toISOString();
      users[idx].articleQuotaRemaining = "unlimited";
      localStorage.setItem("news_unpacker_users", JSON.stringify(users));
    }

    // Call Billing sheet
    try {
      fetch(BILLING_APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          action: "add_free_pass",
          userId: activeSessionUser.userId,
          name: activeSessionUser.name,
          email: activeSessionUser.email,
          plan: "Pre-Release 90-Day Free Pass",
          amount: 0
        })
      });
    } catch(e) {
      console.warn("Free pass billing sync:", e);
    }

    renderProfileDropdown();
    updateProfileHeader();
    triggerFlowerShower();

    showCustomModalAlert(
      "3-Month Free Pass Activated!",
      `Congratulations ${activeSessionUser.name}!\nYour Special 90-Day Event Pass is active until: ${expiry.toLocaleDateString()}`
    );
    return;
  }

  window.isClaimingEventPass = true;
  showCustomModalAlert(
    "Pre-Release Event",
    "Please Sign In or Create an Account to claim your 90-Day (3-Month) Free VIP Pass!"
  );
  openAuthModal();
  switchAuthView("register");
}

function claimEventPassFromPoster() {
  minimizeEventPoster();
  triggerEventPassClaim();
}

// 16. Circular Progress Metrics Animation
function animateGoldRing(ringId, textId, targetValue, circumference) {
  const ring = document.getElementById(ringId);
  const text = document.getElementById(textId);
  if (!ring || !text) return;

  const offset = circumference - (targetValue / 100) * circumference;
  ring.style.strokeDashoffset = offset;

  let currentVal = 0;
  const duration = 2000;
  const stepTime = Math.abs(Math.floor(duration / targetValue));

  const timer = setInterval(() => {
    currentVal += 1;
    text.innerText = currentVal;
    if (currentVal >= targetValue) {
      clearInterval(timer);
      text.innerText = targetValue;
      ring.classList.add("shimmer-active");
    }
  }, stepTime);
}

// 17. Master Initializer (Consolidated DOMContentLoaded)
document.addEventListener("DOMContentLoaded", () => {
  initUserAuthDB();

  // Force close login modal on initial page load
  const authModal = document.getElementById("userAuthOverlay");
  if (authModal) {
    authModal.classList.add("hidden");
    authModal.style.setProperty("display", "none", "important");
  }

  // Restore Active User Session
  const rawSession = localStorage.getItem("news_unpacker_active_user");
  if (rawSession) {
    try {
      activeSessionUser = JSON.parse(rawSession);
      updateProfileHeader();
    } catch (e) {
      localStorage.removeItem("news_unpacker_active_user");
    }
  }

  // Update Guest Quota Banner
  updateQuotaBannerUI();

  // Infinite Contact Carousel Setup
  const track = document.getElementById("contactTickerTrack");
  const viewport = document.getElementById("contactTickerViewport");
  if (track && viewport) {
    track.innerHTML += track.innerHTML;
    viewport.addEventListener("click", () => {
      viewport.classList.toggle("is-paused");
    });
  }

  // Enterprise Progress Rings Observer
  const section = document.getElementById("enterpriseSection");
  if (section) {
    let animated = false;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          animateGoldRing("ring99", "count99", 99, 440);
          animateGoldRing("ring100", "count100", 100, 440);
          animateGoldRing("ringSuccess", "countSuccess", 99, 440);
        }
      });
    }, { threshold: 0.3 });
    observer.observe(section);
  }

  // OTP 6-Digit Auto-Flow
  const otpContainer = document.getElementById("otpBoxesWrap");
  if (otpContainer) {
    const boxes = otpContainer.querySelectorAll(".otp-digit-box");
    const hiddenOtpInput = document.getElementById("otpCodeInput");

    boxes.forEach((box, index) => {
      box.addEventListener("input", (e) => {
        const val = e.target.value.replace(/[^0-9]/g, "");
        e.target.value = val;
        if (val) {
          box.classList.add("filled");
          if (index < boxes.length - 1) boxes[index + 1].focus();
        } else {
          box.classList.remove("filled");
        }
        let combined = "";
        boxes.forEach(b => combined += b.value);
        if (hiddenOtpInput) hiddenOtpInput.value = combined;
      });

      box.addEventListener("keydown", (e) => {
        if (e.key === "Backspace" && !box.value && index > 0) {
          boxes[index - 1].focus();
          boxes[index - 1].value = "";
          boxes[index - 1].classList.remove("filled");
          let combined = "";
          boxes.forEach(b => combined += b.value);
          if (hiddenOtpInput) hiddenOtpInput.value = combined;
        }
      });

      box.addEventListener("paste", (e) => {
        e.preventDefault();
        const pasteData = (e.clipboardData || window.clipboardData).getData("text").replace(/[^0-9]/g, "").slice(0, 6);
        if (pasteData) {
          pasteData.split("").forEach((char, i) => {
            if (boxes[i]) {
              boxes[i].value = char;
              boxes[i].classList.add("filled");
            }
          });
          const nextIndex = Math.min(pasteData.length, boxes.length - 1);
          boxes[nextIndex].focus();
          let combined = "";
          boxes.forEach(b => combined += b.value);
          if (hiddenOtpInput) hiddenOtpInput.value = combined;
        }
      });
    });
  }

  // URL Routing Parameters
  const urlParams = new URLSearchParams(window.location.search);
  const targetWorkspace = urlParams.get("workspace");
  const targetAction = urlParams.get("action");

  if (targetWorkspace) {
    setTimeout(() => openWorkspace(targetWorkspace), 150);
  }

  // Only open login modal if explicitly requested in URL query
  if (targetAction === "login") {
    setTimeout(() => {
      openAuthModal();
      switchAuthView("login");
    }, 150);
  }

  // Show Launch Poster for Non-Subscribers After 1 Second
  if (!activeSessionUser || !activeSessionUser.subscribed) {
    setTimeout(() => {
      showEventPoster();
    }, 1000);
  }

  // Close dropdown on outside click
  document.addEventListener("click", (e) => {
    const wrapper = document.querySelector(".user-profile-wrapper");
    const dropdown = document.getElementById("profileDropdownCard");
    if (dropdown && !dropdown.classList.contains("hidden")) {
      if (wrapper && !wrapper.contains(e.target)) {
        dropdown.classList.add("hidden");
      }
    }
  });
});
