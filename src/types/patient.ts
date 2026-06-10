export interface Patient {
  id: string;
  name: string;
  email: string;
}

export interface Evaluation {
  id: string;
  patientId: string;
  startDate: string;
  endDate: string;
}

export interface PainScaleEntry {
  id: string;
  evaluationId: string;
  scale: number;
  date: string;
}
