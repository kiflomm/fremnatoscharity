import { Link } from "@inertiajs/react"
import { useTranslation } from "react-i18next"
import { SimpleLanguageSwitcher } from "./LanguageSwitcher"
import { ThemeToggle } from "./ThemeToggle"
import { useTheme } from "@/contexts/ThemeContext"
import { motion } from "framer-motion"

export default function Footer() {
  const { t } = useTranslation()
  const { theme } = useTheme()

  return (
    <footer className={`relative overflow-hidden ${theme === "dark" ? "bg-gray-950" : "bg-gray-900"} text-white`}>
      {/* Enhanced gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-pink-600/20 pointer-events-none" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full -translate-x-48 -translate-y-48 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-purple-500/10 to-transparent rounded-full translate-x-48 translate-y-48 blur-3xl" />

      {/* Main content */}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Brand & Description */}
          <motion.div 
            className="md:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              Freminatos
            </h2>
            <p className="text-gray-300 text-base leading-relaxed mb-8">
              {t("footer.description", {
                defaultValue: "Making a difference in communities through compassion and action.",
              })}
            </p>
            
            {/* Enhanced Social Media Links */}
            <div className="space-y-4">
              <h4 className="text-white font-semibold text-sm uppercase tracking-wider flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-blue-400"></div>
                {t("footer.follow_us", { defaultValue: "Follow Us" })}
              </h4>
              <div className="flex gap-3">
                {/* LinkedIn */}
                <a href="#" className="group">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-blue-500/25">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </div>
                </a>
                
                {/* X (Former Twitter) */}
                <a href="#" className="group">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-gray-500/25">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </div>
                </a>
                
                {/* Facebook */}
                <a href="#" className="group">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-blue-500/25">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </div>
                </a>
                
                {/* YouTube */}
                <a href="#" className="group">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-red-500/25">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </div>
                </a>
              </div>
            </div>
          </motion.div>
          </div>

{/* Utilities */}
<div className="flex items-center gap-3">

        </div>
      </div>

      {/* Enhanced Bottom bar */}
      <div className="border-t border-white/10 bg-gradient-to-r from-black/30 via-black/20 to-black/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-between gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <p className="text-gray-400 text-sm text-center sm:text-left">
                {t("footer.copyright", { year: new Date().getFullYear() })}
              </p>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-gray-500"></div>
                <span className="text-gray-500 text-xs">Made with</span>
                <div className="w-4 h-4 text-red-500 flex items-center justify-center">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </div>
                <span className="text-gray-500 text-xs">for communities</span>
              </div>
            </div>
            <div className="flex items-center gap-8 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors duration-300 hover:scale-105">
                {t("footer.privacy")}
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors duration-300 hover:scale-105">
                {t("footer.terms")}
              </Link>
              <Link href="/contact" className="text-gray-400 hover:text-white transition-colors duration-300 hover:scale-105">
                {t("footer.contact")}
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  )
}
