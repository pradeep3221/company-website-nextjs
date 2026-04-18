"use client";

import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";

type FAQItem = {
  question: string;
  answer: string;
};

type ChatMessage = {
  role: "assistant" | "user";
  content: string;
};

const LOGOS = [
  "Meridian Capital",
  "◆",
  "Halcyon Systems",
  "◆",
  "Verdant Labs",
  "◆",
  "Axiom Ventures",
  "◆",
  "Orobos Tech",
  "◆",
  "Felicitas Group",
  "◆",
  "Tessera Health",
  "◆",
  "Stratum Finance",
  "◆",
];

const FAQs: FAQItem[] = [
  {
    question: "How does billing work?",
    answer:
      "Origin is free forever. Meridian is billed monthly or annually (save 20% on annual). Zenith is negotiated on a custom contract. All plans can be upgraded, downgraded, or cancelled at any time with no lock-in.",
  },
  {
    question: "Can I export my data?",
    answer:
      "Absolutely. You own your data. Export models, training data, inference logs, and analytics at any time via the dashboard or our REST API. We support standard formats including ONNX, PMML, and Parquet.",
  },
  {
    question: "What LLMs does Synthara support?",
    answer:
      "Our Synthesis Engine supports any foundation model — GPT-4o, Claude, Gemini, Llama, Mistral, and custom fine-tuned models. Swap providers with a single config change; our abstraction layer handles the rest.",
  },
  {
    question: "Is there a self-hosted option?",
    answer:
      "Yes. Our Zenith tier includes dedicated VPC and on-premise deployment options. Synthara runs on any Kubernetes cluster — AWS, GCP, Azure, or bare metal. Talk to sales for architecture guidance.",
  },
  {
    question: "How do you handle data privacy?",
    answer:
      "Your data never trains shared models. All inference runs in isolated environments with AES-256 encryption at rest and TLS 1.3 in transit. We're SOC 2 Type II, ISO 27001, and EU AI Act compliant. See our Trust section for details.",
  },
  {
    question: "What kind of support do you offer?",
    answer:
      "Origin includes community forums and docs. Meridian adds priority email/chat with a 4-hour SLA. Zenith includes a dedicated Customer Success Manager available 24/7 plus custom onboarding and training sessions.",
  },
];

const CHAT_SUGGESTIONS = [
  "Show me Meridian vs Zenith",
  "How does Synthara handle drift?",
  "Can we deploy in our own VPC?",
];

const NAV_ITEMS = [
  { href: "#capabilities", label: "Capabilities" },
  { href: "#demo", label: "Demo" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
  { href: "#trust", label: "Trust" },
  { href: "#resources", label: "Resources" },
];

const DEMO_PRESETS = [
  { label: "Summarize risks", prompt: "Summarize the key risks in our Q3 earnings data" },
  { label: "Anomaly detection", prompt: "Detect anomalies in server latency over the past 24h" },
  { label: "Churn prediction", prompt: "Generate a classification model for customer churn" },
  { label: "Explainability", prompt: "Explain the reasoning behind prediction ID #4821" },
];

const TRUST_ITEMS = [
  {
    icon: "🔍",
    title: "Explainable Decisions",
    description:
      "Every prediction includes a reasoning trace. Understand why a model chose a specific output — drill into feature attribution, confidence scores, and decision boundaries in real time.",
  },
  {
    icon: "🛡️",
    title: "Data Governance",
    description:
      "Your data never trains shared models. All inference runs in isolated environments with AES-256 encryption at rest and TLS 1.3 in transit. SOC 2 Type II and ISO 27001 certified.",
  },
  {
    icon: "⚖️",
    title: "Bias Monitoring",
    description:
      "Continuous fairness audits across protected attributes. Automated alerts when model outputs deviate from expected distributions. Quarterly third-party bias reports published openly.",
  },
  {
    icon: "👤",
    title: "Human-in-the-Loop",
    description:
      "Override any autonomous action at any time. Set confidence thresholds that escalate to human review. Your team always retains final authority over every decision.",
  },
  {
    icon: "📋",
    title: "Model Cards & Documentation",
    description:
      "Every deployed model ships with a standardized model card — training data sources, known limitations, intended use cases, and performance benchmarks across demographic groups.",
  },
  {
    icon: "🔓",
    title: "Open Audit Trail",
    description:
      "Full immutable logs of every inference, retraining event, and configuration change. Export anytime for regulatory compliance. GDPR Article 22 and EU AI Act ready.",
  },
];

const RESOURCE_ITEMS = [
  {
    type: "White Paper",
    title: "The Architecture of Reliable AI: Synthesis Engine Deep Dive",
    description: "A technical exploration of how our RAG-augmented reasoning layer achieves 99.4% accuracy while maintaining sub-15ms latency at scale.",
    meta: "12 min read",
    date: "April 2026",
  },
  {
    type: "Case Study",
    title: "How Stratum Finance Replaced 3 Engineers with Observability Suite",
    description: "Stratum's AI team shares how automated drift detection and explainability dashboards cut their model maintenance burden by 65%.",
    meta: "8 min read",
    date: "March 2026",
  },
  {
    type: "Engineering Blog",
    title: "Building Fair AI: Our Approach to Bias Detection & Mitigation",
    description: "An inside look at Synthara's fairness pipeline — from training data audits to continuous production monitoring across protected attributes.",
    meta: "10 min read",
    date: "February 2026",
  },
];

const PROCESS_ITEMS = [
  {
    title: "Connect Your Sources",
    description: "Ingest from any data source — warehouses, streams, APIs, documents. Synthara's universal connectors normalize and index your data automatically, building the foundation for intelligence.",
  },
  {
    title: "Configure Intelligence",
    description: "Define your reasoning objectives, choose model architectures, and set evaluation criteria. Our guided studio removes the friction of ML engineering without removing the control you need.",
  },
  {
    title: "Deploy to the Edge",
    description: "One-click deployment to our globally distributed inference infrastructure. Your model is live, load-balanced, and protected behind enterprise-grade security within minutes.",
  },
  {
    title: "Observe & Evolve",
    description: "Real-time telemetry captures every signal. Automatic retraining triggers on drift. Your intelligence compounds over time — getting sharper the more it runs in production.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Synthara didn't just improve our model accuracy — it completely changed how our team thinks about intelligence. The observability suite alone saved us three full-time engineers worth of manual work.",
    author: "Rohan Nair",
    role: "Chief AI Officer · Stratum Finance",
    initials: "RN",
    color: "rgba(0,200,255,0.15)",
    textColor: "var(--gold)",
    tall: true,
  },
  {
    quote:
      "Went from data to deployed prediction model in under a day. The synthesis engine is genuinely unlike anything else in the market.",
    author: "Layla Mansouri",
    role: "VP Engineering · Tessera Health",
    initials: "LM",
    color: "rgba(196,110,245,0.15)",
    textColor: "#c46ef5",
    tall: false,
  },
  {
    quote:
      "The agents capability is production-grade. We replaced an entire orchestration stack with Synthara in six weeks. Support team is exceptional — they treated us like partners, not tickets.",
    author: "Kai Sato",
    role: "CTO · Halcyon Systems",
    initials: "KS",
    color: "rgba(74,222,128,0.12)",
    textColor: "#4ade80",
    tall: false,
  },
];

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chatMessagesRef = useRef<HTMLDivElement | null>(null);
  const [isLight, setIsLight] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [annualPricing, setAnnualPricing] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [showTop, setShowTop] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [activeNav, setActiveNav] = useState("#capabilities");
  const [newsletterDone, setNewsletterDone] = useState(false);
  const [loaderDone, setLoaderDone] = useState(false);
  const [showMobileCta, setShowMobileCta] = useState(false);
  const [metricsStarted, setMetricsStarted] = useState(false);
  const [metricInferences, setMetricInferences] = useState(0);
  const [metricUptime, setMetricUptime] = useState(0);
  const [metricLatency, setMetricLatency] = useState(0);
  const [metricClients, setMetricClients] = useState(0);
  const [cookieChoice, setCookieChoice] = useState<string | null>(null);
  const [cookieModalOpen, setCookieModalOpen] = useState(false);
  const [cookiePrefs, setCookiePrefs] = useState({
    analytics: true,
    marketing: false,
    personalization: true,
  });
  const [chatOpen, setChatOpen] = useState(false);
  const [chatBusy, setChatBusy] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [showChatBadge, setShowChatBadge] = useState(true);
  const [demoInput, setDemoInput] = useState("");
  const [demoOutput, setDemoOutput] = useState("");
  const [demoRunning, setDemoRunning] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Welcome to Synthara. I can help with platform fit, architecture, pricing, and deployment pathways.",
    },
  ]);

  // Hydrate client-only state from localStorage after mount
  useEffect(() => {
    setIsLight(window.localStorage.getItem("synthara_theme") === "light");
    setCookieChoice(window.localStorage.getItem("synthara_cookie"));
    const rawPrefs = window.localStorage.getItem("synthara_cookie_prefs");
    if (rawPrefs) {
      try {
        const parsed = JSON.parse(rawPrefs);
        setCookiePrefs((prev) => ({
          analytics: parsed.analytics ?? prev.analytics,
          marketing: parsed.marketing ?? prev.marketing,
          personalization: parsed.personalization ?? prev.personalization,
        }));
      } catch { /* use defaults */ }
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("light", isLight);
  }, [isLight]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Custom cursor (desktop only)
  useEffect(() => {
    const dot = document.getElementById("cursor-dot");
    const ring = document.getElementById("cursor-ring");
    if (!dot || !ring) return;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) {
      dot.style.display = "none";
      ring.style.display = "none";
      document.body.style.cursor = "auto";
      return;
    }
    const onMove = (e: MouseEvent) => {
      dot.style.left = `${e.clientX}px`;
      dot.style.top = `${e.clientY}px`;
      ring.style.left = `${e.clientX}px`;
      ring.style.top = `${e.clientY}px`;
    };
    document.addEventListener("mousemove", onMove);
    const interactiveEls = document.querySelectorAll("a,button,.cap-cell,.t-block,.price-col,.process-item,.trust-card,.res-card,.demo-preset");
    const onEnter = () => { ring.style.width = "54px"; ring.style.height = "54px"; ring.style.borderColor = "rgba(0,200,255,0.8)"; };
    const onLeave = () => { ring.style.width = "36px"; ring.style.height = "36px"; ring.style.borderColor = "rgba(0,200,255,0.5)"; };
    interactiveEls.forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });
    return () => {
      document.removeEventListener("mousemove", onMove);
      interactiveEls.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > window.innerHeight * 0.8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => setLoaderDone(true), 600);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setShowMobileCta(!entry.isIntersecting);
      },
      { threshold: 0.05 },
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.1 },
    );

    const revealNodes = document.querySelectorAll(".reveal");
    revealNodes.forEach((node) => io.observe(node));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const sectionIds = [
      "#capabilities",
      "#demo",
      "#pricing",
      "#faq",
      "#trust",
      "#resources",
    ];
    const sections = sectionIds
      .map((id) => document.querySelector(id))
      .filter((el): el is Element => Boolean(el));
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveNav(`#${entry.target.id}`);
          }
        });
      },
      {
        root: null,
        rootMargin: "-35% 0px -55% 0px",
        threshold: 0,
      },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const metricsEl = document.getElementById("metrics");
    if (!metricsEl || metricsStarted) return;

    const animate = (
      setter: (value: number) => void,
      target: number,
      duration: number,
      decimals = 0,
    ) => {
      const start = performance.now();
      const step = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - (1 - progress) ** 3;
        const value = target * eased;
        setter(Number(value.toFixed(decimals)));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry.isIntersecting) return;
        setMetricsStarted(true);
        animate(setMetricInferences, 4.8, 1700, 1);
        animate(setMetricUptime, 99.97, 1400, 2);
        animate(setMetricLatency, 11, 1200, 0);
        animate(setMetricClients, 230, 1500, 0);
        observer.disconnect();
      },
      { threshold: 0.28 },
    );

    observer.observe(metricsEl);
    return () => observer.disconnect();
  }, [metricsStarted]);

  useEffect(() => {
    const onEsc = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setCookieModalOpen(false);
        setChatOpen(false);
      }
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const titles = document.querySelectorAll(".section-title");
    if (titles.length === 0) return;

    const onScroll = () => {
      for (const title of titles) {
        const rect = (title as HTMLElement).getBoundingClientRect();
        const viewH = window.innerHeight;
        if (rect.top < viewH && rect.bottom > 0) {
          const ratio = (viewH - rect.top) / (viewH + rect.height);
          const shift = (ratio - 0.5) * -24;
          (title as HTMLElement).style.transform = `translateY(${shift.toFixed(1)}px)`;
        }
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!chatMessagesRef.current) return;
    chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
  }, [chatHistory, chatBusy]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrame = 0;
    let running = true;
    let width = 0;
    let height = 0;

    type Node = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      pulse: number;
      pulseSpeed: number;
    };

    const nodes: Node[] = [];

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;

      if (nodes.length === 0) {
        const count = Math.min(Math.floor((width * height) / 25000), 80);
        for (let i = 0; i < count; i += 1) {
          nodes.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.35,
            vy: (Math.random() - 0.5) * 0.35,
            pulse: Math.random() * Math.PI * 2,
            pulseSpeed: 0.01 + Math.random() * 0.02,
          });
        }
      }
    };

    const draw = () => {
      if (!running) return;
      ctx.clearRect(0, 0, width, height);

      ctx.strokeStyle = "rgba(0, 200, 255, 0.02)";
      ctx.lineWidth = 0.5;
      for (let x = 0; x < width; x += 60) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 60) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;
        node.pulse += node.pulseSpeed;

        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        const radius = 1.2 + Math.sin(node.pulse) * 0.6;
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 200, 255, 0.45)";
        ctx.fill();
      }

      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < 150) {
            const alpha = (1 - dist / 150) * 0.18;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(0, 200, 255, ${alpha})`;
            ctx.stroke();
          }
        }
      }

      animationFrame = window.requestAnimationFrame(draw);
    };

    const onVisibility = () => {
      running = !document.hidden;
      if (running) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = window.requestAnimationFrame(draw);
      }
    };

    resize();
    animationFrame = window.requestAnimationFrame(draw);

    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const price = useMemo(() => (annualPricing ? 79 : 99), [annualPricing]);
  const priceLabel = annualPricing
    ? "per month · billed annually"
    : "per month · billed monthly";

  function toggleTheme() {
    const next = !isLight;
    setIsLight(next);
    document.documentElement.classList.toggle("light", next);
    window.localStorage.setItem("synthara_theme", next ? "light" : "dark");
  }

  function onNewsletterSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setNewsletterDone(true);
    e.currentTarget.reset();
    window.setTimeout(() => setNewsletterDone(false), 2500);
  }

  function dismissCookie(choice: "accepted" | "declined") {
    setCookieChoice(choice);
    window.localStorage.setItem("synthara_cookie", choice);
  }

  function saveCookiePrefs() {
    window.localStorage.setItem("synthara_cookie", "prefs");
    window.localStorage.setItem("synthara_cookie_prefs", JSON.stringify(cookiePrefs));
    setCookieChoice("prefs");
    setCookieModalOpen(false);
  }

  function formatChatHistoryForApi(messages: ChatMessage[]) {
    return messages.map((message) => ({
      role: message.role,
      content: message.content,
    }));
  }

  async function sendChatMessage(messageOverride?: string) {
    if (chatBusy) return;
    const message = (messageOverride ?? chatInput).trim();
    if (!message) return;

    const nextHistory = [...chatHistory, { role: "user" as const, content: message }];
    setChatHistory(nextHistory);
    setChatInput("");
    setChatBusy(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: formatChatHistoryForApi(nextHistory) }),
      });

      if (!response.ok) {
        throw new Error("Chat API error");
      }

      const data = (await response.json()) as { reply?: string };
      const reply =
        data.reply ||
        "I can help with architecture, pricing fit, and deployment planning. What should we focus on?";

      setChatHistory((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setChatHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I could not reach the assistant endpoint. Please retry, and I will continue from your previous context.",
        },
      ]);
    } finally {
      setChatBusy(false);
    }
  }

  function onChatInputKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendChatMessage();
    }
  }

  function runDemo(promptOverride?: string) {
    if (demoRunning) return;
    const prompt = (promptOverride ?? demoInput).trim();
    if (!prompt) return;

    setDemoInput("");
    setDemoRunning(true);
    setDemoOutput(`[USER] ${prompt}\n\n[SYNTHARA] Reasoning…`);

    const responses: Record<string, string> = {
      risk: "[SYNTHARA] Analysis complete.\n\n◆ Revenue concentration risk: Top-3 clients represent 41% of ARR — recommend diversification roadmap.\n◆ Margin compression: COGS grew 12% YoY vs 8% revenue growth — flag for CFO review.\n◆ Regulatory exposure: 2 pending compliance items in EU AI Act scope.\n\n✓ 3 risks identified · Confidence: 94.2% · Latency: 8ms",
      anomaly: "[SYNTHARA] Scan complete.\n\n◆ Anomaly detected at 03:42 UTC — p99 latency spiked to 340ms (baseline: 11ms).\n◆ Root cause: Connection pool exhaustion on us-east-1 replica.\n◆ Auto-recovery triggered at 03:44 UTC. No user-facing impact.\n\n✓ 1 anomaly · Severity: Medium · Latency: 6ms",
      churn: "[SYNTHARA] Model generated.\n\n◆ Architecture: Gradient-boosted ensemble + temporal attention layer.\n◆ Top features: Login frequency (0.34), support tickets (0.28), contract age (0.19).\n◆ Validation AUC: 0.91 on holdout set.\n\n✓ Model ready for deployment · Training time: 4.2s · Latency: 3ms",
      explain: "[SYNTHARA] Trace retrieved.\n\n◆ Prediction #4821: Churn probability 0.87 (High).\n◆ Primary drivers: 14-day login gap, 3 unresolved tickets, contract renewal in 22 days.\n◆ Counterfactual: Resolving tickets would reduce probability to 0.41.\n\n✓ Full trace available · Confidence: 96.1% · Latency: 5ms",
    };

    const lower = prompt.toLowerCase();
    let reply = "[SYNTHARA] Processing complete.\n\n◆ Task understood and executed.\n◆ The Synthesis Engine analyzed your request across available data sources.\n◆ Results are ready for review in the observability dashboard.\n\n✓ Task complete · Confidence: 91.8% · Latency: 9ms";

    if (lower.includes("risk") || lower.includes("earning")) reply = responses.risk;
    else if (lower.includes("anomal") || lower.includes("latency")) reply = responses.anomaly;
    else if (lower.includes("churn") || lower.includes("classif")) reply = responses.churn;
    else if (lower.includes("explain") || lower.includes("reason")) reply = responses.explain;

    window.setTimeout(() => {
      setDemoOutput(`[USER] ${prompt}\n\n${reply}`);
      setDemoRunning(false);
    }, 1200);
  }

  return (
    <div className="page min-h-screen bg-[var(--ink)] text-[var(--text)]">
      <div id="loader" className={loaderDone ? "done" : ""} aria-hidden="true">
        <svg viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="17" cy="17" r="16" stroke="rgba(0,200,255,0.3)" strokeWidth="1" />
          <path d="M9 17 L17 8 L25 17 L17 26 Z" fill="none" stroke="#00c8ff" strokeWidth="1.5" />
          <circle cx="17" cy="17" r="3" fill="#00c8ff" />
        </svg>
        <div className="loader-text">Initializing Synthara</div>
      </div>

      <canvas id="ai-bg" ref={canvasRef} aria-hidden="true" />
      <div id="cursor-dot" aria-hidden="true" />
      <div id="cursor-ring" aria-hidden="true" />
      <div className="bg-orb bg-orb-1" aria-hidden="true" />
      <div className="bg-orb bg-orb-2" aria-hidden="true" />
      <div className="bg-orb bg-orb-3" aria-hidden="true" />

      <a href="#hero" className="skip-link">
        Skip to main content
      </a>

      <header
        className={`fixed top-0 left-0 right-0 z-[200] border-b border-transparent backdrop-blur-xl ${
          navScrolled ? "scrolled" : ""
        }`}
        style={{ height: 72, background: "rgba(6,10,20,0.6)" }}
      >
        <nav className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-12">
          <a href="#" className="logo">
            <svg className="logo-mark" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <circle cx="17" cy="17" r="16" stroke="var(--border2)" strokeWidth="1" />
              <path className="logo-diamond" d="M9 17 L17 8 L25 17 L17 26 Z" fill="none" stroke="var(--gold)" strokeWidth="1.5" />
              <circle className="logo-core" cx="17" cy="17" r="3" fill="var(--gold)" />
            </svg>
            <span className="logo-wordmark">
              Synth<span>ara</span>
            </span>
          </a>

          <ul className="hidden gap-[2.5rem] text-[0.78rem] tracking-[.14em] uppercase text-[var(--muted2)] lg:flex">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <a href={item.href} className={`nav-link ${activeNav === item.href ? "active" : ""}`}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label="Toggle light and dark mode"
            >
              {isLight ? "☀" : "☾"}
            </button>
            <a href="#" className="nav-signin hidden lg:inline">Sign in</a>
            <a href="#pricing" className="nav-get-started hidden lg:inline">Begin →</a>
            <button
              type="button"
              className="hamburger lg:hidden"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-label="Open mobile navigation"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </nav>
      </header>

      {menuOpen && (
        <div className="mobile-menu open lg:hidden">
          {NAV_ITEMS.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
              {item.label}
            </a>
          ))}
        </div>
      )}

      <main id="main" className="mx-auto max-w-[1200px] px-12 pb-24">
        <section id="hero" className="hero-section">
          <div className="hero-left">
            <div className="hero-eyebrow">
              <span className="hero-eyebrow-line" />
              <span className="hero-eyebrow-text">AI Platform · Est. 2024</span>
            </div>
            <h1 className="hero-h1">
              Where<br />
              intelligence<br />
              <em>takes form</em>
            </h1>
            <p className="hero-desc">
              Synthara transforms raw, unstructured complexity into decisive,
              elegant intelligence — built for the architects of tomorrow&apos;s
              most consequential software.
            </p>
            <div className="hero-ctas">
              <a href="#" className="btn-gold">
                Begin your journey
              </a>
              <button type="button" className="btn-ghost-text" onClick={() => setChatOpen(true)}>
                Speak with Synthara
              </button>
            </div>
          </div>

          <div className="hero-right">
            <div className="hero-card-stack">
              <div className="h-card h-card-main">
                <div>
                  <div className="card-main-label">Inference Engine</div>
                  <div className="card-main-title">Reasoning Pipeline</div>
                  <div className="status-row">
                    <div className="status-dot" />
                    <span className="status-text">Active — processing 4.2M tokens/sec</span>
                  </div>
                </div>
                <div>
                  <div className="graph-bars">
                    {[30, 55, 40, 80, 65, 90, 70, 100, 85, 95, 75, 88].map((h, i) => (
                      <div key={i} className="bar" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                  <div className="card-sub" style={{ marginTop: ".5rem" }}>Last 12 hours · Peak throughput today</div>
                </div>
              </div>

              <div className="h-card h-card-float1">
                <div className="card-label">Accuracy Rate</div>
                <div className="card-stat">99.4<span style={{ fontSize: "1.2rem", color: "var(--muted)" }}>%</span></div>
                <div className="card-sub">+2.1% vs last week</div>
              </div>

              <div className="h-card h-card-float2">
                <div className="card-label">Latency</div>
                <div className="card-stat">11<span style={{ fontSize: "1rem", color: "var(--muted)" }}>ms</span></div>
                <div className="card-sub">p99 response time</div>
                <div className="sparkline" style={{ marginTop: ".6rem" }}>
                  {[40, 60, 35, 80, 50, 70, 100, 65].map((h, i) => (
                    <div key={i} className="sp" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="logos-strip reveal" aria-label="Trusted by leading teams">
          <div className="logos-track">
            {[...LOGOS, ...LOGOS].map((logo, index) => (
              <span key={`${logo}-${index}`} className="logo-item">
                {logo}
              </span>
            ))}
          </div>
        </div>

        <section id="metrics" className="reveal">
          <div className="metrics-inner">
            <MetricCard value={`${metricInferences.toFixed(1)}B+`} label="Inferences served" />
            <div className="metric-divider" />
            <MetricCard value={`${metricUptime.toFixed(2)}%`} label="Uptime guarantee" />
            <div className="metric-divider" />
            <MetricCard value={`${Math.round(metricLatency)}ms`} label="p99 latency" />
            <div className="metric-divider" />
            <MetricCard value={`${Math.round(metricClients)}+`} label="Enterprise clients" />
          </div>
        </section>

        <section id="capabilities" className="section-wrap reveal">
          <div className="sect-eyebrow"><div className="sect-line" /><span className="sect-tag">Capabilities</span></div>
          <h2 className="section-title">Every layer of<br /><em>modern AI</em> — unified</h2>
          <p className="sect-sub">A complete, composable stack. From training to inference, from orchestration to observability — all in one elegant surface.</p>
          <div className="cap-layout">
            <div className="cap-cell">
              <span className="cap-num">01</span>
              <span className="cap-icon">◈</span>
              <h3>Synthesis Engine</h3>
              <p>A proprietary reasoning layer that synthesizes knowledge from disparate sources into coherent, actionable intelligence. Trained on domain-specific corpora with continual refinement.</p>
              <div className="cap-tags">
                <span className="cap-tag">RAG</span>
                <span className="cap-tag">Fine-tuning</span>
                <span className="cap-tag">Continual Learning</span>
              </div>
            </div>
            <div className="cap-cell">
              <span className="cap-num">02</span>
              <span className="cap-icon">⬡</span>
              <h3>Autonomous Agents</h3>
              <p>Multi-step agentic pipelines that plan, act, verify, and iterate — without human intervention. Connect to any API, database, or tool your workflow requires.</p>
              <div className="cap-tags">
                <span className="cap-tag">Multi-agent</span>
                <span className="cap-tag">Tool Use</span>
                <span className="cap-tag">Memory</span>
              </div>
            </div>
            <div className="cap-cell">
              <span className="cap-num">03</span>
              <span className="cap-icon">◉</span>
              <h3>Predictive Intelligence</h3>
              <p>Forecasting and anomaly detection built for enterprise data. Time-series, classification, regression — deployed to production in hours, not quarters.</p>
              <div className="cap-tags">
                <span className="cap-tag">Forecasting</span>
                <span className="cap-tag">Anomaly Detection</span>
                <span className="cap-tag">AutoML</span>
              </div>
            </div>
            <div className="cap-cell">
              <span className="cap-num">04</span>
              <span className="cap-icon">◎</span>
              <h3>Observability Suite</h3>
              <p>Real-time model monitoring, drift detection, cost tracking, and explainability dashboards. Every inference is auditable, traceable, and improvable.</p>
              <div className="cap-tags">
                <span className="cap-tag">Drift Detection</span>
                <span className="cap-tag">Explainability</span>
                <span className="cap-tag">Cost Analysis</span>
              </div>
            </div>
          </div>
        </section>

        <section id="process" className="section-wrap reveal">
          <div className="sect-eyebrow"><div className="sect-line" /><span className="sect-tag">Process</span></div>
          <h2 className="section-title">From raw data<br />to <em>decisive action</em></h2>
          <p className="sect-sub">Four deliberate steps from integration to intelligence. Designed for engineering teams who move with intention.</p>
          <div className="process-list">
            {PROCESS_ITEMS.map((item, index) => (
              <article key={item.title} className="process-item">
                <p className="p-num">{String(index + 1).padStart(2, "0")}</p>
                <div className="p-content">
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="demo" className="section-wrap reveal">
          <div className="sect-eyebrow"><div className="sect-line" /><span className="sect-tag">Try It</span></div>
          <h2 className="section-title">See Synthara <em>in action</em></h2>
          <p className="sect-sub">Type a prompt or choose a preset below. This is a live simulation of the Synthesis Engine — the same reasoning layer powering 230+ enterprise deployments.</p>
          <div className="demo-container">
            <div className="demo-header">
              <div className="demo-dot demo-dot-r" />
              <div className="demo-dot demo-dot-y" />
              <div className="demo-dot demo-dot-g" />
              <span className="demo-title">Synthara Playground · Synthesis Engine v3.2</span>
            </div>
            <div className="demo-body">
              <div className="demo-presets">
                {DEMO_PRESETS.map((preset) => (
                  <button key={preset.label} className="demo-preset" onClick={() => runDemo(preset.prompt)}>
                    {preset.label}
                  </button>
                ))}
              </div>
              <div className="demo-output">
                {demoOutput || <span className="demo-system">← Select a preset or type your own prompt to begin.</span>}
              </div>
              <div className="demo-input-row">
                <label htmlFor="demo-input" className="sr-only">Describe a task for the Synthesis Engine</label>
                <input
                  id="demo-input"
                  className="demo-input"
                  type="text"
                  placeholder="Describe a task for the Synthesis Engine..."
                  value={demoInput}
                  onChange={(e) => setDemoInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      runDemo();
                    }
                  }}
                />
                <button className="demo-run" onClick={() => runDemo()} disabled={demoRunning}>
                  {demoRunning ? "Running…" : "Run ▸"}
                </button>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="section-wrap reveal">
          <div className="sect-eyebrow" style={{ justifyContent: "center" }}><div className="sect-line" /><span className="sect-tag">Pricing</span><div className="sect-line" style={{ transform: "scaleX(-1)" }} /></div>
          <div style={{ textAlign: "center" }}>
            <h2 className="section-title">Priced for<br /><em>ambition</em></h2>
            <p className="sect-sub" style={{ margin: "0 auto" }}>Transparent, scalable, no surprises. Start free and grow into the platform as your AI matures.</p>
            <div className="price-toggle-wrap">
              <span className={`price-toggle-label ${!annualPricing ? "active" : ""}`}>
                Monthly
              </span>
              <button
                type="button"
                className={`price-toggle-switch ${annualPricing ? "annual" : ""}`}
                onClick={() => setAnnualPricing((v) => !v)}
                aria-label="Toggle monthly or annual billing"
                aria-checked={annualPricing}
                role="switch"
              />
              <span className={`price-toggle-label ${annualPricing ? "active" : ""}`}>
                Annual
              </span>
              <span className="save-badge">Save 20%</span>
            </div>
          </div>

          <div className="pricing-grid">
            <div className="price-col">
              <div className="plan-tier">Origin</div>
              <div className="plan-cost"><sub>$</sub>0</div>
              <div className="plan-mo">per month, forever</div>
              <p className="plan-tagline">For explorers building their first intelligent application.</p>
              <ul className="plan-list">
                <li>Up to 3 models in production</li>
                <li>500K inferences / month</li>
                <li>Community support &amp; forums</li>
                <li>Basic analytics dashboard</li>
                <li>1 workspace, 2 team seats</li>
              </ul>
              <a href="#" className="plan-action pa-outline">Begin for free</a>
            </div>
            <div className="price-col featured">
              <div className="feat-ribbon">Most Popular</div>
              <div className="plan-tier">Meridian</div>
              <div className="plan-cost"><sub>$</sub>{price}</div>
              <div className="plan-mo">{priceLabel}</div>
              <p className="plan-tagline">For product teams shipping AI to real users at scale.</p>
              <ul className="plan-list">
                <li>Unlimited production models</li>
                <li>5M inferences / month</li>
                <li>Priority support · 4hr SLA</li>
                <li>Advanced observability suite</li>
                <li>10 team seats · SSO</li>
                <li>Custom model fine-tuning</li>
                <li>A/B testing &amp; rollbacks</li>
              </ul>
              <a href="#" className="plan-action pa-fill">Start 14-day trial</a>
            </div>
            <div className="price-col">
              <div className="plan-tier">Zenith</div>
              <div className="plan-cost" style={{ fontSize: "2.2rem", letterSpacing: "-.02em" }}>Custom</div>
              <div className="plan-mo">negotiated annually</div>
              <p className="plan-tagline">For institutions demanding dedicated infrastructure and governance.</p>
              <ul className="plan-list">
                <li>Dedicated VPC or on-premise</li>
                <li>Unlimited everything</li>
                <li>24/7 dedicated CSM</li>
                <li>Custom SLAs &amp; contracts</li>
                <li>Audit logs &amp; RBAC</li>
                <li>BAA / DPA on request</li>
              </ul>
              <a href="#" className="plan-action pa-outline">Contact sales</a>
            </div>
          </div>
        </section>

        <section id="faq" className="section-wrap reveal">
          <div className="sect-eyebrow"><div className="sect-line" /><span className="sect-tag">FAQ</span></div>
          <h2 className="section-title">Common <em>questions</em></h2>
          <div className="faq-list">
            {FAQs.map((item, idx) => (
              <div key={item.question} className={`faq-item${openFaq === idx ? " open" : ""}`}>
                <button
                  type="button"
                  className="faq-q"
                  onClick={() => setOpenFaq((prev) => (prev === idx ? null : idx))}
                  aria-expanded={openFaq === idx}
                >
                  {item.question}
                  <span className="faq-chevron">▼</span>
                </button>
                <div className="faq-a">
                  <p>{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="testimonials" className="section-wrap reveal">
          <div className="sect-eyebrow"><div className="sect-line" /><span className="sect-tag">Stories</span></div>
          <h2 className="section-title">Trusted by those who<br /><em>build the future</em></h2>
          <div className="testi-mosaic">
            {TESTIMONIALS.map((item) => (
              <article key={item.author} className={`t-block${item.tall ? " tall" : ""}`}>
                <div className="t-stars">★★★★★</div>
                {item.tall && <span className="quote-mark">&ldquo;</span>}
                {!item.tall && <span className="quote-mark">&ldquo;</span>}
                <p className="t-quote">{item.quote}</p>
                <div className="t-author">
                  <div className="t-av" style={{
                    background: item.color,
                    color: item.textColor,
                  }}>{item.initials}</div>
                  <div>
                    <div className="t-name">{item.author}</div>
                    <div className="t-role">{item.role}</div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="trust" className="section-wrap reveal">
          <div className="sect-eyebrow"><div className="sect-line" /><span className="sect-tag">Trust &amp; Transparency</span></div>
          <h2 className="section-title">AI you can <em>understand</em></h2>
          <p className="sect-sub">We believe trustworthy AI starts with radical transparency. Here&apos;s how we earn confidence at every layer.</p>
          <div className="trust-grid">
            {TRUST_ITEMS.map((item) => (
              <article key={item.title} className="trust-card">
                <span className="trust-icon">{item.icon}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="resources" className="section-wrap reveal">
          <div className="sect-eyebrow"><div className="sect-line" /><span className="sect-tag">Resources</span></div>
          <h2 className="section-title">Insights from the <em>frontier</em></h2>
          <p className="sect-sub">Research, guides, and deep dives from the team building Synthara — and the practitioners who deploy it.</p>
          <div className="res-grid">
            {RESOURCE_ITEMS.map((item) => (
              <article key={item.title} className="res-card">
                <p className="res-type">{item.type}</p>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <div className="res-meta">
                  <span>{item.meta}</span>
                  <span>{item.date}</span>
                  <span className="res-arrow">→</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="section-wrap reveal">
          <div className="newsletter-wrap">
            <h3>Dispatches from the frontier</h3>
            <p>Join 12,000+ engineers receiving weekly insights on AI architecture, deployment patterns, and platform updates.</p>
            <form className="newsletter-form" onSubmit={onNewsletterSubmit}>
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                className="newsletter-input"
                type="email"
                placeholder="you@company.com"
                required
              />
              <button className="newsletter-btn" type="submit">
                Subscribe
              </button>
            </form>
            {newsletterDone && <p className="newsletter-msg show">✓ You&apos;re in. Watch your inbox.</p>}
          </div>
        </section>

        <section id="cta-final" className="section-wrap">
          <div className="cta-wrap reveal">
            <div className="sect-eyebrow" style={{ justifyContent: "center", marginBottom: "1rem" }}><div className="sect-line" /><span className="sect-tag">Begin</span><div className="sect-line" style={{ transform: "scaleX(-1)" }} /></div>
            <h2 className="section-title">Intelligence<br /><em>awaits form</em></h2>
            <p>Join 230+ teams who&apos;ve chosen Synthara as the foundation of their AI infrastructure. Your first model is free. No credit card required.</p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", position: "relative" }}>
              <a href="#" className="btn-gold">Begin your journey →</a>
              <a href="#" className="btn-ghost-text" style={{ color: "var(--muted2)" }}>Schedule a demo</a>
            </div>
            <div className="social-proof-row" style={{ justifyContent: "center", marginTop: "2rem" }}>
              <div className="sp-item"><span className="sp-dot" /> <span className="sp-count">1,247</span> models deployed this week</div>
              <div className="sp-item"><span className="sp-dot" /> <span className="sp-count">84</span> teams online now</div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--border)]">
        <div className="foot-top">
          <div className="foot-brand">
            <a href="#" className="logo">
              <svg className="logo-mark" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ width: 26, height: 26 }}>
                <circle cx="17" cy="17" r="16" stroke="var(--border2)" strokeWidth="1" />
                <path d="M9 17 L17 8 L25 17 L17 26 Z" fill="none" stroke="var(--gold)" strokeWidth="1.5" />
                <circle cx="17" cy="17" r="3" fill="var(--gold)" />
              </svg>
              <span className="logo-wordmark" style={{ fontSize: "1.1rem" }}>Synth<span>ara</span></span>
            </a>
            <p>Enterprise AI infrastructure for teams building tomorrow&apos;s most consequential software.</p>
          </div>
          <div className="foot-col">
            <h5>Platform</h5>
            <ul>
              <li><a href="#capabilities">Synthesis Engine</a></li>
              <li><a href="#capabilities">Autonomous Agents</a></li>
              <li><a href="#capabilities">Observability</a></li>
              <li><a href="#">API Reference</a></li>
              <li><a href="#">Changelog</a></li>
            </ul>
          </div>
          <div className="foot-col">
            <h5>Company</h5>
            <ul>
              <li><a href="#">About</a></li>
              <li><a href="#trust">Trust &amp; AI Disclosure</a></li>
              <li><a href="#resources">Blog</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Press</a></li>
            </ul>
          </div>
          <div className="foot-col">
            <h5>Legal</h5>
            <ul>
              <li><a href="#">Privacy Policy</a></li>
              <li><button type="button" className="foot-link-btn" onClick={() => setCookieModalOpen(true)}>Cookie Policy</button></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Security</a></li>
              <li><button type="button" className="foot-link-btn" onClick={() => setCookieModalOpen(true)}>Cookie Preferences</button></li>
            </ul>
          </div>
        </div>
        <div className="foot-bottom">
          <p>© 2026 Synthara Inc. All rights reserved. Built with intention.</p>
          <div className="foot-links">
            <a href="#">Twitter / X</a>
            <a href="#">LinkedIn</a>
            <a href="#">GitHub</a>
            <a href="#">Status</a>
          </div>
        </div>
      </footer>

      <a href="#hero" id="back-to-top" className={showTop ? "visible" : ""}>
        ↑
      </a>

      <div className={`mobile-cta ${showMobileCta ? "visible" : ""}`}>
        <a href="#pricing">Get Started - Free</a>
      </div>

      {!cookieChoice && (
        <div id="cookie-banner">
          <div className="ck-text">
            <strong>We value your privacy</strong>
            <p>
              We use cookies to improve your experience and platform intelligence. You can edit
              preferences anytime.
            </p>
          </div>
          <div className="ck-actions">
            <button className="ck-btn ck-prefs" onClick={() => setCookieModalOpen(true)}>
              Preferences
            </button>
            <button className="ck-btn ck-decline" onClick={() => dismissCookie("declined")}>
              Decline
            </button>
            <button className="ck-btn ck-accept" onClick={() => dismissCookie("accepted")}>
              Accept All
            </button>
          </div>
        </div>
      )}

      <div
        id="cookie-modal"
        className={cookieModalOpen ? "open" : ""}
        role="dialog"
        aria-modal="true"
        aria-label="Cookie preferences"
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            setCookieModalOpen(false);
          }
        }}
      >
        <div className="ck-modal-box">
          <button className="ck-modal-close" onClick={() => setCookieModalOpen(false)}>
            x
          </button>
          <h2>Cookie Preferences</h2>
          <p>Control how Synthara stores analytics and personalization data in your browser.</p>

          <div className="toggle-row">
            <div>
              <p className="toggle-label">Necessary</p>
              <p className="toggle-sub">Required for core platform behavior</p>
            </div>
            <button className="toggle on disabled" disabled aria-label="Necessary cookies enabled" />
          </div>

          <div className="toggle-row">
            <div>
              <p className="toggle-label">Analytics</p>
              <p className="toggle-sub">Performance and interaction measurements</p>
            </div>
            <button
              className={`toggle ${cookiePrefs.analytics ? "on" : ""}`}
              onClick={() =>
                setCookiePrefs((prev) => ({
                  ...prev,
                  analytics: !prev.analytics,
                }))
              }
              aria-label="Toggle analytics cookies"
            />
          </div>

          <div className="toggle-row" style={{ borderBottom: "none" }}>
            <div>
              <p className="toggle-label">Personalization</p>
              <p className="toggle-sub">Theme and UX preference retention</p>
            </div>
            <button
              className={`toggle ${cookiePrefs.personalization ? "on" : ""}`}
              onClick={() =>
                setCookiePrefs((prev) => ({
                  ...prev,
                  personalization: !prev.personalization,
                }))
              }
              aria-label="Toggle personalization cookies"
            />
          </div>

          <div className="ck-actions" style={{ marginTop: "1rem" }}>
            <button className="ck-btn ck-decline" onClick={() => dismissCookie("declined")}>
              Reject
            </button>
            <button className="ck-btn ck-accept" onClick={saveCookiePrefs}>
              Save Preferences
            </button>
          </div>
        </div>
      </div>

      <button
        id="chatbot-trigger"
        onClick={() => {
          setChatOpen((prev) => !prev);
          setShowChatBadge(false);
        }}
        aria-label="Open Synthara AI chat"
        title="Chat with Synthara AI"
      >
        {showChatBadge && <div className="chat-badge">1</div>}
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      </button>

      <div id="chatbot-panel" className={chatOpen ? "open" : ""}>
        <div className="cb-header">
          <div className="cb-logo">S</div>
          <div className="cb-info">
            <strong>Synthara AI</strong>
            <span>◆ Online · Powered by Claude</span>
          </div>
          <button className="cb-close" onClick={() => setChatOpen(false)} aria-label="Close chat">
            ✕
          </button>
        </div>

        <div className="cb-msgs" ref={chatMessagesRef}>
          {chatHistory.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`cb-msg ${message.role === "user" ? "cb-msg-user" : "cb-msg-bot"}`}
            >
              {message.content}
            </div>
          ))}

          {chatBusy && (
            <div className="cb-msg cb-msg-bot cb-typing">
              <div className="cb-dot" />
              <div className="cb-dot" />
              <div className="cb-dot" />
            </div>
          )}

          {chatHistory.length < 3 && (
            <div className="cb-suggestions">
              {CHAT_SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  className="cb-suggest-btn"
                  onClick={() => void sendChatMessage(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="cb-footer">
          <label htmlFor="cb-input" className="sr-only">
            Ask Synthara AI
          </label>
          <textarea
            id="cb-input"
            rows={1}
            placeholder="Ask Synthara..."
            value={chatInput}
            onChange={(event) => setChatInput(event.target.value)}
            onKeyDown={onChatInputKeyDown}
          />
          <button id="cb-send" onClick={() => void sendChatMessage()} aria-label="Send message">
            <svg viewBox="0 0 24 24" fill="var(--ink)"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="metric">
      <p className="metric-val">{value}</p>
      <p className="metric-name">{label}</p>
    </div>
  );
}
