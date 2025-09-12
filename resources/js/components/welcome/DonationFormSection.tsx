import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/contexts/ThemeContext';
import { usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { router } from '@inertiajs/react';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function DonationFormSection() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { auth, isAuthenticated, user } = usePage<SharedData>().props;
  const [formData, setFormData] = useState({
    // Personal Information
    name: user?.name || '',
    fatherName: '',
    gender: '',
    age: '',
    country: '',
    region: '',
    city: '',
    woreda: '',
    kebele: '',
    profession: '',
    educationLevel: '',
    phoneNumber: '',
    
    // Professional Help
    helpProfessions: [] as string[],
    
    // Donation
    donationAmount: '',
    donationCurrency: 'ETB',
    donationTime: '',
    propertyType: '',
    additionalProperty: '',
    propertyDonationTime: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckboxChange = (profession: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      helpProfessions: checked 
        ? [...prev.helpProfessions, profession]
        : prev.helpProfessions.filter(p => p !== profession)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.visit('/login');
      return;
    }
    
    // Handle form submission here
    console.log('Form submitted:', formData);
    // You can add API call here
  };

  const handleUnauthenticatedClick = () => {
    router.visit('/login');
  };

  if (!isAuthenticated) {
    return null; // Don't render anything when user is not logged in
  }

  return (
    <motion.section 
      id="donation-form"
      className="py-16 bg-gradient-to-br from-background via-background to-muted/20"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      <div className="mx-auto max-w-4xl px-4">
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-4">
            {t('donation_form.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('donation_form.subtitle')}
          </p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-8" variants={itemVariants}>
            {/* Left Column - Personal Information */}
            <div className="space-y-6">
            <Card className={`${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <CardHeader>
                <CardTitle className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} flex items-center gap-2`}>
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  {t('donation_form.personal_info')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">{t('donation_form.name')}</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                      className="h-10"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fatherName" className="text-sm font-medium">{t('donation_form.father_name')}</Label>
                    <Input
                      id="fatherName"
                      value={formData.fatherName}
                      onChange={(e) => handleInputChange('fatherName', e.target.value)}
                      className="h-10"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-sm font-medium">{t('donation_form.gender')}</Label>
                    <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder={t('donation_form.select_gender')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">{t('donation_form.male')}</SelectItem>
                        <SelectItem value="female">{t('donation_form.female')}</SelectItem>
                        <SelectItem value="other">{t('donation_form.other')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-sm font-medium">{t('donation_form.age')}</Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      className="h-10"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className={`text-sm font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'} border-b pb-2`}>
                    Location Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="country" className="text-sm font-medium">{t('donation_form.country')}</Label>
                      <Input
                        id="country"
                        value={formData.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        className="h-10"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="region" className="text-sm font-medium">{t('donation_form.region')}</Label>
                      <Input
                        id="region"
                        value={formData.region}
                        onChange={(e) => handleInputChange('region', e.target.value)}
                        className="h-10"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-sm font-medium">{t('donation_form.city')}</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="h-10"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="woreda" className="text-sm font-medium">{t('donation_form.woreda')}</Label>
                      <Input
                        id="woreda"
                        value={formData.woreda}
                        onChange={(e) => handleInputChange('woreda', e.target.value)}
                        className="h-10"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="kebele" className="text-sm font-medium">{t('donation_form.kebele')}</Label>
                      <Input
                        id="kebele"
                        value={formData.kebele}
                        onChange={(e) => handleInputChange('kebele', e.target.value)}
                        className="h-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className={`text-sm font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'} border-b pb-2`}>
                    Professional Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="profession" className="text-sm font-medium">{t('donation_form.profession')}</Label>
                      <Input
                        id="profession"
                        value={formData.profession}
                        onChange={(e) => handleInputChange('profession', e.target.value)}
                        className="h-10"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="educationLevel" className="text-sm font-medium">{t('donation_form.education_level')}</Label>
                      <Input
                        id="educationLevel"
                        value={formData.educationLevel}
                        onChange={(e) => handleInputChange('educationLevel', e.target.value)}
                        className="h-10"
                      />
                    </div>
                    
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="phoneNumber" className="text-sm font-medium">{t('donation_form.phone_number')}</Label>
                      <Input
                        id="phoneNumber"
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                        className="h-10"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Contribution & Donation */}
          <div className="space-y-6">
            {/* Professional Help Section */}
            <Card className={`${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <CardHeader>
                <CardTitle className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} flex items-center gap-2`}>
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  {t('donation_form.professional_help_title')}
                </CardTitle>
                <CardDescription className={`${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'} text-sm`}>
                  {t('donation_form.professional_help_description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    'medicine',
                    'teaching',
                    'construction',
                    'hair_profession',
                    'food_profession',
                    'agriculture',
                    'computer_science',
                    'others'
                  ].map((profession) => (
                    <div key={profession} className="flex items-center space-x-2">
                      <Checkbox
                        id={profession}
                        checked={formData.helpProfessions.includes(profession)}
                        onCheckedChange={(checked) => handleCheckboxChange(profession, checked as boolean)}
                      />
                      <Label htmlFor={profession} className="text-sm font-medium cursor-pointer">
                        {t(`donation_form.help_${profession}`)}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Donation Section */}
            <Card className={`${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <CardHeader>
                <CardTitle className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} flex items-center gap-2`}>
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  {t('donation_form.donation')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Monetary Donation */}
                <div>
                  <h4 className={`text-sm font-semibold mb-3 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'} border-b pb-2`}>
                    {t('donation_form.by_money')}
                  </h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="donationAmount" className="text-sm font-medium">{t('donation_form.amount_of_money')}</Label>
                      <Input
                        id="donationAmount"
                        type="number"
                        value={formData.donationAmount}
                        onChange={(e) => handleInputChange('donationAmount', e.target.value)}
                        className="h-10"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="donationCurrency" className="text-sm font-medium">{t('donation_form.birr')}</Label>
                        <Select value={formData.donationCurrency} onValueChange={(value) => handleInputChange('donationCurrency', value)}>
                          <SelectTrigger className="h-10">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ETB">{t('donation_form.birr')}</SelectItem>
                            <SelectItem value="USD">{t('donation_form.usd')}</SelectItem>
                            <SelectItem value="EUR">{t('donation_form.eur')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="donationTime" className="text-sm font-medium">{t('donation_form.select_donation_time')}</Label>
                        <Select value={formData.donationTime} onValueChange={(value) => handleInputChange('donationTime', value)}>
                          <SelectTrigger className="h-10">
                            <SelectValue placeholder={t('donation_form.select_donation_time')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="one_time">{t('donation_form.one_time')}</SelectItem>
                            <SelectItem value="monthly">{t('donation_form.monthly')}</SelectItem>
                            <SelectItem value="yearly">{t('donation_form.yearly')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Property Donation */}
                <div>
                  <h4 className={`text-sm font-semibold mb-3 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'} border-b pb-2`}>
                    {t('donation_form.by_property')}
                  </h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="propertyType" className="text-sm font-medium">{t('donation_form.select_property_type')}</Label>
                        <Select value={formData.propertyType} onValueChange={(value) => handleInputChange('propertyType', value)}>
                          <SelectTrigger className="h-10">
                            <SelectValue placeholder={t('donation_form.select_property_type')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="land">{t('donation_form.land')}</SelectItem>
                            <SelectItem value="building">{t('donation_form.building')}</SelectItem>
                            <SelectItem value="vehicle">{t('donation_form.vehicle')}</SelectItem>
                            <SelectItem value="equipment">{t('donation_form.equipment')}</SelectItem>
                            <SelectItem value="other">{t('donation_form.other')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="propertyDonationTime" className="text-sm font-medium">{t('donation_form.select_donation_time')}</Label>
                        <Select value={formData.propertyDonationTime} onValueChange={(value) => handleInputChange('propertyDonationTime', value)}>
                          <SelectTrigger className="h-10">
                            <SelectValue placeholder={t('donation_form.select_donation_time')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="immediate">{t('donation_form.immediate')}</SelectItem>
                            <SelectItem value="future">{t('donation_form.future')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="additionalProperty" className="text-sm font-medium">{t('donation_form.additional_property')}</Label>
                      <Textarea
                        id="additionalProperty"
                        value={formData.additionalProperty}
                        onChange={(e) => handleInputChange('additionalProperty', e.target.value)}
                        placeholder={t('donation_form.additional_property_placeholder')}
                        rows={3}
                        className="resize-none"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div className="text-center mt-8" variants={itemVariants}>
            <Button type="submit" size="lg" className="px-12 py-3 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
              {t('donation_form.submit')}
            </Button>
          </motion.div>
        </form>
      </div>
    </motion.section>
  );
}
