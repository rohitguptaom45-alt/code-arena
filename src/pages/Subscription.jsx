import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { plans } from '../data/mockData.js'
import { submitPayment, getUserPayments, redeemPointsForDiscount, POINTS_PER_RUPEE } from '../utils/appData.js'
const UPI_VPA = '9226575170@upi'
const UPI_PAYEE_NAME = 'CodeArena'
const QR_WINDOW_SECONDS = 10 * 60
function planAmount(plan) {
  const digits = plan.price.replace(/[^\d]/g, '')
  return digits ? parseInt(digits, 10) : 0
}
function buildUpiUri({ amount, note, refId }) {
  const params = new URLSearchParams({
    pa: UPI_VPA,
    pn: UPI_PAYEE_NAME,
    am: String(amount),
    cu: 'INR',
    tn: note,
    tr: refId,
  })
  return `upi://pay?${params.toString()}`
}
function formatMMSS(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}
export default function Subscription() {
  const user = useSelector((s) => s.auth.user)
  const [activePlan, setActivePlan] = useState(null)
  const [payments, setPayments] = useState(user ? getUserPayments(user.username) : [])
  const refreshPayments = () => {
    if (user) setPayments(getUserPayments(user.username))
  }
  return (
    <div className="max-w-6xl mx-auto px-5 py-16">
      <div className="text-center mb-12">
        <h1 className="font-display font-bold text-3xl md:text-4xl text-ink">Choose Your Plan</h1>
        <p className="text-ink-soft mt-3">Simple pricing that scales with your ambition. Cancel anytime.</p>
        {user?.subscription?.active && (
          <div className="mt-4 inline-block px-4 py-2 rounded-2xl bg-success/10 border border-success/30 text-success text-sm font-medium">
            ✅ Active plan: {user.subscription.plan} — renews{' '}
            {new Date(user.subscription.expiresAt).toLocaleDateString('en-IN')}
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const amount = planAmount(plan)
          return (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 border card-lift ${plan.highlight ? 'border-accent shadow-lift bg-white scale-[1.03]' : 'border-border bg-white'}`}
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
              {amount === 0 ? (
                <button
                  disabled
                  className="w-full py-3 rounded-2xl font-semibold text-sm border border-border text-ink-soft"
                >
                  Included for everyone
                </button>
              ) : !user ? (
                <Link
                  to="/login"
                  className="block text-center w-full py-3 rounded-2xl font-semibold text-sm bg-accent text-white hover:bg-accent-hover"
                >
                  Log in to subscribe
                </Link>
              ) : (
                <button
                  onClick={() => setActivePlan(plan)}
                  className={`w-full py-3 rounded-2xl font-semibold text-sm transition-colors ${plan.highlight ? 'bg-accent text-white hover:bg-accent-hover' : 'border border-border text-ink hover:bg-bg-soft'}`}
                >
                  {plan.cta}
                </button>
              )}
            </div>
          )
        })}
      </div>

      {user && payments.length > 0 && (
        <div className="mt-14 max-w-2xl mx-auto">
          <h2 className="font-display font-bold text-xl text-ink mb-4">Your payment history</h2>
          <div className="space-y-3">
            {payments.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between border border-border rounded-2xl px-4 py-3 text-sm"
              >
                <div>
                  <div className="font-semibold text-ink">
                    {p.plan} — ₹{p.amount}
                  </div>
                  <div className="text-ink-soft text-xs">
                    UTR: {p.utr} · {new Date(p.createdAt).toLocaleString('en-IN')}
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${p.status === 'approved' ? 'bg-success/10 text-success' : p.status === 'rejected' ? 'bg-danger/10 text-danger' : 'bg-warning/10 text-warning'}`}
                >
                  {p.status === 'approved'
                    ? '✅ Verified'
                    : p.status === 'rejected'
                      ? '✗ Rejected'
                      : '⏳ Pending review'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activePlan && (
        <PaymentModal
          plan={activePlan}
          user={user}
          onClose={() => {
            setActivePlan(null)
            refreshPayments()
          }}
        />
      )}
    </div>
  )
}
function PaymentModal({ plan, user, onClose }) {
  const baseAmount = planAmount(plan)
  const [redeemPoints, setRedeemPoints] = useState(0)
  const maxRedeemable = Math.min(user.points || 0, (baseAmount - 1) * POINTS_PER_RUPEE)
  const discountRupees = Math.floor(redeemPoints / POINTS_PER_RUPEE)
  const finalAmount = Math.max(1, baseAmount - discountRupees)
  const [refId] = useState(() => `CA${Date.now()}`)
  const [secondsLeft, setSecondsLeft] = useState(QR_WINDOW_SECONDS)
  const [expired, setExpired] = useState(false)
  const [stage, setStage] = useState('scan')
  const [utr, setUtr] = useState('')
  const [utrError, setUtrError] = useState('')
  useEffect(() => {
    if (expired) return
    const t = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          setExpired(true)
          clearInterval(t)
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [expired])
  const upiUri = useMemo(
    () =>
      buildUpiUri({
        amount: finalAmount,
        note: `${plan.name} subscription`,
        refId,
      }),
    [finalAmount, plan.name, refId]
  )
  const qrImgSrc = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(upiUri)}`
  const regenerate = () => {
    setSecondsLeft(QR_WINDOW_SECONDS)
    setExpired(false)
  }
  const handleSubmitUtr = () => {
    if (!/^[a-zA-Z0-9]{6,25}$/.test(utr.trim())) {
      setUtrError('Enter the 12-digit UPI reference / UTR number shown in your payment app after paying.')
      return
    }
    setUtrError('')
    setStage('verifying')
    setTimeout(() => {
      if (redeemPoints > 0) {
        redeemPointsForDiscount(user.username, redeemPoints)
      }
      submitPayment({
        username: user.username,
        plan: plan.name,
        amount: finalAmount,
        utr: utr.trim(),
        discountRupees,
        vpa: UPI_VPA,
      })
      setStage('done')
    }, 1800)
  }
  return (
    <div className="fixed inset-0 z-50 grid place-items-center px-4">
      <div
        className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
        onClick={stage === 'verifying' ? undefined : onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-lift max-w-md w-full p-7">
        {stage !== 'verifying' && (
          <button onClick={onClose} className="absolute top-4 right-4 text-ink-soft hover:text-ink text-lg">
            ✕
          </button>
        )}

        {stage === 'scan' && (
          <>
            <h3 className="font-display font-bold text-xl text-ink mb-1">Pay via UPI</h3>
            <p className="text-sm text-ink-soft mb-4">
              {plan.name} plan — scan the QR with any UPI app (GPay, PhonePe, Paytm).
            </p>

            {!expired ? (
              <div className="flex flex-col items-center">
                <img src={qrImgSrc} alt="UPI QR code" className="w-56 h-56 rounded-xl border border-border" />
                <div className="mt-3 text-xs text-ink-soft">
                  QR expires in <span className="font-mono font-semibold text-accent">{formatMMSS(secondsLeft)}</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center py-10">
                <div className="text-3xl mb-2">⏰</div>
                <p className="text-sm text-ink-soft mb-4">
                  This QR session expired for security. Generate a new one to continue.
                </p>
                <button
                  onClick={regenerate}
                  className="px-5 py-2.5 rounded-2xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover"
                >
                  Generate new QR
                </button>
              </div>
            )}

            <div className="mt-5 bg-bg-soft rounded-2xl p-4 text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-ink-soft">UPI ID</span>
                <span className="font-mono font-medium text-ink">{UPI_VPA}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Payable amount</span>
                <span className="font-semibold text-ink">₹{finalAmount}</span>
              </div>
              {discountRupees > 0 && (
                <div className="flex justify-between text-success">
                  <span>Points discount applied</span>
                  <span>−₹{discountRupees}</span>
                </div>
              )}
            </div>

            {maxRedeemable >= POINTS_PER_RUPEE && (
              <div className="mt-4">
                <label className="text-xs font-semibold text-ink-soft block mb-1.5">
                  Redeem points for a discount (you have {user.points} pts · {POINTS_PER_RUPEE} pts = ₹1)
                </label>
                <input
                  type="range"
                  min={0}
                  max={maxRedeemable}
                  step={POINTS_PER_RUPEE}
                  value={redeemPoints}
                  onChange={(e) => setRedeemPoints(Number(e.target.value))}
                  className="w-full accent-accent"
                />
                <div className="text-xs text-ink-soft mt-1">
                  Redeeming {redeemPoints} pts → ₹{discountRupees} off
                </div>
              </div>
            )}

            <button
              disabled={expired}
              onClick={() => setStage('confirm')}
              className="w-full mt-5 py-3 rounded-2xl bg-accent text-white font-semibold text-sm hover:bg-accent-hover disabled:opacity-40"
            >
              I've completed the payment
            </button>
          </>
        )}

        {stage === 'confirm' && (
          <>
            <h3 className="font-display font-bold text-xl text-ink mb-1">Confirm your payment</h3>
            <p className="text-sm text-ink-soft mb-4">
              Enter the UPI reference number (UTR) from your payment app's transaction receipt. We use this to match
              your payment to your account.
            </p>
            <label className="text-xs font-semibold text-ink-soft block mb-1.5">UPI Transaction Ref / UTR</label>
            <input
              value={utr}
              onChange={(e) => setUtr(e.target.value)}
              placeholder="e.g. 402812345678"
              className="w-full px-4 py-2.5 rounded-2xl border border-border text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent-soft"
            />
            {utrError && <p className="text-xs text-danger mt-1.5">{utrError}</p>}
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setStage('scan')}
                className="flex-1 py-2.5 rounded-2xl border border-border text-sm font-medium text-ink hover:bg-bg-soft"
              >
                Back
              </button>
              <button
                onClick={handleSubmitUtr}
                className="flex-1 py-2.5 rounded-2xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover"
              >
                Submit
              </button>
            </div>
          </>
        )}

        {stage === 'verifying' && (
          <div className="py-14 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border-4 border-accent-soft border-t-accent animate-spin mb-5" />
            <p className="text-sm font-medium text-ink">Verifying your payment…</p>
            <p className="text-xs text-ink-soft mt-1">Checking reference {refId}</p>
          </div>
        )}

        {stage === 'done' && (
          <div className="py-8 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-success/10 grid place-items-center text-3xl mb-4">✅</div>
            <h3 className="font-display font-bold text-xl text-ink mb-2">Payment submitted</h3>
            <p className="text-sm text-ink-soft mb-1">
              Reference <strong>{refId}</strong> and UTR <strong>{utr}</strong> were recorded.
            </p>
            <p className="text-xs text-ink-soft mb-6">
              Your subscription activates once the payment is verified against the UPI account — usually within a few
              hours. Track its status below on this page.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-2xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
