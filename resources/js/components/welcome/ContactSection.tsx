"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Heart, Mail, Phone, MapPin, Shield } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Form submitted:", formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4 text-balance">We'd Love to Hear From You!</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Heart className="h-5 w-5" />
                Get Involved
              </CardTitle>
              <CardDescription>Fill out the form below and we'll get back to you as soon as possible.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    className="focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    required
                    className="focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us how you'd like to get involved or any questions you have..."
                    rows={5}
                    required
                    className="focus:ring-2 focus:ring-primary/20 resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 transition-colors"
                >
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <h3 className="text-3xl font-bold text-foreground mb-3">Get in Touch</h3>
              <p className="text-lg text-muted-foreground">We're here to help and answer any questions you may have</p>
            </div>

            {/* Contact Cards Grid */}
            <div className="grid gap-4">
              {/* Freminatos Contact */}
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                      <Heart className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-gray-900 mb-1">Freminatos Charity</h4>
                      <p className="text-sm text-gray-600 mb-4">Main organization contact</p>
                      <div className="space-y-2">
                        <a 
                          href="mailto:fremnatoscharity@gmail.com" 
                          className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors group/link"
                        >
                          <Mail className="w-4 h-4 text-blue-500" />
                          <span className="font-medium">fremnatoscharity@gmail.com</span>
                        </a>
                        <a 
                          href="tel:+251993110999" 
                          className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors group/link"
                        >
                          <Phone className="w-4 h-4 text-blue-500" />
                          <span className="font-medium">+251 993 110 999</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Aba Samuel Contact */}
             </div>
          </div>
        </div>
      </div>
    </section>
  )
}
