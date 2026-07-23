import React from 'react'
import { plans } from '../data/mockData.js'

export default function Subscription() {
  return (
    <div className="max-w-6xl mx-auto px-5 py-16">
      <div className="text-center mb-12">
        <h1 className="font-display font-bold text-3xl md:text-4xl text-ink">Choose Your Plan</h1>
        <p className="text-ink-soft mt-3">Simple pricing that scales with your ambition. Cancel anytime.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative rounded-2xl p-8 border card-lift ${
              plan.highlight ? 'border-accent shadow-lift bg-white scale-[1.03]' : 'border-border bg-white'
            }`}
          >
            {plan.badge && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-accent text-white text-xs font-semibold whitespace-nowrap">
                {plan.badge}
              </span>
            )}
            <h3 className="font-display font-bold text-xl text-ink mb-1">{plan.name}</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="font-display font-extrabold text-4xl text-ink">{plan.price}</span>
              <span className="text-ink-soft text-sm">{plan.period}</span>
            </div>
            <ul className="space-y-3 mb-8">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-ink-soft">
                  <span className="text-success mt-0.5">✔</span> {f}
                </li>
              ))}
            </ul>
            <button
              className={`w-full py-3 rounded-2xl font-semibold text-sm transition-colors ${
                plan.highlight ? 'bg-accent text-white hover:bg-accent-hover' : 'border border-border text-ink hover:bg-bg-soft'
              }`}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
