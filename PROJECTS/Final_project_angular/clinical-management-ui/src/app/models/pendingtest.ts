import { Doctor } from "./doctor";
import { Patient } from "./patient";
import { Labtest } from "./labtest";

export class Pendingtest {
  PrescriptionId: number = 0;
  Patient: Patient = new Patient();
  Doctor: Doctor = new Doctor();
  Test: Labtest = new Labtest();
}
