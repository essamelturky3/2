import { GoogleGenAI, Type } from "@google/genai";
import { MarketData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function fetchEgyptianMarketData(location?: string): Promise<MarketData> {
  const model = "gemini-3-flash-preview";
  const prompt = `
    أعطني معلومات دقيقة ومحدثة عن:
    *ملاحظة هامة: شهر رمضان المبارك بدأ في مصر يوم 19 فبراير 2026.*
    1. أسعار الذهب في مصر اليوم (عيار 24، 21، 18، والجنيه الذهب).
    2. أسعار صرف العملات الرئيسية مقابل الجنيه المصري (الدولار، اليورو، الريال السعودي، الدرهم الإماراتي).
    3. مواقيت الصلاة في ${location || "القاهرة"} اليوم (استخدم نظام 12 ساعة AM/PM).
    4. حالة الطقس الحالية ودرجات الحرارة في ${location || "القاهرة"}.
    5. الأيام العالمية والدولية والأعياد والمناسبات (الرسمية وغير الرسمية) والوطنية لجميع دول العالم خلال شهر فبراير 2026، مع ذكر التاريخ وكم يوماً متبقي لكل مناسبة.
    6. دليل التلفزيون المصري (ما يعرض الآن على القنوات) بناءً على الرابط: https://elcinema.com/tvguide/
    7. آخر الأخبار العاجلة المتداولة عالمياً.
    8. التاريخ اليوم في مصر بالميلادي والهجري.
    
    يجب أن تكون الإجابة بتنسيق JSON حصراً مع الحقول التالية:
    - gold: نص منسق بـ Markdown.
    - currency: نص منسق بـ Markdown.
    - prayerTimes: نص منسق بـ Markdown (نظام 12 ساعة).
    - weather: نص منسق بـ Markdown.
    - holidays: نص منسق بـ Markdown (قائمة المناسبات والعد التنازلي).
    - tvGuide: نص منسق بـ Markdown (ما يعرض الآن على القنوات).
    - news: نص منسق بـ Markdown (أخبار عاجلة).
    - gregorianDate: التاريخ الميلادي.
    - hijriDate: التاريخ الهجري.
    - lastUpdated: الوقت الحالي بتنسيق نصي (نظام 12 ساعة).
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }, { urlContext: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          gold: { type: Type.STRING },
          currency: { type: Type.STRING },
          prayerTimes: { type: Type.STRING },
          weather: { type: Type.STRING },
          holidays: { type: Type.STRING },
          tvGuide: { type: Type.STRING },
          news: { type: Type.STRING },
          gregorianDate: { type: Type.STRING },
          hijriDate: { type: Type.STRING },
          lastUpdated: { type: Type.STRING },
        },
        required: ["gold", "currency", "prayerTimes", "weather", "holidays", "tvGuide", "news", "gregorianDate", "hijriDate", "lastUpdated"],
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("لم يتم العثور على بيانات");

  const parsed = JSON.parse(text);
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const sources = chunks
    .filter((c: any) => c.web)
    .map((c: any) => ({ uri: c.web.uri, title: c.web.title }));

  return {
    ...parsed,
    sources,
  };
}
