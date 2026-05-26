// Quran Cloud API helpers (https://alquran.cloud/api)
const BASE = "https://api.alquran.cloud/v1";

export type SurahMeta = {
  number: number;
  name: string; // arabic
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: "Meccan" | "Medinan";
};

export type Ayah = {
  number: number;
  numberInSurah: number;
  text: string;
  audio?: string;
  juz: number;
  page: number;
};

export type SurahDetail = {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
  ayahs: Ayah[];
};

export async function fetchSurahList(): Promise<SurahMeta[]> {
  const res = await fetch(`${BASE}/surah`);
  const json = await res.json();
  return json.data as SurahMeta[];
}

// Returns three parallel editions: tajweed Arabic, plain Arabic, Indonesian translation, alafasy audio
export async function fetchSurahBundle(id: number): Promise<{
  meta: SurahMeta;
  tajweed: Ayah[];
  translation: Ayah[];
  audio: Ayah[];
  fullAudio: string;
}> {
  const res = await fetch(
    `${BASE}/surah/${id}/editions/quran-tajweed,id.indonesian,ar.alafasy`,
  );
  const json = await res.json();
  const editions = json.data as SurahDetail[];
  const tajweed = editions[0];
  const translation = editions[1];
  const audio = editions[2];
  const padded = String(id).padStart(3, "0");
  return {
    meta: {
      number: tajweed.number,
      name: tajweed.name,
      englishName: tajweed.englishName,
      englishNameTranslation: tajweed.englishNameTranslation,
      numberOfAyahs: tajweed.numberOfAyahs,
      revelationType: tajweed.revelationType as "Meccan" | "Medinan",
    },
    tajweed: tajweed.ayahs,
    translation: translation.ayahs,
    audio: audio.ayahs,
    fullAudio: `https://server8.mp3quran.net/afs/${padded}.mp3`,
  };
}
