import React from 'react'

const groups = {
  Company: ['About Us', 'Careers', 'Blog', 'Announcements'],
  Support: ['Help Center', 'FAQs', 'Contact Us', 'Report Bug'],
  Community: ['Community', 'Feedback', 'API Documentation', 'Download Mobile App'],
  Legal: ['Privacy Policy', 'Terms & Conditions'],
}

export default function More() {
  return (
    <div className="max-w-5xl mx-auto px-5 py-14">
      <h1 className="font-display font-bold text-3xl text-ink mb-2">More</h1>
      <p className="text-ink-soft mb-10 text-sm">Everything else about CodeArena, in one place.</p>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {Object.entries(groups).map(([title, items]) => (
          <div key={title}>
            <h2 className="font-display font-semibold text-lg text-ink mb-4">{title}</h2>
            <div className="grid grid-cols-2 gap-3">
              {items.map((item) => (
                <button key={item} className="card-lift text-left px-4 py-3 rounded-2xl border border-border text-sm text-ink-soft hover:border-accent-soft hover:text-ink">
                  {item}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <section className="bg-bg-soft rounded-2xl p-8 grid md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-display font-semibold text-ink mb-2">Our Mission</h3>
          <p className="text-sm text-ink-soft">Make world-class competitive programming accessible to every developer, everywhere.</p>
        </div>
        <div>
          <h3 className="font-display font-semibold text-ink mb-2">Our Vision</h3>
          <p className="text-sm text-ink-soft">A global arena where skill, not pedigree, decides who gets hired and who gets funded.</p>
        </div>
        <div>
          <h3 className="font-display font-semibold text-ink mb-2">Our Journey</h3>
          <p className="text-sm text-ink-soft">Started in 2023 as a weekend hackathon project; now home to over a million developers.</p>
        </div>
      </section>
    </div>
  )
}
