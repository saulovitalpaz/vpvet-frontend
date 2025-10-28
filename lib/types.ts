// Type definitions
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  is_dr_saulo: boolean;
  clinic?: {
    id: string;
    name: string;
  };
}

export interface TimeSlot {
  datetime: string;
  available: boolean;
  appointment?: {
    id: string;
    service_type: string;
    clinic: {
      id: string;
      name: string;
    };
    animal?: {
      id: string;
      name: string;
    };
    duration_minutes?: number;
  };
}

export interface Appointment {
  id: string;
  datetime: string;
  duration_minutes: number;
  service_type: string;
  status: string;
  notes?: string;
  clinic: {
    id: string;
    name: string;
  };
  animal: {
    id: string;
    name: string;
    species: string;
    tutor: {
      name: string;
      phone: string;
    };
  };
}

export interface Patient {
  id: string;
  name: string;
  species: string;
  breed?: string;
  age_years?: number;
  tutor: {
    id: string;
    name: string;
    phone: string;
    cpf: string;
  };
}
