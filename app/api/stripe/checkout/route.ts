import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { planId } = await req.json();

    if (!planId) {
      return NextResponse.json({ error: "Missing planId" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Launcher AI — Full Launch Dashboard",
              description:
                "Complete launch plan: positioning strategy, revenue channels, week-by-week execution plan, and custom tools stack.",
            },
            unit_amount: 1900, // $19.00
          },
          quantity: 1,
        },
      ],
      metadata: { plan_id: planId },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/${planId}?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/preview/${planId}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Stripe checkout error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
