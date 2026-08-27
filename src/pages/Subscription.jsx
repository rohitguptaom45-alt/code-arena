import React, { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { plans } from '../data/mockData.js'
import { submitPayment, getUserPayments, redeemPointsForDiscount, POINTS_PER_RUPEE } from '../utils/appData.js'

const SERVER = 'http://localhost:8000'

const RAZORPAY_KEY_ENDPOINT = `${SERVER}/api/v1/get/razorpay`
const RAZORPAY_CHECKOUT_ENDPOINT = `${SERVER}/api/v1/payment/checkout`
const RAZORPAY_VERIFY_ENDPOINT = `${SERVER}/api/v1/payment/paymentVarification`

function planAmount(plan) {
  const digits = plan.price.replace(/[^\d]/g, '')
  return digits ? parseInt(digits, 10) : 0
}

function authHeaders() {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function safeJson(res, label) {
  const contentType = res.headers.get('content-type') || ''
  if (!contentType.includes('application/json')) {
    const text = await res.text()
    console.error(`${label} did not return JSON:`, text.slice(0, 200))
    throw new Error(
      `${label} failed (got ${res.status} ${res.statusText}, non-JSON response). Check that SERVER is set correctly and the backend route exists.`
    )
  }
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data?.message || `${label} failed (${res.status}).`)
  }
  return data
}

let razorpayScriptPromise = null
function loadRazorpayScript() {
  if (razorpayScriptPromise) return razorpayScriptPromise
  razorpayScriptPromise = new Promise((resolve) => {
    if (window.Razorpay) return resolve(true)
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
  return razorpayScriptPromise
}

// Plan ke "period" text (e.g. "/mo", "/month", "/yr", "/year") ke hisaab se expiry nikalta hai
function computeExpiryDate(plan) {
  const period = (plan.period || '').toLowerCase()
  const isYearly = period.includes('yr') || period.includes('year')
  const days = isYearly ? 365 : 30
  const expires = new Date()
  expires.setDate(expires.getDate() + days)
  return expires
}

export default function Subscription() {
  const user = useSelector((s) => s.auth.user)
  const [activePlan, setActivePlan] = useState(null)
  const [payments, setPayments] = useState(user ? getUserPayments(user.username) : [])
  // Payment verify hote hi turant UI update dikhane ke liye optimistic local override.
  // Jab tak actual user.subscription (redux/refetch se) update na ho jaaye, ye use hoga.
  const [localSubscription, setLocalSubscription] = useState(null)

  const refreshPayments = () => {
    if (user) setPayments(getUserPayments(user.username))
  }

  const activeSubscription = localSubscription || user?.subscription

  const handlePaymentSuccess = (plan) => {
    setLocalSubscription({
      active: true,
      plan: plan.name,
      expiresAt: computeExpiryDate(plan).toISOString(),
    })
  }

  return (
    <div className="max-w-6xl mx-auto px-5 py-16">
      <div className="text-center mb-12">
        <h1 className="font-display font-bold text-3xl md:text-4xl text-ink">Choose Your Plan</h1>
        <p className="text-ink-soft mt-3">Simple pricing that scales with your ambition. Cancel anytime.</p>
        {activeSubscription?.active && (
          <div className="mt-4 inline-block px-4 py-2 rounded-2xl bg-success/10 border border-success/30 text-success text-sm font-medium">
            ✅ Active plan: {activeSubscription.plan} — renews{' '}
            {new Date(activeSubscription.expiresAt).toLocaleDateString('en-IN')}
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const amount = planAmount(plan)
          const isCurrentPlan = activeSubscription?.active && activeSubscription.plan === plan.name
          return (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 border card-lift ${plan.highlight ? 'border-accent shadow-lift bg-white scale-[1.03]' : 'border-border bg-white'} ${isCurrentPlan ? 'ring-2 ring-success' : ''}`}
            >
              {plan.badge && !isCurrentPlan && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-accent text-white text-xs font-semibold whitespace-nowrap">
                  {plan.badge}
                </span>
              )}
              {isCurrentPlan && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-success text-white text-xs font-semibold whitespace-nowrap">
                  ✅ Current plan
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
              {isCurrentPlan ? (
                <div className="w-full py-3 rounded-2xl font-semibold text-sm border border-success/40 text-success text-center bg-success/5">
                  Active · renews {new Date(activeSubscription.expiresAt).toLocaleDateString('en-IN')}
                </div>
              ) : amount === 0 ? (
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
                    Ref: {p.utr} · {new Date(p.createdAt).toLocaleString('en-IN')}
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
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  )
}

function PaymentModal({ plan, user, onClose, onSuccess }) {
  const [redeemPoints, setRedeemPoints] = useState(0)
  const [stage, setStage] = useState('review')
  const [errorMsg, setErrorMsg] = useState('')
  const [paymentRef, setPaymentRef] = useState(null)

  const baseAmount = useMemo(() => planAmount(plan), [plan])
  const maxRedeemable = useMemo(
    () => Math.min(user.points || 0, (baseAmount - 1) * POINTS_PER_RUPEE),
    [user.points, baseAmount]
  )
  const discountRupees = useMemo(() => Math.floor(redeemPoints / POINTS_PER_RUPEE), [redeemPoints])
  const finalAmount = useMemo(() => Math.max(1, baseAmount - discountRupees), [baseAmount, discountRupees])
  const expiryDate = useMemo(() => computeExpiryDate(plan), [plan])

  const handlePay = async () => {
    setErrorMsg('')
    setStage('processing')

    try {
      // 1. Load Razorpay script
      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        throw new Error('Could not load Razorpay checkout script.')
      }

      // 2. Get Razorpay Key
      const keyRes = await fetch(RAZORPAY_KEY_ENDPOINT, {
        method: 'GET',
        credentials: 'include',
        headers: { ...authHeaders() },
      })
      const keyData = await safeJson(keyRes, 'Fetching Razorpay key')
      const razorpayKey = keyData?.data || keyData?.key
      if (!razorpayKey) {
        throw new Error('Server did not return a Razorpay key.')
      }

      // 3. Create Razorpay Order
      const orderRes = await fetch(RAZORPAY_CHECKOUT_ENDPOINT, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({
          username: user.username,
          plan: plan.name,
          amount: finalAmount,
          discountRupees,
        }),
      })
      const orderData = await safeJson(orderRes, 'Creating order')
      console.log('Order Response:', orderData)

      const order = orderData?.data
      if (!order?.id) {
        throw new Error('Server did not return Razorpay order id.')
      }

      // 4. Razorpay Options
      const options = {
        key: razorpayKey,
        amount: order.amount,
        currency: order.currency || 'INR',
        name: 'CodeArena',
        description: `${plan.name} subscription`,
        // Backend returns id, not order_id
        order_id: order.id,
        prefill: {
          name: user.name || user.username || '',
          email: user.email || '',
          contact: user.phone || '',
        },
        notes: {
          plan: plan.name,
          username: user.username,
        },
        theme: {
          color: '#5B5BF0',
        },

        // 5. Payment Success
        handler: async function (response) {
          try {
            setStage('processing')

            const verifyRes = await fetch(RAZORPAY_VERIFY_ENDPOINT, {
              method: 'POST',
              credentials: 'include',
              headers: { 'Content-Type': 'application/json', ...authHeaders() },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }),
            })

            const verifyData = await safeJson(verifyRes, 'Verifying payment')
            console.log('Payment Verification Response:', verifyData)

            // 6. Turant plan active dikhane ke liye parent ko batao
            setPaymentRef(response.razorpay_payment_id)
            onSuccess?.(plan)

            // 7. Payment successful
            setStage('done')
          } catch (error) {
            console.error('Payment verification error:', error)
            setErrorMsg(error?.message || 'Payment verification failed.')
            setStage('error')
          }
        },

        // User closes payment popup
        modal: {
          ondismiss: function () {
            setStage('review')
          },
        },
      }

      // 8. Create Razorpay instance
      const rzp = new window.Razorpay(options)

      // 9. Payment Failed
      rzp.on('payment.failed', function (response) {
        console.error('Razorpay Payment Failed:', response)
        setErrorMsg(response?.error?.description || 'Payment failed. Please try again.')
        setStage('error')
      })

      // 10. Open Razorpay popup
      rzp.open()
    } catch (err) {
      console.error('Handle Pay Error:', err)
      setErrorMsg(err?.message || 'Something went wrong. Please try again.')
      setStage('error')
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center px-4">
      <div
        className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
        onClick={stage === 'processing' || stage === 'verifying' ? undefined : onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-lift max-w-md w-full p-7">
        {stage !== 'processing' && stage !== 'verifying' && (
          <button onClick={onClose} className="absolute top-4 right-4 text-ink-soft hover:text-ink text-lg">
            ✕
          </button>
        )}

        {(stage === 'review' || stage === 'error') && (
          <>
            <h3 className="font-display font-bold text-xl text-ink mb-1">Checkout</h3>
            <p className="text-sm text-ink-soft mb-4">
              {plan.name} plan — pay securely with Razorpay (cards, UPI, netbanking, wallets).
            </p>

            <div className="bg-bg-soft rounded-2xl p-4 text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-ink-soft">Plan</span>
                <span className="font-medium text-ink">{plan.name}</span>
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

            {stage === 'error' && errorMsg && (
              <p className="text-xs text-danger mt-4 bg-danger/10 border border-danger/30 rounded-xl px-3 py-2">
                {errorMsg}
              </p>
            )}

            <button
              onClick={handlePay}
              className="w-full mt-5 py-3 rounded-2xl bg-accent text-white font-semibold text-sm hover:bg-accent-hover flex items-center justify-center gap-2"
            >
              Pay ₹{finalAmount} with Razorpay
            </button>
          </>
        )}

        {stage === 'processing' && (
          <div className="py-14 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border-4 border-accent-soft border-t-accent animate-spin mb-5" />
            <p className="text-sm font-medium text-ink">Opening secure Razorpay checkout…</p>
          </div>
        )}

        {stage === 'verifying' && (
          <div className="py-14 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border-4 border-accent-soft border-t-accent animate-spin mb-5" />
            <p className="text-sm font-medium text-ink">Verifying your payment…</p>
          </div>
        )}

        {stage === 'done' && (
          <div className="py-8 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-success/10 grid place-items-center text-3xl mb-4">✅</div>
            <h3 className="font-display font-bold text-xl text-ink mb-2">Payment successful</h3>
            <p className="text-sm text-ink-soft mb-1">
              Payment ref <strong>{paymentRef}</strong> was recorded.
            </p>
            <p className="text-sm font-semibold text-success mb-1">
              Your {plan.name} plan is active now!
            </p>
            <p className="text-xs text-ink-soft mb-6">
              It will renew on {expiryDate.toLocaleDateString('en-IN')}. Track its status below on this page.
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