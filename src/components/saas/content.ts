// Real Ideas posts (from the staging branch's content/ideas) and
// principles (from the Principles page), copied here so the product
// shell has real text to show. Replace with content-collection reads
// when this moves beyond a concept.

export interface Idea {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // YYYY-MM-DD
  body: string[];
}

export interface Principle {
  num: string;
  title: string;
  body: string;
}

export const principlesIntro =
  "My design process, refined over more than ten years of shipping, repeatable, because it delivers.";

export const ideas: Idea[] = [
  {
    "slug": "why-most-onboarding-flows-fail",
    "title": "Why most onboarding flows fail in the first ten seconds",
    "excerpt": "Users decide whether to trust a product before they've read a single word of copy.",
    "date": "2026-02-18",
    "body": [
      "Most onboarding flows fail before the user reads a single word. They fail on load: the wrong loading state, a layout shift, an empty screen with no signal that something good is coming. By the time the copy loads, the decision is already made.",
      "I've watched session recordings where users bounce inside the first five seconds, long before any real friction shows up. What they're reacting to isn't the flow, it's the room. Does this look like it was built by people who care? Does it feel stable? Those questions get answered visually, instantly, before anyone reads a headline.",
      "The fix isn't better copy. It's treating the first paint like the pitch. Skeleton states that match the real layout. A brand mark that renders instantly. Nothing that flashes, jumps, or looks unfinished. Trust is a visual argument first, a written one second."
    ]
  },
  {
    "slug": "the-best-prototype",
    "title": "The best prototype is the one nobody notices is a prototype",
    "excerpt": "If it looks unfinished, stakeholders panic. If it looks finished, they stop giving real feedback.",
    "date": "2026-01-30",
    "body": [
      "There's a narrow band where a prototype actually works. Too rough and stakeholders panic, certain you're presenting the final product a week before launch. Too polished and they stop giving real feedback, assuming the decisions are already locked.",
      "I aim for the middle: real interactions, real content, obviously placeholder in the two or three places that don't matter yet. That combination gets people reacting to the actual product instead of the idea of it, which is the entire point of prototyping in the first place.",
      "The tell is always the same. When a prototype is right, people forget to mention it's a prototype. They just start talking about the thing."
    ]
  },
  {
    "slug": "simple-isnt-a-compliment",
    "title": "Simple isn't a compliment, it's a discipline",
    "excerpt": "Cutting a feature is a harder conversation than adding one, and that's exactly why it works.",
    "date": "2026-01-09",
    "body": [
      "Nobody fights you when you propose adding a feature. Everyone has a reason it should exist, and saying yes costs nothing in the room. Cutting one is different. Cutting one means someone's idea, sometimes someone's whole quarter, doesn't make the release.",
      "That asymmetry is why most products get more complicated over time and almost never simpler. Simple isn't the default outcome of good taste, it's the result of someone repeatedly winning an argument they didn't have to start.",
      "I've run this discipline on every product I've shipped. The pattern always holds: what survives the cut is what mattered, and the product is better for the things that didn't make it."
    ]
  },
  {
    "slug": "what-ten-years-taught-me-about-saying-no",
    "title": "What ten years of client work taught me about saying no",
    "excerpt": "Every 'no' protected a shipping date. Here's how I learned to say it without sounding difficult.",
    "date": "2025-12-14",
    "body": [
      "Early on, every \"no\" felt like a risk to the relationship. I said yes to scope I didn't have time for, deadlines I didn't believe in, features I knew wouldn't matter, because saying no felt like friction I couldn't afford.",
      "What changed wasn't my willingness to disagree, it was learning to say no in terms the other person already cared about. Not \"I don't think that's a good idea,\" but \"that pushes the launch you asked for by three weeks.\" The date, not the disagreement, does the convincing.",
      "Every no I've given in the last five years protected something specific: a deadline, a budget, a piece of the product that actually mattered. Framed that way, it stopped sounding difficult and started sounding like the thing I was hired to do."
    ]
  },
  {
    "slug": "talking-to-five-users",
    "title": "Talking to five users beats guessing with fifty stakeholders",
    "excerpt": "The most confident room is usually the one that skipped user research.",
    "date": "2025-11-22",
    "body": [
      "Confidence in a product decision has almost no correlation with whether it's right. The rooms I've seen most sure of themselves were, more often than not, the rooms that hadn't talked to a single user that quarter.",
      "Five real conversations with actual users surface more than fifty stakeholders debating from memory and assumption. Users tell you what confused them, what they ignored, what they never even saw. Stakeholders tell you what they'd personally want, which is a much smaller and less useful data set.",
      "I've never regretted a user conversation. I've regretted plenty of assumptions dressed up as consensus."
    ]
  },
  {
    "slug": "the-empty-state",
    "title": "The empty state is where most products quietly lose people",
    "excerpt": "Nobody complains about a blank screen. They just leave.",
    "date": "2025-10-30",
    "body": [
      "Empty states get almost no design attention because they're easy to forget exist. Nobody demos the screen with zero data in it. But it's often the first real screen a new user sees, and a blank dashboard with no explanation reads as \"nothing happens here yet,\" not \"this is where your data will go.\"",
      "The failure mode is silent. Users don't file a bug report for a confusing empty state. They just quietly conclude the product doesn't do much and don't come back to find out otherwise.",
      "I treat every empty state as its own onboarding moment: what should the user do right now, and does the screen say so clearly. It's a small piece of surface area with an outsized effect on whether someone ever gets to the good part of the product."
    ]
  }
];

export const principles: Principle[] = [
  {
    "num": "I.",
    "title": "Show, don't tell",
    "body": "Ten years of shipping taught me decks convince nobody. A working prototype argues my case better than I ever could, so I build the real thing first and explain it second."
  },
  {
    "num": "II.",
    "title": "Simple is hard",
    "body": "Cutting a feature takes more conviction than adding one, and the constraints behind it, time, headcount, scope, never hold still for long. What survives isn't just what mattered on day one, it's what still holds up."
  },
  {
    "num": "III.",
    "title": "Prototype from day one",
    "body": "Specs go stale the moment they're written. I've built this way for a decade: a rough, clickable version in week one beats a polished document in month three, every time."
  },
  {
    "num": "IV.",
    "title": "Bring every stakeholder along",
    "body": "Every product I've shipped had a narrative, and every person touching it needed to hear the same one. I retell it until engineering, sales, and leadership are solving the same problem."
  },
  {
    "num": "V.",
    "title": "Talk to users as early and as often as possible",
    "body": "I've never regretted a user conversation. I've regretted plenty of assumptions. This is the one step I don't skip, no matter how confident the room feels."
  }
];
