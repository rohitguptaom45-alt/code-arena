import React from "react"
import CommunityFeed from "../components/CommunityFeed.jsx"

export default function Community() {
  return (
    <div className="max-w-3xl mx-auto px-5 py-12">
      <div className="mb-8">
        <h1 className="font-display font-extrabold text-3xl text-ink mb-2">Community</h1>
        <p className="text-ink-soft text-sm leading-relaxed">
          The global discussion feed — share wins, ask questions, or talk shop with everyone on the platform.
        </p>
      </div>
      <CommunityFeed showHeading={false} />
    </div>
  )
}
