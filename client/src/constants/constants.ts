export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

export function formatTo12Hour(time: string): string {
    const [hour, minute] = time.split(":").map(Number);
    const period = hour >= 12 ? "PM" : "AM";
    const formattedHour = ((hour + 11) % 12) + 1;
    return `${formattedHour}:${minute.toString().padStart(2, "0")} ${period}`;
  }