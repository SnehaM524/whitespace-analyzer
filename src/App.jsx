import React, { useState, useEffect } from "react";

// WHITESPACE. Competitive Messaging Analyzer.
// Reads competitors' live positioning, maps the crowded themes,
// and surfaces the open angle nobody owns.

export default function WhitespaceAnalyzer() {
  const [category, setCategory] = useState("AI sales & GTM platforms");
  const [yourCompany, setYourCompany] = useState("Actively AI");
  const [competitors, setCompetitors] = useState(["Clay", "Apollo.io", "6sense"]);
  const [status, setStatus] = useState("idle");
  const [stage, setStage] = useState("");
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const id = "ws-fonts";
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@400;500;600;700;800;900&family=Hanken+Grotesk:wght@400;500;600;700&display=swap";
      document.head.appendChild(link);
    }
  }, []);

  const updateCompetitor = (i, val) => {
    const next = [...competitors];
    next[i] = val;
    setCompetitors(next);
  };
  const addCompetitor = () => {
    if (competitors.length < 4) setCompetitors([...competitors, ""]);
  };
  const removeCompetitor = (i) => {
    setCompetitors(competitors.filter((_, idx) => idx !== i));
  };

  const run = async () => {
    const cleaned = competitors.map((c) => c.trim()).filter(Boolean);
    if (cleaned.length < 2) {
      setErrorMsg("Add at least 2 competitors to find the white space.");
      setStatus("error");
      return;
    }
    setStatus("running");
    setErrorMsg("");
    setResult(null);
    setStage("Researching live positioning");

    const prompt = `You are a sharp B2B positioning strategist. Analyze the competitive messaging landscape in the category: "${category}".

The company seeking white space is: "${yourCompany}".
The competitors to analyze are: ${cleaned.map((c) => `"${c}"`).join(", ")}.

Use web search to read each competitor's CURRENT homepage / positioning. For each, identify the actual language they lead with (taglines, category claims, value props). Base this on what they really say today, not assumptions.

Then return ONLY a JSON object (no preamble, no markdown fences) with this exact shape:
{
  "competitors": [
    {
      "name": "string",
      "tagline": "their actual lead message, short",
      "pillars": ["3 short messaging pillars they emphasize"],
      "angle": "one sentence: the core narrative they are betting on",
      "x": "number 0 to 100, this brand's position on the x axis",
      "y": "number 0 to 100, this brand's position on the y axis"
    }
  ],
  "axes": {
    "x": "label for the horizontal positioning dimension, two or three words",
    "y": "label for the vertical positioning dimension, two or three words"
  },
  "saturated": ["three or four themes nearly everyone in this set is crowding into"],
  "whitespace": {
    "headline": "the single open angle nobody is owning, as a bold phrase",
    "rationale": "2 sentences on why this gap exists and why it matters to buyers",
    "positioning_statement": "a ready-to-use positioning line ${yourCompany} could own",
    "x": "number 0 to 100, where the open territory sits on the x axis",
    "y": "number 0 to 100, where the open territory sits on the y axis"
  },
  "fastest_move": "one concrete thing ${yourCompany}'s marketing could ship this week to claim that white space, followed by one short sentence on why that move fits this specific gap"
}

Keep every string tight and editorial. No fluff. Return valid JSON only.

WRITING RULES (strict): Never use em dashes, en dashes, or hyphens as punctuation anywhere in your output. Do not use hyphens to join words either; write "ready to use" not "ready-to-use", and "go to market" not "go-to-market". Use only short, complete sentences. No run-on sentences. If a thought is long, split it into two sentences.

RECOMMENDATION RULES: For "fastest_move", do not default to a landing page or a blog post unless that is genuinely the sharpest move for this exact gap. Choose the move that truly fits the white space, drawing from a wide range such as a bold point of view essay, a head to head comparison page, a customer proof asset or case study, a provocative campaign hook, a product demo framing, a sales talk track, a webinar or panel, a benchmark or original data report, or an analyst or press angle. Pick deliberately based on the gap you found, and vary your choice across different inputs.

POSITIONING MAP RULES: Choose two axes that capture the most meaningful strategic tension in this category, not generic ones. Each axis label should name a real spectrum buyers care about. Place each competitor honestly based on their actual positioning, and let them cluster where they genuinely overlap. The whitespace x and y must sit in an open region of the map where no competitor is, so the gap is visually obvious.`;

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 3000,
          messages: [{ role: "user", content: prompt }],
          tools: [{ type: "web_search_20250305", name: "web_search" }],
        }),
      });

      if (!response.ok) throw new Error("Request failed (" + response.status + ")");
      setStage("Mapping the landscape");
      const data = await response.json();

      const text = (data.content || [])
        .map((b) => (b.type === "text" ? b.text : ""))
        .filter(Boolean)
        .join("\n");

      const first = text.indexOf("{");
      const last = text.lastIndexOf("}");
      if (first === -1 || last === -1) throw new Error("Could not parse the analysis.");
      const parsed = JSON.parse(text.slice(first, last + 1));

      setResult(parsed);
      setStatus("done");
    } catch (e) {
      setErrorMsg(e.message || "Something went wrong. Try again.");
      setStatus("error");
    }
  };

  // palette
  const ink = "#15161A";
  const sub = "#6B6F76";
  const line = "#E6E4DE";
  const bg = "#FBFAF7";
  const card = "#FFFFFF";
  const accent = "#3D5AFE";
  const accentSoft = "#EEF1FF";

  const sans = "'Hanken Grotesk', sans-serif";
  const display = "'Schibsted Grotesk', sans-serif";

  const S = {
    wrap: {
      background: bg,
      color: ink,
      minHeight: "100%",
      fontFamily: sans,
      backgroundImage:
        "radial-gradient(circle at 12% 0%, rgba(61,90,254,0.05), transparent 38%)",
    },
    inner: { maxWidth: 920, margin: "0 auto", padding: "56px 28px 90px" },
    badge: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      fontFamily: display,
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: "0.04em",
      color: accent,
      background: accentSoft,
      padding: "6px 12px",
      borderRadius: 100,
      marginBottom: 22,
    },
    h1: {
      fontFamily: display,
      fontWeight: 800,
      fontSize: 46,
      lineHeight: 1.04,
      letterSpacing: "-0.025em",
      margin: "0 0 14px",
    },
    lede: { fontSize: 17, lineHeight: 1.55, color: sub, maxWidth: 540, margin: 0 },
    panel: {
      marginTop: 38,
      border: `1px solid ${line}`,
      background: card,
      borderRadius: 16,
      padding: "28px",
      boxShadow: "0 1px 2px rgba(20,22,26,0.04), 0 10px 30px rgba(20,22,26,0.05)",
    },
    label: {
      fontFamily: display,
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: "0.02em",
      color: sub,
      display: "block",
      marginBottom: 8,
    },
    input: {
      width: "100%",
      boxSizing: "border-box",
      padding: "12px 14px",
      border: `1px solid ${line}`,
      borderRadius: 10,
      background: "#FCFCFB",
      color: ink,
      fontFamily: sans,
      fontSize: 15,
      outline: "none",
      transition: "border-color 0.15s, box-shadow 0.15s",
    },
    row: { display: "flex", gap: 14, flexWrap: "wrap" },
    col: { flex: 1, minWidth: 220, marginBottom: 20 },
    compRow: { display: "flex", gap: 8, alignItems: "center", marginBottom: 10 },
    chip: {
      fontFamily: display,
      fontWeight: 600,
      fontSize: 13,
      width: 24,
      color: accent,
      flexShrink: 0,
    },
    iconBtn: {
      border: `1px solid ${line}`,
      background: "#FCFCFB",
      width: 42,
      height: 44,
      borderRadius: 10,
      cursor: "pointer",
      fontSize: 18,
      color: sub,
      flexShrink: 0,
    },
    addBtn: {
      border: `1px dashed ${line}`,
      background: "transparent",
      color: sub,
      padding: "10px 16px",
      borderRadius: 10,
      cursor: "pointer",
      fontFamily: display,
      fontSize: 13,
      fontWeight: 600,
      marginTop: 4,
    },
    cta: {
      marginTop: 26,
      width: "100%",
      padding: "16px",
      background: ink,
      color: "#fff",
      border: "none",
      borderRadius: 12,
      cursor: "pointer",
      fontFamily: display,
      fontWeight: 700,
      fontSize: 16,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
    },
    err: { marginTop: 14, color: "#D8431F", fontSize: 14, fontWeight: 500 },
  };

  const focusOn = (e) => {
    e.target.style.borderColor = accent;
    e.target.style.boxShadow = `0 0 0 3px ${accentSoft}`;
  };
  const focusOff = (e) => {
    e.target.style.borderColor = line;
    e.target.style.boxShadow = "none";
  };

  return (
    <div style={S.wrap}>
      <div style={S.inner}>
        <div style={S.badge}>
          <span style={{ width: 6, height: 6, borderRadius: 6, background: accent }} />
          Competitive Messaging Analyzer
        </div>
        <h1 style={S.h1}>
          Find the angle<br />nobody owns.
        </h1>
        <p style={S.lede}>
          Drop in your competitors. WHITESPACE reads their live positioning, maps where
          everyone is crowded, and surfaces the open territory you can claim.
        </p>

        <div style={S.panel}>
          <div style={S.row}>
            <div style={S.col}>
              <label style={S.label}>Category</label>
              <input
                style={S.input}
                value={category}
                onFocus={focusOn}
                onBlur={focusOff}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. AI sales platforms"
              />
            </div>
            <div style={S.col}>
              <label style={S.label}>Your company</label>
              <input
                style={S.input}
                value={yourCompany}
                onFocus={focusOn}
                onBlur={focusOff}
                onChange={(e) => setYourCompany(e.target.value)}
                placeholder="e.g. Actively AI"
              />
            </div>
          </div>

          <label style={S.label}>Competitors</label>
          {competitors.map((c, i) => (
            <div key={i} style={S.compRow}>
              <span style={S.chip}>{String(i + 1).padStart(2, "0")}</span>
              <input
                style={{ ...S.input, flex: 1 }}
                value={c}
                onFocus={focusOn}
                onBlur={focusOff}
                onChange={(e) => updateCompetitor(i, e.target.value)}
                placeholder="Company name or URL"
              />
              {competitors.length > 2 && (
                <button style={S.iconBtn} onClick={() => removeCompetitor(i)}>
                  ×
                </button>
              )}
            </div>
          ))}
          {competitors.length < 4 && (
            <button style={S.addBtn} onClick={addCompetitor}>
              + Add competitor
            </button>
          )}

          <button
            style={{ ...S.cta, opacity: status === "running" ? 0.7 : 1 }}
            onClick={run}
            disabled={status === "running"}
          >
            {status === "running" ? (
              <>
                <Spinner />
                {stage}
              </>
            ) : (
              "Find the white space"
            )}
          </button>

          {status === "error" && <div style={S.err}>{errorMsg}</div>}
        </div>

        {status === "done" && result && (
          <Results
            result={result}
            ink={ink}
            sub={sub}
            line={line}
            card={card}
            accent={accent}
            accentSoft={accentSoft}
            display={display}
          />
        )}
      </div>

      <style>{`
        @keyframes ws-spin { to { transform: rotate(360deg); } }
        @keyframes ws-rise { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
      `}</style>
    </div>
  );
}

function Spinner() {
  return (
    <span
      style={{
        width: 16,
        height: 16,
        border: "2px solid rgba(255,255,255,0.35)",
        borderTopColor: "#fff",
        borderRadius: "50%",
        display: "inline-block",
        animation: "ws-spin 0.7s linear infinite",
      }}
    />
  );
}

function Results({ result, ink, sub, line, card, accent, accentSoft, display }) {
  const sectionLabel = {
    fontFamily: display,
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: "0.02em",
    color: sub,
    marginBottom: 18,
    display: "flex",
    alignItems: "center",
    gap: 10,
  };
  const rule = { flex: 1, height: 1, background: line };

  return (
    <div style={{ marginTop: 56, animation: "ws-rise 0.5s ease both" }}>
      <div style={sectionLabel}>
        Positioning map <span style={rule} />
      </div>
      <PositioningMap
        result={result}
        ink={ink}
        sub={sub}
        line={line}
        card={card}
        accent={accent}
        display={display}
      />

      <div style={{ ...sectionLabel, marginTop: 46 }}>
        The landscape <span style={rule} />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 16,
        }}
      >
        {result.competitors?.map((c, i) => (
          <div
            key={i}
            style={{
              border: `1px solid ${line}`,
              borderRadius: 14,
              padding: "20px",
              background: card,
              boxShadow: "0 1px 2px rgba(20,22,26,0.04)",
            }}
          >
            <div style={{ fontFamily: display, fontWeight: 700, fontSize: 19, marginBottom: 4 }}>
              {c.name}
            </div>
            <div style={{ fontSize: 14, color: accent, fontWeight: 600, marginBottom: 12 }}>
              “{c.tagline}”
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.5, color: sub, marginBottom: 12 }}>
              {c.angle}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {(c.pillars || []).map((p, j) => (
                <span
                  key={j}
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    background: "#F4F3EF",
                    color: "#54585F",
                    padding: "4px 9px",
                    borderRadius: 7,
                  }}
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ ...sectionLabel, marginTop: 46 }}>
        Saturated territory <span style={rule} />
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        {result.saturated?.map((s, i) => (
          <span
            key={i}
            style={{
              fontSize: 15,
              fontWeight: 500,
              padding: "9px 15px",
              borderRadius: 9,
              background: "#F4F3EF",
              color: "#9A9089",
              textDecoration: "line-through",
              textDecorationColor: "#D8431F",
              textDecorationThickness: 2,
            }}
          >
            {s}
          </span>
        ))}
      </div>

      <div
        style={{
          marginTop: 46,
          background: ink,
          color: "#fff",
          padding: "42px 38px",
          borderRadius: 20,
          backgroundImage:
            "radial-gradient(circle at 90% 0%, rgba(61,90,254,0.32), transparent 55%)",
        }}
      >
        <div
          style={{
            fontFamily: display,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#9DB0FF",
            marginBottom: 18,
          }}
        >
          The white space
        </div>
        <div
          style={{
            fontFamily: display,
            fontWeight: 800,
            fontSize: 38,
            lineHeight: 1.06,
            letterSpacing: "-0.025em",
            marginBottom: 18,
          }}
        >
          {result.whitespace?.headline}
        </div>
        <div style={{ fontSize: 16, lineHeight: 1.65, color: "#C7CBD4", maxWidth: 620 }}>
          {result.whitespace?.rationale}
        </div>
        <div
          style={{
            marginTop: 26,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 12,
            padding: "20px 22px",
          }}
        >
          <div
            style={{
              fontFamily: display,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#9DB0FF",
              marginBottom: 8,
            }}
          >
            Positioning line to own
          </div>
          <div style={{ fontSize: 19, lineHeight: 1.4, fontWeight: 500 }}>
            {result.whitespace?.positioning_statement}
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: 18,
          border: `1px solid ${line}`,
          background: accentSoft,
          borderRadius: 14,
          padding: "22px 24px",
          display: "flex",
          gap: 14,
          alignItems: "flex-start",
        }}
      >
        <span style={{ fontSize: 20 }}>⚡</span>
        <div>
          <div
            style={{
              fontFamily: display,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: accent,
              marginBottom: 6,
            }}
          >
            Ship this week
          </div>
          <div style={{ fontSize: 16, lineHeight: 1.55, color: ink }}>
            {result.fastest_move}
          </div>
        </div>
      </div>
    </div>
  );
}

function PositioningMap({ result, ink, sub, line, card, accent, display }) {
  const W = 680;
  const H = 460;
  const pad = 64;
  const plotW = W - pad * 2;
  const plotH = H - pad * 2;

  const num = (v, fallback) => {
    const n = typeof v === "number" ? v : parseFloat(v);
    return isNaN(n) ? fallback : Math.max(0, Math.min(100, n));
  };

  const px = (x) => pad + (num(x, 50) / 100) * plotW;
  const py = (y) => pad + (1 - num(y, 50) / 100) * plotH; // invert so high y is up

  const comps = result.competitors || [];
  const ws = result.whitespace || {};
  const axisX = result.axes?.x || "Positioning axis";
  const axisY = result.axes?.y || "Positioning axis";

  const wsx = px(ws.x);
  const wsy = py(ws.y);

  return (
    <div
      style={{
        border: `1px solid ${line}`,
        borderRadius: 16,
        background: card,
        padding: "18px 14px 10px",
        boxShadow: "0 1px 2px rgba(20,22,26,0.04)",
        overflowX: "auto",
      }}
    >
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ minWidth: 520, display: "block" }}>
        <defs>
          <radialGradient id="wsGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={accent} stopOpacity="0.32" />
            <stop offset="60%" stopColor={accent} stopOpacity="0.10" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* grid */}
        {[0.25, 0.5, 0.75].map((t, i) => (
          <g key={i}>
            <line
              x1={pad + t * plotW}
              y1={pad}
              x2={pad + t * plotW}
              y2={pad + plotH}
              stroke={line}
              strokeDasharray="3 4"
            />
            <line
              x1={pad}
              y1={pad + t * plotH}
              x2={pad + plotW}
              y2={pad + t * plotH}
              stroke={line}
              strokeDasharray="3 4"
            />
          </g>
        ))}

        {/* frame */}
        <rect x={pad} y={pad} width={plotW} height={plotH} fill="none" stroke={line} />

        {/* white space glow + marker */}
        <circle cx={wsx} cy={wsy} r="72" fill="url(#wsGlow)" />
        <circle cx={wsx} cy={wsy} r="9" fill={accent} />
        <circle cx={wsx} cy={wsy} r="9" fill="none" stroke={accent} strokeOpacity="0.4">
          <animate attributeName="r" from="9" to="26" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.5" to="0" dur="1.8s" repeatCount="indefinite" />
        </circle>
        <text
          x={wsx}
          y={wsy - 18}
          textAnchor="middle"
          fontFamily={display}
          fontSize="13"
          fontWeight="700"
          fill={accent}
        >
          White space
        </text>

        {/* competitors */}
        {comps.map((c, i) => {
          const cx = px(c.x);
          const cy = py(c.y);
          const labelLeft = cx > W - 130;
          return (
            <g key={i}>
              <circle cx={cx} cy={cy} r="7" fill={ink} />
              <text
                x={labelLeft ? cx - 12 : cx + 12}
                y={cy + 4}
                textAnchor={labelLeft ? "end" : "start"}
                fontFamily={display}
                fontSize="13"
                fontWeight="600"
                fill={ink}
              >
                {c.name}
              </text>
            </g>
          );
        })}

        {/* axis labels */}
        <text
          x={pad + plotW / 2}
          y={H - 18}
          textAnchor="middle"
          fontFamily={display}
          fontSize="12"
          fontWeight="600"
          fill={sub}
        >
          {axisX} →
        </text>
        <text
          x={-(pad + plotH / 2)}
          y={20}
          transform="rotate(-90)"
          textAnchor="middle"
          fontFamily={display}
          fontSize="12"
          fontWeight="600"
          fill={sub}
        >
          {axisY} →
        </text>
      </svg>
    </div>
  );
}
