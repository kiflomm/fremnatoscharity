import RegisteredUserController from '@/actions/App/Http/Controllers/Auth/RegisteredUserController';
import { login } from '@/routes';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle, User, Mail, Lock, Eye, EyeOff, CheckCircle, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import FixedHeaderLayout from '@/layouts/FixedHeaderLayout';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { t } = useTranslation();

    return (
        <FixedHeaderLayout title="Register">
            <Head title="Register" />
            <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full">
                    <div 
                        id="auth-form" 
                        className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-2xl border-0 p-8"
                    >
                        <div className="space-y-6">
                            <div className="text-center space-y-3">
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t("auth.join_mission")}</h1>
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{t("auth.create_account_description")}</p>
                            </div>
                            
                            <Form
                                {...RegisteredUserController.store.form()}
                                resetOnSuccess={['password', 'password_confirmation']}
                                disableWhileProcessing
                                className="space-y-6"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        <div className="space-y-5">
                                            <div className="space-y-2">
                                                <Label htmlFor="name" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                    {t("auth.full_name")}
                                                </Label>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                                    <Input
                                                        id="name"
                                                        type="text"
                                                        required
                                                        autoFocus
                                                        tabIndex={1}
                                                        autoComplete="name"
                                                        name="name"
                                                        placeholder={t("auth.full_name")}
                                                        className="pl-10 h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 dark:border-slate-600 dark:focus:border-blue-400"
                                                    />
                                                </div>
                                                <InputError message={errors.name} />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                    {t("auth.email_address")}
                                                </Label>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        required
                                                        tabIndex={2}
                                                        autoComplete="email"
                                                        name="email"
                                                        placeholder={t("auth.enter_email")}
                                                        className="pl-10 h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 dark:border-slate-600 dark:focus:border-blue-400"
                                                    />
                                                </div>
                                                <InputError message={errors.email} />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                    {t("auth.password")}
                                                </Label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                                    <Input
                                                        id="password"
                                                        type={showPassword ? "text" : "password"}
                                                        required
                                                        tabIndex={3}
                                                        autoComplete="new-password"
                                                        name="password"
                                                        placeholder={t("auth.create_password")}
                                                        className="pl-10 pr-10 h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 dark:border-slate-600 dark:focus:border-blue-400"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                                    >
                                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                    </button>
                                                </div>
                                                <InputError message={errors.password} />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="password_confirmation" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                    {t("auth.confirm_password")}
                                                </Label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                                    <Input
                                                        id="password_confirmation"
                                                        type={showConfirmPassword ? "text" : "password"}
                                                        required
                                                        tabIndex={4}
                                                        autoComplete="new-password"
                                                        name="password_confirmation"
                                                        placeholder={t("auth.confirm_password_placeholder")}
                                                        className="pl-10 pr-10 h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 dark:border-slate-600 dark:focus:border-blue-400"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                                    >
                                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                    </button>
                                                </div>
                                                <InputError message={errors.password_confirmation} />
                                            </div>

                                            <Button 
                                                type="submit" 
                                                className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group" 
                                                tabIndex={5}
                                                disabled={processing}
                                            >
                                                {processing ? (
                                                    <>
                                                        <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                                                        {t("auth.creating_account")}
                                                    </>
                                                ) : (
                                                    <>
                                                        {t("auth.create_account")}
                                                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                                    </>
                                                )}
                                            </Button>
                                        </div>

                                        <div className="relative">
                                            <div className="absolute inset-0 flex items-center">
                                                <div className="w-full border-t border-slate-200 dark:border-slate-600" />
                                            </div>
                                            <div className="relative flex justify-center text-sm">
                                                <span className="px-4 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                                                    {t("auth.already_have_account")}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="text-center">
                                            <TextLink 
                                                href={login()} 
                                                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors" 
                                                tabIndex={6}
                                            >
                                                {t("auth.sign_in_instead")}
                                            </TextLink>
                                        </div>
                                    </>
                                )}
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </FixedHeaderLayout>
    );
}
