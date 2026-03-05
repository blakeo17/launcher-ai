const express = require("express");
const cors = require("cors");
const Anthropic = require("@anthropic-ai/sdk").default;
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(express.json());
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));
app.options("*", cors());

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function scrapeUrl(url) {
  try {
    const res = await fetch(`https://r.jina.ai/${url}`, {
      headers: {
        Accept: "text/plain",
        "X-No-Cache": "true",
      },
      signal: AbortSignal.timeout(10000),
    });
    const text = await res.text();
    return text.slice(0, 8000);
  } catch {
    return "";
  }
}

// ─── Preview prompt — fast, minimal output ────────────────────────────────────
const PREVIEW_PROMPT = `You are a product launch expert. Analyze this product and return ONLY this JSON — no markdown, no explanation, just raw JSON:

{
  "productName": "string — the product name from the page",
  "tagline": "string — sharp one-line description of what it does",
  "preview": {
    "topIssues": ["string", "string", "string"],
    "previewActions": ["string", "string", "string"]
  }
}

RULES:
1. topIssues: exactly 3 specific problems found on their page that are hurting conversions or growth — be direct and name real issues
2. previewActions: exactly 3 teaser actions — specific enough to show value, incomplete enough to leave them wanting the full plan
3. Every string is 1 sentence max. Be specific to this product, never generic.`;

// ─── Full plan prompt ─────────────────────────────────────────────────────────
const FULL_PROMPT = `You are a world-class product launch strategist and growth expert. You analyze indie products, SaaS tools, and AI apps and produce sharp, specific, actionable launch plans.

You will be given:
- The scraped text content of a product's landing page or app listing
- The founder's answers to onboarding questions (budget, product type, stage, main goal)

Your job is to return a single valid JSON object — no markdown, no explanation, just raw JSON — that matches EXACTLY the schema below.

Be specific and direct. Use the actual product name, actual copy from their page, real channel names. Never be generic. Every insight should feel like it was written specifically for this product.

CRITICAL OUTPUT RULES — follow these exactly:
1. Every string value must be 1 sentence maximum. No exceptions. Be punchy and direct.
2. executionPlan.weeks MUST contain EXACTLY 4 weeks. Each week MUST have EXACTLY 3 actions.
3. rankedChannels: maximum 3 items. immediateActions: maximum 3 items.
4. messagingAngles: maximum 2 items. competitiveInsight: maximum 2 items. channelTable: maximum 3 items. channelBreakdowns: maximum 2 items.

Return this exact JSON shape:

{
  "productName": "string — the product name extracted from the page",
  "tagline": "string — a sharp one-line description of what it does",

  "overview": {
    "launchSnapshot": {
      "readinessScore": "number 1-100",
      "biggestWin": "string — the single strongest thing about this product",
      "criticalGap": "string — the single most important thing holding it back",
      "timeToFirstUser": "string — realistic estimate e.g. '7-14 days'"
    },
    "topFocus": {
      "title": "string — the #1 thing they should do right now",
      "description": "string — 2-3 sentences on why this is the priority and what to do",
      "channel": "string — e.g. 'Twitter/X' or 'Reddit'",
      "timeframe": "string — e.g. 'This week'"
    },
    "rankedChannels": [
      { "name": "string", "potential": "High|Medium|Low", "reason": "string — one line" }
    ],
    "immediateActions": [
      { "action": "string", "priority": "High|Medium", "time": "string — e.g. '1h'" }
    ]
  },

  "positioning": {
    "currentHeadline": "string — pulled from their actual page",
    "improvedHeadline": "string — sharper rewrite",
    "whyItWins": "string — 2-3 sentences explaining the strategic reasoning",
    "icp": {
      "primaryUserType": "string",
      "corePainPoint": "string",
      "buyingTrigger": "string",
      "urgencyLevel": "High|Medium|Low"
    },
    "messagingAngles": [
      { "angle": "string — short label", "copy": "string — example headline or hook using this angle" }
    ],
    "competitiveInsight": [
      { "label": "string", "insight": "string" }
    ]
  },

  "revenueChannels": {
    "channelTable": [
      { "channel": "string", "timeToFirstDollar": "string — e.g. '7-14 days'", "rationale": "string" }
    ],
    "channelBreakdowns": [
      {
        "channel": "string",
        "contentAngles": ["string"],
        "cadence": "string — e.g. '2x per day'",
        "conversionMechanism": "string"
      }
    ],
    "operatorRecommendation": "string — 2-3 sentences of direct advice on where to focus"
  },

  "executionPlan": {
    "primaryFocus": {
      "channels": "string — e.g. 'Twitter + Reddit'",
      "revenueGoal": "string — e.g. '$1K MRR'",
      "tagline": "string — one punchy line"
    },
    "weeks": [
      { "week": 1, "theme": "string — e.g. 'Validate'", "actions": ["string", "string", "string"] },
      { "week": 2, "theme": "string — e.g. 'Refine'", "actions": ["string", "string", "string"] },
      { "week": 3, "theme": "string — e.g. 'Convert'", "actions": ["string", "string", "string"] },
      { "week": 4, "theme": "string — e.g. 'Scale'", "actions": ["string", "string", "string"] }
    ]
  }
}`;

function buildUserPrompt(url, answers, pageContent) {
  const [budget, productType, stage, goal] = (answers || []).filter(
    (a) => a !== undefined && a !== null
  );
  return `Product URL: ${url}

Scraped page content:
${pageContent || "Could not scrape page — use the URL and context clues to infer the product."}

Founder's answers:
- Budget for launch: ${budget ?? "Not provided"}
- Type of product: ${productType ?? "Not provided"}
- Current stage: ${stage ?? "Not provided"}
- Main goal right now: ${goal ?? "Not provided"}`;
}

// ─── /analyze — fast preview only ────────────────────────────────────────────
app.post("/analyze", async (req, res) => {
  try {
    const { url, answers, sessionId } = req.body;

    if (!url || !sessionId) {
      return res.status(400).json({ error: "Missing url or sessionId" });
    }

    const pageContent = await scrapeUrl(url);

    if (!pageContent || pageContent.trim().length < 100) {
      return res.status(422).json({
        error: "Could not analyze your landing page — make sure the URL is publicly accessible and try again.",
      });
    }

    const userPrompt = buildUserPrompt(url, answers, pageContent);

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: PREVIEW_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    });

    const raw = message.content[0]?.type === "text" ? message.content[0].text : "";
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.status(500).json({ error: "Failed to parse AI response" });
    }
    const plan = JSON.parse(jsonMatch[0]);

    const { data, error } = await supabase
      .from("launch_plans")
      .insert({ session_id: sessionId, url, answers, plan })
      .select("id")
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({ error: "Failed to save plan" });
    }

    res.json({ id: data.id });
  } catch (err) {
    console.error("Analyze error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── /analyze-full — full plan after payment ──────────────────────────────────
app.post("/analyze-full", async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: "Missing id" });

    // Fetch url + answers from Supabase
    const { data: row, error: fetchError } = await supabase
      .from("launch_plans")
      .select("url, answers, plan")
      .eq("id", id)
      .single();

    if (fetchError || !row) return res.status(404).json({ error: "Plan not found" });

    // Guard: don't regenerate if full plan already exists
    if (row.plan?.overview) {
      return res.json({ ok: true });
    }

    const pageContent = await scrapeUrl(row.url);
    const userPrompt = buildUserPrompt(row.url, row.answers, pageContent);

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 8096,
      system: FULL_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    });

    const raw = message.content[0]?.type === "text" ? message.content[0].text : "";
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return res.status(500).json({ error: "Failed to parse AI response" });

    const fullPlan = JSON.parse(jsonMatch[0]);

    // Preserve the original preview data
    const mergedPlan = { ...fullPlan, preview: row.plan?.preview ?? fullPlan.preview };

    const { error: updateError } = await supabase
      .from("launch_plans")
      .update({ plan: mergedPlan })
      .eq("id", id);

    if (updateError) {
      console.error("Supabase update error:", updateError);
      return res.status(500).json({ error: "Failed to save full plan" });
    }

    res.json({ ok: true });
  } catch (err) {
    console.error("Analyze-full error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get("/health", (_, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Analyze server running on port ${PORT}`));
