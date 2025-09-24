import axios from "axios";
import type { Career } from "@/types/Career";
import { baseAPI } from "@/utils/configs";

type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

const isCareer = (v: unknown): v is Career => {
  if (!isObject(v)) return false;
  const o = v as Partial<Career>;
  return (
    typeof o.id === "number" &&
    typeof o.title === "string" &&
    typeof o.location === "string" &&
    typeof o.description === "string" &&
    typeof o.requirements === "string" &&
    typeof o.created_at === "string"
  );
};

const toCareerArray = (payload: unknown): Career[] => {
  if (Array.isArray(payload)) return payload.filter(isCareer);
  if (isObject(payload) && Array.isArray((payload as Paginated<Career>).results)) {
    return (payload as Paginated<Career>).results.filter(isCareer);
  }
  return [];
};

export const fetchCareers = async (): Promise<Career[]> => {
  const res = await axios.get(`${baseAPI}/careers/careers/`);
  const list = toCareerArray(res.data);
  // Default sort: newest first
  return list.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
};

export const fetchCareerById = async (id: number): Promise<Career> => {
  const res = await axios.get(`${baseAPI}/careers/careers/${id}/`);
  if (isCareer(res.data)) return res.data;
  throw new Error("Career response did not match expected shape.");
};
