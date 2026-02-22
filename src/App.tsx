import { useState, useEffect } from 'react';
import { 
  Coins, 
  TrendingUp, 
  Clock, 
  RefreshCw, 
  Search, 
  ExternalLink, 
  AlertCircle,
  MapPin,
  Calendar,
  CloudSun,
  Globe,
  Tv,
  Newspaper,
  Moon,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { fetchEgyptianMarketData } from './services/geminiService';
import { MarketData } from './types';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      type: 'spring' as const, 
      stiffness: 100,
      damping: 15
    } 
  }
};

export default function App() {
  const [data, setData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState('القاهرة');
  const [searchCity, setSearchCity] = useState('القاهرة');

  const loadData = async (location: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchEgyptianMarketData(location);
      setData(result);
    } catch (err) {
      console.error(err);
      setError('حدث خطأ أثناء جلب البيانات. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(city);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCity.trim()) {
      setCity(searchCity);
      loadData(searchCity);
    }
  };

  return (
    <div className="min-h-screen bg-mesh text-zinc-900 font-sans pb-20 selection:bg-emerald-100 selection:text-emerald-900">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-zinc-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="h-20 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 15 }}
                whileTap={{ scale: 0.9, rotate: -15 }}
                className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-200/50 cursor-pointer relative overflow-hidden group"
              >
                <TrendingUp size={28} className="relative z-10" />
                <motion.div 
                  animate={{ 
                    x: ['-100%', '100%'],
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "linear",
                    repeatDelay: 3
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                />
              </motion.div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-zinc-900 leading-none mb-1">نبض السوق</h1>
                <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-bold uppercase tracking-widest">
                  <span>مصر</span>
                  <span className="w-1 h-1 bg-zinc-200 rounded-full"></span>
                  <span className="flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    تحديث مباشر
                  </span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSearch} className="hidden lg:flex items-center relative w-96">
              <input
                type="text"
                placeholder="ابحث عن مدينة لمواقيت الصلاة والطقس..."
                className="w-full bg-zinc-50 border border-zinc-100 focus:bg-white focus:border-emerald-500 focus:ring-8 focus:ring-emerald-500/5 rounded-2xl py-3 pr-12 pl-4 text-sm transition-all outline-none placeholder:text-zinc-400"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
              />
              <Search className="absolute right-4 text-zinc-400" size={20} />
            </form>

            <div className="flex items-center gap-4">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => loadData(city)}
                disabled={loading}
                className="p-3 bg-zinc-50 hover:bg-white hover:shadow-lg hover:shadow-zinc-200/50 border border-zinc-100 rounded-2xl transition-all disabled:opacity-50 group"
              >
                <RefreshCw className={cn("text-zinc-600 group-hover:text-emerald-600 transition-colors", loading && "animate-spin")} size={22} />
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      <motion.main 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-4 lg:px-8 mt-10"
      >
        {/* Hero Section */}
        <section className="mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Date & Location Info */}
            <div className="lg:col-span-8 bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl shadow-zinc-200">
              <div className="relative z-10">
                <div className="flex flex-wrap items-center gap-4 mb-8">
                  <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest border border-white/10 flex items-center gap-2">
                    <MapPin size={14} className="text-emerald-400" />
                    {city}
                  </span>
                  <span className="px-4 py-1.5 bg-emerald-500 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                    <Clock size={14} />
                    {data?.lastUpdated || 'جاري التحديث...'}
                  </span>
                </div>
                
                <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
                  مرحباً بك في <span className="text-emerald-400">نبض السوق</span>
                </h2>
                
                <div className="flex flex-col md:flex-row md:items-center gap-8 text-zinc-300">
                  <div className="flex items-center gap-4">
                    <motion.div 
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10"
                    >
                      <Calendar size={24} className="text-emerald-400" />
                    </motion.div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">التاريخ الميلادي</p>
                      <p className="text-lg font-bold text-white">{data?.gregorianDate || '...'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <motion.div 
                      animate={{ y: [0, 8, 0] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                      className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10"
                    >
                      <Moon size={24} className="text-amber-400" />
                    </motion.div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">التاريخ الهجري</p>
                      <p className="text-lg font-bold text-white">{data?.hijriDate || '...'}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Abstract Background Elements */}
              <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-500/10 blur-[100px] rounded-full"></div>
              <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-blue-500/10 blur-[100px] rounded-full"></div>
            </div>

            {/* Weather Quick View */}
            <div className="lg:col-span-4 bg-emerald-50 rounded-[2.5rem] p-8 flex flex-col justify-between border border-emerald-100 shadow-xl shadow-emerald-100/20">
              <div className="flex items-center justify-between mb-8">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200/50">
                  <CloudSun size={32} className="text-emerald-600" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600/60 mb-1">حالة الطقس</p>
                  <p className="text-sm font-bold text-emerald-900">{city}</p>
                </div>
              </div>
              
              <div className="flex-grow">
                {loading ? (
                  <div className="space-y-3">
                    <div className="h-8 bg-emerald-100/50 rounded-xl w-1/2 animate-pulse" />
                    <div className="h-4 bg-emerald-100/50 rounded-xl w-full animate-pulse" />
                  </div>
                ) : (
                  <div className="markdown-body text-emerald-900 font-medium">
                    <Markdown>{data?.weather}</Markdown>
                  </div>
                )}
              </div>
              
              <div className="mt-6 pt-6 border-t border-emerald-100 flex items-center justify-between text-emerald-600 font-bold text-xs">
                <span>عرض التفاصيل</span>
                <ArrowRight size={16} />
              </div>
            </div>
          </motion.div>
        </section>

        {/* Search Mobile */}
        <section className="lg:hidden mb-10">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="ابحث عن مدينة..."
              className="w-full bg-white border border-zinc-200 focus:border-emerald-500 focus:ring-8 focus:ring-emerald-500/5 rounded-[2rem] py-4 pr-14 pl-6 outline-none shadow-xl shadow-zinc-100 transition-all"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
            />
            <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-400" size={24} />
          </form>
        </section>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-10 p-6 bg-red-50 border border-red-100 rounded-[2rem] flex items-center gap-4 text-red-700 shadow-xl shadow-red-100/20"
          >
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-600">
              <AlertCircle size={24} />
            </div>
            <div>
              <p className="font-bold">عذراً، حدث خطأ</p>
              <p className="text-sm opacity-80">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Main Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <Card 
            title="أسعار الذهب" 
            subtitle="السوق المصري"
            icon={<Coins size={24} />} 
            loading={loading}
            content={data?.gold}
            variant="amber"
          />

          <Card 
            title="أسعار العملات" 
            subtitle="مقابل الجنيه"
            icon={<TrendingUp size={24} />} 
            loading={loading}
            content={data?.currency}
            variant="blue"
          />

          <Card 
            title="مواقيت الصلاة" 
            subtitle={city}
            icon={<Clock size={24} />} 
            loading={loading}
            content={data?.prayerTimes}
            variant="emerald"
          />

          <Card 
            title="أخبار عاجلة" 
            subtitle="تغطية عالمية"
            icon={<Newspaper size={24} />} 
            loading={loading}
            content={data?.news}
            variant="red"
          />

          {/* TV Guide Card - Full Width */}
          <div className="lg:col-span-3">
            <Card 
              title="دليل التلفزيون المصري" 
              subtitle="ما يعرض الآن على القنوات (elcinema.com)"
              icon={<Tv size={24} />} 
              loading={loading}
              content={data?.tvGuide}
              variant="purple"
            />
          </div>

          {/* Holidays Card - Full Width */}
          <div className="lg:col-span-3">
            <Card 
              title="المناسبات والأعياد العالمية والوطنية" 
              subtitle="أعياد وأيام عالمية"
              icon={<Globe size={24} />} 
              loading={loading}
              content={data?.holidays}
              variant="indigo"
            />
          </div>
        </motion.div>

        {/* Sources */}
        <AnimatePresence>
          {!loading && data && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-20 border-t border-zinc-100 pt-12"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div>
                  <h3 className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-6">المصادر الموثوقة</h3>
                  <div className="flex flex-wrap gap-3">
                    {data.sources.map((source, i) => (
                      <motion.a 
                        key={i}
                        whileHover={{ y: -2 }}
                        href={source.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-5 py-2.5 bg-white border border-zinc-100 rounded-2xl text-xs font-bold text-zinc-600 hover:border-emerald-500 hover:text-emerald-600 transition-all shadow-sm hover:shadow-md"
                      >
                        <span className="truncate max-w-[200px]">{source.title}</span>
                        <ExternalLink size={14} className="opacity-40" />
                      </motion.a>
                    ))}
                  </div>
                </div>
                <div className="text-left">
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.2em] mb-2"
                  >
                    نظام الذكاء الاصطناعي
                  </motion.p>
                  <p className="text-xs font-bold text-zinc-400">جميع البيانات يتم جلبها وتحليلها لحظياً</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.main>
    </div>
  );
}

interface CardProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  loading: boolean;
  content?: string;
  variant: 'amber' | 'blue' | 'emerald' | 'purple' | 'red' | 'indigo';
}

function Card({ title, subtitle, icon, loading, content, variant }: CardProps) {
  const variants = {
    amber: 'from-amber-500 to-orange-600 shadow-amber-100 bg-amber-50/50 border-amber-100',
    blue: 'from-blue-500 to-indigo-600 shadow-blue-100 bg-blue-50/50 border-blue-100',
    emerald: 'from-emerald-500 to-teal-600 shadow-emerald-100 bg-emerald-50/50 border-emerald-100',
    purple: 'from-purple-500 to-violet-600 shadow-purple-100 bg-purple-50/50 border-purple-100',
    red: 'from-red-500 to-rose-600 shadow-red-100 bg-red-50/50 border-red-100',
    indigo: 'from-indigo-500 to-blue-700 shadow-indigo-100 bg-indigo-50/50 border-indigo-100',
  };

  const iconColors = {
    amber: 'text-amber-600',
    blue: 'text-blue-600',
    emerald: 'text-emerald-600',
    purple: 'text-purple-600',
    red: 'text-red-600',
    indigo: 'text-indigo-600',
  };

  return (
    <motion.div 
      variants={itemVariants}
      whileHover={{ 
        y: -12,
        scale: 1.02,
        transition: { duration: 0.4, ease: "easeOut" }
      }}
      className="group glass-card glass-card-hover rounded-[2.5rem] p-8 flex flex-col h-full relative overflow-hidden"
    >
      <div className="flex items-center gap-5 mb-8">
        <motion.div 
          whileHover={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.5 }}
          className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110",
            "bg-white border border-zinc-50",
            iconColors[variant]
          )}
        >
          {icon}
        </motion.div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-300 mb-1 group-hover:text-zinc-400 transition-colors">{subtitle}</p>
          <h2 className="font-black text-xl text-zinc-900 group-hover:text-emerald-700 transition-colors">{title}</h2>
        </div>
      </div>

      <div className="flex-grow relative z-10">
        {loading ? (
          <div className="space-y-4">
            <div className="h-4 bg-zinc-50 rounded-full w-3/4 animate-shimmer" />
            <div className="h-4 bg-zinc-50 rounded-full w-full animate-shimmer" />
            <div className="h-4 bg-zinc-50 rounded-full w-5/6 animate-shimmer" />
            <div className="h-4 bg-zinc-50 rounded-full w-2/3 animate-shimmer" />
          </div>
        ) : content ? (
          <div className="markdown-body">
            <Markdown>{content}</Markdown>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-zinc-300">
            <AlertCircle size={40} className="mb-4 opacity-20" />
            <p className="text-sm font-bold italic">لا توجد بيانات متاحة</p>
          </div>
        )}
      </div>

      {/* Subtle Background Accent */}
      <div className={cn(
        "absolute -right-10 -bottom-10 w-32 h-32 blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity rounded-full",
        variant === 'amber' && 'bg-amber-500',
        variant === 'blue' && 'bg-blue-500',
        variant === 'emerald' && 'bg-emerald-500',
        variant === 'purple' && 'bg-purple-500',
        variant === 'red' && 'bg-red-500',
        variant === 'indigo' && 'bg-indigo-500',
      )}></div>
    </motion.div>
  );
}
