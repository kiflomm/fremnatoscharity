import { useTranslation } from "react-i18next"
import { motion } from "framer-motion"

interface ContactCardProps {
  className?: string
}

export default function ContactCard({ className = "" }: ContactCardProps) {
  const { t } = useTranslation()

  return (
    <motion.div 
      className={`bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full bg-blue-400"></div>
        <h3 className="text-white text-sm font-semibold">
          {t("footer.contact_info", { defaultValue: "Contact" })}
        </h3>
      </div>

      {/* Contact Items - Ultra Compact */}
      <div className="space-y-2.5">
        {/* Freminatos */}
        <div className="space-y-1.5">
          <div className="text-blue-400 text-xs font-medium">Freminatos</div>
          <div className="space-y-1">
            <a 
              href="mailto:fremnatoscharity@gmail.com" 
              className="flex items-center gap-2 text-xs text-gray-300 hover:text-white transition-colors group"
            >
              <svg className="w-3 h-3 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="truncate">fremnatoscharity@gmail.com</span>
            </a>
            <a 
              href="tel:+251993110999" 
              className="flex items-center gap-2 text-xs text-gray-300 hover:text-white transition-colors group"
            >
              <svg className="w-3 h-3 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>+251993110999</span>
            </a>
          </div>
        </div>

        {/* Aba Samuel */}
        <div className="space-y-1.5">
          <div className="text-purple-400 text-xs font-medium">Aba Samuel</div>
          <a 
            href="tel:+972543046018" 
            className="flex items-center gap-2 text-xs text-gray-300 hover:text-white transition-colors group"
          >
            <svg className="w-3 h-3 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span>+972543046018</span>
          </a>
        </div>

        {/* Aba Gebremedhn */}
        <div className="space-y-1.5">
          <div className="text-purple-400 text-xs font-medium">Aba Gebremedhn</div>
          <div className="space-y-1">
            <a 
              href="mailto:abagebremedhnzeselama@gmail.com" 
              className="flex items-center gap-2 text-xs text-gray-300 hover:text-white transition-colors group"
            >
              <svg className="w-3 h-3 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="truncate">abagebremedhnzeselama@gmail.com</span>
            </a>
            <a 
              href="tel:+25192010219" 
              className="flex items-center gap-2 text-xs text-gray-300 hover:text-white transition-colors group"
            >
              <svg className="w-3 h-3 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>+25192010219</span>
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
