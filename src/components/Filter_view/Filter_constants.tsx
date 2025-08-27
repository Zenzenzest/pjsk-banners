export const grouped: Record<string, string[]> = {
  "Virtual Singers": [
    "Hatsune Miku",
    "Kagamine Rin",
    "Kagamine Len",
    "Megurine Luka",
    "MEIKO",
    "KAITO",
  ],
  "Leo/Need": [
    "Hoshino Ichika",
    "Tenma Saki",
    "Mochizuki Honami",
    "Hinomori Shiho",
  ],
  "MORE MORE JUMP!": [
    "Hanasato Minori",
    "Kiritani Haruka",
    "Momoi Airi",
    "Hinomori Shizuku",
  ],
  "Vivid BAD SQUAD": [
    "Azusawa Kohane",
    "Shiraishi An",
    "Shinonome Akito",
    "Aoyagi Toya",
  ],
  "Wonderlands x Showtime": [
    "Tenma Tsukasa",
    "Otori Emu",
    "Kusanagi Nene",
    "Kamishiro Rui",
  ],
  "Nightcord at 25:00": [
    "Yoisaki Kanade",
    "Asahina Mafuyu",
    "Shinonome Ena",
    "Akiyama Mizuki",
  ],
};



export const cardFilterCategories = {
  Characters: [
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
  ],
  Unit: [
    "Virtual Singers",
    "Leo/Need",
    "MORE MORE JUMP!",
    "Vivid BAD SQUAD",
    "Wonderlands x Showtime",
    "Nightcord at 25:00",
  ],
  sub_unit: [
    "Leo/Need",
    "MORE MORE JUMP!",
    "Vivid BAD SQUAD",
    "Wonderlands x Showtime",
    "Nightcord at 25:00",
  ],
  Attribute: ["Cute", "Pure", "Mysterious", "Cool", "Happy"],
  Rarity: [1, 2, 3, 4, 5],
  Type: [
    "Permanent",
    "Collab",
    "Movie",
    "Limited",
    "Unit Limited",
    "ColorFes",
    "BloomFes",
  ],
};

export const bannerFilterCategories = {
  "Banner Type": [
    "Limited Event Rerun",
    "Limited Event",
    "Event",
    "Bloom Festival",
    "Colorful Festival",
    "Collab",
    "Unit Limited Event",
    "Birthday",
  ],
  Characters: cardFilterCategories.Characters,
};

// For FilteredCards
export const cardTypeMapping = {
  permanent: "Permanent",
  limited: "Limited",
  movie_exclusive: "Movie",
  unit_limited: "Unit Limited",
  color_fes: "ColorFes",
  bloom_fes: "BloomFes",
  limited_collab: "Collab",
};
