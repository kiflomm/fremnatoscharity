import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface DonationFormProps {
  isAuthenticated: boolean;
  user?: {
    id: number;
    name: string;
    email: string;
  } | null;
  onUnauthenticatedClick?: () => void;
}

export default function DonationForm({ isAuthenticated, user, onUnauthenticatedClick }: DonationFormProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
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
    
    // Social Media
    skype: '',
    viber: '',
    facebook: '',
    messenger: '',
    
    // Monthly Contribution
    monthlyAmount: '',
    currency: 'ETB',
    
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
      onUnauthenticatedClick?.();
      return;
    }
    
    // Handle form submission here
    console.log('Form submitted:', formData);
    // You can add API call here
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className={`w-full max-w-md ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <CardHeader className="text-center">
            <CardTitle className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              {t('donation_form.login_required')}
            </CardTitle>
            <CardDescription className={`${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              {t('donation_form.login_required_description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className={`text-center ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              {t('donation_form.already_setup_message')}
            </p>
            <div className="flex gap-2">
              <Button 
                onClick={onUnauthenticatedClick}
                className="flex-1"
                variant="default"
              >
                {t('auth.login')}
              </Button>
              <Button 
                onClick={() => window.location.href = '/register'}
                className="flex-1"
                variant="outline"
              >
                {t('auth.register')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className={`text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            {t('donation_form.title')}
          </h1>
          <p className={`text-lg ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
            {t('donation_form.subtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information Section */}
          <Card className={`${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
            <CardHeader>
              <CardTitle className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                {t('donation_form.personal_info')}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('donation_form.name')}</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fatherName">{t('donation_form.father_name')}</Label>
                <Input
                  id="fatherName"
                  value={formData.fatherName}
                  onChange={(e) => handleInputChange('fatherName', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gender">{t('donation_form.gender')}</Label>
                <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                  <SelectTrigger>
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
                <Label htmlFor="age">{t('donation_form.age')}</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="country">{t('donation_form.country')}</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="region">{t('donation_form.region')}</Label>
                <Input
                  id="region"
                  value={formData.region}
                  onChange={(e) => handleInputChange('region', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="city">{t('donation_form.city')}</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="woreda">{t('donation_form.woreda')}</Label>
                <Input
                  id="woreda"
                  value={formData.woreda}
                  onChange={(e) => handleInputChange('woreda', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="kebele">{t('donation_form.kebele')}</Label>
                <Input
                  id="kebele"
                  value={formData.kebele}
                  onChange={(e) => handleInputChange('kebele', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="profession">{t('donation_form.profession')}</Label>
                <Input
                  id="profession"
                  value={formData.profession}
                  onChange={(e) => handleInputChange('profession', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="educationLevel">{t('donation_form.education_level')}</Label>
                <Input
                  id="educationLevel"
                  value={formData.educationLevel}
                  onChange={(e) => handleInputChange('educationLevel', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">{t('donation_form.phone_number')}</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Social Media Section */}
          <Card className={`${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
            <CardHeader>
              <CardTitle className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                {t('donation_form.social_media')}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="skype">{t('donation_form.skype')}</Label>
                <Input
                  id="skype"
                  value={formData.skype}
                  onChange={(e) => handleInputChange('skype', e.target.value)}
                  placeholder={t('donation_form.if_you_have_write')}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="viber">{t('donation_form.viber')}</Label>
                <Input
                  id="viber"
                  value={formData.viber}
                  onChange={(e) => handleInputChange('viber', e.target.value)}
                  placeholder={t('donation_form.if_you_have_write')}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="facebook">{t('donation_form.facebook')}</Label>
                <Input
                  id="facebook"
                  value={formData.facebook}
                  onChange={(e) => handleInputChange('facebook', e.target.value)}
                  placeholder={t('donation_form.if_you_have_write')}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="messenger">{t('donation_form.messenger')}</Label>
                <Input
                  id="messenger"
                  value={formData.messenger}
                  onChange={(e) => handleInputChange('messenger', e.target.value)}
                  placeholder={t('donation_form.if_you_have_write')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Monthly Contribution Section */}
          <Card className={`${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
            <CardHeader>
              <CardTitle className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                {t('donation_form.monthly_contribution')}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="monthlyAmount">{t('donation_form.amount_of_money')}</Label>
                <Input
                  id="monthlyAmount"
                  type="number"
                  value={formData.monthlyAmount}
                  onChange={(e) => handleInputChange('monthlyAmount', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currency">{t('donation_form.select_currency')}</Label>
                <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ETB">{t('donation_form.birr')}</SelectItem>
                    <SelectItem value="USD">{t('donation_form.usd')}</SelectItem>
                    <SelectItem value="EUR">{t('donation_form.eur')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Professional Help Section */}
          <Card className={`${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
            <CardHeader>
              <CardTitle className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                {t('donation_form.professional_help_title')}
              </CardTitle>
              <CardDescription className={`${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                {t('donation_form.professional_help_description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <Label htmlFor={profession} className="text-sm font-medium">
                    {t(`donation_form.help_${profession}`)}
                  </Label>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Donation Section */}
          <Card className={`${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
            <CardHeader>
              <CardTitle className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                {t('donation_form.donation')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Monetary Donation */}
              <div>
                <h4 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  {t('donation_form.by_money')}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="donationAmount">{t('donation_form.amount_of_money')}</Label>
                    <Input
                      id="donationAmount"
                      type="number"
                      value={formData.donationAmount}
                      onChange={(e) => handleInputChange('donationAmount', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="donationCurrency">{t('donation_form.birr')}</Label>
                    <Select value={formData.donationCurrency} onValueChange={(value) => handleInputChange('donationCurrency', value)}>
                      <SelectTrigger>
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
                    <Label htmlFor="donationTime">{t('donation_form.select_donation_time')}</Label>
                    <Select value={formData.donationTime} onValueChange={(value) => handleInputChange('donationTime', value)}>
                      <SelectTrigger>
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

              <Separator />

              {/* Property Donation */}
              <div>
                <h4 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  {t('donation_form.by_property')}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="propertyType">{t('donation_form.select_property_type')}</Label>
                    <Select value={formData.propertyType} onValueChange={(value) => handleInputChange('propertyType', value)}>
                      <SelectTrigger>
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
                    <Label htmlFor="propertyDonationTime">{t('donation_form.select_donation_time')}</Label>
                    <Select value={formData.propertyDonationTime} onValueChange={(value) => handleInputChange('propertyDonationTime', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('donation_form.select_donation_time')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">{t('donation_form.immediate')}</SelectItem>
                        <SelectItem value="future">{t('donation_form.future')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="additionalProperty">{t('donation_form.additional_property')}</Label>
                    <Textarea
                      id="additionalProperty"
                      value={formData.additionalProperty}
                      onChange={(e) => handleInputChange('additionalProperty', e.target.value)}
                      placeholder={t('donation_form.additional_property_placeholder')}
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="text-center">
            <Button type="submit" size="lg" className="px-8">
              {t('donation_form.submit')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
