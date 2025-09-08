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
      className="relative bg-gradient-to-br from-background via-background to-muted/20 overflow-hidden py-4"
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

            {/* Desktop: Modern Card Grid Layout */}
            <div className="hidden lg:block lg:col-span-12">
              <motion.div 
                variants={containerVariants}
                className="grid grid-cols-1 xl:grid-cols-5 gap-8"
              >
                {/* Left side: Navigation */}
                <motion.div variants={itemVariants} className="space-y-4 xl:col-span-2">
                  <div className="sticky top-24">
                    <div className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl rounded-2xl border border-border/50 p-6 shadow-xl">

                      <nav className="space-y-3" role="tablist" aria-label="About section navigation">
                        {sections.map((item, idx) => {
                          const isActive = activeId === item.id
                          const IconComponent = item.icon
                          return (
                            <motion.button
                              key={item.id}
                              type="button"
                              onClick={() => setActiveId(item.id)}
                              role="tab"
                              aria-selected={isActive}
                              aria-controls={`${item.id}-panel`}
                              className={`group w-full text-left transition-all duration-300 ${
                                isActive
                                  ? "transform scale-[1.02]"
                                  : "hover:scale-[1.01]"
                              }`}
                              whileHover={{ x: 8 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className={`relative overflow-hidden rounded-xl p-4 transition-all duration-300 ${
                                isActive
                                  ? "bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 shadow-lg"
                                  : "bg-muted/30 border border-border/30 hover:bg-muted/50 hover:border-primary/20"
                              }`}>
                                <div className="flex items-center gap-4">
                                  <div className={`relative flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                                    isActive 
                                      ? "bg-primary text-primary-foreground shadow-lg" 
                                      : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                                  }`}>
                                    <IconComponent className="w-6 h-6" />
                                    {isActive && (
                                      <motion.div
                                        className="absolute inset-0 rounded-xl bg-primary/20"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ duration: 0.3 }}
                                      />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-1">
                                      <h4 className="font-semibold text-foreground text-sm">
                                        {item.title}
                                      </h4>
                                      <Badge 
                                        variant={isActive ? "default" : "outline"} 
                                        className="text-xs px-2 py-0.5"
                                      >
                                        {String(idx + 1).padStart(2, "0")}
                                      </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                      {item.description.substring(0, 80)}...
                                    </p>
                                  </div>
                                </div>
                                {isActive && (
                                  <motion.div
                                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary/50 rounded-b-xl"
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ duration: 0.3 }}
                                  />
                                )}
                              </div>
                            </motion.button>
                          )
                        })}
                      </nav>
                    </div>
                  </div>
                </motion.div>

                {/* Right side: Content */}
                <motion.div variants={itemVariants} className="space-y-6 xl:col-span-3">
                  {sections.map((section, index) => {
                    const activeIndex = sections.findIndex(s => s.id === activeId)
                    const isActive = section.id === activeId
                    const IconComponent = section.icon
                    
                    return (
                      <motion.div
                        key={section.id}
                        variants={itemVariants}
                        id={section.id}
                        role="tabpanel"
                        aria-labelledby={section.id}
                        className={`transition-all duration-500 ${
                          isActive 
                            ? 'opacity-100 translate-y-0' 
                            : 'opacity-0 translate-y-4 pointer-events-none absolute'
                        }`}
                        tabIndex={0}
                        aria-live="polite"
                      >
                        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-card/80 via-card/60 to-card/40 backdrop-blur-xl shadow-2xl">
                          {/* Background decoration */}
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-50"></div>
                          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                          
                          <CardHeader className="relative pb-6">
                            <div className="flex items-start gap-6">
                              <motion.div
                                className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-lg"
                                whileHover={{ scale: 1.05, rotate: 5 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                              >
                                <IconComponent className="w-8 h-8 text-primary" />
                              </motion.div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-4 mb-3">
                                  <CardTitle className="text-2xl font-bold text-foreground">
                                    {section.title}
                                  </CardTitle>
                                  <Badge 
                                    variant="secondary" 
                                    className="text-sm px-3 py-1 font-medium bg-primary/10 text-primary border-primary/20"
                                  >
                                    {String(activeIndex + 1).padStart(2, "0")}
                                  </Badge>
                                </div>
                                <div className="w-16 h-1 bg-gradient-to-r from-primary to-primary/50 rounded-full"></div>
                              </div>
                            </div>
                          </CardHeader>
                          
                          <CardContent className="relative pt-0">
                            <CardDescription className="text-lg leading-relaxed text-muted-foreground font-medium">
                              {section.description}
                            </CardDescription>
                            
                            {/* Decorative elements */}
                            <div className="mt-6 flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-primary/60"></div>
                              <div className="w-1 h-1 rounded-full bg-primary/40"></div>
                              <div className="w-1 h-1 rounded-full bg-primary/20"></div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )
                  })}
                </motion.div>
              </motion.div>
            </div>
          </div> 
      </div>
    </section>
  )
}
