"use client"

import { LandingNav } from "@/components/landing-nav"
import { Button } from "@/components/ui/button"
import { ArrowRight, Check, Zap, Shield, TrendingUp, Play } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function LandingPage() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <nav className="fixed w-full z-50 border-b border-white/5 bg-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex-shrink-0 w-64 h-full flex items-center px-6 gap-2">
            <Link href='/'>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                <img src="/logo/logo.svg" className="w-8 h-8" />
                </div>
            </Link>
            <div className="flex flex-col items-start">
                <Link href='/'><span className="font-semibold text-lg text-[#687FE5]">Healium CKD AI</span></Link>
                <Link href='https://www.healiumintelliscan.com' target="_blank" className="text-[#687FE5]">
                <span className="text-sm">by Healium Intelliscan</span>
                </Link>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">
              Features
            </Link>
            <Link href="#workflow" className="text-sm text-gray-400 hover:text-white transition-colors">
              How it Works
            </Link>
            <LandingNav />
          </div>
        </div>
      </nav>

      <section className="relative pt-32 pb-20 px-6 lg:px-8">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#009A6B]/10 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-80 h-80 bg-[#009A6B]/5 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#009A6B]/20 bg-[#009A6B]/5 mb-6">
              <div className="w-1.5 h-1.5 bg-[#009A6B] rounded-full animate-pulse" />
              <span className="text-xs text-[#009A6B] font-medium">AI-Powered Kidney Disease Detection</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              Diagnose kidney disease in{" "}
              <span className="bg-gradient-to-r from-[#009A6B] to-[#00C896] bg-clip-text text-transparent">
                seconds
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Advanced AI that automatically selects optimal ultrasound images and delivers precise CKD stage
              detection—transforming hours of analysis into seconds.
            </p>

            <div className="flex flex-wrap gap-3 justify-center mb-16">
              <Link href="/cases/new">
                <Button size="lg" className="bg-white text-black hover:bg-gray-100 rounded-full group">
                  Start Free Analysis
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-white/10 text-white hover:bg-white/5 rounded-full bg-transparent"
              >
                <Play className="mr-2 h-4 w-4" />
                Watch Demo
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                { value: "98.5%", label: "Accuracy" },
                { value: "<30s", label: "Analysis Time" },
                { value: "50K+", label: "Cases Analyzed" },
                { value: "200+", label: "Facilities" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="p-6 bg-white/[0.02] backdrop-blur-sm rounded-xl border border-white/5 hover:border-[#009A6B]/30 transition-all"
                >
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="relative py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Built for modern radiology</h2>
            <p className="text-lg text-gray-400">
              Advanced AI algorithms that understand medical imaging at a level previously impossible
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Zap,
                title: "Intelligent Image Selection",
                description:
                  "AI automatically identifies and selects the highest quality ultrasound images for analysis, eliminating manual sorting.",
                color: "#009A6B",
              },
              {
                icon: Shield,
                title: "Precise CKD Detection",
                description:
                  "Advanced deep learning models trained on thousands of cases deliver accurate kidney disease stage classification.",
                color: "#00C896",
              },
              {
                icon: TrendingUp,
                title: "Patient Progress Tracking",
                description:
                  "Monitor kidney health trends over time with comprehensive progression reports and visual analytics.",
                color: "#007A55",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group"
                onMouseEnter={() => setHoveredFeature(i)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className="h-full p-8 bg-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/5 hover:border-white/10 transition-all">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-all"
                    style={{
                      backgroundColor: hoveredFeature === i ? `${feature.color}20` : "transparent",
                      border: `1px solid ${feature.color}30`,
                    }}
                  >
                    <feature.icon
                      className="h-6 w-6 transition-all"
                      style={{ color: hoveredFeature === i ? feature.color : "#6b7280" }}
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="workflow" className="relative py-20 px-6 lg:px-8 bg-[#009A6B]/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Three steps to diagnosis</h2>
            <p className="text-lg text-gray-400">From upload to results in under 30 seconds</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Upload Images",
                description:
                  "Upload ultrasound images directly or connect to your PACS system for seamless integration.",
              },
              {
                step: "02",
                title: "AI Selection",
                description:
                  "Our algorithm analyzes all images and automatically selects the optimal ones for diagnosis.",
              },
              {
                step: "03",
                title: "Get Results",
                description:
                  "Receive detailed analysis with stage classification, confidence scores, and recommendations.",
              },
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#009A6B]/10 border border-[#009A6B]/30 flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-[#009A6B]">{step.step}</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-400 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Faster diagnosis.
                <br />
                Better outcomes.
              </h2>
              <p className="text-lg text-gray-400 mb-8">
                Reduce analysis time from hours to seconds while maintaining the highest standards of accuracy.
              </p>
              <div className="space-y-4">
                {[
                  "Reduce radiologist workload by 70%",
                  "Eliminate manual image sorting",
                  "Consistent, objective analysis",
                  "Comprehensive patient history",
                  "HIPAA compliant and secure",
                ].map((benefit, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#009A6B]/10 border border-[#009A6B]/30 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-[#009A6B]" />
                    </div>
                    <span className="text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="p-10 bg-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/5">
                <div className="text-center">
                  <div className="text-7xl font-bold bg-gradient-to-br from-[#009A6B] to-[#00C896] bg-clip-text text-transparent mb-4">
                    98.5%
                  </div>
                  <div className="text-xl text-white mb-2">Diagnostic Accuracy</div>
                  <div className="text-sm text-gray-500 mb-8">Validated across 50,000+ cases</div>
                  <div className="pt-8 border-t border-white/5">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <div className="text-2xl font-bold text-white mb-1">{"<30s"}</div>
                        <div className="text-xs text-gray-500">Average Analysis</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-white mb-1">200+</div>
                        <div className="text-xs text-gray-500">Healthcare Facilities</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-20 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to transform your workflow?</h2>
          <p className="text-lg text-gray-400 mb-8">
            Join hundreds of healthcare facilities using KidneyAI for faster, more accurate diagnosis.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/cases/new">
              <Button size="lg" className="bg-[#009A6B] hover:bg-[#008059] text-white rounded-full group">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/cases">
              <Button
                size="lg"
                variant="outline"
                className="border-white/10 text-white hover:bg-white/5 rounded-full bg-transparent"
              >
                Request Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 py-8 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gradient-to-br from-[#009A6B] to-[#007A55] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">K</span>
              </div>
              <span className="font-semibold">KidneyAI</span>
            </div>
            <div className="flex gap-6 text-sm text-gray-500">
              <Link href="#" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                Terms
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                Contact
              </Link>
            </div>
            <div className="text-sm text-gray-500">© 2025 KidneyAI</div>
          </div>
        </div>
      </footer>
    </div>
  )
}