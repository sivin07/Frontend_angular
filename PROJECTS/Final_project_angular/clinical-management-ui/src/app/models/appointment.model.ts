export interface Appointment {
  appointmentId: number;
  patientId: number;
  patientName?: string;
  mmrNo?: string;
  doctorId: number;
  slotId: number;
  tokenNumber: number;
  appointmentDate: string;
  status: string;
  consultationBill?: number;
}