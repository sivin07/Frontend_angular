// For TABLE LIST - one row per appointment
export interface PrescriptionSummary {
    appointmentId: number;
    patientName: string;
    doctorName: string;
    prescribedDate: string;
    status: string;
}

// For DETAIL MODAL - medicines per appointment
export interface PrescriptionDetail {
    prescriptionId: number;
    medicineName: string;
    medicineStock: number;
    quantity: number;
    dosage: string;
    status: string;
}

export interface PrescriptionMedicine {
    medicineId: number;
    medicineName?: string;
    quantity: number;
    dosage?: string;
}

export interface Medicine {
    id?: number;
    name: string;
    stock: number;
    price: number;
    expiryDate: string;
}

export interface Bill {
    id: number;
    patientName: string;
    amount: number;
    date: string;
}