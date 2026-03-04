import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Use service role key to bypass RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Webhook signature error:", message);
    return NextResponse.json({ error: `Webhook error: ${message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const planId = session.metadata?.plan_id;

    if (planId) {
      const { error } = await supabase
        .from("launch_plans")
        .update({ unlocked: true })
        .eq("id", planId);

      if (error) {
        console.error("Supabase unlock error:", error);
        return NextResponse.json({ error: "Failed to unlock plan" }, { status: 500 });
      }

      console.log(`Plan ${planId} unlocked via Stripe payment.`);
    }
  }

  return NextResponse.json({ received: true });
}
