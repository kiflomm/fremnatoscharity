"use client"

import { useTranslation } from "react-i18next"
import i18n from "i18next"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion, type Variants } from "framer-motion"
import { Copy, Check, Building2, ChevronDown } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Toaster } from "@/components/ui/sonner"
import axios from "axios"

type BankInfo = {
  id: number
  nameKey: string
  display_name: string
  display_name_en: string
  display_name_am: string
  display_name_ti: string
  logo_url: string
  accounts: string[]
  alt?: string
}

type ApiResponse = {
  success: boolean
  data: BankInfo[]
}

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

const listVariants: Variants = {
  hidden: {},
  visible: {
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
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  hover: {
    y: -4,
    transition: {
      duration: 0.2,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

export default function DonationSection() {
  const { t } = useTranslation()
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null)
  const [isUserScrolling, setIsUserScrolling] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, scrollLeft: 0 })
  const [banks, setBanks] = useState<BankInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const animationRef = useRef<number | null>(null) 

  // Fetch banks data from API
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Get current locale from i18n
        const currentLocale = i18n.language || 'en'
        const response = await axios.get<ApiResponse>(`/api/banks?locale=${currentLocale}`)
        
        if (response.data.success) {
          setBanks(response.data.data)
        } else {
          setError('Failed to load bank data')
        }
      } catch (err) {
        console.error('Error fetching banks:', err)
        setError('Failed to load bank data')
      } finally {
        setLoading(false)
      }
    }

    fetchBanks()
  }, [i18n.language]) // Refetch when language changes

  const handleCopyAccount = async (account: string, bankName: string) => {
    try {
      await navigator.clipboard.writeText(account)
      setCopiedAccount(account)
      toast.success(t("donation.account_copied"), {
        description: t("donation.account_copied_description", { bankName }),
        duration: 2000,
      })

      // Reset copied state after 2 seconds
      setTimeout(() => setCopiedAccount(null), 2000)
    } catch (err) {
      toast.error(t("donation.copy_failed"), {
        description: t("donation.copy_failed_description"),
        duration: 3000,
      })
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return
    
    setIsDragging(true)
    setIsUserScrolling(true)
    
    // Cancel any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    
    // Clear any existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }
    
    // Get current scroll position and mouse position
    const container = scrollContainerRef.current
    const rect = container.getBoundingClientRect()
    const scrollLeft = container.scrollLeft || 0
    const x = e.clientX - rect.left
    
    setDragStart({ x, scrollLeft })
    
    // Prevent default to avoid text selection
    e.preventDefault()
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return
    
    const container = scrollContainerRef.current
    const rect = container.getBoundingClientRect()
    const x = e.clientX - rect.left
    const walk = (x - dragStart.x) * 2 // Scroll speed multiplier
    const newScrollLeft = dragStart.scrollLeft - walk
    
    container.scrollLeft = newScrollLeft
  }

  const handleMouseUp = () => {
    if (!isDragging) return
    
    setIsDragging(false)
    
    // Resume auto-scroll after 3 seconds of no user interaction
    scrollTimeoutRef.current = setTimeout(() => {
      setIsUserScrolling(false)
    }, 3000)
  }

  const handleMouseLeave = () => {
    if (isDragging) {
      handleMouseUp()
    }
  }

  const handleWheel = (e: React.WheelEvent) => {
    if (!scrollContainerRef.current) return
    
    setIsUserScrolling(true)
    
    // Cancel any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    
    // Clear any existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }
    
    const container = scrollContainerRef.current
    container.scrollLeft += e.deltaY
    
    // Resume auto-scroll after 3 seconds of no user interaction
    scrollTimeoutRef.current = setTimeout(() => {
      setIsUserScrolling(false)
    }, 3000)
  }

  // Auto-scroll effect
  useEffect(() => {
    if (isUserScrolling || !scrollContainerRef.current) return

    const container = scrollContainerRef.current
    const scrollWidth = container.scrollWidth
    const clientWidth = container.clientWidth
    const maxScroll = scrollWidth - clientWidth

    const autoScroll = () => {
      if (isUserScrolling || !scrollContainerRef.current) return

      const currentScroll = container.scrollLeft
      const newScroll = currentScroll + 1 // 1px per frame

      if (newScroll >= maxScroll) {
        // Reset to beginning for seamless loop
        container.scrollLeft = 0
      } else {
        container.scrollLeft = newScroll
      }

      animationRef.current = requestAnimationFrame(autoScroll)
    }

    animationRef.current = requestAnimationFrame(autoScroll)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isUserScrolling])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  // Show loading state
  if (loading) {
    return (
      <section id="donate" className="py-8 sm:py-6 bg-gradient-to-br from-background via-background to-muted/20">
        <div className="mx-auto max-w-5xl px-3 sm:px-4">
          <div className="text-center mb-8">
            <h2 className="text-balance text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-3">
              {t("donation.title")}
            </h2>
            <p className="text-balance text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t("donation.subtitle") ||
                "Your support helps us continue our mission. Choose from any of our trusted bank accounts below."}
            </p>
          </div>
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 text-muted-foreground">{t("donation.loading_bank_info")}</span>
          </div>
        </div>
      </section>
    )
  }

  // Show error state
  if (error) {
    return (
      <section id="donate" className="py-8 sm:py-6 bg-gradient-to-br from-background via-background to-muted/20">
        <div className="mx-auto max-w-5xl px-3 sm:px-4">
          <div className="text-center mb-8">
            <h2 className="text-balance text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-3">
              {t("donation.title")}
            </h2>
            <p className="text-balance text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t("donation.subtitle") ||
                "Your support helps us continue our mission. Choose from any of our trusted bank accounts below."}
            </p>
          </div>
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={() => window.location.reload()} variant="outline">
                {t("donation.try_again")}
              </Button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="donate" className="py-8 sm:py-6 bg-gradient-to-br from-background via-background to-muted/20">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
        className="mx-auto max-w-5xl px-3 sm:px-4"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-balance text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-3">
            {t("donation.title")}
          </h2>
          <p className="text-balance text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t("donation.subtitle") ||
              "Your support helps us continue our mission. Choose from any of our trusted bank accounts below."}
          </p>
        </div>

        {/* Auto-scrolling bank logos */}
        <div className="relative overflow-hidden group">
          {/* Scroll hint */}
          <div className="absolute top-0 right-4 z-10 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-muted-foreground border border-border/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {isDragging ? t("donation.dragging") : isUserScrolling ? t("donation.scroll_to_explore") : t("donation.drag_to_scroll")}
          </div>
          
          <div 
            ref={scrollContainerRef}
            className="flex gap-8 lg:gap-12 overflow-x-auto scrollbar-hide"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onWheel={handleWheel}
            style={{
              cursor: isDragging ? 'grabbing' : 'grab',
              userSelect: 'none',
              scrollBehavior: 'auto',
            }}
          >
            {/* Duplicate banks for seamless loop */}
            {[...banks, ...banks].map((bank, index) => (
              <Dialog key={`${bank.id}-${index}`}>
                <DialogTrigger asChild>
                  <motion.div
                    variants={itemVariants}
                    className="flex flex-col items-center gap-3 cursor-pointer group hover:scale-110 transition-transform duration-300"
                  >
                    <Avatar className="size-16 lg:size-20 ring-2 ring-border/30 group-hover:ring-primary/50 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                      <AvatarImage
                        src={bank.logo_url || "/placeholder.svg"}
                        alt={bank.display_name}
                        className="object-contain"
                      />
                      <AvatarFallback className="bg-gradient-to-br from-muted to-muted/80 text-muted-foreground text-lg font-bold">
                        <Building2 className="size-8" />
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm lg:text-base font-medium text-foreground group-hover:text-primary transition-colors duration-300 text-center whitespace-nowrap">
                      {bank.display_name}
                    </span>
                  </motion.div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader className="pb-4">
                    <DialogTitle className="flex items-center gap-4 text-xl">
                      <Avatar className="size-12 ring-2 ring-primary/20">
                        <AvatarImage
                          src={bank.logo_url || "/placeholder.svg"}
                          alt={bank.display_name}
                          className="object-contain"
                        />
                        <AvatarFallback className="bg-gradient-to-br from-primary/10 to-primary/5 text-primary text-lg font-bold">
                          <Building2 className="size-6" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-bold">{bank.display_name}</h3>
                        <p className="text-sm text-muted-foreground font-normal">
                          {t("donation.accounts_available", { count: bank.accounts.length })}
                        </p>
                      </div>
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    {bank.accounts.map((account, accountIndex) => (
                      <div
                        key={account}
                        className="flex items-center justify-between gap-4 p-4 bg-gradient-to-r from-muted/30 to-muted/10 rounded-xl border border-border/20 hover:border-primary/30 hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary/10 transition-all duration-200"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-muted-foreground mb-2 font-medium">
                            {t("donation.account")} {bank.accounts.length > 1 ? accountIndex + 1 : ""}
                          </p>
                          <code className="text-base font-mono font-semibold text-card-foreground select-all break-all bg-muted/50 px-3 py-2 rounded-lg border">
                            {account}
                          </code>
                        </div>
                        <Button
                          variant="default"
                          size="sm"
                          className="shrink-0 h-10 px-4 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-lg transition-all duration-200"
                          onClick={() => handleCopyAccount(account, bank.display_name)}
                          aria-label={`Copy ${bank.display_name} account ${account}`}
                        >
                          {copiedAccount === account ? (
                            <>
                              <Check className="size-4 mr-2" /> {t("donation.copied")}
                            </>
                          ) : (
                            <>
                              <Copy className="size-4 mr-2" /> {t("donation.copy")}
                            </>
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>

        <Toaster position="top-center" richColors />
      </motion.div>
    </section>
  )
}
