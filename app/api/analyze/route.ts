import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";

// Extend function timeout — requires Vercel Pro (60s). On Hobby this is ignored.
export const maxDuration = 60;

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Jina AI reader — handles SPAs, Cloudflare, JS-rendered pages. Free, no key needed.
async function scrapeUrl(url: string): Promise<string> {
  try {
    const res = await fetch(`https://r.jina.ai/${url}`, {
      headers: {
        Accept: "text/plain",
        "X-No-Cache": "true",
      },
      signal: AbortSignal.timeout(8000),
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

MANDATORY RULES — never break these:
1. toolsStack.tools MUST contain EXACTLY 5 tools. Always. No exceptions. Each tool MUST include a real working homepage URL.
2. executionPlan.weeks MUST contain EXACTLY 4 weeks (week 1 through week 4). Always. Each week MUST have at least 3 specific actions.
3. toolsStack.tools MUST only recommend mainstream, widely-known tools that founders will recognize. Prioritize tools like: Notion, Figma, Stripe, Mailchimp, ConvertKit, Webflow, Framer, Canva, Zapier, Buffer, Hootsuite, Google Analytics, Hotjar, Intercom, HubSpot, Typeform, Airtable, Linear, Slack, Loom, Calendly, Gumroad, Lemlist, Twitter/X Ads, Reddit Ads, Product Hunt, AppSumo, Beehiiv, Ghost, Substack, Carrd, Notion, Mixpanel, Amplitude, PostHog, Crisp, Tally, Cal.com, Plausible. Never recommend obscure or niche tools a typical founder would not have heard of.

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
      { "name": "string", "purpose": "string", "tag": "string — e.g. 'Distribution'", "url": "string — the tool's homepage URL e.g. 'https://typefully.com'" },
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

export async function POST(req: NextRequest) {
  try {
    const { url, answers, sessionId } = await req.json();

    if (!url || !sessionId) {
      return NextResponse.json({ error: "Missing url or sessionId" }, { status: 400 });
    }

    // Scrape the product page
    const pageContent = await scrapeUrl(url);

    // answers[0] is undefined (step 0 is the URL input, not a choice)
    // filter it out so destructuring aligns: budget, productType, stage, goal
    const [budget, productType, stage, goal] = (answers as string[]).filter(
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
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2500,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    });

    const raw = message.content[0]?.type === "text" ? message.content[0].text : "";

    // Extract JSON robustly
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
    }
    const plan = JSON.parse(jsonMatch[0]);

    // Save to Supabase
    const { data, error } = await supabase
      .from("launch_plans")
      .insert({ session_id: sessionId, url, answers, plan })
      .select("id")
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: "Failed to save plan" }, { status: 500 });
    }

    return NextResponse.json({ id: data.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Analyze error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
