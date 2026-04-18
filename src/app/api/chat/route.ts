import { NextResponse } from "next/server";

type ChatBody = {
  messages?: Array<{ role: string; content: string }>;
};

export async function POST(req: Request) {
  let body: ChatBody = {};
  try {
    body = (await req.json()) as ChatBody;
  } catch {
    return NextResponse.json({ reply: "Invalid JSON payload." }, { status: 400 });
  }

  const lastMessage = body.messages?.[body.messages.length - 1]?.content?.trim();
  if (!lastMessage) {
    return NextResponse.json({ reply: "Please provide a message." }, { status: 400 });
  }

  const message = lastMessage.toLowerCase();

  if (message.includes("pricing") || message.includes("meridian") || message.includes("zenith")) {
    return NextResponse.json({
      reply:
        "Origin is free with 3 models and 500K monthly inferences. Meridian is $79/mo billed annually with unlimited models, 5M inferences, and priority support. Zenith is enterprise custom with dedicated infrastructure and 24/7 CSM coverage.",
    });
  }

  if (message.includes("vpc") || message.includes("deploy") || message.includes("cloud")) {
    return NextResponse.json({
      reply:
        "Yes. Synthara supports private deployment patterns, including dedicated VPC footprints for regulated environments with RBAC, audit trails, and policy controls.",
    });
  }

  if (message.includes("drift") || message.includes("observability") || message.includes("explain")) {
    return NextResponse.json({
      reply:
        "The Observability Suite covers drift detection, explainability, and cost diagnostics. Teams can trace prediction changes, isolate regressions, and run remediation workflows before incidents spread.",
    });
  }

  return NextResponse.json({
    reply:
      "Happy to help. I can walk you through platform capabilities, deployment architecture, evaluation strategy, or pricing fit based on your use case.",
  });
}
