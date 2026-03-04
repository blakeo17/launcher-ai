const express = require("express");
const cors = require("cors");
const Anthropic = require("@anthropic-ai/sdk").default;
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(express.json());
app.use(cors()); // allow requests from Vercel frontend

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Jina AI reader — handles SPAs, Cloudflare, JS-rendered pages
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

const SYSTEM_PROMPT = `You are a world-class product launch strategist and growth expert. You analyze indie products, SaaS tools, and AI apps and produce sharp, specific, actionable launch plans.

You will be given:
- The scraped text content of a product's landing page or app listing
- The founder's answers to onboarding questions (budget, product type, stage, main goal)

Your job is to return a single valid JSON object — no markdown, no explanation, just raw JSON — that matches EXACTLY the schema below.

Be specific and direct. Use the actual product name, actual copy from their page, real channel names. Never be generic. Every insight should feel like it was written specifically for this product.

CRITICAL OUTPUT RULES — follow these exactly:
1. Every string value must be 1 sentence maximum. No exceptions. Be punchy and direct.
2. toolsStack.tools MUST contain EXACTLY 5 tools. Each tool MUST include a real working homepage URL.
3. executionPlan.weeks MUST contain EXACTLY 4 weeks. Each week MUST have EXACTLY 3 actions.
4. rankedChannels: maximum 3 items. immediateActions: maximum 3 items. recommendedStack: maximum 3 items.
5. messagingAngles: maximum 2 items. competitiveInsight: maximum 2 items. channelTable: maximum 3 items. channelBreakdowns: maximum 2 items. whyItWorks: maximum 2 items. preview.topIssues: exactly 3 items. preview.previewActions: exactly 3 items.
6. toolsStack.tools MUST only use mainstream tools founders know: Notion, Figma, Stripe, Mailchimp, ConvertKit, Webflow, Framer, Canva, Zapier, Buffer, Google Analytics, Hotjar, Intercom, HubSpot, Typeform, Airtable, Linear, Loom, Calendly, Gumroad, Product Hunt, AppSumo, Beehiiv, Substack, Mixpanel, PostHog, Crisp, Plausible.

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
    "positioningUpgrade": {
      "current": "string — their current headline or value prop (pulled from their page)",
      "improved": "string — a sharper rewrite"
    },
    "rankedChannels": [
      { "name": "string", "potential": "High|Medium|Low", "reason": "string — one line" }
    ],
    "immediateActions": [
      { "action": "string", "priority": "High|Medium", "time": "string — e.g. '1h'" }
    ],
    "recommendedStack": [
      { "tool": "string", "purpose": "string" }
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
    "stats": {
      "channelConfidence": "string — e.g. 'High'",
      "revenuePredictability": "string — e.g. 'Medium'",
      "acquisitionCostRisk": "string — e.g. 'Low'"
    },
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
  },

  "toolsStack": {
    "tools": [
      { "name": "string", "purpose": "string", "tag": "string — e.g. 'Distribution'", "url": "string — the tool's homepage URL" },
      { "name": "string", "purpose": "string", "tag": "string", "url": "string" },
      { "name": "string", "purpose": "string", "tag": "string", "url": "string" },
      { "name": "string", "purpose": "string", "tag": "string", "url": "string" },
      { "name": "string", "purpose": "string", "tag": "string", "url": "string" }
    ],
    "whyItWorks": ["string"],
    "stackPrinciple": "string — one punchy philosophy statement"
  },

  "preview": {
    "topIssues": ["string — real specific issues found on their page"],
    "previewActions": ["string — teaser action items, specific but not complete"]
  }
}`;

app.post("/analyze", async (req, res) => {
  try {
    const { url, answers, sessionId } = req.body;

    if (!url || !sessionId) {
      return res.status(400).json({ error: "Missing url or sessionId" });
    }

    const pageContent = await scrapeUrl(url);

    // answers[0] is undefined (step 0 is URL input, not a choice)
    const [budget, productType, stage, goal] = (answers || []).filter(
      (a) => a !== undefined && a !== null
    );

    const userPrompt = `Product URL: ${url}

Scraped page content:
${pageContent || "Could not scrape page — use the URL and context clues to infer the product."}

Founder's answers:
- Budget for launch: ${budget ?? "Not provided"}
- Type of product: ${productType ?? "Not provided"}
- Current stage: ${stage ?? "Not provided"}
- Main goal right now: ${goal ?? "Not provided"}

Analyze this product thoroughly and return the JSON launch plan.`;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 8096,
      system: SYSTEM_PROMPT,
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

app.get("/health", (_, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Analyze server running on port ${PORT}`));
