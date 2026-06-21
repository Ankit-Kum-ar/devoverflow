import { techDescriptionMap, techMap } from "@/app/constants/TechMap";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getDeviconClassName = (techName: string) => {
  const normalizedTechName = techName.toLowerCase().replace(/[ .]/g, ""); // Remove spaces and dots

  return techMap[normalizedTechName]
    ? `${techMap[normalizedTechName]} colored`
    : "devicon-devicon-plain";
};

export const getTechDescription = (techName: string) => {
  const normalizedTechName = techName.toLowerCase().replace(/[ .]/g, "");
  return techDescriptionMap[normalizedTechName]
    ? techDescriptionMap[normalizedTechName]
    : `${techName} is a technology or tool widely used in software development. It may refer to a programming language, framework, library, or other software tool that developers use to build applications, websites, or other software solutions.`;
};

// Function that takes in a date and return a string specifies how long ago was it created. i.e. 5 seconds ago, or days or hours
export const getTimeStamp = (createdAt: Date | string): string => {
  const parsedDate = new Date(createdAt); // handles both Date objects and date strings
  const seconds = Math.floor(
    (new Date().getTime() - parsedDate.getTime()) / 1000
  );

  if (seconds < 60) return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days !== 1 ? "s" : ""} ago`;

  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} week${weeks !== 1 ? "s" : ""} ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months !== 1 ? "s" : ""} ago`;

  const years = Math.floor(days / 365);
  return `${years} year${years !== 1 ? "s" : ""} ago`;
};

export const formatNumber = (number: number) => {
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + "M";
  } else if (number >= 1000) {
    return (number / 1000).toFixed(1) + "K";
  } else {
    return number.toString();
  }
};
