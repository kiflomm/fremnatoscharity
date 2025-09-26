"use client"

import type React from "react"

import { useState } from "react"
import { useForm, usePage } from "@inertiajs/react"
import contactMessages from "@/routes/contact-messages"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, Shield } from "lucide-react"
import { Badge } from "@/components/ui/badge"

type PageProps = {
  auth?: { user?: { id: number; name?: string | null; email?: string | null } | null }
}

export default function ContactSection() {
  const { t } = useTranslation()
  const { props } = usePage<PageProps>()
  const isLoggedIn = Boolean(props.auth?.user)
  const sessionEmail = props.auth?.user?.email ?? ""
  const { data, setData, post, processing, reset, errors, clearErrors } = useForm({
    name: "",
    email: "",
    message: "",
  })

  // Google Maps URL to search for the organization's office
  const googleMapsUrl = "https://www.google.com/maps/search/13%C2%B029'55%22N+39%C2%B029'5%22E/@13.4986111,39.4847222,62m/data=!3m1!1e3?entry=ttu&g_ep=EgoyMDI1MDkwMy4wIKXMDSoASAFQAw%3D%3D"
    

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    clearErrors()
    post(contactMessages.store.url(), {
      preserveScroll: true,
      onSuccess: () => {
        reset('name', 'email', 'message')
        toast.success(t('contact.message_sent_success') || 'Your message has been sent.')
      },
      onError: () => {
        toast.error(t('contact.message_sent_error') || 'Failed to send your message.')
      },
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setData(e.target.name as 'name' | 'email' | 'message', e.target.value)
  }

  return (
    <section id="contact" className="py-16 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4 text-balance">{t("contact.title")}</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Contact Form */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardDescription>{t("contact.form_description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">{t("contact.full_name")}</Label>
                  <Input
                    id="name"
                    name="name"
                    value={data.name}
                    onChange={handleChange}
                    placeholder={t("contact.full_name_placeholder")}
                    required
                    className="focus:ring-2 focus:ring-primary/20"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                {!isLoggedIn && (
                  <div className="space-y-2">
                    <Label htmlFor="email">{t("contact.email_address")}</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={data.email}
                      onChange={handleChange}
                      placeholder={t("contact.email_placeholder")}
                      required
                      className="focus:ring-2 focus:ring-primary/20"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="message">{t("contact.message")}</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={data.message}
                    onChange={handleChange}
                    placeholder={t("contact.message_placeholder")}
                    rows={5}
                    required
                    className="focus:ring-2 focus:ring-primary/20 resize-none"
                  />
                  {errors.message && (
                    <p className="text-sm text-red-600">{errors.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={processing}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 transition-colors disabled:opacity-60"
                >
                  {processing ? t("common.actions.sending") : t("contact.send_message")}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6 lg:space-y-8">
            {/* Contact Cards Grid */}
            <div className="space-y-4 lg:space-y-6">
              {/* Freminatos Contact */}
              <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 lg:hover:-translate-y-2 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 w-full max-w-full">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/3 via-transparent to-indigo-500/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/20 to-indigo-100/20 rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-50/40 to-indigo-50/40 rounded-full translate-y-12 -translate-x-12 group-hover:scale-125 transition-transform duration-700" />
                
                <CardContent className="relative p-4 sm:p-6 lg:p-8">
                  <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                    {/* Icon Container */}
                    <div className="flex-shrink-0 mx-auto sm:mx-0">
                      <div className="relative">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110 p-1">
                          <img 
                            src="/images/slideshow/logo2.jpg" 
                            alt="Freminatos Charity Logo" 
                            className="w-full h-full object-contain rounded-xl"
                          />
                        </div>
                        <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                          <Shield className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 w-full">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-2">
                        <h4 className="text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-blue-900 transition-colors duration-300 text-center sm:text-left">
                          {t("contact.freminatos_charity")}
                        </h4>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200 font-medium self-center sm:self-auto">
                          {t("contact.official")}
                        </Badge>
                      </div>
                      
                      <p className="text-slate-600 mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed text-center sm:text-left">
                        {t("contact.main_contact_description")}
                      </p>

                      {/* Contact Details */}
                      <div className="space-y-3 sm:space-y-4">
                        <a 
                          href="mailto:fremnatoscharity@gmail.com" 
                          className="group/link flex items-center gap-3 sm:gap-4 p-3 sm:p-3 rounded-xl bg-white/60 hover:bg-white/90 border border-slate-200/60 hover:border-blue-200 transition-all duration-300 hover:shadow-md"
                        >
                          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm group-hover/link:shadow-md transition-shadow duration-300 flex-shrink-0">
                            <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm text-slate-500 font-medium">{t("contact.email_address_label")}</p>
                            <p className="text-sm sm:text-base text-slate-900 font-semibold group-hover/link:text-blue-700 transition-colors duration-300 break-all sm:truncate">
                              fremnatoscharity@gmail.com
                            </p>
                          </div>
                        </a>

                        <a 
                          href="https://youtube.com/@fremnatoscharity7176?si=hyaJaZxkDn2SOt9n" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="group/link flex items-center gap-3 sm:gap-4 p-3 sm:p-3 rounded-xl bg-white/60 hover:bg-white/90 border border-slate-200/60 hover:border-blue-200 transition-all duration-300 hover:shadow-md"
                        >
                          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-sm group-hover/link:shadow-md transition-shadow duration-300 flex-shrink-0">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm text-slate-500 font-medium">{t("contact.youtube_label")}</p>
                            <p className="text-sm sm:text-base text-slate-900 font-semibold group-hover/link:text-blue-700 transition-colors duration-300 truncate">
                              @fremnatoscharity
                            </p>
                          </div>
                        </a>

                        <a 
                          href="tel:+251993110999" 
                          className="group/link flex items-center gap-3 sm:gap-4 p-3 sm:p-3 rounded-xl bg-white/60 hover:bg-white/90 border border-slate-200/60 hover:border-blue-200 transition-all duration-300 hover:shadow-md"
                        >
                          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-sm group-hover/link:shadow-md transition-shadow duration-300 flex-shrink-0">
                            <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm text-slate-500 font-medium">{t("contact.phone_number_label")}</p>
                            <p className="text-sm sm:text-base text-slate-900 font-semibold group-hover/link:text-blue-700 transition-colors duration-300">
                              +251 993 110 999
                            </p>
                          </div>
                        </a>
                      </div>

                      {/* Action Button */}
                      <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-slate-200/60">
                        <Button
                          asChild
                          variant="outline"
                          className="w-full group-hover:bg-blue-50 group-hover:border-blue-200 group-hover:text-blue-700 transition-all duration-300 font-medium text-sm sm:text-base py-2 sm:py-3"
                        >
                          <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                            <MapPin className="w-4 h-4 mr-2" />
                            {t("contact.visit_our_office")}
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Toaster position="top-center" richColors />
    </section>
  )
}
