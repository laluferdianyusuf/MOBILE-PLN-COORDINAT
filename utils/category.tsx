import { Category } from "@/types/types";
import {
  BezierCurve,
  CarBattery,
  Compass,
  Intersection,
  SubsetOf,
  SupersetOf,
} from "phosphor-react-native";

export const category: Category[] = [
  {
    id: "maps",
    name: "Sudut Koordinat",
    icon: <Compass size={35} color="black" />,
    desc: "More about teacher",
    primary: "bg-custom-info-1",
    color: "bg-custom-light-blue-1",
    uri: "/(category)/maps",
  },
  {
    id: "fuse_link",
    name: "Fuse Link",
    icon: <SubsetOf size={35} color="black" />,
    desc: "More about student",
    primary: "bg-custom-warning-1",
    color: "bg-custom-grey-5",
    uri: "/(category)/link",
  },
  {
    id: "fuse_link_branch",
    name: "Fuse Link Percabangan",
    icon: <SupersetOf size={35} color="black" />,
    desc: "More about attendance",
    primary: "bg-custom-success-1",
    color: "bg-custom-light-green-1",
    uri: "/(category)/branch",
  },
  {
    id: "nh_fuse_substation",
    name: "NH Fuse Gardu",
    icon: <Intersection size={35} color="black" />,
    desc: "More about calendar",
    primary: "bg-custom-indigo-1",
    color: "bg-custom-light-yellow-1",
    uri: "/(category)/substation",
  },
  {
    id: "mcb",
    name: "MCB",
    icon: <CarBattery size={35} color="black" />,
    desc: "More about calendar",
    primary: "bg-custom-indigo-1",
    color: "bg-custom-light-purple-1",
    uri: "/(category)/mcb",
  },
  {
    id: "balancer",
    name: "Penyeimbang Beban gardu",
    icon: <BezierCurve size={35} color="black" />,
    desc: "More about calendar",
    primary: "bg-custom-indigo-1",
    color: "bg-custom-error-1",
    uri: "/(category)/balancer",
  },
];

export const slides = [
  {
    id: "1",
    image: require("@/assets/images/first.png"),
    title: "Selamat Datang di Ampere Pro",
    description:
      "Aplikasi teknisi PLN yang membantu mempermudah pekerjaan lapangan, mulai dari kalkulasi fuse, MCB, hingga pengukuran sudut di peta.",
  },
  {
    id: "2",
    image: require("@/assets/images/second.png"),
    title: "Hitung Otomatis & Akurat",
    description:
      "Dapatkan hasil perhitungan fuse dan MCB secara instan dan tepat. Tidak perlu lagi menghitung manual, semua siap dalam genggaman Anda.",
  },
  {
    id: "3",
    image: require("@/assets/images/third.png"),
    title: "Pantau Lokasi & Sudut Titik",
    description:
      "Gunakan fitur peta interaktif untuk menentukan titik dan sudut antar koordinat dengan mudah, serta simpan hasilnya ke histori.",
  },
];
