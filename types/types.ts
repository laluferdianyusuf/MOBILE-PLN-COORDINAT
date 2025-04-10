import { ReactNode } from "react";

// category
export interface Category {
  id: string;
  name: string;
  desc: string;
  icon: ReactNode;
  primary: string;
  color: string;
  uri:
    | "/(category)/teacher"
    | "/(category)/student"
    | "/(category)/attendance"
    | "/(category)/calendar";
}
