import React, { useState, useEffect } from "react";

export default function Test() {
  const [useCustomYear, setUseCustomYear] = useState(false);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [time, setTime] = useState("");
  const [localDateTime, setLocalDateTime] = useState<{
    date: string;
    time: string;
  } | null>(null);

  // Convert PT to local datetime when all fields are filled
  useEffect(() => {
    if (month && day && time) {
      const result = convertPTtoLocal(
        year,
        parseInt(month),
        parseInt(day),
        time
      );
      setLocalDateTime(result);
    } else {
      setLocalDateTime(null);
    }
  }, [year, month, day, time]);

  const convertPTtoLocal = (
    year: number,
    month: number,
    day: number,
    time: string
  ) => {
    const [hours, minutes] = time.split(":").map(Number);

    // 1. Create a date string in PT timezone
    const ptDateStr = `${year}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}T${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:00-07:00`; // PDT offset (-7)

    // 2. Create date object (will be converted to local time)
    const localDate = new Date(ptDateStr);

    // 3. Format for display
    return {
      date: localDate.toLocaleDateString([], {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: localDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!month || !day || !time) return;

    // Store the original PT time
    const [hours, minutes] = time.split(":").map(Number);
    const ptDate = new Date(Date.UTC(year, month - 1, day, hours, minutes));
    const ptTimestamp = ptDate.getTime();

    console.log("Storing PT timestamp:", ptTimestamp);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-4">
      {/* Year Input */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="customYear"
          checked={useCustomYear}
          onChange={(e) => setUseCustomYear(e.target.checked)}
          className="h-4 w-4"
        />
        <label htmlFor="customYear" className="text-sm font-medium">
          Use custom year
        </label>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
          disabled={!useCustomYear}
          min="2000"
          max="2100"
          className={`border p-2 rounded flex-1 ${
            !useCustomYear ? "bg-gray-100" : ""
          }`}
          placeholder="Year"
        />
      </div>

      {/* Month Input */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="month" className="block text-sm font-medium mb-1">
            Month
          </label>
          <input
            id="month"
            type="number"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            min="1"
            max="12"
            className="border p-2 rounded w-full"
            placeholder="1-12"
            required
          />
        </div>

        {/* Day Input */}
        <div>
          <label htmlFor="day" className="block text-sm font-medium mb-1">
            Day
          </label>
          <input
            id="day"
            type="number"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            min="1"
            max="31"
            className="border p-2 rounded w-full"
            placeholder="1-31"
            required
          />
        </div>
      </div>

      {/* Time Input */}
      <div>
        <label htmlFor="time" className="block text-sm font-medium mb-1">
          Time (PT)
        </label>
        <input
          id="time"
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />
      </div>

      {/* Local Time Display */}
      {localDateTime && (
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
          <h3 className="font-medium text-blue-800">In your local time:</h3>
          <p className="text-2xl font-bold mt-1">
            {localDateTime.date} at {localDateTime.time}
          </p>
          <p className="text-sm text-blue-600 mt-2">
            (Converted from Pacific Time)
          </p>
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
      >
        Submit
      </button>
    </form>
  );
}
