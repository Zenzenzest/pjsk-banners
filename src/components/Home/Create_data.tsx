import { useState, useEffect } from "react";
import gachas from "../../gachas.json";
import * as fs from "fs";
import Select from "react-select";

type Server = "jp" | "global";

interface GachaArr {
  id: number;
  name: string;
  start: number;
  end: number;
}

type Entry = {
  id: number;

  name: string;
  character: string;
  rarity: 1 | 2 | 3 | 4;
  group: string;
  attribute: string;
  untrained_url: string;
  trained_url: string;
};
const groupedCharacters: Record<string, string[]> = {
  "Virtual Singers": [
    "Hatsune Miku",
    "Kagamine Rin",
    "Kagamine Len",
    "MEIKO",
    "Megurine Luka",
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
    "Shiraishi An",
    "Azusawa Kohane",
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

const characterOptions = Object.values(groupedCharacters)
  .flat()
  .map((name) => ({ label: name, value: name }));

const rarityOptions = [1, 2, 3, 4].map((r) => ({ label: `${r}`, value: r }));

const groupOptions = Object.keys(groupedCharacters).map((group) => ({
  label: group,
  value: group,
}));

const attributeOptions = ["Cute", "Happy", "Mysterious", "Cool", "Pure"].map(
  (attr) => ({
    label: attr,
    value: attr,
  })
);

// Helper to get group name from character
function getGroupForCharacter(character: string): string {
  for (const [groupName, members] of Object.entries(groupedCharacters)) {
    if (members.includes(character)) {
      return groupName;
    }
  }
  return "Virtual Singers"; // default
}

export default function CreateData() {
 
  const [entries, setEntries] = useState<Entry[]>([]);
  const [form, setForm] = useState<Omit<Entry, "id">>({
    name: "",
    character: characterOptions[0].value,
    rarity: 4,
    group: getGroupForCharacter(characterOptions[0].value),
    attribute: "Cute",
    untrained_url: "",
    trained_url: "",
  });


  useEffect(() => {
    const saved = localStorage.getItem('entries');
    if (saved) {
      setEntries(JSON.parse(saved));
    }
  }, []);
  const dropDownStyle = {
    control: (base) => ({ ...base, backgroundColor: "white", color: "black" }),
    singleValue: (base) => ({ ...base, color: "black" }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#e5e7eb" : "white",
      color: "black",
    }),
    menu: (base) => ({ ...base, zIndex: 9999 }),
  };

  const handleCharacterChange = (selected: any) => {
    const char = selected.value;
    const autoGroup = getGroupForCharacter(char);
    setForm((prev) => ({ ...prev, character: char, group: autoGroup }));
  };

  const handleSubmit = () => {
    const newEntry: Entry = {
      id: entries.length + 1,
      ...form,
    };
    setEntries((prev) => [...prev, newEntry]);
  };

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(entries, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "entries.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 space-y-4 max-w-xl mx-auto">
      <input
        type="text"
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="border p-2 w-full rounded"
      />

      <Select
        styles={dropDownStyle}
        options={characterOptions}
        value={{ label: form.character, value: form.character }}
        onChange={handleCharacterChange}
        placeholder="Select Character"
      />

      <Select
        styles={dropDownStyle}
        options={rarityOptions}
        value={{ label: `${form.rarity}`, value: form.rarity }}
        onChange={(r) => setForm({ ...form, rarity: r.value })}
        placeholder="Select Rarity"
      />

      <Select
        styles={dropDownStyle}
        options={groupOptions}
        value={{ label: form.group, value: form.group }}
        onChange={(g) => setForm({ ...form, group: g.value })}
        placeholder="Select Group"
      />

      <Select
        styles={dropDownStyle}
        options={attributeOptions}
        value={{ label: form.attribute, value: form.attribute }}
        onChange={(a) => setForm({ ...form, attribute: a.value })}
        placeholder="Select Attribute"
      />

      <input
        type="text"
        placeholder="Untrained URL"
        value={form.untrained_url}
        onChange={(e) => setForm({ ...form, untrained_url: e.target.value })}
        className="border p-2 w-full rounded"
      />

      <input
        type="text"
        placeholder="Trained URL"
        value={form.trained_url}
        onChange={(e) => setForm({ ...form, trained_url: e.target.value })}
        className="border p-2 w-full rounded"
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add Entry
      </button>

      <button
        onClick={downloadJson}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Download JSON
      </button>
      <button
        onClick={() => console.log(entries)}
        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
      >
        Log Entries
      </button>

      <pre className="bg-gray-100 text-black p-2 rounded overflow-auto max-h-64">
        {JSON.stringify(entries, null, 2)}
      </pre>
    </div>
  );
}
