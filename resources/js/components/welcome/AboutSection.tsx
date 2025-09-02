"use client"

import { useTheme } from "@/contexts/ThemeContext"
import { useTranslation } from "react-i18next"
import { useState, useMemo } from "react"
import { motion, type Variants } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Heart, Users, Target, Lightbulb, Globe } from "lucide-react"

export default function AboutSection() {
  const { theme } = useTheme()
  const { t } = useTranslation()
  const [activeId, setActiveId] = useState<string>("slide-1")
  const [openId, setOpenId] = useState<string | null>(null)

  const sections = [
    {
      id: "slide-1",
      title: t("slideshow.slide1.title", { defaultValue: "Our Mission" }),
      description: t("slideshow.slide1.description", {
        defaultValue:
          "We are dedicated to creating positive change in communities worldwide through innovative solutions and collaborative partnerships.",
      }),
      icon: Target,
    },
    {
      id: "slide-2",
      title: t("slideshow.slide2.title", { defaultValue: "Our Vision" }),
      description: t("slideshow.slide2.description", {
        defaultValue:
          "Building a sustainable future where technology and humanity work together to solve the world's most pressing challenges.",
      }),
      icon: Lightbulb,
    },
    {
      id: "slide-3",
      title: t("slideshow.slide3.title", { defaultValue: "Our Team" }),
      description: t("slideshow.slide3.description", {
        defaultValue:
          "A diverse group of passionate professionals committed to excellence, innovation, and making a meaningful impact in everything we do.",
      }),
      icon: Users,
    },
    {
      id: "slide-4",
      title: t("slideshow.slide4.title", { defaultValue: "Our Values" }),
      description: t("slideshow.slide4.description", {
        defaultValue:
          "Integrity, transparency, and social responsibility guide every decision we make as we work toward our shared goals.",
      }),
      icon: Heart,
    }
  ]

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  return (
    <section
      className="relative bg-background overflow-hidden py-4"
      role="region"
      aria-labelledby="about-heading"
      id="about"
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23000000' fillOpacity='0.4'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
          aria-hidden="true"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Mobile-first grid layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Mobile cards navigation */}
            <motion.div variants={itemVariants} className="lg:hidden">
              <div className="grid grid-cols-2 gap-3">
                {sections.map((s) => {
                  const Icon = s.icon
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => { setActiveId(s.id); setOpenId(s.id); }}
                      className="group relative flex flex-col items-center justify-center rounded-xl border border-border/60 bg-card/50 px-3 py-4 text-center transition hover:border-primary/40 hover:bg-card/70 focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary mb-2">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span className="text-xs font-medium text-foreground line-clamp-2">{s.title}</span>
                    </button>
                  )
                })}
              </div>

              {/* Description modal */}
              <AlertDialog open={openId !== null} onOpenChange={(v) => { if (!v) setOpenId(null) }}>
                <AlertDialogContent>
                  {(() => {
                    const selected = sections.find(sec => sec.id === openId) || sections[0]
                    return (
                      <>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{selected.title}</AlertDialogTitle>
                          <AlertDialogDescription>{selected.description}</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setOpenId(null)}>{t('close')}</AlertDialogCancel>
                        </AlertDialogFooter>
                      </>
                    )
                  })()}
                </AlertDialogContent>
              </AlertDialog>
            </motion.div>
            {/* Navigation - Hidden on mobile, sidebar on desktop */}
            <motion.aside variants={itemVariants} className="hidden lg:block lg:col-span-3">
              <div className="sticky top-24">
                <nav className="space-y-2" role="tablist" aria-label="About section navigation">
                  {sections.map((item, idx) => {
                    const isActive = activeId === item.id
                    return (
                      <motion.button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveId(item.id)}
                        role="tab"
                        aria-selected={isActive}
                        aria-controls={`${item.id}-panel`}
                        className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? "text-foreground bg-muted/60"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        }`}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center text-xs">
                          {String(idx + 1).padStart(2, "0")}
                        </Badge>
                        <span className="text-pretty">{item.title}</span>
                      </motion.button>
                    )
                  })}
                </nav>
              </div>
            </motion.aside>

            {/* Content */}
            <div className="lg:col-span-9">
              <motion.div variants={containerVariants} className="space-y-6 md:space-y-8">
                {(() => {
                  const activeIndex = sections.findIndex(s => s.id === activeId)
                  const section = sections[Math.max(0, activeIndex)]
                  const IconComponent = section.icon
                  return (
                    <motion.div
                      key={section.id}
                      variants={itemVariants}
                      id={section.id}
                      role="tabpanel"
                      aria-labelledby={section.id}
                      className="scroll-mt-24"
                      tabIndex={0}
                      aria-live="polite"
                    >
                      <Card id={`${section.id}-panel`} className="group hover:shadow-lg transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm">
                        <CardHeader className="pb-4">
                          <div className="flex items-start gap-4">
                            <motion.div
                              className="hidden sm:flex flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 items-center justify-center"
                              whileHover={{ scale: 1.05, rotate: 5 }}
                              transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                              <IconComponent className="w-6 h-6 text-primary" aria-hidden="true" />
                            </motion.div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-2">
                                <CardTitle className="hidden sm:block text-xl sm:text-2xl font-semibold text-balance">
                                  {section.title}
                                </CardTitle>
                                <Badge variant="secondary" className="hidden sm:inline-flex text-xs font-medium">
                                  {String(activeIndex + 1).padStart(2, "0")}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <CardDescription className="hidden sm:block text-base leading-relaxed text-pretty">
                            {section.description}
                          </CardDescription>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })()}
              </motion.div>
            </div>
          </div> 
      </div>
    </section>
  )
}
