"use client";
import { useState, useRef, useEffect } from "react";
import api from "@/lib/api";
import { Spinner, TypingDots } from "@/components/ui";

const IMAGE_LIBRARY = [
  {
    label: "Human Heart — Sectional View",
    filename: "human-heart-schematic-sectional-view.png",
    keywords: ["heart", "cardiac", "blood circulation", "circulatory", "double circulation", "atrium", "ventricle", "aorta", "pulmonary"],
  },
  {
    label: "Acid-Base Reaction with Metals",
    filename: "acid-base-react-with-metals.png",
    keywords: ["acid react", "base react", "acid with metal", "base with metal", "hydrogen gas", "metal acid"],
  },
  {
    label: "Concave and Convex Mirrors",
    filename: "conave-convex-mirror.png",
    keywords: ["concave mirror", "convex mirror", "spherical mirror", "mirror image", "focal point", "centre of curvature", "reflection of light"],
  },
  {
    label: "Human Excretory System",
    filename: "excretory-system.png",
    keywords: ["excretion", "excretory system", "urine", "urinary", "bladder", "ureter", "urethra", "kidney function"],
  },
  {
    label: "HCl Gas Preparation",
    filename: "hcl-gas-preparation.png",
    keywords: ["hcl gas", "hydrochloric acid preparation", "hydrogen chloride", "gas preparation", "nacl h2so4"],
  },
  {
    label: "Human Alimentary Canal",
    filename: "human-alimentary-canal.png",
    keywords: ["alimentary canal", "digestive system", "digestion", "oesophagus", "stomach", "small intestine", "large intestine", "gut", "human digestion"],
  },
  {
    label: "Human Respiratory System",
    filename: "human-respiratory-system.png",
    keywords: ["respiratory system", "lungs", "breathing", "trachea", "bronchi", "alveoli", "inhalation", "exhalation", "respiration"],
  },
  {
    label: "Leaf Cross-Section",
    filename: "leaf-cross-section.png",
    keywords: ["leaf", "leaf cross section", "mesophyll", "epidermis", "chloroplast", "stomata", "photosynthesis", "leaf structure", "palisade"],
  },
  {
    label: "Metal Carbonates & Hydrogencarbonates with Acids",
    filename: "metal-carbonates-hydrocarbonates-react-with-metals.png",
    keywords: ["carbonate", "hydrogencarbonate", "bicarbonate", "co2 gas", "effervescence", "carbonate react", "nahco3", "na2co3"],
  },
  {
    label: "Nephron Structure",
    filename: "nephron-structure.png",
    keywords: ["nephron", "glomerulus", "bowman", "tubule", "kidney structure", "filtration", "reabsorption", "collecting duct", "loop of henle"],
  },
  {
    label: "Stomatal Pore — Open and Closed",
    filename: "open-close-stomatal-pore.png",
    keywords: ["stomata", "stomatal pore", "guard cell", "transpiration", "open stoma", "closed stoma"],
  },
  {
    label: "pH Scale",
    filename: "ph-scale.png",
    keywords: ["ph scale", "ph value", "acidic basic neutral", "ph of", "ph number", "ph indicator"],
  },
];
 
// ── Image detection (same keyword-scan pattern as detectDiagram) ──────────────
// Scans the user message + AI response for image keywords.
// Returns the matching IMAGE_LIBRARY entry or null.
// Deliberately does NOT return an image if a Mermaid diagram already matched —
// avoids showing both for the same concept (caller handles that logic).
function detectImage(userText, aiText = "") {
  const combined = (userText + " " + aiText).toLowerCase();
  for (const entry of IMAGE_LIBRARY) {
    if (entry.keywords.some((kw) => combined.includes(kw))) {
      return entry;
    }
  }
  return null;
}
 
// ── NCERT Image component ─────────────────────────────────────────────────────
function NCERTImage({ filename, label }) {
  const [status, setStatus] = useState("loading"); // loading | ok | error
 
  return (
    <div className="my-3 rounded-xl border border-[#E2E0D8] bg-white overflow-hidden">
      {/* Header bar — same style as MermaidDiagram */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#E2E0D8] bg-[#F5F0E8]">
        <div className="flex items-center gap-2">
          <span className="text-sm">🖼️</span>
          <span className="text-[#1B2A4A] text-xs font-bold">{label}</span>
        </div>
        <span className="text-[10px] font-bold text-[#0F6E56] bg-[#E1F5EE] px-2 py-0.5 rounded-full border border-[#0F6E56]/20">
          NCERT Class 10
        </span>
      </div>
 
      {/* Image area */}
      <div className="p-3 flex justify-center bg-white">
        {status === "loading" && (
          <div className="flex items-center gap-2 py-4">
            <Spinner size={14} color="#0F6E56" />
            <span className="text-[#4b5563] text-xs">Loading diagram…</span>
          </div>
        )}
        {status === "error" && (
          <p className="text-[#991b1b] text-xs py-4">
            Diagram could not be loaded. The concept is explained in the text above.
          </p>
        )}
        <img
          src={`/ncert-images/${filename}`}
          alt={label}
          className={`max-w-full rounded-lg object-contain ${status !== "ok" ? "hidden" : ""}`}
          style={{ maxHeight: 320 }}
          onLoad={() => setStatus("ok")}
          onError={() => setStatus("error")}
        />
      </div>
    </div>
  );
}


const DIAGRAM_LIBRARY = [
  {
    label: "Photosynthesis Process",
    keywords: ["photosynthesis", "photosynth"],
    code: `graph TD
  A["Sunlight ☀️"] --> B["Absorbed by Chlorophyll"]
  B --> C["Light Reactions - Thylakoid"]
  C --> D["ATP + NADPH produced"]
  C --> E["Water H₂O splits → O₂ released"]
  D --> F["Calvin Cycle - Stroma"]
  E --> F
  F --> G["CO₂ fixed into G3P"]
  G --> H["Glucose C₆H₁₂O₆"]`,
  },
  {
    label: "Reflex Arc",
    keywords: ["reflex arc", "reflex action", "reflex"],
    code: `graph LR
  A["Stimulus 🔥"] --> B["Receptor\n skin/sense organ"]
  B --> C["Sensory Neuron\n afferent"]
  C --> D["Spinal Cord\n relay neuron"]
  D --> E["Motor Neuron\n efferent"]
  E --> F["Effector\n muscle/gland"]
  F --> G["Response 🦵"]`,
  },
  {
    label: "Human Digestive System",
    keywords: ["digestion", "digestive", "alimentary"],
    code: `graph TD
  A["Food enters Mouth 👄"] --> B["Teeth grind + Salivary Amylase"]
  B --> C["Oesophagus\n peristalsis"]
  C --> D["Stomach\n HCl + Pepsin"]
  D --> E["Small Intestine\n Bile + Pancreatic enzymes"]
  E --> F["Absorption into blood\n villi + microvilli"]
  F --> G["Large Intestine\n water absorbed"]
  G --> H["Waste → Anus"]`,
  },
  {
    label: "Water Cycle",
    keywords: ["water cycle", "hydrological", "hydrologic"],
    code: `graph TD
  A["Oceans / Water bodies 🌊"] --> B["Evaporation ☀️"]
  B --> C["Water Vapour rises"]
  C --> D["Condensation → Clouds ☁️"]
  D --> E["Precipitation\n rain / snow 🌧️"]
  E --> F["Surface Runoff"]
  E --> G["Infiltration → Groundwater"]
  F --> A
  G --> A`,
  },
  {
    label: "Carbon Cycle",
    keywords: ["carbon cycle", "carbon dioxide cycle"],
    code: `graph TD
  A["CO₂ in Atmosphere"] --> B["Photosynthesis\n by Plants"]
  B --> C["Organic Carbon\n in plants"]
  C --> D["Consumed by Animals"]
  D --> E["Respiration\n CO₂ released"]
  C --> E
  E --> A
  C --> F["Dead matter\n decomposition"]
  F --> A
  D --> G["Fossil Fuels\n over millions of years"]
  G --> H["Combustion 🔥"]
  H --> A`,
  },
  {
    label: "Nitrogen Cycle",
    keywords: ["nitrogen cycle", "nitrogen fixation", "nitrification", "denitrification"],
    code: `graph TD
  A["N₂ in Atmosphere 78%"] --> B["Nitrogen Fixation\n Rhizobium bacteria"]
  B --> C["Ammonia NH₃\n in soil"]
  C --> D["Nitrification\n Nitrosomonas"]
  D --> E["Nitrites NO₂⁻"]
  E --> F["Nitrites → Nitrates NO₃⁻\n Nitrobacter"]
  F --> G["Absorbed by Plants"]
  G --> H["Consumed by Animals"]
  H --> I["Excretion / Death\n decomposition"]
  I --> C
  F --> J["Denitrification\n Pseudomonas"]
  J --> A`,
  },
  {
    label: "Human Respiration",
    keywords: ["respiration", "breathing", "aerobic", "anaerobic", "cellular respiration"],
    code: `graph TD
  A["Inhalation\n diaphragm contracts"] --> B["Air enters Lungs"]
  B --> C["Alveoli\n gas exchange"]
  C --> D["O₂ → Blood\n CO₂ → Alveoli"]
  D --> E["O₂ to cells via\n haemoglobin"]
  E --> F["Cellular Respiration\n mitochondria"]
  F --> G["Glucose + O₂\n → ATP + CO₂ + H₂O"]
  G --> H["CO₂ → Blood → Lungs"]
  H --> I["Exhalation 💨"]`,
  },
  {
    label: "Blood Circulation",
    keywords: ["blood circulation", "circulatory", "double circulation", "heart"],
    code: `graph TD
  A["Right Atrium\n deoxygenated blood"] --> B["Right Ventricle"]
  B --> C["Pulmonary Artery\n to lungs"]
  C --> D["Lungs 🫁\n CO₂ out, O₂ in"]
  D --> E["Pulmonary Vein\n oxygenated blood"]
  E --> F["Left Atrium"]
  F --> G["Left Ventricle"]
  G --> H["Aorta → Body"]
  H --> I["Capillaries\n O₂ to tissues"]
  I --> A`,
  },
  {
    label: "Nerve Impulse Transmission",
    keywords: ["nerve impulse", "neuron", "synapse", "neural", "nervous system"],
    code: `graph LR
  A["Stimulus"] --> B["Dendrites\n receive signal"]
  B --> C["Cell Body\n integrates signal"]
  C --> D["Axon\n electrical impulse"]
  D --> E["Axon Terminal\n synaptic knob"]
  E --> F["Neurotransmitters\n released into synapse"]
  F --> G["Next Neuron\n dendrites"]
  G --> H["Effector\n muscle / gland"]`,
  },
  {
    label: "Kidney — Urine Formation",
    keywords: ["kidney", "nephron", "urine", "excretion", "excretory"],
    code: `graph TD
  A["Blood enters\n Glomerulus"] --> B["Ultrafiltration\n Bowman's Capsule"]
  B --> C["Filtrate:\n water, urea, glucose, salts"]
  C --> D["Proximal Convoluted Tubule\n glucose + salts reabsorbed"]
  D --> E["Loop of Henle\n water reabsorbed"]
  E --> F["Distal Convoluted Tubule\n selective reabsorption"]
  F --> G["Collecting Duct\n final water reabsorption"]
  G --> H["Urine formed\n urea + excess salts + water"]
  H --> I["Ureter → Urinary Bladder → Urethra"]`,
  },
  {
    label: "Sexual Reproduction in Flowering Plants",
    keywords: ["pollination", "fertilisation", "flower", "reproduction in plants", "plant reproduction"],
    code: `graph TD
  A["Pollen grain\n on anther"] --> B["Pollination\n wind / insect / water"]
  B --> C["Pollen lands on Stigma"]
  C --> D["Pollen tube grows\n down style"]
  D --> E["Reaches Ovule\n in ovary"]
  E --> F["Fertilisation\n pollen + egg cell"]
  F --> G["Zygote formed"]
  G --> H["Zygote → Embryo\n seed develops"]
  H --> I["Ovary → Fruit 🍎"]`,
  },
  {
    label: "Human Reproductive System — Fertilisation",
    keywords: ["human reproduction", "fertilisation", "zygote", "embryo", "menstrual"],
    code: `graph TD
  A["Ovulation\n egg released from ovary"] --> B["Egg travels\n fallopian tube"]
  B --> C["Fertilisation\n sperm meets egg"]
  C --> D["Zygote formed\n 2n chromosomes"]
  D --> E["Cell division begins\n cleavage"]
  E --> F["Blastocyst\n reaches uterus"]
  F --> G["Implantation\n in uterine wall"]
  G --> H["Embryo → Foetus\n ~9 months"]
  H --> I["Birth 👶"]`,
  },
  {
    label: "Light — Image Formation by Lens",
    keywords: ["convex lens", "concave lens", "lens image", "refraction through lens"],
    code: `graph TD
  A["Object placed\n in front of lens"] --> B{"Convex or\n Concave?"}
  B --> C["Convex Lens\n converging"]
  B --> D["Concave Lens\n diverging"]
  C --> E{"Object position?"}
  E --> F["Beyond 2F\n → Real, inverted, smaller"]
  E --> G["At 2F\n → Real, inverted, same size"]
  E --> H["Between F and 2F\n → Real, inverted, larger"]
  E --> I["At F\n → Image at infinity"]
  E --> J["Within F\n → Virtual, erect, larger"]
  D --> K["Any position\n → Virtual, erect, smaller"]`,
  },
  {
    label: "Electricity — Series vs Parallel Circuits",
    keywords: ["series circuit", "parallel circuit", "series and parallel", "electric circuit"],
    code: `graph TD
  A["Electric Circuit"] --> B["Series"]
  A --> C["Parallel"]
  B --> D["Same current\n through all"]
  B --> E["Voltages add up\n V = V₁+V₂+V₃"]
  B --> F["R_total = R₁+R₂+R₃\n resistance increases"]
  B --> G["One breaks →\n all stop ❌"]
  C --> H["Same voltage\n across all"]
  C --> I["Currents add up\n I = I₁+I₂+I₃"]
  C --> J["1/R = 1/R₁+1/R₂\n resistance decreases"]
  C --> K["One breaks →\n others work ✅"]`,
  },
  {
    label: "Acids, Bases and Salts — Reactions",
    keywords: ["neutralisation", "neutralization", "acid base reaction", "acid and base"],
    code: `graph TD
  A["Acid\n H⁺ ions in water"] --> C["Neutralisation\n Acid + Base"]
  B["Base\n OH⁻ ions in water"] --> C
  C --> D["Salt + Water"]
  D --> E{"pH of salt?"}
  E --> F["Strong acid +\n Strong base\n → pH = 7 neutral"]
  E --> G["Weak acid +\n Strong base\n → pH > 7 basic"]
  E --> H["Strong acid +\n Weak base\n → pH < 7 acidic"]
  A --> I["Turns blue\n litmus red"]
  B --> J["Turns red\n litmus blue"]`,
  },
];


function detectDiagram(userText, aiText = "") {
  const combined = (userText + " " + aiText).toLowerCase();
  for (const entry of DIAGRAM_LIBRARY) {
    if (entry.keywords.some((kw) => combined.includes(kw))) {
      return entry;
    }
  }
  return null;
}

// ── Mermaid loader  ─────────────────────────────────────────
let mermaidState = "idle"; // idle | loading | ready | error
const mermaidQueue = [];

function loadMermaid(cb) {
  if (mermaidState === "ready") { cb(); return; }
  mermaidQueue.push(cb);
  if (mermaidState === "loading") return;
  mermaidState = "loading";

  const script = document.createElement("script");
  script.src = "https://cdnjs.cloudflare.com/ajax/libs/mermaid/10.9.0/mermaid.min.js";
  script.onload = () => {
    window.mermaid.initialize({
      startOnLoad: false,
      theme: "base",
      themeVariables: {
        primaryColor: "#E1F5EE",
        primaryTextColor: "#1B2A4A",
        primaryBorderColor: "#0F6E56",
        lineColor: "#0F6E56",
        secondaryColor: "#F5F0E8",
        tertiaryColor: "#fafaf9",
        background: "#ffffff",
        fontSize: "13px",
        edgeLabelBackground: "#ffffff",
      },
      flowchart: { curve: "basis", padding: 20 },
    });
    mermaidState = "ready";
    mermaidQueue.forEach((fn) => fn());
    mermaidQueue.length = 0;
  };
  script.onerror = () => { mermaidState = "error"; };
  document.head.appendChild(script);
}

// ── Mermaid diagram component ─────────────────────────────────────────────────
let diagramCounter = 0;

function MermaidDiagram({ code, label }) {
  const containerRef = useRef(null);
  const [status, setStatus] = useState("loading");
  const [svg, setSvg] = useState("");
  const idRef = useRef(`ee-dgm-${++diagramCounter}`);

  useEffect(() => {
    if (!code) return;
    loadMermaid(async () => {
      try {
        const { svg: rendered } = await window.mermaid.render(idRef.current, code.trim());
        setSvg(rendered);
        setStatus("ok");
      } catch (e) {
        console.warn("Mermaid render error:", e);
        setStatus("error");
      }
    });
  }, [code]);

  if (status === "loading") {
    return (
      <div className="flex items-center gap-2 px-4 py-3 my-2 rounded-xl border border-[#E2E0D8] bg-[#fafaf9]">
        <Spinner size={14} color="#0F6E56" />
        <span className="text-[#4b5563] text-xs">Rendering diagram…</span>
      </div>
    );
  }
  if (status === "error") {
    return (
      <div className="px-4 py-3 my-2 rounded-xl border border-[#fca5a5] bg-[#fff1f1]">
        <p className="text-[#991b1b] text-xs">Diagram could not be rendered. The concept is explained in the text above.</p>
      </div>
    );
  }
  return (
    <div className="my-3 rounded-xl border border-[#E2E0D8] bg-white overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#E2E0D8] bg-[#F5F0E8]">
        <div className="flex items-center gap-2">
          <span className="text-sm">📊</span>
          <span className="text-[#1B2A4A] text-xs font-bold">{label}</span>
        </div>
        <span className="text-[10px] font-bold text-[#0F6E56] bg-[#E1F5EE] px-2 py-0.5 rounded-full border border-[#0F6E56]/20">
          CBSE Class 10
        </span>
      </div>
      <div
        ref={containerRef}
        className="p-4 overflow-x-auto"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </div>
  );
}

// ── Welcome messages ──────────────────────────────────────────────────────────
const WELCOME_EN = `Namaste! 🙏 I'm your EduEdge AI Tutor for CBSE Class 10 Science.

I won't just give you answers — I'll guide you to discover them yourself through questions. That's the Socratic method, and it makes learning stick.

Ask me about any process or topic and I'll show you a diagram alongside my explanation!

What topic would you like to explore today?`;

const WELCOME_HI = `नमस्ते! 🙏 मैं आपका EduEdge AI Tutor हूँ — CBSE कक्षा 10 विज्ञान के लिए।

मैं सीधे उत्तर नहीं दूँगा — बल्कि प्रश्नों के माध्यम से आपको स्वयं उत्तर खोजने में मदद करूँगा।

किसी भी प्रक्रिया या विषय के बारे में पूछें और मैं आपको एक आरेख भी दिखाऊँगा!

आज आप कौन सा विषय पढ़ना चाहते हैं?`;

const SUGGESTIONS = [
  "How does photosynthesis work?",
  "Explain the reflex arc",
  "Show me the water cycle",
  "How does digestion work?",
  "What is Ohm's Law?",
  "Explain blood circulation",
];

// ── Main component ────────────────────────────────────────────────────────────
export default function TutorPage() {
  const [lang, setLang] = useState("en");
  const [messages, setMessages] = useState([
    { role: "assistant", content: WELCOME_EN, diagram: null, ncertImage: null },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const bottomRef = useRef(null);
 
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);
 
  const toggleLang = () => {
    const next = lang === "en" ? "hi" : "en";
    setLang(next);
    if (messages.length === 1 && messages[0].role === "assistant") {
      setMessages([{ role: "assistant", content: next === "hi" ? WELCOME_HI : WELCOME_EN, diagram: null, ncertImage: null }]);
    }
  };
 
  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userText = input.trim();
    setInput("");
 
    const userMsg = { role: "user", content: userText, diagram: null, ncertImage: null };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setLoading(true);
 
    try {
      const apiMessages = updated.map((m) => ({ role: m.role, content: m.content }));
      const { data } = await api.post("/api/ai/chat", { messages: apiMessages, lang, sessionId });
 
      // Detect Mermaid diagram first
      const diagram = detectDiagram(userText, data.message);
      // Only detect NCERT image if no Mermaid diagram matched — avoids showing both for same concept
      const ncertImage = diagram ? null : detectImage(userText, data.message);
 
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message, diagram, ncertImage },
      ]);
      if (data.sessionId && !sessionId) setSessionId(data.sessionId);
    } catch (err) {
      const is429 = err.response?.status === 429;
      const content = is429
        ? "The AI is getting a lot of requests right now. Please wait a few seconds and try again. ⏳"
        : "Connection error. Please check that the backend is running.";
      setMessages((prev) => [...prev, { role: "assistant", content, diagram: null, ncertImage: null }]);
    } finally {
      setLoading(false);
    }
  };
 
  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };
 
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 border-b border-white/[0.07] bg-card flex-shrink-0">
        <div className="min-w-0">
          <h1 className="font-display text-lg font-extrabold text-slate-100">AI Tutor</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="pill pill-blue text-xs">CBSE Class 10</span>
            <span className="text-slate-500 text-xs hidden sm:inline">Science · Socratic · Diagrams + NCERT Images</span>
          </div>
        </div>
 
        {/* Language toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-sm font-semibold text-[#374151]">EN</span>
          <button
            onClick={toggleLang}
            className="relative w-10 h-6 rounded-full transition-colors duration-300 flex-shrink-0"
            style={{ background: lang === "hi" ? "#10B981" : "#374151" }}
          >
            <span
              className="absolute top-0.5 w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full shadow transition-all duration-300"
              style={{ left: lang === "hi" ? "20px" : "2px" }}
            />
          </button>
          <span className="text-sm font-semibold text-[#374151]">हिं</span>
          {lang === "hi" && (
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/25 px-2 py-0.5 rounded-md hidden sm:inline">
              हिंदी Active
            </span>
          )}
        </div>
      </header>
 
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-3 sm:py-5 flex flex-col gap-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 items-end ${m.role === "user" ? "flex-row-reverse" : ""}`}>
            {m.role === "assistant" && (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand to-violet-600 flex items-center justify-center text-lg flex-shrink-0 self-start mt-1">
                🤖
              </div>
            )}
            <div className={`flex flex-col gap-1 ${m.role === "user" ? "items-end max-w-[85%] sm:max-w-[72%]" : "flex-1 min-w-0"}`}>
              {/* Text bubble */}
              {m.content && (
                <div
                  className={`px-3 py-2 sm:px-4 sm:py-3 text-[13px] sm:text-[15px] leading-relaxed whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-gradient-to-br from-brand to-violet-600 text-white rounded-2xl rounded-br-sm"
                      : "ee-card text-[#1c1c1a] rounded-2xl rounded-bl-sm"
                  }`}
                >
                  {m.content}
                </div>
              )}
              {/* Mermaid diagram — assistant only */}
              {m.role === "assistant" && m.diagram && (
                <MermaidDiagram code={m.diagram.code} label={m.diagram.label} />
              )}
              {/* NCERT image — assistant only, only when no Mermaid diagram */}
              {m.role === "assistant" && m.ncertImage && (
                <NCERTImage filename={m.ncertImage.filename} label={m.ncertImage.label} />
              )}
            </div>
          </div>
        ))}
 
        {loading && (
          <div className="flex gap-3 items-end">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand to-violet-600 flex items-center justify-center text-lg flex-shrink-0">
              🤖
            </div>
            <div className="ee-card rounded-2xl rounded-bl-sm">
              <TypingDots />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
 
      {/* Suggestion chips — first message only */}
      {messages.length === 1 && (
        <div className="px-3 sm:px-6 pb-3 flex flex-wrap gap-2 flex-shrink-0">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setInput(s)}
              className="px-2 py-1.5 sm:px-3 sm:py-1.5 rounded-full border border-[#bfdbfe] bg-[#eff6ff] text-[#1a3c6e] text-xs
                         font-medium hover:bg-[#1a3c6e]/10 hover:border-[#1a3c6e]/40 transition-all"
            >
              {s}
            </button>
          ))}
        </div>
      )}
 
      {/* Input bar */}
      <div className="px-3 sm:px-6 py-3 sm:py-4 border-t border-white/[0.07] bg-card flex gap-2 sm:gap-3 items-center flex-shrink-0">
        <input
          className="flex-1 bg-surface border border-white/10 rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-sm
                     text-[#1c1c1a] placeholder:text-[#4b5563] focus:outline-none focus:border-brand transition-colors"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder={
            lang === "hi"
              ? "अपना प्रश्न यहाँ लिखें…"
              : "Ask anything — try 'explain digestion' or 'what is the pH scale'…"
          }
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-white
                     bg-gradient-to-br from-brand to-violet-600 disabled:opacity-40
                     disabled:cursor-not-allowed hover:opacity-90 transition-opacity flex-shrink-0"
        >
          {loading ? <Spinner size={14} /> : <span className="text-lg">↑</span>}
        </button>
      </div>
    </div>
  );
}
 