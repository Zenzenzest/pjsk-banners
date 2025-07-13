// import React, { useState, useEffect } from "react";
// import { Upload, Download, Plus, Trash2, RotateCcw } from "lucide-react";

// interface DataEntry {
//   id: number;
//   name: string;
//   cards: number[];
//   start: number;
//   end: number;
// }

// export default function GachaCard() {
//   const [data, setData] = useState<DataEntry[]>([]);
//   const [formData, setFormData] = useState({
//     name: "",
//     cards: "",
//     startMonth: "",
//     startDay: "",
//     startYear: "",
//     startTime: "",
//     endMonth: "",
//     endDay: "",
//     endYear: "",
//     endTime: "",
//   });
//   const [convertedTimes, setConvertedTimes] = useState({
//     start: "",
//     end: "",
//   });

//   useEffect(() => {
//     const savedData = localStorage.getItem("jsonEditorData");
//     if (savedData) {
//       try {
//         setData(JSON.parse(savedData));
//       } catch (error) {
//         console.error("Error loading data from localStorage:", error);
//       }
//     }
//   }, []);

//   const isPDT = (date: Date): boolean => {
//     const year = date.getFullYear();

//     // DST starts on the second Sunday in March
//     const marchSecondSunday = new Date(year, 2, 1);
//     marchSecondSunday.setDate(
//       marchSecondSunday.getDate() + (7 - marchSecondSunday.getDay()) + 7
//     );

//     // DST ends on the first Sunday in November
//     const novemberFirstSunday = new Date(year, 10, 1);
//     novemberFirstSunday.setDate(
//       novemberFirstSunday.getDate() + (7 - novemberFirstSunday.getDay())
//     );

//     return date >= marchSecondSunday && date < novemberFirstSunday;
//   };

//   const convertPTToGMTPlus8 = (ptTimestamp: number): string => {
//     const gmtPlus8Date = new Date(ptTimestamp + 8 * 60 * 60 * 1000);

//     const ptOffsetForCheck = 8;
//     const ptDateForCheck = new Date(
//       ptTimestamp - ptOffsetForCheck * 60 * 60 * 1000
//     );
//     const isDST = isPDT(ptDateForCheck);

//     const timeZoneLabel = isDST ? "PDT" : "PST";

//     // Format the GMT+8 time
//     const formattedTime = gmtPlus8Date
//       .toISOString()
//       .replace("T", " ")
//       .substring(0, 16);

//     return `${formattedTime} GMT+8 (converted from ${timeZoneLabel})`;
//   };

//   // Update converted times when form change
//   useEffect(() => {
//     const updateConvertedTimes = () => {
//       const startTimestamp = createTimestamp(
//         formData.startMonth,
//         formData.startDay,
//         formData.startYear,
//         formData.startTime
//       );
//       const endTimestamp = createTimestamp(
//         formData.endMonth,
//         formData.endDay,
//         formData.endYear,
//         formData.endTime
//       );

//       setConvertedTimes({
//         start: startTimestamp ? convertPTToGMTPlus8(startTimestamp) : "",
//         end: endTimestamp ? convertPTToGMTPlus8(endTimestamp) : "",
//       });
//     };

//     updateConvertedTimes();
//   }, [
//     formData.startMonth,
//     formData.startDay,
//     formData.startYear,
//     formData.startTime,
//     formData.endMonth,
//     formData.endDay,
//     formData.endYear,
//     formData.endTime,
//   ]);

//   const createTimestamp = (
//     month: string,
//     day: string,
//     year: string,
//     time: string
//   ): number | null => {
//     if (!month || !day || !year || !time) return null;

//     const [hours, minutes] = time.split(":").map(Number);
//     if (isNaN(hours) || isNaN(minutes)) return null;

//     const utcDate = new Date(
//       Date.UTC(
//         parseInt(year),
//         parseInt(month) - 1,
//         parseInt(day),
//         hours,
//         minutes
//       )
//     );

//     // Determine if date DST for PT
//     const isDST = isPDT(utcDate);

//     // PT is UTC-8 (PST) or UTC-7 (PDT)
//     // ADD offset hours
//     const ptOffsetHours = isDST ? 7 : 8;

//     // UTC timestamp
//     const utcTimestamp = utcDate.getTime() + ptOffsetHours * 60 * 60 * 1000;

//     return utcTimestamp;
//   };

//   const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = (e) => {
//       try {
//         const jsonData = JSON.parse(e.target?.result as string);
//         if (Array.isArray(jsonData)) {
//           // Validate data structure
//           const validatedData = jsonData.map((item, index) => {
//             // Ensure proper types
//             return {
//               id: typeof item.id === "number" ? item.id : index + 1,
//               name:
//                 typeof item.name === "string"
//                   ? item.name
//                   : `Entry ${index + 1}`,
//               cards: Array.isArray(item.cards)
//                 ? item.cards.filter((card) => typeof card === "number")
//                 : [],
//               start: typeof item.start === "number" ? item.start : Date.now(),
//               end: typeof item.end === "number" ? item.end : Date.now(),
//             };
//           });
//           setData(validatedData);
//         } else {
//           alert("Please upload a valid JSON array");
//         }
//       } catch (error) {
//         alert("Error parsing JSON file: " + error.message);
//       }
//     };
//     reader.readAsText(file);
//   };

//   const handleAddEntry = () => {
//     const { name, cards } = formData;

//     if (!name.trim()) {
//       alert("Please enter a name");
//       return;
//     }

//     // Parse cards
//     const cardNumbers = cards
//       .split(",")
//       .map((str) => {
//         const num = parseInt(str.trim());
//         return isNaN(num) ? 0 : num;
//       })
//       .filter((num) => num !== 0);

//     // Create timestamps
//     const startTimestamp = createTimestamp(
//       formData.startMonth,
//       formData.startDay,
//       formData.startYear,
//       formData.startTime
//     );
//     const endTimestamp = createTimestamp(
//       formData.endMonth,
//       formData.endDay,
//       formData.endYear,
//       formData.endTime
//     );

//     if (!startTimestamp || !endTimestamp) {
//       alert("Please fill in all date and time fields");
//       return;
//     }

//     // Generate new ID
//     const newId =
//       data.length > 0 ? Math.max(...data.map((item) => item.id)) + 1 : 1;

//     const newEntry: DataEntry = {
//       id: newId,
//       name: name.trim(),
//       cards: cardNumbers,
//       start: startTimestamp,
//       end: endTimestamp,
//     };

//     setData([...data, newEntry]);

//     // Reset form
//     setFormData({
//       name: "",
//       cards: "",
//       startMonth: "",
//       startDay: "",
//       startYear: "",
//       startTime: "",
//       endMonth: "",
//       endDay: "",
//       endYear: "",
//       endTime: "",
//     });
//     localStorage.setItem("jsonEditorData", JSON.stringify(data));
//   };

//   const handleDownload = () => {
//     const blob = new Blob([JSON.stringify(data, null, 2)], {
//       type: "application/json",
//     });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "data.json";
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   const clearLocalStorage = () => {
//     localStorage.removeItem("jsonEditorData");
//     setData([]);
//   };

//   const deleteLastEntry = () => {
//     if (data.length > 0) {
//       setData(data.slice(0, -1));
//     }
//   };

//   const formatTimestamp = (timestamp: number): string => {
//     // Validate timestamp
//     if (!timestamp || isNaN(timestamp) || timestamp < 0) {
//       return "Invalid Date";
//     }

//     try {
//       // Convert UTC timestamp to GMT+8
//       const gmtPlus8Date = new Date(timestamp + 8 * 60 * 60 * 1000);

//       // Check if the resulting date is valid
//       if (isNaN(gmtPlus8Date.getTime())) {
//         return "Invalid Date";
//       }

//       // Format in UTC timezone since we already added the GMT+8 offset
//       return gmtPlus8Date.toISOString().replace("T", " ").substring(0, 19);
//     } catch (error) {
//       return "Invalid Date";
//     }
//   };

//   return (
//     <div className="max-w-6xl mx-auto p-6 bg-white min-h-screen text-black">
//       <h1 className="text-3xl font-bold mb-8 text-gray-800">
//         JSON Array Editor
//       </h1>

//       {/* UPLOAD*/}
//       <div className="mb-8 p-6 bg-gray-50 rounded-lg">
//         <h2 className="text-xl font-semibold mb-4">Upload JSON</h2>
//         <div className="flex items-center gap-4">
//           <label className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600">
//             <Upload size={20} />
//             Upload JSON File
//             <input
//               type="file"
//               accept=".json"
//               onChange={handleFileUpload}
//               className="hidden"
//             />
//           </label>
//           <span className="text-gray-600">Current entries: {data.length}</span>
//         </div>
//       </div>

//       {/* ADD ENTRY */}
//       <div className="mb-8 p-6 bg-gray-50 rounded-lg">
//         <h2 className="text-xl font-semibold mb-4">Add New Entry</h2>

//         {/* NAME FIELD */}
//         <div className="mb-4">
//           <label className="block text-sm font-medium mb-2">Name</label>
//           <input
//             type="text"
//             value={formData.name}
//             onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//             className="w-full p-2 border rounded"
//             placeholder="Enter name"
//           />
//         </div>

//         {/* CARDS FIELD */}
//         <div className="mb-4">
//           <label className="block text-sm font-medium mb-2">
//             Cards (comma-separated numbers)
//           </label>
//           <input
//             type="text"
//             value={formData.cards}
//             onChange={(e) =>
//               setFormData({ ...formData, cards: e.target.value })
//             }
//             className="w-full p-2 border rounded"
//             placeholder="536, 231, 884"
//           />
//         </div>

//         {/* START TIME*/}
//         <div className="mb-4">
//           <label className="block text-sm font-medium mb-2">
//             Start Time (PT)
//           </label>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
//             <input
//               type="number"
//               placeholder="Month (1-12)"
//               value={formData.startMonth}
//               onChange={(e) =>
//                 setFormData({ ...formData, startMonth: e.target.value })
//               }
//               className="p-2 border rounded"
//               min="1"
//               max="12"
//             />
//             <input
//               type="number"
//               placeholder="Day (1-31)"
//               value={formData.startDay}
//               onChange={(e) =>
//                 setFormData({ ...formData, startDay: e.target.value })
//               }
//               className="p-2 border rounded"
//               min="1"
//               max="31"
//             />
//             <input
//               type="number"
//               placeholder="Year"
//               value={formData.startYear}
//               onChange={(e) =>
//                 setFormData({ ...formData, startYear: e.target.value })
//               }
//               className="p-2 border rounded"
//             />
//             <input
//               type="time"
//               value={formData.startTime}
//               onChange={(e) =>
//                 setFormData({ ...formData, startTime: e.target.value })
//               }
//               className="p-2 border rounded"
//             />
//           </div>
//           {convertedTimes.start && (
//             <p className="text-sm text-blue-600">{convertedTimes.start}</p>
//           )}
//         </div>

//         {/* END TIME*/}
//         <div className="mb-4">
//           <label className="block text-sm font-medium mb-2">
//             End Time (PT)
//           </label>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
//             <input
//               type="number"
//               placeholder="Month (1-12)"
//               value={formData.endMonth}
//               onChange={(e) =>
//                 setFormData({ ...formData, endMonth: e.target.value })
//               }
//               className="p-2 border rounded"
//               min="1"
//               max="12"
//             />
//             <input
//               type="number"
//               placeholder="Day (1-31)"
//               value={formData.endDay}
//               onChange={(e) =>
//                 setFormData({ ...formData, endDay: e.target.value })
//               }
//               className="p-2 border rounded"
//               min="1"
//               max="31"
//             />
//             <input
//               type="number"
//               placeholder="Year"
//               value={formData.endYear}
//               onChange={(e) =>
//                 setFormData({ ...formData, endYear: e.target.value })
//               }
//               className="p-2 border rounded"
//             />
//             <input
//               type="time"
//               value={formData.endTime}
//               onChange={(e) =>
//                 setFormData({ ...formData, endTime: e.target.value })
//               }
//               className="p-2 border rounded"
//             />
//           </div>
//           {convertedTimes.end && (
//             <p className="text-sm text-blue-600">{convertedTimes.end}</p>
//           )}
//         </div>

//         <button
//           onClick={handleAddEntry}
//           className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
//         >
//           <Plus size={20} />
//           Add Entry
//         </button>
//       </div>

//       {/* DOWNLOAD BUTTON*/}
//       <div className="mb-8 flex flex-wrap gap-4">
//         <button
//           onClick={handleDownload}
//           className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//         >
//           <Download size={20} />
//           Download JSON
//         </button>
//         {/* DELETE BUTTON */}
//         <button
//           onClick={deleteLastEntry}
//           className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
//         >
//           <Trash2 size={20} />
//           Delete Last Entry
//         </button>
//         {/* CLEAR LOCAL STORAGE BUTTON */}
//         <button
//           onClick={clearLocalStorage}
//           className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//         >
//           <RotateCcw size={20} />
//           Clear Local Storage
//         </button>
//       </div>

//       {/* ENTRIES DISPLAY */}
//       <div className="bg-gray-50 rounded-lg p-6">
//         <h2 className="text-xl font-semibold mb-4">
//           Current Entries ({data.length})
//         </h2>
//         {data.length === 0 ? (
//           <p className="text-gray-500">
//             No entries yet. Upload a JSON file or add new entries.
//           </p>
//         ) : (
//           <div className="space-y-4 max-h-96 overflow-y-auto">
//             {data.map((entry, index) => (
//               <div key={entry.id} className="bg-white p-4 rounded border">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <p>
//                       <strong>ID:</strong> {entry.id}
//                     </p>
//                     <p>
//                       <strong>Name:</strong> {entry.name}
//                     </p>
//                     <p>
//                       <strong>Cards:</strong> [{entry.cards.join(", ")}]
//                     </p>
//                   </div>
//                   <div>
//                     <p>
//                       <strong>Start:</strong> {formatTimestamp(entry.start)}
//                     </p>
//                     <p>
//                       <strong>End:</strong> {formatTimestamp(entry.end)}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
