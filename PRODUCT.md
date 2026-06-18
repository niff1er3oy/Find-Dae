# Product

## Register

product

## Users

Two distinct user types sharing the same app:

**Photographers**: Photographers and event organizers who shoot events (concerts, marathons, weddings, festivals) and need to distribute photos to attendees at scale. They upload batches of photos after an event and hand off the discovery problem to the system. Context: they are time-pressured, often mobile, and want zero friction bulk upload.

**Attendees**: People who attended an event and want to find photos of themselves. They are casual, mobile-first, Thai-speaking users who may not be tech-savvy. Their core emotion on arrival: mild frustration at not being able to find themselves in a sea of photos. Their core emotion after a successful match: delight and relief.

Thai market, young adult-leaning demographic, primarily mobile.

## Product Purpose

Find Dae is an AI face-recognition photo retrieval service for events. Photographers upload their event photos; attendees upload 3 selfies and the system returns every photo where their face appears — in seconds. Success looks like: attendees find their photos before they leave the event venue. The product removes the labor of manual photo-browsing and the friction of photo-sharing coordination for photographers.

## Brand Personality

**Playful · Trusty · Sharp**

Voice: Casual Thai, warm and encouraging, occasionally cheeky. The app feels like a clever friend who knows where all the photos are. Tone never condescends — it celebrates the win (finding your photo) as a small joy.

Emotional goal: Replace the mild frustration of photo-hunting with a moment of delight. The result screen should feel like a little reveal.

## Anti-references

- Generic enterprise SaaS aesthetic: clean white backgrounds, navy/blue palette, Helvetica-adjacent type, "trusted by 10,000 teams" copy. No Stripe, no Linear, no Notion.
- Stock-photo warmth: cream/sand productivity apps (Notion-adjacent, warm-beige minimal). The warm palette is earned through vibrancy and personality, not muted neutrality.
- Sterile AI tools: minimalist white "powered by AI" dashboards that treat face recognition as a cold utility.

## Design Principles

1. **The reveal is the product.** The moment an attendee sees their photos is the entire point. Every screen before that is setup; design each step to minimize drag toward that payoff.
2. **Earn the warmth.** The orange/pink palette signals friendliness — but warmth must come from vibrancy and craft, not from muted pastels or stock-photo softness. Contrast, saturation, and sharp type carry the energy.
3. **Speed signals trust.** Face recognition is "magic" to most users. Fast feedback loops (loading states, progress, instant results) reinforce that the system is working, not hanging.
4. **Thai-first, globally legible.** Copy is Thai; cultural context is Thai. Layout and hierarchy must work with Thai script's visual weight — avoid all-caps Thai, test line heights at every heading scale.
5. **Playful ≠ imprecise.** The bubbly visual language does not excuse sloppy spacing, weak hierarchy, or low contrast. The craft underneath must be sharp enough that the playfulness reads as confidence, not sloppiness.

## Accessibility & Inclusion

WCAG AA. Key priorities:
- Minimum 4.5:1 contrast for body text (watch the slate-500 on light bg combinations).
- Touch targets ≥ 44×44px on mobile — critical for the selfie-upload flow.
- Reduced-motion alternatives for all anime.js animations.
- Thai script: avoid letterspacing adjustments on body Thai text; they break ligatures.
