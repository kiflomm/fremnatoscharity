"use client"

import { useTranslation } from "react-i18next"
import { motion, type Variants } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Users, MapPin, Calendar, Award, BetweenVerticalEnd } from "lucide-react"
import { usePage, Link, router } from '@inertiajs/react'
import { type SharedData } from '@/types'

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}


export default function HeroSection() {
  const { t } = useTranslation()
  const { isAuthenticated } = usePage<SharedData>().props

  const donateHref = isAuthenticated ? '/help' : '/login'

  const highlights = [
    {
      icon: MapPin,
      title: t("hero.highlights.location", { defaultValue: "Tigray Region" }),
      description: t("hero.highlights.location_desc", { defaultValue: "Serving communities across Tigray" }),
    },
    {
      icon: Calendar,
      title: t("hero.highlights.established", { defaultValue: "Since 2020" }),
      description: t("hero.highlights.established_desc", { defaultValue: "4+ years of dedicated service" }),
    },
    {
      icon: Award,
      title: t("hero.highlights.focus", { defaultValue: "Three Focus Areas" }),
      description: t("hero.highlights.focus_desc", { defaultValue: "Elders, Children & Mental Health" }),
    },
    {
      icon: Users,
      title: t("hero.highlights.beneficiaries", { defaultValue: "Beneficiaries Helped" }),
      description: t("hero.highlights.beneficiaries_desc", { defaultValue: "500+ beneficiaries helped" }),
    },
  ]
  return (
    <section className="relative bg-gradient-to-br from-background via-background to-muted/20 overflow-hidden flex items-center pb-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
        className="mx-auto max-w-7xl px-3 sm:px-4 relative z-10 w-full"
      >
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column - Content */}
          <div>
            <motion.div variants={itemVariants} className="space-y-0">

              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground tracking-tight leading-tight">
                {t("hero.title", {
                  defaultValue: "Supporting Elders, Mentally Disabled, and Children in Need"
                })}
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                {t("hero.description", {
                  defaultValue: "Fremnatos Charity Organization is dedicated to providing better services and solving problems for people without support in the Tigray region. Join us in making a meaningful impact."
                })}
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => router.visit(donateHref)}
                size="lg"
                variant="default"
                className="border-2 hover:bg-primary/5 transition-all duration-300"
              >
                {t("hero.cta.donate", { defaultValue: "Donate Now" })}
                <ArrowRight className="ml-2 size-5" />
              </Button>

              <Button
                variant="default"
                size="lg"
                className="border-2 hover:bg-primary/5 transition-all duration-300"
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {t("hero.cta.learn_more", { defaultValue: "Learn More" })}
              </Button>
            </motion.div>
          </div>


          {/* Key Highlights */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {highlights.map((highlight, index) => (
              <div key={highlight.title} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <highlight.icon className="size-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-foreground">{highlight.title}</h3>
                  <p className="text-xs text-muted-foreground">{highlight.description}</p>
                </div>
              </div>
            ))}
          </motion.div>


        </div>
      </motion.div>
    </section>
  )
}
