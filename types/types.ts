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
    | "/(category)/maps"
    | "/(category)/link"
    | "/(category)/branch"
    | "/(category)/substation"
    | "/(category)/mcb"
    | "/(category)/balancer";
}
