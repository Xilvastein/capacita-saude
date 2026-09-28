import type { Equipment, Training, Employee, AccessLog, TrainingRecord, Notification } from '@/types';
import {
  seedEquipments,
  seedTrainings,
  seedEmployees,
  seedAccessLogs,
  seedTrainingRecords,
  seedNotifications,
} from '@/data/seed';

const KEYS = {
  equipments: 'capacitasau_equipments',
  trainings: 'capacitasau_trainings',
  employees: 'capacitasau_employees',
  accessLogs: 'capacitasau_access_logs',
  trainingRecords: 'capacitasau_training_records',
  notifications: 'capacitasau_notifications',
  user: 'capacitasau_user',
  completedTrainings: 'capacitasau_completed',
} as const;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore quota errors */
  }
}

export function initStorage(): void {
  if (!localStorage.getItem(KEYS.equipments)) write(KEYS.equipments, seedEquipments);
  if (!localStorage.getItem(KEYS.trainings)) write(KEYS.trainings, seedTrainings);
  if (!localStorage.getItem(KEYS.employees)) write(KEYS.employees, seedEmployees);
  if (!localStorage.getItem(KEYS.accessLogs)) write(KEYS.accessLogs, seedAccessLogs);
  if (!localStorage.getItem(KEYS.trainingRecords)) write(KEYS.trainingRecords, seedTrainingRecords);
  if (!localStorage.getItem(KEYS.notifications)) write(KEYS.notifications, seedNotifications);
}

export function resetStorage(): void {
  write(KEYS.equipments, seedEquipments);
  write(KEYS.trainings, seedTrainings);
  write(KEYS.employees, seedEmployees);
  write(KEYS.accessLogs, seedAccessLogs);
  write(KEYS.trainingRecords, seedTrainingRecords);
  write(KEYS.notifications, seedNotifications);
  localStorage.removeItem(KEYS.user);
  localStorage.removeItem(KEYS.completedTrainings);
}

/* Equipments */
export function getEquipments(): Equipment[] {
  return read(KEYS.equipments, seedEquipments);
}
export function saveEquipments(items: Equipment[]): void {
  write(KEYS.equipments, items);
}
export function getEquipmentById(id: string): Equipment | undefined {
  return getEquipments().find((e) => e.id === id);
}
export function upsertEquipment(eq: Equipment): void {
  const items = getEquipments();
  const idx = items.findIndex((e) => e.id === eq.id);
  if (idx >= 0) items[idx] = eq;
  else items.push(eq);
  saveEquipments(items);
}
export function deleteEquipment(id: string): void {
  saveEquipments(getEquipments().filter((e) => e.id !== id));
}

/* Trainings */
export function getTrainings(): Training[] {
  return read(KEYS.trainings, seedTrainings);
}
export function saveTrainings(items: Training[]): void {
  write(KEYS.trainings, items);
}

/* Employees */
export function getEmployees(): Employee[] {
  return read(KEYS.employees, seedEmployees);
}
export function saveEmployees(items: Employee[]): void {
  write(KEYS.employees, items);
}

/* Access logs */
export function getAccessLogs(): AccessLog[] {
  return read(KEYS.accessLogs, seedAccessLogs);
}
export function saveAccessLogs(items: AccessLog[]): void {
  write(KEYS.accessLogs, items);
}
export function addAccessLog(log: AccessLog): void {
  const items = getAccessLogs();
  items.unshift(log);
  saveAccessLogs(items);
}

/* Training records */
export function getTrainingRecords(): TrainingRecord[] {
  return read(KEYS.trainingRecords, seedTrainingRecords);
}
export function saveTrainingRecords(items: TrainingRecord[]): void {
  write(KEYS.trainingRecords, items);
}

/* Notifications */
export function getNotifications(): Notification[] {
  return read(KEYS.notifications, seedNotifications);
}
export function saveNotifications(items: Notification[]): void {
  write(KEYS.notifications, items);
}

/* Completed trainings (current demo user) */
export function getCompletedTrainings(): string[] {
  return read<string[]>(KEYS.completedTrainings, []);
}
export function markTrainingCompleted(trainingId: string): void {
  const items = getCompletedTrainings();
  if (!items.includes(trainingId)) {
    items.push(trainingId);
    write(KEYS.completedTrainings, items);
  }
}
export function isTrainingCompleted(trainingId: string): boolean {
  return getCompletedTrainings().includes(trainingId);
}

/* User session */
export function getUser(): { name: string; role: 'funcionario' | 'gestor'; email: string } | null {
  return read(KEYS.user, null);
}
export function setUser(user: { name: string; role: 'funcionario' | 'gestor'; email: string }): void {
  write(KEYS.user, user);
}
export function clearUser(): void {
  localStorage.removeItem(KEYS.user);
}
