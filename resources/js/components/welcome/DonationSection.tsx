import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';

type BankInfo = {
    nameKey: string;
    accounts: string[];
    logoSrc: string; // public path e.g. /images/banks/cbe.svg
    accentClass: string; // text color for title
    alt?: string;
};

const containerVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const listVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.06, delayChildren: 0.1 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
    hover: { y: -2, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' },
};

export default function DonationSection() {
    const { theme } = useTheme();
    const { t } = useTranslation();

    const banks: BankInfo[] = [
        {
            nameKey: 'commercial_bank',
            accounts: ['1000241223195', '1000564271498', '1000622132404'],
            logoSrc: 'https://images.seeklogo.com/logo-png/54/1/commercial-bank-of-ethiopia-logo-png_seeklogo-547506.png',
            accentClass: 'text-green-600',
            alt: 'Commercial Bank of Ethiopia',
        },
        {
            nameKey: 'wegagen_bank',
            accounts: ['0827742010102'],
            logoSrc: 'https://play-lh.googleusercontent.com/Ves7vKxwdSCMXkBX-opA4KDWrYT9pMdktTXfNfczbC1RgFZpBX81RvUTa0ghTbMXRKk=w240-h480-rw',
            accentClass: 'text-blue-600',
        },
        {
            nameKey: 'abyssinia_bank',
            accounts: ['146309151'],
            logoSrc: 'https://play-lh.googleusercontent.com/W6pOvwi0XCs8nNjZzcnZ91tXn29CBPUlLu4h8JQ1RCPPNMKyEVxYCPEuc4fCaLtw0A=w240-h480-rw',
            accentClass: 'text-purple-600',
        },
        {
            nameKey: 'awash_bank',
            accounts: ['013251148569500'],
            logoSrc: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Awash_International_Bank.png/500px-Awash_International_Bank.png',
            accentClass: 'text-orange-600',
        },
        {
            nameKey: 'berhan_bank',
            accounts: ['1500700167456'],
            logoSrc: 'data:image/png;base64,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',
            accentClass: 'text-indigo-600',
        },
        {
            nameKey: 'dashen_bank',
            accounts: ['5013032975011'],
            logoSrc: 'https://play-lh.googleusercontent.com/iqSg1Sbo332FCja9e99khtAOwyVWZhZp1IRvulU_U9ASnOnnnCxXCFocCEE6PhMVAUw=w240-h480-rw',
            accentClass: 'text-teal-600',
        },
    ];

    return (
        <section id="donate" className="py-16 sm:py-20 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 relative overflow-hidden">
            <div className="absolute inset-0 opacity-15">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.12'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
                }} />
            </div>

            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={containerVariants}
                className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"
            >
                <div className="text-center">
                    <h2 className="text-pretty text-2xl sm:text-3xl md:text-5xl font-bold text-white tracking-tight mb-3">
                        {t('donation.title')}
                    </h2>
                    <p className="text-balance text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
                        {t('donation.subtitle')}
                    </p>
                </div>

                <motion.div
                    variants={listVariants}
                    className={`${theme === 'dark' ? 'bg-gray-900/70' : 'bg-white/90'} backdrop-blur-md rounded-3xl mt-8 p-4 sm:p-6 md:p-8 shadow-2xl ring-1 ring-black/5`}
                >

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {banks.map((bank) => (
                            <motion.div key={bank.nameKey} variants={itemVariants} whileHover="hover" className="h-full">
                                <Card className="h-full transition-colors">
                                    <CardHeader className="flex-row items-center gap-4">
                                        <Avatar className="size-12 ring-2 ring-black/5 dark:ring-white/5">
                                            <AvatarImage src={bank.logoSrc} alt={bank.alt ?? t(bank.nameKey)} />
                                            <AvatarFallback aria-hidden>
                                                {t(bank.nameKey).slice(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <CardTitle className={`text-base sm:text-lg ${bank.accentClass}`}>
                                            {t(bank.nameKey)}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-2" aria-label={t('bank_accounts')}>
                                            {bank.accounts.map((acct) => (
                                                <li key={acct} className="flex items-center justify-between">
                                                    <span className="text-xs sm:text-sm font-mono bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-3 py-1.5 rounded-md select-all">
                                                        {acct}
                                                    </span>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-xs"
                                                        onClick={() => navigator.clipboard?.writeText(acct)}
                                                        aria-label={`Copy ${t(bank.nameKey)} account`}
                                                    >
                                                        {t('copy') ?? 'Copy'}
                                                    </Button>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
}
