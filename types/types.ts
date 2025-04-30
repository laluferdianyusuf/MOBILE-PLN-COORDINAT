import { ReactNode } from "react";
import { ImageProps } from "react-native";

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
    | "/(category)/balancer"
    | "/(category)/mcb/first"
    | "/(category)/mcb/third";
}

export interface Home {
  id: string;
  title: string;
  desc: string;
  image: ImageProps;
  uri: "/screens/signin" | "/(tabs)";
}

export interface ItemProps {
  id: string;
  image: ImageProps;
  title: string;
  description: string;
}

export interface HistoryItem {
  id: string;
  title: string;
  category: string;
  time: string;
  date: string;
  background: string;
}

// User state
export interface User {
  id?: number;
  userId?: string;
  name?: string;
  username?: string;
  email?: string;
  address?: string;
  password?: string;
  role?: string;
}

export interface UserState {
  users: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface UserResponse {
  data: {
    user: User;
    token?: string;
  };
  token: string | null;
  status: boolean;
  message: string | null;
}

// History state
export interface History {
  id?: number;
  user_id?: string;
  category?:
    | ""
    | "maps"
    | "mcb_1_phase"
    | "mcb_3_phase"
    | "fuse_link"
    | "fuse_link_branch"
    | "nh_fuse_substation"
    | "balancer";
  title?: string;
  description?: string;
  type?: string;
  value?: Record<string, any>;
  background?: string;
  createdAt?: string;
}

export interface HistoryState {
  histories: History[] | [];
  historyDetail: History | null;
  loading: boolean;
  error: string | null;
}

export interface HistoryResponse {
  data: {
    history: History[] | [];
  };
  status: boolean;
  message: string | null;
}

export interface HistoryDetailState {
  history: History | null;
  loading: boolean;
  error: string | null;
}

export interface HistoryDetailResponse {
  data: History;
  status: boolean;
  message: string | null;
}
