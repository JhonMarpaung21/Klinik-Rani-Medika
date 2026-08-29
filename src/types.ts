export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  price: string;
  duration: string;
  features: string[];
}

export interface Doctor {
  id: string;
  name: string;
  role: string;
  experience: string;
  education: string;
  schedule: string;
  status: "Aktif" | "Cuti" | "Tidak Aktif";
  rating: number;
  reviewsCount: number;
  image: string;
}

export interface Review {
  id: string;
  authorName: string;
  authorAvatar: string;
  rating: number;
  text: string;
  timeAgo: string;
  source: string;
}

export interface Appointment {
  id?: string;
  patientName: string;
  phone: string;
  email?: string;
  doctorId: string;
  doctorName?: string;
  date: string;
  time: string;
  notes?: string;
  status?: string;
  createdAt?: string;
}

export interface ContactMessage {
  id?: string;
  name: string;
  email?: string;
  phone: string;
  message: string;
  createdAt?: string;
}
