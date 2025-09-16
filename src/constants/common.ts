import { useProsekaData } from "../context/Data";
import { useServer } from "../context/Server";
export const CHARACTERS = [
  "Hoshino Ichika",
  "Tenma Saki",
  "Mochizuki Honami",
  "Hinomori Shiho",
  "Hanasato Minori",
  "Kiritani Haruka",
  "Momoi Airi",
  "Hinomori Shizuku",
  "Azusawa Kohane",
  "Shiraishi An",
  "Shinonome Akito",
  "Aoyagi Toya",
  "Tenma Tsukasa",
  "Otori Emu",
  "Kusanagi Nene",
  "Kamishiro Rui",
  "Yoisaki Kanade",
  "Asahina Mafuyu",
  "Shinonome Ena",
  "Akiyama Mizuki",
  "Hatsune Miku",
  "Kagamine Rin",
  "Kagamine Len",
  "Megurine Luka",
  "MEIKO",
  "KAITO",
];
export const today = Date.now();
export const UNITS = [
  "Leo/need",
  "MORE MORE JUMP!",
  "Vivid BAD SQUAD",
  "Wonderlands x Showtime",
  "Nightcord at 25:00",
];

export const SUB_UNITS = [
  "Leo/Need",
  "MORE MORE JUMP!",
  "Vivid BAD SQUAD",
  "Wonderlands x Showtime",
  "Nightcord at 25:00",
];

export const VS = [
  "Hatsune Miku",
  "Kagamine Rin",
  "Kagamine Len",
  "Megurine Luka",
  "MEIKO",
  "KAITO",
];

export const SpecialCards: number[] = [1167];

export const Banners = () => {
  const { server } = useServer();
  const { jpBanners, enBanners } = useProsekaData();
  const GcObj =
    server === "global" || server === "saved" ? enBanners : jpBanners;
  return GcObj;
};
