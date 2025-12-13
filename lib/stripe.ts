/**
 * Stripe Integration for Q-SLICE Threatlab Arena
 * ===============================================
 * No paywall - optional donations/subscriptions
 *
 * CAGE: 9HUP5 | Agile Defense Systems, LLC
 */

import Stripe from 'stripe'

// Server-side Stripe client
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil' as any,
  typescript: true
})

// ═══════════════════════════════════════════════════════════════════════════════
// PRODUCT CONFIGURATION (No Paywall)
// ═══════════════════════════════════════════════════════════════════════════════

export const PRODUCTS = {
  // Free tier - full access, no restrictions
  FREE: {
    name: 'Q-SLICE Free',
    description: 'Full platform access - no restrictions',
    price: 0,
    features: [
      'NLP-to-Quantum Lab',
      'Real QPU Execution',
      'CLASS_A Evidence Binding',
      'Unlimited Experiments',
      'Community Support'
    ]
  },

  // Supporter tier - optional donation
  SUPPORTER: {
    name: 'Q-SLICE Supporter',
    description: 'Support quantum research development',
    price_id: 'price_supporter_monthly',
    price: 25,
    interval: 'month',
    features: [
      'All Free features',
      'Priority QPU Queue',
      'Discord VIP Access',
      'Name in Credits',
      'Early Feature Access'
    ]
  },

  // Research tier - for organizations
  RESEARCH: {
    name: 'Q-SLICE Research',
    description: 'For research institutions and labs',
    price_id: 'price_research_monthly',
    price: 199,
    interval: 'month',
    features: [
      'All Supporter features',
      'Dedicated QPU Time',
      'Custom Integrations',
      'SLA Support',
      'Co-authorship Opportunities'
    ]
  },

  // Enterprise - DARPA/DoD
  ENTERPRISE: {
    name: 'Q-SLICE Enterprise',
    description: 'DFARS Compliant - Defense & Government',
    price_id: 'price_enterprise_custom',
    price: 'Contact',
    features: [
      'All Research features',
      'DFARS 15.6 Compliance',
      'Dedicated Infrastructure',
      'Custom SLA',
      'Direct PM Support',
      'CAGE 9HUP5 Certification'
    ]
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// CHECKOUT HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

export async function createCheckoutSession(
  priceId: string,
  customerId?: string,
  email?: string
) {
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    customer: customerId,
    customer_email: customerId ? undefined : email,
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/auth?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/auth?canceled=true`,
    metadata: {
      platform: 'q-slice-threatlab',
      cage: '9HUP5'
    }
  })

  return session
}

export async function createCustomerPortalSession(customerId: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/auth`
  })

  return session
}

export async function getSubscription(subscriptionId: string) {
  return stripe.subscriptions.retrieve(subscriptionId)
}

export async function cancelSubscription(subscriptionId: string) {
  return stripe.subscriptions.cancel(subscriptionId)
}

// ═══════════════════════════════════════════════════════════════════════════════
// ONE-TIME DONATIONS
// ═══════════════════════════════════════════════════════════════════════════════

export async function createDonationSession(
  amount: number,
  email?: string
) {
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Q-SLICE Research Donation',
          description: 'Support sovereign quantum computing research'
        },
        unit_amount: amount * 100 // Stripe uses cents
      },
      quantity: 1
    }],
    customer_email: email,
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/auth?donation=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/auth?donation=canceled`,
    metadata: {
      type: 'donation',
      platform: 'q-slice-threatlab',
      cage: '9HUP5'
    }
  })

  return session
}
