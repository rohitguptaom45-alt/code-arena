import React from 'react'
import { Link, useSearchParams } from 'react-router-dom'

const termsSections = [
  {
    title: '1. Account Eligibility',
    body: `Aap CodeArena par account tabhi bana sakte hain jab aapki age kam se kam 13 saal ho. Signup ke time aapko apni sahi aur updated details (naam, email, username) deni hongi. Ek user sirf ek hi account rakh sakta hai; multiple/duplicate accounts se contest rankings ko manipulate karna strictly mana hai.`,
  },
  {
    title: '2. Account Security',
    body: `Aapke password aur login credentials ki security aapki apni responsibility hai. Agar aapko lagta hai ki aapka account compromise ho gaya hai, turant humein contact karein. CodeArena kisi bhi unauthorized access se hone wale loss ke liye responsible nahi hoga.`,
  },
  {
    title: '3. Fair Play & Contest Conduct',
    body: `Contests ke dauraan plagiarism, code sharing, multiple accounts se submit karna, ya kisi bhi tarah ka cheating strictly prohibited hai. Agar koi user fair play rules todta paya jaata hai, toh uske submissions disqualify kiye ja sakte hain aur account temporarily ya permanently suspend kiya ja sakta hai.`,
  },
  {
    title: '4. Content & Submissions',
    body: `Aap jo bhi code, comments, bio, ya other content platform par post karte hain, uske liye aap khud responsible hain. CodeArena ko aapke public submissions ko contest leaderboards, profile pages aur analytics me display karne ka right milta hai.`,
  },
  {
    title: '5. Prohibited Activities',
    body: `Platform ko disrupt karna, bots/scripts se automated abuse karna, dusre users ko harass karna, ya illegal content share karna allowed nahi hai. In activities ke violation par account turant band kiya ja sakta hai.`,
  },
  {
    title: '6. Points, Badges & Rewards',
    body: `Contest points, badges aur referral bonuses sirf platform ke andar use hote hain aur inka koi real-world monetary value nahi hai, jab tak specifically mention na kiya gaya ho. CodeArena kabhi bhi points/rewards system ko update ya reset karne ka right rakhta hai.`,
  },
  {
    title: '7. Termination',
    body: `Hum kisi bhi account ko, bina prior notice ke, terms violation ki wajah se suspend ya terminate kar sakte hain. Aap bhi kabhi bhi apna account delete karne ki request kar sakte hain.`,
  },
  {
    title: '8. Changes to Terms',
    body: `Yeh terms samay samay par update ho sakte hain. Kisi bhi major change ki notification aapko email ya platform notification ke through di jayegi. Platform ka use continue karna updated terms ko accept karna maana jayega.`,
  },
  {
    title: '9. Limitation of Liability',
    body: `CodeArena "as-is" basis par provide kiya jaata hai. Hum kisi bhi technical downtime, data loss, ya indirect damages ke liye liable nahi honge, jahan tak applicable law allow karta hai.`,
  },
  {
    title: '10. Contact Us',
    body: `Agar in terms se related aapke koi questions hain, toh humein support@codearena.example par email karein.`,
  },
]

const privacySections = [
  {
    title: '1. Information We Collect',
    body: `Jab aap signup karte hain, hum aapka full name, username, email address, bio, account type aur (optional) GitHub username collect karte hain. Agar aap Google se sign in karte hain, toh Google se sirf basic profile info (naam, email, profile photo) le jaati hai — aapka Google password kabhi bhi humare saath share nahi hota.`,
  },
  {
    title: '2. How We Use Your Data',
    body: `Aapki information ka use hum account create karne, contest leaderboards dikhane, notifications bhejne (jaise welcome messages ya referral rewards), aur platform experience personalize karne ke liye karte hain. Hum aapka data kabhi bhi third-party advertisers ko sell nahi karte.`,
  },
  {
    title: '3. Cookies & Sessions',
    body: `Login sessions ko secure rakhne ke liye hum httpOnly cookies ka use karte hain, jaise Google OAuth login flow ke case me. Yeh cookies sirf authentication ke liye hote hain, tracking/advertising ke liye nahi.`,
  },
  {
    title: '4. Data Sharing',
    body: `Aapka public profile (username, avatar, bio, contest stats) dusre users ko platform par visible hota hai. Aapka email address kabhi bhi publicly display nahi kiya jaata aur kisi third party ke saath share nahi kiya jaata, sirf legal requirement ke case ko chhodkar.`,
  },
  {
    title: '5. Referral Program',
    body: `Agar aap kisi referral link se signup karte hain, toh hum yeh track karte hain ki kisne kisko refer kiya, taaki dono users ko bonus points diye ja sakein. Yeh info sirf internal reward-tracking ke liye use hoti hai.`,
  },
  {
    title: '6. Data Security',
    body: `Hum industry-standard practices (jaise password hashing) use karte hain aapka data secure rakhne ke liye. Lekin koi bhi online system 100% secure nahi hota, isliye apna password kisi ke saath share na karein.`,
  },
  {
    title: '7. Your Rights',
    body: `Aap kabhi bhi apni profile details update kar sakte hain, ya apna account delete karne ki request kar sakte hain. Account delete hone par aapki personal information humare systems se remove kar di jaati hai, contest history ke anonymized records ko chhodkar.`,
  },
  {
    title: '8. Children\u2019s Privacy',
    body: `CodeArena 13 saal se kam age ke bacchon ke liye intended nahi hai. Agar humein pata chalta hai ki kisi minor ne bina parental consent ke account banaya hai, toh us account ko remove kar diya jayega.`,
  },
  {
    title: '9. Changes to This Policy',
    body: `Hum is privacy policy ko samay samay par update kar sakte hain. Koi bhi significant change hone par aapko notification ke through inform kiya jayega.`,
  },
  {
    title: '10. Contact Us',
    body: `Privacy se related kisi bhi query ke liye humein privacy@codearena.example par email karein.`,
  },
]

export default function Legal() {
  const [searchParams, setSearchParams] = useSearchParams()
  const tab = searchParams.get('tab') === 'privacy' ? 'privacy' : 'terms'
  const sections = tab === 'terms' ? termsSections : privacySections

  return (
    <div className="max-w-2xl mx-auto px-5 py-14">
      <Link to="/signup" className="text-accent text-sm font-medium hover:underline">
        ← Back to Signup
      </Link>

      <h1 className="font-display font-bold text-2xl text-ink mt-4 mb-1">
        {tab === 'terms' ? 'Terms & Conditions' : 'Privacy Policy'}
      </h1>
      <p className="text-xs text-ink-soft mb-6">Last updated: August 29, 2026</p>

      <div className="flex gap-2 mb-8 border-b border-border">
        <button
          type="button"
          onClick={() => setSearchParams({ tab: 'terms' })}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
            tab === 'terms' ? 'border-accent text-accent' : 'border-transparent text-ink-soft hover:text-ink'
          }`}
        >
          Terms & Conditions
        </button>
        <button
          type="button"
          onClick={() => setSearchParams({ tab: 'privacy' })}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
            tab === 'privacy' ? 'border-accent text-accent' : 'border-transparent text-ink-soft hover:text-ink'
          }`}
        >
          Privacy Policy
        </button>
      </div>

      <p className="text-sm text-ink-soft mb-8">
        {tab === 'terms'
          ? `Welcome to CodeArena! In terms and conditions ko padhne se pehle please sunischit karein ki aap in sabhi points se agree karte hain. Platform ka use karke, aap in terms ko accept karte hain.`
          : `Aapki privacy humare liye important hai. Yeh policy batati hai ki hum aapki information kaise collect, use aur protect karte hain jab aap CodeArena use karte hain.`}
      </p>

      <div className="space-y-6">
        {sections.map((s) => (
          <section key={s.title}>
            <h2 className="font-semibold text-ink text-base mb-1.5">{s.title}</h2>
            <p className="text-sm text-ink-soft leading-relaxed">{s.body}</p>
          </section>
        ))}
      </div>
    </div>
  )
}