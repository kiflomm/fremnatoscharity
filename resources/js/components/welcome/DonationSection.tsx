import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

export default function DonationSection() {
    const { theme } = useTheme();
    const { t } = useTranslation();

    return (
        <section id="donate" className="py-20 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
                }} />
            </div>
            
            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                    Your Support Changes Lives
                </h2>
                <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                    Every contribution, no matter the size, makes a real difference in the lives of elders, children, and those with mental disabilities.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                    <button className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-2xl hover:shadow-white/25 transform hover:-translate-y-1 hover:scale-105">
                        Donate Now
                    </button>
                    <button className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:-translate-y-1">
                        Bank Details
                    </button>
                </div>
                
                {/* Bank Accounts */}
                <div className={`${theme === 'dark' ? 'bg-gray-800/90' : 'bg-white/90'} backdrop-blur-sm rounded-3xl p-8 shadow-2xl`}>
                    <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
                        {t('bank_accounts')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="text-center">
                            <h4 className="font-semibold text-green-600 mb-2">{t('commercial_bank')}</h4>
                            <div className="space-y-1">
                                <p className="text-sm font-mono bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-2 rounded">1000241223195</p>
                                <p className="text-sm font-mono bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-2 rounded">1000564271498</p>
                                <p className="text-sm font-mono bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-2 rounded">1000622132404</p>
                            </div>
                        </div>
                        
                        <div className="text-center">
                            <h4 className="font-semibold text-blue-600 mb-2">{t('wegagen_bank')}</h4>
                            <p className="text-sm font-mono bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-2 rounded">0827742010102</p>
                        </div>
                        
                        <div className="text-center">
                            <h4 className="font-semibold text-purple-600 mb-2">{t('abyssinia_bank')}</h4>
                            <p className="text-sm font-mono bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-2 rounded">146309151</p>
                        </div>
                        
                        <div className="text-center">
                            <h4 className="font-semibold text-orange-600 mb-2">{t('awash_bank')}</h4>
                            <p className="text-sm font-mono bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-2 rounded">013251148569500</p>
                        </div>
                        
                        <div className="text-center">
                            <h4 className="font-semibold text-indigo-600 mb-2">{t('berhan_bank')}</h4>
                            <p className="text-sm font-mono bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-2 rounded">1500700167456</p>
                        </div>
                        
                        <div className="text-center">
                            <h4 className="font-semibold text-teal-600 mb-2">{t('dashen_bank')}</h4>
                            <p className="text-sm font-mono bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-2 rounded">5013032975011</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
