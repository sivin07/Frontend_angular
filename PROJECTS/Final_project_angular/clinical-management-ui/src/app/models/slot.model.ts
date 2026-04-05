export interface Slot {
  slotId: number;
  doctorId: number;
  startTime: string;
  endTime: string;
  isAvailable?: boolean;
}