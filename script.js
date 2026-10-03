const API_KEY = "AQ.Ab8RN6JfkjIq56mJkQkOVOdMxJ79g6EkNtBifIKOTbxHx1nlUA";

let isSpeaking = false;
let currentLanguage = "en-US";
let currentToolMode = "unpack_news";
let currentVoiceUtterance = null;

// Complete 24-Tool Comprehensive Configuration Registry (Pure English - Zero Emojis)
const toolConfigMap = {
  // 1. Core Engines
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
    lead: "The Fact and Bias Check engine operates as an automated linguistic and analytical audit layer across raw media streams, targeting the systemic distortions commonly introduced between field reporting and digital publication. Rather than evaluating subjective ideology, the engine inspects the structural integrity of the prose to detect how narrative framing diverges from underlying empirical reality.",
    box1: "Media bias often operates not through outright falsehoods, but through selective filtering. The engine cross-references the input text against baseline timeline data to identify",
    box2: "Subjective framing relies on semantically charged vocabulary to provoke emotional bias before the reader evaluates the facts.",
    aiPrompt: "Audit this text for misinformation, partisan slant, unverified assertions, and emotional framing. Explicitly outline what is verifiable evidence versus what is subjective commentary."
  },
  eli5: {
    title: "Explain Like I'm 5",
    desc: "Break down ultra-complex financial regulations, court verdicts, and policies into simple prose.",
    placeholder: "Paste complex regulatory policies, court judgments, or economic budgets...",
    btnText: "Explain in Simple Lines",
    badge: "JARGON DECONSTRUCTION AND ANALOGY SYNTHESIS",
    lead: "The Explain Like I'm 5 (ELI5) engine operates as an automated semantic simplification and cognitive-accessibility layer within News Unpacker. Rather than merely truncating sentences, the engine actively dismantles complex legal, economic, and institutional dialect, rebuilding the core informational premise into intuitive, plain-language concepts grounded in everyday real-world analogies.",
    box1: "Deconstructs intricate legislative bills, regulatory filings, and executive mandates into direct, cause-and-effect statements. Instead of reciting regulatory codes, the system maps out how a clause operates in physical practice.",
    box2: "Transforms dense geopolitical treaties, environmental pacts, and constitutional amendments into clean conceptual models, dramatically accelerating retention and syllabus coverage.",
    aiPrompt: "Explain this topic as if explaining to a 5-year-old child or beginner. Convert dense jargon, statutory clauses, or high-tech concepts into crystal-clear everyday analogies without losing accuracy."
  },
  bullet_points: {
    title: "Bullet Points & Key Briefs",
    desc: "Condense multi-page write-ups and lengthy reads into sharp, 60-second executive summaries.",
    placeholder: "Paste long investigative journalism, policy documents, or press releases...",
    btnText: "Extract Bullet Points",
    badge: "HIGH-SPEED EXECUTIVE EXTRACTION",
    lead: "The Bullet Points & Key Briefs engine acts as an information distillation and structured extraction pipeline within News Unpacker. It converts dense, multi-page journalistic prose into sharp, skimmable takeaway lists without sacrificing crucial facts or contextual nuance.",
    lead2: "<strong>80% Reading-Time Compression:</strong> Cuts reading duration by up to 80% by eliminating repetitive contextual restatements, rhetorical questions, and emotional embellishments.",
    box1: "Cuts reading time by 80% while retaining critical details.",
    box2: "Instant clarity for executives, professionals, and students.",
    aiPrompt: "Condense this document into 4 to 5 high-priority, crisp, actionable bullet points highlighting metrics, dates, and core resolutions."
  },

  // 2. Specialized Processing Utilities
  news_to_speech: {
    title: "News to Speech Engine",
    desc: "Convert lengthy news dispatches, reports, and circulars into natural spoken audio.",
    placeholder: "Paste articles, memos, or circulars to convert into speech...",
    btnText: "Convert to Speech",
    badge: "NEURAL ACOUSTIC CADENCE AND SPEECH OPTIMIZATION",
    lead: "The News to Speech Engine transforms dense news articles, reports, and editorial analysis into clear, natural audio briefings. Featuring smart acronym expansion and flexible playback speeds (1.25x to 2.0x), it eliminates screen fatigue and delivers a seamless, hands-free listening experience designed for commuters and multitaskers.",
    box1: "Hands-free listening optimized for commutes and multitasking.",
    box2: "Eliminates screen fatigue while keeping you 100% updated.",
    aiPrompt: "Format and optimize this news text for spoken acoustic delivery. Smooth awkward punctuation, expand statutory abbreviations, and create a fluent, broadcast-ready script."
  },
  short_to_depth: {
    title: "Short News to In-Depth Converter",
    desc: "Expand brief social media updates and one-line breaking alerts into comprehensive analytical briefs.",
    placeholder: "Paste 1-2 sentence breaking alerts, flash news tweets, or wire snippets...",
    btnText: "Unpack to Deep Story",
    badge: "CONTEXTUAL EXPANSION AND HISTORICAL CORRELATION",
    lead: "The Short News to In-Depth Converter transforms brief alerts and surface-level notifications into comprehensive, structured contextual dossiers. Powered by advanced AI processing, the engine automatically correlates current breaking headlines with historical institutional milestones, establishing clear timeline precedents and analyzing broader geopolitical implications.",
    lead2: "By bridging the gap between quick updates and deep analysis, the tool eliminates speculative noise and delivers a 360-degree perspective on complex events. This enables readers to quickly understand not just what happened, but the underlying root causes, long-term impact, and true significance behind sensational headlines.",
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
    lead: "The News Translator Engine is an AI-powered system designed to transpose news coverage seamlessly across regional languages without losing accuracy or nuance. By utilizing contextual mapping, the engine bypasses the awkwardness of standard machine translations, ensuring that official ranks, administrative terms, and subtle factual nuances remain intact across different languages.",
    box1: "Maintains absolute semantic neutrality across languages.",
    box2: "Built on the principle of absolute semantic neutrality, the engine strips away translation bias and linguistic distortions. The result is a natural, precise, and culturally accurate translation that delivers consistent, reliable facts regardless of the target language.",
    aiPrompt: "Translate this news report accurately while strictly preserving journalistic neutrality, official titles, and administrative terminology."
  },

  // 3. Specialized Domain Analyzers
  politics: {
    title: "Political News Decoder",
    desc: "Analyze electoral dynamics, legislative amendments, and public policy impacts with strict neutrality.",
    placeholder: "Paste election speeches, parliamentary bills, cabinet resolutions, or political reporting...",
    btnText: "Analyze Political Points",
    badge: "LEGISLATIVE DECODING AND CIVIC POLICY INTELLIGENCE",
    lead: "The Political News Decoder is an advanced AI utility designed to cut through political noise by filtering out campaign rhetoric, media spin, and partisan bias. By evaluating objective governance metrics, the engine strips away sensationalized political claims to highlight what truly matters—statutory consequences, real policy changes, and direct civic impact.",
    lead2: "Built on the principle of absolute political neutrality, this tool benchmark real policy execution against original political promises. Instead of focusing on ideological debates or party narratives, it provides citizens, researchers, and voters with a clear, fact-based breakdown of how legislative decisions actually affect governance and everyday public life.",
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
    lead: "The Business & Economy Decoder is an advanced AI utility that decodes complex fiscal indices, corporate profit-and-loss metrics, and regulatory tariffs into straightforward commercial takeaways. Driven by core principles that strictly isolate revenue metrics, net debt, and forward guidance, the engine eliminates financial jargon to connect broader monetary policy directly to consumer purchasing power and real-world market impacts.",
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
    box1: "The Technology & AI Decoder simplifies complex machine learning breakthroughs, semiconductor architectures, and platform regulatory shifts into clear, accessible insights. Grounded in core System Principles, the engine cuts through tech industry jargon and marketing hype to focus strictly on real-world utility and practical applications.",
    box2: "From an Objective Outcome perspective, the tool goes beyond surface-level features to evaluate critical user privacy implications and emerging cybersecurity vectors. This ensures tech enthusiasts, developers, and everyday users understand the true impact, security risks, and strategic significance of new technologies.",
    aiPrompt: "Deconstruct this technology/AI announcement. Highlight practical consumer/enterprise utility, architectural benchmarks, and data security or privacy impacts without marketing fluff."
  },
  crime_legal: {
    title: "Crime & Legal Updates",
    desc: "Clarifies court verdicts, constitutional clauses, charges, and ongoing trials objectively.",
    placeholder: "Paste court orders, police FIR filings, legal arguments, or statutory notices...",
    btnText: "Clarify Legal Points",
    badge: "JURISPRUDENCE AND STATUTORY CLARITY",
    lead: "The Crime & Legal Updates engine translates complex multi-clause court orders, statutory charges, and constitutional rulings into plain, neutral language. By clarifying ongoing trials and judicial verdicts without biased interpretations, it ensures complex legal proceedings are easy for anyone to understand.",
    lead2: "Grounded in strict analytical principles, the system strips away courtroom melodrama and media sensationalism. It isolates procedural facts to deliver an accurate, objective summary of the legal process.",
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
    lead: "The Education & Career Intelligence engine transforms lengthy educational gazettes, official exam notifications, and recruitment announcements into structured, actionable takeaways. By filtering out administrative jargon and unnecessary clutter, the system pinpoints key eligibility criteria, crucial syllabus milestones, cutoff marks, and upcoming exam timelines. Grounded in principles designed to maximize preparation efficiency, it eliminates confusion for students and job seekers, delivering a clear roadmap for academic success and career growth.",
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
    lead: "The Health & Lifestyle Verification engine distinguishes clinical empirical evidence from commercial wellness trends and pseudo-scientific marketing claims. By cross-checking sample sizes, peer-reviewed data, and verified medical trials, the system strips away unverified hype to summarize actionable public health guidelines cleanly and objectively.",
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
    lead: "The Entertainment & Box Office engine provides a clean, fact-based overview of the entertainment industry by focusing strictly on commercial distribution deals, audited box-office gross receipts, and intellectual property production rights.",
    lead2: "Rather than relying on unverified claims, the platform analyzes industry-standard financial metrics and trade reports to present precise, data-backed insights into theatrical performances and global streaming distribution models.",
    box1: "Under its core System Principles, the engine cross-verifies financial performance, domestic and international revenue figures, and official studio release schedules directly from authenticated trade sources.",
    box2: "Driven by its clear Objective Outcome, the system filters out unconfirmed celebrity rumors, promotional fluff, and speculative tabloid gossip, delivering a purely objective breakdown of the entertainment business.",
    aiPrompt: "Summarize this entertainment dispatch focusing strictly on audited box office revenue, distribution agreements, technical credits, and verified industry milestones without gossip."
  },
  sports: {
    title: "Sports Analytics & Briefs",
    desc: "Condenses match analyses, tournament standings, stats, and rule changes.",
    placeholder: "Paste match reports, tournament points tables, athlete statements, or rule updates...",
    btnText: "Extract Sports Briefs",
    badge: "ATHLETIC METRICS AND TOURNAMENT AUDIT",
    lead: "The Sports Analytics & Briefs engine delivers pure, data-driven match intelligence by isolating tactical formations, verified scorelines, penalty statistics, and key performance metrics.",
    lead2: "It cuts through fan commentary and emotional media bias to present an objective breakdown of player performance, team strategies, and game outcomes.",
    box1: "Under its core System Principles, the engine mathematically evaluates complex qualification scenarios, group table standings, and tournament progression probabilities using real-time match data.",
    box2: "Driven by its Objective Outcome, the system summarizes post-match press conferences factually, filtering out managerial mind games, sensational quotes, and speculative transfer rumors.",
    aiPrompt: "Synthesize this sports dispatch into a factual analytical brief. Detail the official final score, critical tactical turnarounds, individual statistics, and tournament standings."
  },
  environment: {
    title: "Weather & Climate Intelligence",
    desc: "Decodes meteorological forecasts, pollution indexes, and environment shifts.",
    placeholder: "Paste meteorological bulletins, Air Quality Index advisories, or disaster circulars...",
    btnText: "Decode Climate Alert",
    badge: "METEOROLOGICAL FORECASTING AND AQI ADVISORY",
    lead: "The Weather & Climate Intelligence engine converts complex atmospheric telemetry, satellite updates, cyclone warnings, and air pollution indices into clear, actionable safety precautions.",
    lead2: "It translates raw meteorological data into simple, everyday advisories so that communities and travelers can quickly make informed decisions during changing weather conditions.",
    box1: "Under its core System Principles, the engine pinpoints clear localized impact coordinates, mapping precise risk zones, rainfall intensity, and storm trajectories for specific areas.",
    box2: "Driven by its Objective Outcome, the system strips panic-inducing adjectives and clickbait headlines from weather reporting, ensuring public updates remain calm, fact-based, and practical",
    aiPrompt: "Break down this weather or climate advisory. State the affected geographic coordinates, air quality metrics, rainfall/wind projections, and official safety precautions clearly."
  },
  kids: {
    title: "Kids & Students Mode",
    desc: "Safe, educational news breakdowns with age-appropriate vocabulary and no graphic elements.",
    placeholder: "Paste news stories to reformat for children or classroom discussion...",
    btnText: "Reformat for Students",
    badge: "EDUCATIONAL ADAPTATION AND SAFE CONTENT SHIELD",
    lead: "The Kids & Students Mode engine restructures complex national and global developments using age-appropriate educational vocabulary. Designed to foster critical thinking and intellectual curiosity, it presents current events in a safe, constructive way that informs young minds without causing anxiety or distress.",
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
    lead: "The Hard News Analyzer engine focuses strictly on the core fundamental pillars of journalism: Who, What, When, Where, Why, and How.",
    lead2: "It eliminates subjective fluff and filler text to ensure that every breaking update delivers pure, unadulterated facts right from the first sentence.",
    box1: "Under its core System Principles, the engine strips away narrative tangents, background bloat, and personal author opinions to isolate the core event..",
    box2: "Driven by its Objective Outcome, the system rapidly presents the immediate, verifiable ground status so readers can grasp crucial developments in seconds.",
    aiPrompt: "Perform a hard news forensic analysis on this text. Deliver a strictly factual account answering Who, What, Where, When, and Why without editorializing or filler."
  },
  local: {
    title: "Local News",
    desc: "Community reports, civic issues, regional events, and city-level updates simplified.",
    placeholder: "Paste municipal notices, local collectorate circulars, or neighborhood reports...",
    btnText: "Extract Civic Points",
    badge: "MUNICIPAL GOVERNANCE AND REGIONAL DISPATCH",
    lead: "The Local News engine focuses strictly on essential hyper-local updates, including municipal water and power schedules, road closures, zonal zoning notices, and district collectorate orders.",
    lead2: "It cuts through broad national coverage to prioritize civic developments that directly affect your daily routine and neighborhood living conditions.",
    box1: "Under its core System Principles, the engine details immediate neighborhood repercussions, ensuring citizens are promptly alerted to infrastructure changes and municipal service shifts.",
    box2: "Driven by its Objective Outcome, the system translates complex local administrative bureaucracy into simple, actionable public notices for everyday residents.",
    aiPrompt: "Summarize this local civic news item. Highlight the affected municipal wards, timeline of infrastructure disruptions, official grievance contacts, and citizen advisories."
  },
  soft_news: {
    title: "Soft News",
    desc: "Feature stories, human-interest narratives, culture, and positive lifestyle updates.",
    placeholder: "Paste cultural features, human achievements, arts, or lifestyle profiles...",
    btnText: "Extract Feature Story",
    badge: "CULTURAL PROFILE AND HUMAN-INTEREST SYNTHESIS",
    lead: "The Soft News engine preserves constructive, inspiring narrative arcs while removing clickbait padding, sensational headlines, and excessive commercial fluff.",
    lead2: "It highlights positive human-interest stories, cultural developments, and community achievements without compromising journalistic substance.",
    box1: "Under its core System Principles, the engine spotlights community innovation, social impact, and human resilience across various fields.",
    box2: "Driven by its Objective Outcome, the system delivers an engaging, balanced reading flow that keeps audiences informed, inspired, and uplifted.",
    aiPrompt: "Condense this feature/soft news piece into an engaging human-interest summary. Emphasize cultural elements, inspiring initiatives, and community impact smoothly."
  },
  editorial: {
    title: "Opinion & Editorial",
    desc: "Decodes columns, expert commentaries, and subjective viewpoints from hard facts.",
    placeholder: "Paste editorial op-eds, guest columns, or political think-tank essays...",
    btnText: "Dissect Editorial Stance",
    badge: "RHETORICAL DISSECTION AND THESIS EVALUATION",
    lead: "The Opinion & Editorial engine isolates the author's primary thesis, examines supporting data points, and spotlights counter-arguments. Driven by core principles that distinguish personal ideological stances from baseline facts, the system evaluates whether the writer's final conclusions are logically substantiated by verifiable evidence.",
    box1: "Distinguishes personal ideological stances from baseline facts.",
    box2: "Evaluates whether conclusions are logically substantiated.",
    aiPrompt: "Dissect this editorial column. Identify the author's central thesis, evaluate the factual evidence cited, identify logical fallacies or biases, and summarize the alternative perspective."
  },
  geo_scope: {
    title: "Local vs. International Scope",
    desc: "Stories framed by geographic scope, comparing grassroots local impacts with global geopolitics.",
    placeholder: "Paste foreign policy updates, bilateral treaties, or global trade reports...",
    btnText: "Compare Local and Global Scope",
    badge: "GEOPOLITICAL MAPPING AND GRASSROOTS COMPARISON",
    lead: "The Local vs. International Scope engine bridges macro-level global events with everyday micro-level realities, connecting international treaties, geopolitical shifts, and global trade tensions directly to domestic retail prices, supply chain shifts, and regional employment rates.",
    lead2: "It eliminates abstract geopolitical jargon to explain how decisions made in foreign capitals or international summits directly affect household budgets, local job markets, and regional industry dynamics.",
    box1: "Under its core System Principles, the system traces complex international diplomatic cause-and-effect paths, mapping out how cross-border policy changes, tariffs, and global commodity fluctuations cascade down through domestic supply networks.",
    box2: "Driven by its Objective Outcome, the engine calculates precise local grassroots consequences, providing citizens, local business owners, and analysts with a clear, data-driven picture of how global policy impacts their daily life and financial stability.",
    aiPrompt: "Analyze this story through a dual lens: first, explain the broad international diplomatic or macroeconomic reality; second, detail the direct ground-level impact on local citizens and businesses."
  },
  devotional: {
    title: "Devotional & Cultural Traditions",
    desc: "Horoscopes, festival highlights, and worship rituals presented with clarity and respect.",
    placeholder: "Paste temple trust circulars, festival schedules, or traditional commentary...",
    btnText: "Summarize Sacred Traditions",
    badge: "CULTURAL HERITAGE AND FESTIVAL CHRONOLOGY",
    lead: "The Devotional & Cultural Traditions engine extracts festival dates, temple trust crowd advisories, ritual timings, and philosophical significance neutrally. It cuts through sensationalized coverage and commercial clutter to provide worshippers and cultural enthusiasts with reliable, structured information about spiritual events and traditional heritage.",
    box1: "Under its core System Principles, the platform focuses on authentic cultural and historical traditions, cross-verifying event schedules, scriptural contexts, and heritage significance directly from official administrative bodies, temple trusts, and recognized scholars without imposing theological bias.",
    box2: "Driven by its Objective Outcome, the system details operational visitor guidelines, queue management updates, entry regulations, and precise ritual timelines. This translates complex pilgrimage logistics into clear, actionable updates that ensure safe, respectful, and well-planned visits for devotees and tourists alike.",
    aiPrompt: "Summarize this devotional and cultural text with dignity. Clearly outline the festival muhurat/timings, historical or philosophical significance, and temple visitor guidelines."
  },
  travel: {
    title: "Travel & Tourism",
    desc: "Global travel advisories, route policies, eco-tourism insights, and destination updates.",
    placeholder: "Paste airline circulars, immigration updates, tourism advisories, or route maps...",
    btnText: "Extract Travel Advisory",
    badge: "TRANSIT LOGISTICS AND IMMIGRATION CLEARANCE",
    lead: "The Travel & Tourism engine isolates visa protocol revisions, airline baggage regulations, transit advisories, and destination safety updates. It filters through promotional travel blogs and commercial fluff to provide travelers with verified, accurate operational details for seamless journeys.",
    lead2: "It streamlines cross-border travel planning by synthesizing complex international travel policies, customs mandates, and consular updates into clear, actionable advice.",
    box1: "Under its core System Principles, the system lists official entry requirements, passport validity norms, visa-on-arrival mandates, and vaccination guidelines directly from government portals and aviation authorities.",
    box2: "Driven by its Objective Outcome, the engine highlights real-time route disruptions, airport security delays, regional transport schedules, and localized safety advisories, ensuring travelers can navigate transit risks effectively.",
    aiPrompt: "Extract the actionable travel takeaways from this advisory. Detail the visa or immigration criteria, transit disruption schedules, safety notices, and traveler recommendations."
  }
};

// 1. Open Workspace and Adapt Dynamically to Selected Tool Mode
function openWorkspace(toolKey) {
  stopVoice();

  // Normalize key
  let normalizedKey = toolKey ? toolKey.toLowerCase() : "unpack_news";
  if (normalizedKey === "summary") normalizedKey = "unpack_news";

  currentToolMode = normalizedKey;
  const config = toolConfigMap[currentToolMode] || toolConfigMap.unpack_news;

  // Hide other views
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

  // Set Workspace Headers & Placeholder
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

  // Show speed controls only for News to Speech mode
  const speedContainer = document.getElementById("speechSpeedContainer");
  if (speedContainer) {
    if (currentToolMode === "news_to_speech") {
      speedContainer.classList.remove("hidden");
    } else {
      speedContainer.classList.add("hidden");
    }
  }

  // Clear previous output card
  const outputCard = document.getElementById("outputCard");
  if (outputCard) outputCard.classList.add("hidden");

  // Inject Dynamic System Architecture and AI Workflow Below Button
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
        
        <!-- 1st Paragraph -->
        <p style="color:#475569; font-size:0.95rem; line-height:1.65; margin-bottom:12px;">
          ${config.lead}
        </p>

        <!-- 2nd Paragraph (ఒకవేళ lead2 ఉంటేనే ఇక్కడ డిస్‌ప్లే అవుతుంది) -->
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

// 2. Primary Processing Pipeline with Gemini API
async function startProcessing() {
  const inputEl = document.getElementById("newsInput");
  const text = inputEl ? inputEl.value.trim() : "";

  if (!text) {
    showAlert("Please paste the news article or report before processing.", "Input Required");
    return;
  }

  const loader = document.getElementById("loader");
  const loaderText = document.getElementById("loaderText");
  const outputCard = document.getElementById("outputCard");
  const processBtn = document.getElementById("processBtn");
  const newsTitle = document.getElementById("newsTitle");
  const newsBody = document.getElementById("newsBody");
  const charCount = document.getElementById("charCount");

  stopVoice();
  if (loader) loader.classList.remove("hidden");
  if (outputCard) outputCard.classList.add("hidden");
  if (processBtn) processBtn.disabled = true;

  const config = toolConfigMap[currentToolMode] || toolConfigMap.unpack_news;
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

    if (newsTitle) newsTitle.innerText = result.title;
    if (newsBody) {
      if (currentToolMode === "bullet_points" || currentToolMode === "education") {
        const bulletLines = result.content.split("\n").filter(l => l.trim().length > 0);
        newsBody.innerHTML = `
          <ul style="padding-left:20px; line-height:1.75; color:#334155;">
            ${bulletLines.map(line => `<li>${escapeHTML(line.replace(/^[•\-\*]\s*/, ''))}</li>`).join('')}
          </ul>
        `;
      } else if (currentToolMode === "news_to_speech") {
        newsBody.innerHTML = `
          <p style="color:#059669; font-weight:700; margin-bottom:10px;">Acoustic Speech Synthesis Ready. Click 'Listen' above to play audio.</p>
          <p style="line-height:1.65; color:#334155;">${escapeHTML(result.content)}</p>
        `;
      } else {
        newsBody.innerHTML = `<p style="line-height:1.65; color:#334155;">${escapeHTML(result.content)}</p>`;
      }
    }

    if (charCount) {
      charCount.innerText = `Character count: ${result.content.length} | Mode: ${config.btnText}`;
    }

    if (loader) loader.classList.add("hidden");
    if (outputCard) outputCard.classList.remove("hidden");
    if (processBtn) processBtn.disabled = false;

    outputCard.scrollIntoView({ behavior: "smooth", block: "nearest" });

  } catch (error) {
    if (loader) loader.classList.add("hidden");
    if (processBtn) processBtn.disabled = false;
    showAlert("Processing error: " + error.message, "Execution Error");
  }
}

// 3. Gemini API Caller (Updated to gemini-3.8-flash)
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

// 4. Summarization Shortener
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

// 5. Speech Synthesis with Playback Speed Control
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

  // Check Playback Speed Selection
  const speedSelect = document.getElementById("playbackSpeedSelect");
  if (speedSelect) {
    utterance.rate = parseFloat(speedSelect.value) || 1.0;
  } else {
    utterance.rate = 1.0;
  }

  utterance.onend = () => stopVoice();
  utterance.onerror = () => stopVoice();

  window.speechSynthesis.speak(utterance);
  isSpeaking = true;
  if (voiceBtn) voiceBtn.innerText = "Stop";
}

function stopVoice() {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
  isSpeaking = false;
  const voiceBtn = document.getElementById("voiceBtn");
  if (voiceBtn) voiceBtn.innerText = "Listen";
}

// 6. Quick Translation Hub
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
  const translateUrl = `https://translate.google.com/?sl=auto&tl=en&text=${encodedText}&op=translate`;
  window.open(translateUrl, "_blank");
}

// 7. Navigation & Section Switches
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

function clearOutput() {
  const outputCard = document.getElementById("outputCard");
  const inputEl = document.getElementById("newsInput");
  if (outputCard) outputCard.classList.add("hidden");
  if (inputEl) inputEl.value = "";
  stopVoice();
}

// 8. Custom Alerts & Dialogs
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

function escapeHTML(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// 9. Feedback Management & Smooth Scroll
function scrollToFeedback() {
  const fbEl = document.getElementById("feedbackSection");
  if (fbEl) {
    fbEl.scrollIntoView({ behavior: "smooth", block: "center" });

    const card = fbEl.querySelector(".feedback-card");
    if (card) {
      card.style.borderColor = "#dc2626";
      card.style.boxShadow = "0 0 30px rgba(220, 38, 38, 0.35)";

      setTimeout(() => {
        card.style.borderColor = "#fee2e2";
        card.style.boxShadow = "0 10px 30px rgba(220, 38, 38, 0.07)";
      }, 2000);
    }
  }
}

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
    name: name,
    email: email,
    tool: selectedTool,
    rating: rating,
    message: message
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

// 10. Contact Carousel & Infinite Track
document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("contactTickerTrack");
  const viewport = document.getElementById("contactTickerViewport");

  if (track && viewport) {
    track.innerHTML += track.innerHTML;
    viewport.addEventListener("click", () => {
      viewport.classList.toggle("is-paused");
    });
  }

  // Enterprise Progress Rings
  const section = document.getElementById("enterpriseSection");
  if (section) {
    let animated = false;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          animateGoldRing("ring99", "count99", 99, 440);
          animateGoldRing("ring100", "count100", 100, 440);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(section);
  }
});

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
// Enterprise Progress Rings
  const section = document.getElementById("enterpriseSection");
  if (section) {
    let animated = false;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          animateGoldRing("ring99", "count99", 99, 440);
          animateGoldRing("ring100", "count100", 100, 440);
          animateGoldRing("ringSuccess", "countSuccess", 99, 440); // Kotha metric animation
        }
      });
    }, { threshold: 0.3 });

    observer.observe(section);
  }