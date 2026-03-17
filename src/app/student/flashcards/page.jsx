"use client";
import { useState } from "react";
import { PageHeader } from "@/components/ui";

const CARDS = [
  { q: "What is photosynthesis?", a: "Plants use sunlight, CO₂ & H₂O to produce glucose and oxygen.\n\n6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂\n\nOccurs in chloroplasts, primarily in the palisade mesophyll cells.", color: "#10B981" },
  { q: "State Ohm's Law", a: "At constant temperature, the current (I) through a conductor is directly proportional to the voltage (V).\n\nV = IR\n\nWhere R is resistance (in Ohms, Ω).", color: "#5B7FFF" },
  { q: "What is a reflex arc?", a: "The neural pathway for an involuntary reflex response:\n\nReceptor → Sensory nerve → Spinal cord → Motor nerve → Effector\n\nBypasses the brain for faster response time.", color: "#F59E0B" },
  { q: "Define neutralisation", a: "The reaction between an acid and a base to produce salt and water.\n\nAcid + Base → Salt + Water\n\nExample: HCl + NaOH → NaCl + H₂O\n\npH of the resulting solution = 7 (neutral).", color: "#EF4444" },
];

export default function FlashcardsPage() {
  const [flipped, setFlipped] = useState({});
  const [done, setDone] = useState({});

  return (
    <div className="p-7">
      <PageHeader
        title="Revision Flashcards"
        subtitle="CBSE Class 10 Science · Click any card to flip"
      />

      <div className="grid grid-cols-2 gap-5">
        {CARDS.map((card, i) => (
          <div
            key={i}
            onClick={() => setFlipped((f) => ({ ...f, [i]: !f[i] }))}
            className="cursor-pointer"
            style={{ perspective: "800px", height: 170 }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                transformStyle: "preserve-3d",
                transition: "transform 0.5s",
                transform: flipped[i] ? "rotateY(180deg)" : "rotateY(0deg)",
              }}
            >
              {/* Front */}
              <div
                className="absolute inset-0 ee-card flex flex-col items-center justify-between p-5 text-center"
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  borderTop: `3px solid ${card.color}`,
                }}
              >
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: card.color }}>
                  Question
                </span>
                <p className="font-display font-bold text-slate-100 text-base leading-snug">{card.q}</p>
                <span className="text-slate-600 text-xs">tap to reveal →</span>
              </div>

              {/* Back */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center p-5 text-center rounded-xl"
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  background: card.color,
                }}
              >
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-3">Answer</span>
                <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">{card.a}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Spaced repetition callout */}
      <div className="mt-5 ee-card p-4 flex items-center gap-4">
        <span className="text-2xl">📅</span>
        <div className="flex-1">
          <p className="font-display font-bold text-slate-200 text-sm">Spaced Repetition Schedule</p>
          <p className="text-slate-500 text-xs mt-1">
            Next review: Photosynthesis in 2 days · Ohm&apos;s Law in 5 days · Reflex Arc in 7 days
          </p>
        </div>
        <span className="pill pill-blue flex-shrink-0">SM-2 Algorithm</span>
      </div>
    </div>
  );
}
