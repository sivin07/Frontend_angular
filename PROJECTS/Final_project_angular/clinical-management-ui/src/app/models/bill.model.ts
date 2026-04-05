export interface Bill {
  appointmentId: number;
  patientId: number;
  patientName: string;
  mmrNo: string;
  patientEmail: string;
  doctorId: number;
  tokenNumber: number;
  appointmentDate: string;
  status: string;
  doctorFee: number;
}