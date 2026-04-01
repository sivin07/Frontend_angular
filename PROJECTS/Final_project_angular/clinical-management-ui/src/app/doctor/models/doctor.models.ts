export interface AppointmentDto {
  appointmentId: number;
  patientId: number;
  patientName: string;
  age: number;
  gender: string;
  contactNumber: string;
  appointmentDate: string | Date;
  timeSlot: string;
  status: string;
  reasonForVisit: string;
}

export interface ConsultationDetailDto {
  appointmentId: number;
  patientId: number;
  patientName: string;
  age: number;
  gender: string;
  bloodGroup: string;
  contactNumber: string;
  address: string;
  reasonForVisit: string;
  appointmentDate: string | Date;
  appointmentStatus: string;
  symptoms?: string;
  diagnosis?: string;
  doctorNotes?: string;
  prescriptions: PrescriptionItemDto[];
  labRequests: LabRequestItemDto[];
}

export interface SaveConsultationRequestDto {
  appointmentId: number;
  patientId: number;
  doctorId: number;
  symptoms: string;
  diagnosis: string;
  doctorNotes?: string;
  medicines: MedicineOrderDto[];
  labTests: LabTestOrderDto[];
}

export interface SaveConsultationResponseDto {
  success: boolean;
  message: string;
  consultationId: number;
  stockErrors: string[];
}

export interface MedicineDropdownDto {
  medicineId: number;
  medicineName: string;
  category: string;
  dosageForm: string;
  availableStock: number;
}

export interface MedicineOrderDto {
  medicineId: number;
  medicineName: string;
  frequency: number;
  duration: number;
}

export interface PrescriptionItemDto {
  prescriptionId: number;
  medicineId: number;
  medicineName: string;
  frequency: number;
  duration: number;
  quantity: number;
  dosageForm: string;
}

export interface LabTestDropdownDto {
  labTestId: number;
  testName: string;
  category: string;
  price: number;
}

export interface LabTestOrderDto {
  labTestId: number;
  specialInstructions?: string;
}

export interface LabRequestItemDto {
  labRequestId: number;
  labTestId: number;
  testName: string;
  status: string;
  specialInstructions?: string;
  requestedOn: string | Date;
}

export interface LabResultDto {
  labRequestId: number;
  patientId: number;
  patientName: string;
  labTestId: number;
  testName: string;
  status: string;
  resultValue?: string;
  referenceRange?: string;
  remarks?: string;
  completedOn?: string | Date;
  requestedOn: string | Date;
}

export interface PatientHistoryDto {
  consultationId: number;
  appointmentId: number;
  consultationDate: string | Date;
  doctorName: string;
  symptoms: string;
  diagnosis: string;
  doctorNotes?: string;
  prescriptions: PrescriptionItemDto[];
  labRequests: LabRequestItemDto[];
}

export interface ApiResponseDto<T> {
  success: boolean;
  message: string;
  data: T;
  errors: string[];
}
