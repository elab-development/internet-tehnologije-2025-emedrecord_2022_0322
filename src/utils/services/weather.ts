type HourlyForecastResponse = {
  hourly?: {
    time?: string[];
    temperature_2m?: number[];
    precipitation_probability?: number[];
    weather_code?: number[];
  };
};

const BELGRADE_COORDINATES = {
  latitude: 44.7866,
  longitude: 20.4489,
};

const weatherCodeLabel = (code: number): string => {
  if (code === 0) return "clear sky";
  if (code >= 1 && code <= 3) return "partly cloudy";
  if (code === 45 || code === 48) return "fog";
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return "rain";
  if (code >= 71 && code <= 77) return "snow";
  if (code >= 95) return "thunderstorm";
  return "variable conditions";
};

const parseTimeLabelToHour = (timeLabel: string): number | null => {
  const match = timeLabel.trim().match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);

  if (!match) {
    return null;
  }

  const hour12 = Number(match[1]);
  const period = match[3].toUpperCase();

  if (Number.isNaN(hour12) || hour12 < 1 || hour12 > 12) {
    return null;
  }

  if (period === "AM") {
    return hour12 === 12 ? 0 : hour12;
  }

  return hour12 === 12 ? 12 : hour12 + 12;
};

const toLocalDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export async function getAppointmentWeatherSummary(
  appointmentDate: Date,
  appointmentTimeLabel: string
): Promise<string | null> {
  try {
    const hour24 = parseTimeLabelToHour(appointmentTimeLabel);

    if (hour24 === null) {
      return null;
    }

    const targetDate = toLocalDateString(appointmentDate);

    const url = new URL("https://api.open-meteo.com/v1/forecast");
    url.searchParams.set("latitude", String(BELGRADE_COORDINATES.latitude));
    url.searchParams.set("longitude", String(BELGRADE_COORDINATES.longitude));
    url.searchParams.set("hourly", "temperature_2m,precipitation_probability,weather_code");
    url.searchParams.set("start_date", targetDate);
    url.searchParams.set("end_date", targetDate);
    url.searchParams.set("timezone", "auto");

    const response = await fetch(url.toString(), {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as HourlyForecastResponse;

    const times = payload.hourly?.time;
    const temperatures = payload.hourly?.temperature_2m;
    const precipitation = payload.hourly?.precipitation_probability;
    const weatherCodes = payload.hourly?.weather_code;

    if (!times?.length || !temperatures?.length) {
      return null;
    }

    const index = times.findIndex((timestamp) => {
      const parsed = new Date(timestamp);
      return parsed.getHours() === hour24;
    });

    if (index < 0) {
      return null;
    }

    const temp = temperatures[index];
    const rainChance = precipitation?.[index] ?? 0;
    const weatherCode = weatherCodes?.[index] ?? -1;
    const condition = weatherCodeLabel(weatherCode);

    return `Weather forecast: ${condition}, ${Math.round(temp)}°C, rain chance ${Math.round(rainChance)}%.`;
  } catch {
    return null;
  }
}
