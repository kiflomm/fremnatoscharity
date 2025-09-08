import { Link } from "@inertiajs/react"
import { useTranslation } from "react-i18next" 
import { useTheme } from "@/contexts/ThemeContext"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Mail, Phone } from "lucide-react"

export default function Footer() {
  const { t } = useTranslation()
  const { theme } = useTheme()

  const socialLinks = [
    {
      name: "LinkedIn",
      href: "#",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
      color: "hover:bg-blue-500/20 hover:text-blue-400"
    },
    {
      name: "X",
      href: "#",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      color: "hover:bg-gray-500/20 hover:text-gray-400"
    },
    {
      name: "Facebook",
      href: "#",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      color: "hover:bg-blue-500/20 hover:text-blue-400"
    },
    {
      name: "YouTube",
      href: "#",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
      color: "hover:bg-red-500/20 hover:text-red-400"
    }
  ]

  const quickLinks = [
    { name: t("footer.privacy", { defaultValue: "Privacy Policy" }), href: "/privacy" },
    { name: t("footer.terms", { defaultValue: "Terms of Service" }), href: "/terms" },
    { name: t("footer.contact", { defaultValue: "Contact" }), href: "/contact" }
  ]

  const contactPersons = [
    {
      name: "Aba Selama",
      phone: "+972543046018",
      email: "aba.selama@freminatos.org",
      image: "/images/contact/aba_selama.png"
    },
    {
      name: "Aba Gebremedhn",
      phone: "+25192010219",
      email: "abagebremedhnzeselama@gmail.com",
      image: "/images/contact/aba_gebremedhn.png"
    }
  ]

  return (
    <footer className={`relative ${theme === "dark" ? "bg-gray-950" : "bg-gray-900"} text-white`}>
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/3 to-pink-600/5 pointer-events-none" />
      
      {/* Main content - Compact design */}
      <div className="relative max-w-7xl mx-auto px-3 lg:px-4 py-4">
          <motion.div 
          className="grid grid-cols-1 lg:grid-cols-5 gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">F</span>
              </div>
              <h2 className="text-lg font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Freminatos
            </h2>
            </div>
            
            <p className="text-gray-300 text-xs leading-relaxed max-w-md">
              {t("footer.description", {
                defaultValue: "Making a difference in communities through compassion and action.",
              })}
            </p>
            
            {/* Social Links - Compact */}
            <div className="flex items-center gap-1">
              <span className="text-gray-400 text-xs font-medium">Follow us:</span>
              <div className="flex gap-1">
                {socialLinks.map((social) => (
                  <Button
                    key={social.name}
                    variant="ghost"
                    size="sm"
                    className={`h-6 w-6 p-0 text-gray-400 ${social.color} transition-all duration-200`}
                    asChild
                  >
                    <a href={social.href} aria-label={social.name}>
                      {social.icon}
                    </a>
                  </Button>
                ))}
              </div>
            </div>
                  </div>

          {/* Contact Info - Enhanced UI */}
          <div className="lg:col-span-3 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {contactPersons.map((person, index) => (
                <Card 
                  key={person.name}
                  className="group hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 border border-white/10 hover:border-blue-400/30 backdrop-blur-sm"
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Header with Image and Name */}
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/30 group-hover:border-blue-400/50 transition-colors duration-300">
                            <img 
                              src={person.image} 
                              alt={person.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white/20 flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-white text-base group-hover:text-blue-300 transition-colors duration-300">{person.name}</h3>
                          <p className="text-gray-400 text-xs">Contact Person</p>
                        </div>
                      </div>
                      
                      {/* Contact Details with Enhanced Styling */}
                      <div className="space-y-2.5">
                        <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors duration-300">
                          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors duration-300">
                            <Phone className="w-4 h-4 text-blue-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-400 mb-0.5">Phone</p>
                            <a 
                              href={`tel:${person.phone}`}
                              className="text-white hover:text-blue-300 transition-colors duration-300 font-medium text-sm"
                            >
                              {person.phone}
                            </a>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors duration-300">
                          <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/30 transition-colors duration-300">
                            <Mail className="w-4 h-4 text-purple-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-400 mb-0.5">Email</p>
                            <a 
                              href={`mailto:${person.email}`}
                              className="text-white hover:text-purple-300 transition-colors duration-300 font-medium text-sm truncate block"
                            >
                              {person.email}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

        </motion.div>
      </div>

      {/* Bottom bar - Ultra compact */}
      <Separator className="bg-white/10" />
      <div className="max-w-7xl mx-auto px-3 lg:px-4 py-2">
          <motion.div 
          className="flex flex-col sm:flex-row items-center justify-between gap-2"
          initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
            viewport={{ once: true }}
          >
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>
                {t("footer.copyright", { year: new Date().getFullYear() })}
            </span>
            
                </div>
          
          <div className="flex items-center gap-2 text-xs">
            {quickLinks.map((link, index) => (
              <div key={link.name} className="flex items-center gap-2">
                <Link 
                  href={link.href} 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
                {index < quickLinks.length - 1 && (
                  <div className="w-1 h-1 rounded-full bg-gray-500" />
                )}
              </div>
            ))}
            </div>
          </motion.div>
      </div>
    </footer>
  )
}
