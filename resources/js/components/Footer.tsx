import { Link } from "@inertiajs/react"
import { useTranslation } from "react-i18next"
import { SimpleLanguageSwitcher } from "./LanguageSwitcher"
import { ThemeToggle } from "./ThemeToggle"
import { useTheme } from "@/contexts/ThemeContext"

export default function Footer() {
  const { t } = useTranslation()
  const { theme } = useTheme()

  return (
    <footer className={`relative ${theme === "dark" ? "bg-gray-950" : "bg-gray-900"} text-white`}>
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/10 pointer-events-none" />

      {/* Main content */}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand & Description */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Freminatos
              </h2>
              <p className="text-gray-300 text-sm mt-2 leading-relaxed">
                {t("footer.description", {
                  defaultValue: "Making a difference in communities through compassion and action.",
                })}
              </p>
            </div>

            {/* Social Media Links */}
            <div className="space-y-4">
              <h4 className="text-white font-semibold text-sm uppercase tracking-wide">
                {t("footer.follow_us", { defaultValue: "Follow Us" })}
              </h4>
              <div className="flex gap-4">
                <a href="#" className="group">
                  <div className="w-10 h-10 bg-blue-600 hover:bg-blue-500 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                  </div>
                </a>
                <a href="#" className="group">
                  <div className="w-10 h-10 bg-blue-700 hover:bg-blue-600 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </div>
                </a>
                <a href="#" className="group">
                  <div className="w-10 h-10 bg-pink-600 hover:bg-pink-500 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z" />
                    </svg>
                  </div>
                </a>
                <a href="#" className="group">
                  <div className="w-10 h-10 bg-red-600 hover:bg-red-500 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-6">{t("footer.quick_links")}</h3>
            <ul className="space-y-3">
              {[
                { href: "/", label: t("nav.home") },
                { href: "/about", label: t("nav.about") },
                { href: "/donate", label: t("nav.donate") },
                { href: "/stories", label: t("nav.stories") },
                { href: "/news", label: t("nav.news") },
                { href: "/contact", label: t("nav.contact") },
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-1 h-1 bg-blue-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-6">
              {t("footer.contact_info", { defaultValue: "Contact Info" })}
            </h3>
            <div className="space-y-6">
              {/* Freminatos Contact */}
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="text-blue-400 font-medium mb-2">{t("footer.freminatos_contact")}</h4>
                <div className="space-y-2 text-sm text-gray-300">
                  <p className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {t("footer.location")}
                  </p>
                  <a
                    href="mailto:fremnatoscharity@gmail.com"
                    className="flex items-center hover:text-white transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    fremnatoscharity@gmail.com
                  </a>
                  <a href="tel:+251993110999" className="flex items-center hover:text-white transition-colors">
                    <svg className="w-4 h-4 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    +251993110999
                  </a>
                </div>
              </div>

              {/* Other Contacts - Condensed */}
              <div className="space-y-3">
                <div className="text-sm">
                  <h5 className="text-purple-400 font-medium mb-1">{t("footer.aba_samuel_contact")}</h5>
                  <a href="tel:+972543046018" className="text-gray-300 hover:text-white transition-colors">
                    +972543046018
                  </a>
                </div>
                <div className="text-sm">
                  <h5 className="text-purple-400 font-medium mb-1">{t("footer.aba_gebremedhn_contact")}</h5>
                  <div className="space-y-1">
                    <a
                      href="mailto:abagebremedhnzeselama@gmail.com"
                      className="text-gray-300 hover:text-white transition-colors block"
                    >
                      abagebremedhnzeselama@gmail.com
                    </a>
                    <a href="tel:+25192010219" className="text-gray-300 hover:text-white transition-colors">
                      +25192010219
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter & Utilities */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-6">{t("footer.stay_connected")}</h3>

            {/* Newsletter */}
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg p-4 border border-white/10 mb-6">
              <h4 className="text-white font-medium mb-3">
                {t("footer.newsletter.title", { defaultValue: "Stay Updated" })}
              </h4>
              <form className="space-y-3">
                <input
                  type="email"
                  required
                  placeholder={t("footer.newsletter.placeholder")}
                  className="w-full h-10 rounded-lg px-3 text-sm bg-white/10 text-white placeholder:text-gray-400 border border-white/20 focus:border-blue-400 focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  className="w-full h-10 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105"
                >
                  {t("footer.newsletter.cta")}
                </button>
              </form>
              <p className="text-gray-400 text-xs mt-2">{t("footer.newsletter.privacy")}</p>
            </div>

            {/* Utilities */}
            <div className="flex items-center gap-3">
              <SimpleLanguageSwitcher />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 bg-black/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm text-center sm:text-left">
              {t("footer.copyright", { year: new Date().getFullYear() })}
            </p>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                {t("footer.privacy")}
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                {t("footer.terms")}
              </Link>
              <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                {t("footer.contact")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
