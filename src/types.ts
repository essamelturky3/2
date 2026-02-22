export interface MarketData {
  gold: string;
  currency: string;
  prayerTimes: string;
  weather: string;
  holidays: string;
  tvGuide: string;
  news: string;
  gregorianDate: string;
  hijriDate: string;
  lastUpdated: string;
  sources: { uri: string; title: string }[];
}

export interface AppState {
  data: MarketData | null;
  loading: boolean;
  error: string | null;
}
