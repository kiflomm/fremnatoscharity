import AuthenticatedSessionController from '@/actions/App/Http/Controllers/Auth/AuthenticatedSessionController';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import FixedHeaderLayout from '@/layouts/FixedHeaderLayout';
import { register } from '@/routes';
import { request } from '@/routes/password';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const [showPassword, setShowPassword] = useState(false);
    const { t } = useTranslation();

    return (
        <FixedHeaderLayout title="Log in">
            <Head title="Log in" />
            <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full">
                    <div 
                        id="auth-form" 
                        className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-2xl border-0 p-8"
                    >
                        <div className="space-y-6">
                            <div className="text-center space-y-3">
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t("auth.welcome_back")}</h1>
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{t("auth.sign_in_description")}</p>
                            </div>

                            <Form {...AuthenticatedSessionController.store.form()} resetOnSuccess={['password']} className="space-y-6">
                                {({ processing, errors }) => (
                                    <>
                                        <div className="space-y-5">
                                            <div className="space-y-2">
                                                <Label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                    {t("auth.email_address")}
                                                </Label>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        name="email"
                                                        required
                                                        autoFocus
                                                        tabIndex={1}
                                                        autoComplete="email"
                                                        placeholder={t("auth.enter_email")}
                                                        className="pl-10 h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 dark:border-slate-600 dark:focus:border-blue-400"
                                                    />
                                                </div>
                                                <InputError message={errors.email} />
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <Label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                        {t("auth.password")}
                                                    </Label>
                                                    {canResetPassword && (
                                                        <TextLink 
                                                            href={request()} 
                                                            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors" 
                                                            tabIndex={5}
                                                        >
                                                            {t("auth.forgot_password")}
                                                        </TextLink>
                                                    )}
                                                </div>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                                    <Input
                                                        id="password"
                                                        type={showPassword ? "text" : "password"}
                                                        name="password"
                                                        required
                                                        tabIndex={2}
                                                        autoComplete="current-password"
                                                        placeholder={t("auth.enter_password")}
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

                                            <div className="flex items-center space-x-3">
                                                <Checkbox 
                                                    id="remember" 
                                                    name="remember" 
                                                    tabIndex={3}
                                                    className="border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                                />
                                                <Label 
                                                    htmlFor="remember" 
                                                    className="text-sm text-slate-600 dark:text-slate-300 cursor-pointer"
                                                >
                                                    {t("auth.remember_me")}
                                                </Label>
                                            </div>

                                            <Button 
                                                type="submit" 
                                                className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group" 
                                                tabIndex={4} 
                                                disabled={processing}
                                            >
                                                {processing ? (
                                                    <>
                                                        <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                                                        {t("auth.signing_in")}
                                                    </>
                                                ) : (
                                                    <>
                                                        {t("auth.sign_in")}
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
                                                    {t("auth.dont_have_account")}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="text-center">
                                            <TextLink 
                                                href={register()} 
                                                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors" 
                                                tabIndex={5}
                                            >
                                                {t("auth.create_account_link")}
                                            </TextLink>
                                        </div>
                                    </>
                                )}
                            </Form>

                            {status && (
                                <div className="mt-4 p-3 text-center text-sm font-medium text-green-600 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                                    {status}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </FixedHeaderLayout>
    );
}
