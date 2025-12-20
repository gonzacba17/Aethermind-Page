'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getToken } from '@/lib/auth-utils';
import { Check, Sparkles, Zap, Crown } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '$0',
    priceId: null,
    description: 'Perfect for trying out Aethermind',
    features: [
      '1 AI Agent',
      '100 API calls/month',
      'Basic analytics',
      'Community support',
      'Standard models (GPT-3.5)',
    ],
    notIncluded: [
      'Advanced models',
      'FinOps cost tracking',
      'Priority support',
      'Custom integrations',
    ],
    icon: Sparkles,
    popular: false,
  },
  {
    name: 'Pro',
    price: '$49',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || 'price_pro',
    description: 'For professionals scaling their AI operations',
    features: [
      'Unlimited AI Agents',
      'Unlimited API calls',
      'Advanced analytics & FinOps',
      'All AI models (GPT-4, Claude, etc.)',
      'Priority email support',
      'Cost optimization alerts',
      'Budget controls',
      'Custom webhooks',
    ],
    notIncluded: [
      'Dedicated account manager',
      'Custom SLA',
      'On-premise deployment',
    ],
    icon: Zap,
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    priceId: null,
    description: 'For organizations with advanced needs',
    features: [
      'Everything in Pro',
      'Dedicated account manager',
      'Custom SLA (99.9% uptime)',
      'On-premise deployment option',
      'Advanced security (SSO, SAML)',
      'Custom integrations',
      'Volume discounts',
      'Training & onboarding',
      'Phone support',
    ],
    notIncluded: [],
    icon: Crown,
    popular: false,
  },
];

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const searchParams = useSearchParams();
  const isCheckout = searchParams.get('checkout') === 'true';

  useEffect(() => {
    if (isCheckout) {
      // User came from authentication, show message
      const timer = setTimeout(() => {
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isCheckout]);

  const handleSelectPlan = async (planName: string, priceId: string | null) => {
    if (!priceId) {
      if (planName === 'Enterprise') {
        // Redirect to contact page for enterprise
        window.location.href = '/contact?plan=enterprise';
      } else if (planName === 'Free') {
        // Free plan, just go to dashboard
        const dashboardUrl = process.env.NEXT_PUBLIC_DASHBOARD_URL || 'https://aethermind-agent-os-dashboard.vercel.app';
        window.location.href = `${dashboardUrl}/dashboard`;
      }
      return;
    }

    setLoading(planName);
    setError('');

    try {
      const token = getToken();
      
      if (!token) {
        // Not logged in, redirect to signup
        window.location.href = '/signup';
        return;
      }

      // Call backend to create Stripe Checkout session
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://aethermindapi-production.up.railway.app/api';
      
      const response = await fetch(`${apiUrl}/stripe/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          priceId,
          successUrl: `${window.location.origin}/pricing/success`,
          cancelUrl: `${window.location.origin}/pricing?checkout=true`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;

    } catch (err) {
      console.error('Checkout error:', err);
      setError(err instanceof Error ? err.message : 'Failed to start checkout. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold">
              AETHERMIND
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-zinc-400 hover:text-white transition">
                Sign in
              </Link>
              <Link
                href="/signup"
                className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-zinc-200 transition"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Title Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">
            Choose your plan
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Scale your AI operations with flexible pricing that grows with your business
          </p>
          {isCheckout && (
            <div className="mt-6 max-w-2xl mx-auto bg-blue-500/10 border border-blue-500/50 text-blue-400 px-6 py-4 rounded-lg">
              <p className="font-medium">Welcome to Aethermind! 🎉</p>
              <p className="text-sm mt-1">Choose a plan to unlock the full power of AI agent management</p>
            </div>
          )}
          {error && (
            <div className="mt-6 max-w-2xl mx-auto bg-red-500/10 border border-red-500/50 text-red-400 px-6 py-4 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.name}
                className={`relative rounded-2xl border ${
                  plan.popular
                    ? 'border-white bg-zinc-900'
                    : 'border-zinc-800 bg-zinc-900/50'
                } p-8 ${plan.popular ? 'shadow-2xl shadow-white/10' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="bg-white text-black px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <Icon className={`w-10 h-10 mb-4 ${plan.popular ? 'text-white' : 'text-zinc-400'}`} />
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-zinc-400 text-sm">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.price !== '$0' && plan.price !== 'Custom' && (
                      <span className="text-zinc-400">/month</span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleSelectPlan(plan.name, plan.priceId)}
                  disabled={loading === plan.name}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition mb-8 ${
                    plan.popular
                      ? 'bg-white text-black hover:bg-zinc-200'
                      : 'bg-zinc-800 text-white hover:bg-zinc-700'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading === plan.name ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : plan.name === 'Free' ? (
                    'Start Free'
                  ) : plan.name === 'Enterprise' ? (
                    'Contact Sales'
                  ) : (
                    'Subscribe'
                  )}
                </button>

                <div className="space-y-3">
                  <p className="text-sm font-medium text-zinc-400 mb-4">What's included:</p>
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-zinc-300">{feature}</span>
                    </div>
                  ))}
                  {plan.notIncluded.length > 0 && (
                    <>
                      <div className="border-t border-zinc-800 my-4" />
                      {plan.notIncluded.map((feature) => (
                        <div key={feature} className="flex items-start gap-3 opacity-40">
                          <span className="text-sm text-zinc-500">{feature}</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <details className="group bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
              <summary className="cursor-pointer font-medium text-lg flex items-center justify-between">
                Can I upgrade or downgrade anytime?
                <span className="transition group-open:rotate-180">▼</span>
              </summary>
              <p className="mt-4 text-zinc-400">
                Yes! You can upgrade, downgrade, or cancel your plan at any time. Changes take effect immediately,
                and we'll prorate any charges or credits.
              </p>
            </details>

            <details className="group bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
              <summary className="cursor-pointer font-medium text-lg flex items-center justify-between">
                What payment methods do you accept?
                <span className="transition group-open:rotate-180">▼</span>
              </summary>
              <p className="mt-4 text-zinc-400">
                We accept all major credit cards (Visa, MasterCard, Amex) through Stripe.
                Enterprise customers can also pay via invoice.
              </p>
            </details>

            <details className="group bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
              <summary className="cursor-pointer font-medium text-lg flex items-center justify-between">
                Is there a free trial?
                <span className="transition group-open:rotate-180">▼</span>
              </summary>
              <p className="mt-4 text-zinc-400">
                Yes! The Free plan gives you access to core features indefinitely. You can upgrade to Pro anytime
                to unlock unlimited usage and advanced features.
              </p>
            </details>

            <details className="group bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
              <summary className="cursor-pointer font-medium text-lg flex items-center justify-between">
                What happens if I exceed my limits?
                <span className="transition group-open:rotate-180">▼</span>
              </summary>
              <p className="mt-4 text-zinc-400">
                On the Free plan, you'll receive a notification when approaching limits. Pro users have unlimited
                usage. Our FinOps dashboard helps you monitor and control costs in real-time.
              </p>
            </details>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold mb-4">Still have questions?</h2>
          <p className="text-zinc-400 mb-8">Our team is here to help you find the right plan</p>
          <Link
            href="/contact"
            className="inline-block bg-white text-black px-8 py-3 rounded-lg font-medium hover:bg-zinc-200 transition"
          >
            Contact Sales
          </Link>
        </div>
      </div>
    </div>
  );
}
