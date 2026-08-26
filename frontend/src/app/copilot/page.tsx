"use client";

import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Briefcase, 
  Zap, 
  TrendingUp,
  FileText
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { useLanguage } from '@/contexts/LanguageContext';

export default function CopilotPage() {
  const { isAr } = useLanguage();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: isAr 
        ? "أهلاً يا أحمد! 👋 أنا المساعد الذكي لمسارك المهني في منصة عواطلي. بحلل بيانات سوق العمل المصري وأقدر أساعدك تجهز للإنترفيو، تفهم متطلبات الشركات، أو تحسن سيرتك الذاتية. عايز تبدأ بإيه النهاردة؟"
        : "Hello Ahmed! 👋 I'm your 3WATLY AI Career Copilot. I analyze real Egyptian job market data to help you prepare for interviews, optimize your CV, and bridge skill gaps. How can I help you today?"
    }
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: userText }]);
    setInput('');

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: isAr
            ? `بناءً على تحليلي لـ 1,240 وظيفة Data Analyst في مصر: التركيز على مهارات SQL (Window Functions) وتصميم لوحات تحكم تفاعلية بـ Power BI هما المفتاح الأساسي لقبولك في شركات زي Vodafone وValeo.`
            : `Based on 1,240 Data Analyst postings in Egypt: Mastering SQL Window Functions and building interactive Power BI dashboards are the top 2 factors to pass technical screenings at companies like Vodafone and Valeo.`
        }
      ]);
    }, 600);
  };

  const suggestions = isAr
    ? [
        "إيه أهم أسئلة إنترفيو SQL لمبتدئين في مصر؟",
        "ازاي أعوض نقص مهارة Power BI في الـ CV؟",
        "متوسط رواتب الـ Data Analyst في القاهرة كام؟"
      ]
    : [
        "What are the top SQL interview questions in Egypt?",
        "How can I highlight Power BI projects on my CV?",
        "What is the average salary for Junior Data Analysts in Cairo?"
      ];

  return (
    <AppShell
      title={isAr ? "المساعد الذكي للمسار المهني (AI Copilot)" : "AI Career Copilot"}
      subtitle={isAr ? "استشارات وظيفية وتحضير للمقابلات مبنية على بيانات سوق العمل الحقيقية." : "Real-time career advice and interview preparation backed by actual job market data."}
      showSearch={false}
    >
      <div className="max-w-[1000px] mx-auto h-[calc(100vh-210px)] flex flex-col rounded-[24px] border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-[#0B1120] shadow-xs overflow-hidden">
        
        {/* Messages Feed */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((m) => (
            <div 
              key={m.id}
              className={`flex items-start gap-3 ${m.sender === 'user' ? 'ltr:flex-row-reverse rtl:flex-row-reverse' : ''}`}
            >
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                m.sender === 'user'
                  ? 'bg-blue-600 text-white font-bold text-xs'
                  : 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-sm'
              }`}>
                {m.sender === 'user' ? 'AS' : <Bot className="w-5 h-5" />}
              </div>

              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-[13.5px] leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-white/[0.05] text-slate-800 dark:text-slate-200'
              }`}>
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Prompt Suggestions */}
        <div className="px-6 py-2 border-t border-slate-100 dark:border-white/[0.06] flex items-center gap-2 overflow-x-auto no-scrollbar">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setInput(s)}
              className="px-3 py-1.5 rounded-full bg-slate-50 dark:bg-white/[0.04] hover:bg-slate-100 border border-slate-200 dark:border-white/10 text-[12px] text-slate-600 dark:text-slate-300 font-medium whitespace-nowrap transition-colors cursor-pointer"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <form onSubmit={handleSend} className="p-4 border-t border-slate-100 dark:border-white/[0.06] flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isAr ? "اسأل المساعد الذكي أي سؤال عن سوق العمل، المهارات، أو الـ CV..." : "Ask AI Copilot about the market, skills, or interview prep..."}
            className="flex-1 h-12 px-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#070B14] text-[13.5px] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
          />
          <button
            type="submit"
            className="flex h-12 px-5 items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[13px] shadow-sm transition-colors cursor-pointer"
          >
            <span>{isAr ? "إرسال" : "Send"}</span>
            <Send className={`w-4 h-4 ${isAr ? "rotate-180" : ""}`} />
          </button>
        </form>

      </div>
    </AppShell>
  );
}
