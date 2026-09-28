import type {
  Equipment,
  Training,
  Employee,
  AccessLog,
  TrainingRecord,
  CapacityNeed,
  Sector,
} from '@/types';
import {
  getEquipments,
  getTrainings,
  getEmployees,
  getAccessLogs,
  getTrainingRecords,
} from '@/services/storage';

export interface DashboardStats {
  totalEquipments: number;
  totalTrainings: number;
  totalEmployees: number;
  completedTrainings: number;
  pendingTrainings: number;
  totalAccesses: number;
  completionRate: number;
}

export function getDashboardStats(): DashboardStats {
  const records = getTrainingRecords();
  const completed = records.filter((r) => r.status === 'concluido').length;
  const pending = records.filter((r) => r.status !== 'concluido').length;
  const total = records.length;
  return {
    totalEquipments: getEquipments().length,
    totalTrainings: getTrainings().length,
    totalEmployees: getEmployees().length,
    completedTrainings: completed,
    pendingTrainings: pending,
    totalAccesses: getAccessLogs().length,
    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
}

/* Accesses over time (last 30 days) */
export function getAccessesOverTime(days = 30): { date: string; label: string; acessos: number }[] {
  const logs = getAccessLogs();
  const today = new Date('2026-09-18');
  const result: { date: string; label: string; acessos: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const day = d.getDate();
    const month = d.getMonth() + 1;
    result.push({
      date: dateStr,
      label: `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}`,
      acessos: logs.filter((l) => l.date === dateStr).length,
    });
  }
  return result;
}

/* Most consulted trainings (by equipment access count) */
export function getMostConsultedTrainings(): { name: string; acessos: number }[] {
  const logs = getAccessLogs();
  const trainings = getTrainings();
  const equipments = getEquipments();
  const counts: Record<string, number> = {};
  for (const log of logs) {
    counts[log.equipmentId] = (counts[log.equipmentId] || 0) + 1;
  }
  return trainings
    .map((tr) => ({
      name: tr.title.length > 28 ? tr.title.substring(0, 28) + '…' : tr.title,
      acessos: counts[tr.equipmentId] || 0,
    }))
    .sort((a, b) => b.acessos - a.acessos)
    .slice(0, 8);
}

/* Trainings by sector */
export function getTrainingsBySector(): { sector: string; treinamentos: number }[] {
  const trainings = getTrainings();
  const counts: Record<string, number> = {};
  for (const tr of trainings) {
    counts[tr.sector] = (counts[tr.sector] || 0) + 1;
  }
  return Object.entries(counts).map(([sector, treinamentos]) => ({ sector, treinamentos }));
}

/* Completion evolution over months */
export function getCompletionEvolution(): { month: string; concluidos: number; iniciados: number }[] {
  const records = getTrainingRecords();
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set'];
  const result = months.map((m) => ({ month: m, concluidos: 0, iniciados: 0 }));
  for (const r of records) {
    const monthIdx = new Date(r.startedAt).getMonth();
    if (monthIdx >= 0 && monthIdx < 9) {
      result[monthIdx].iniciados++;
      if (r.status === 'concluido' && r.completedAt) {
        const compMonth = new Date(r.completedAt).getMonth();
        if (compMonth >= 0 && compMonth < 9) result[compMonth].concluidos++;
      }
    }
  }
  return result;
}

/* Most consulted equipments */
export function getMostConsultedEquipments(): { name: string; consultas: number }[] {
  const logs = getAccessLogs();
  const equipments = getEquipments();
  const counts: Record<string, number> = {};
  for (const log of logs) {
    counts[log.equipmentId] = (counts[log.equipmentId] || 0) + 1;
  }
  return equipments
    .map((eq) => ({
      name: eq.name.length > 30 ? eq.name.substring(0, 30) + '…' : eq.name,
      consultas: counts[eq.id] || 0,
    }))
    .sort((a, b) => b.consultas - a.consultas)
    .slice(0, 8);
}

/* Sectors with highest demand */
export function getSectorsDemand(): { sector: string; acessos: number }[] {
  const logs = getAccessLogs();
  const counts: Record<string, number> = {};
  for (const log of logs) {
    counts[log.sector] = (counts[log.sector] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([sector, acessos]) => ({ sector, acessos }))
    .sort((a, b) => b.acessos - a.acessos);
}

/* Average access duration */
export function getAverageAccessDuration(): number {
  const logs = getAccessLogs();
  if (logs.length === 0) return 0;
  const total = logs.reduce((sum, l) => sum + l.durationSec, 0);
  return Math.round(total / logs.length);
}

/* Outdated contents */
export function getOutdatedContents(): Equipment[] {
  const equipments = getEquipments();
  const today = new Date('2026-09-18');
  return equipments.filter((eq) => {
    const updated = new Date(eq.lastUpdated);
    const days = Math.floor((today.getTime() - updated.getTime()) / (1000 * 60 * 60 * 24));
    return days > 120;
  });
}

/* Capacity needs analysis */
export function getCapacityNeeds(): CapacityNeed[] {
  const needs: CapacityNeed[] = [];
  const logs = getAccessLogs();
  const records = getTrainingRecords();
  const equipments = getEquipments();
  const trainings = getTrainings();
  const today = new Date('2026-09-18');

  // 1. High demand equipment (>15 accesses in last 14 days)
  const recentLogs = logs.filter((l) => {
    const d = new Date(l.date);
    const days = Math.floor((today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    return days <= 14;
  });
  const eqCounts: Record<string, number> = {};
  for (const l of recentLogs) {
    eqCounts[l.equipmentId] = (eqCounts[l.equipmentId] || 0) + 1;
  }
  for (const [eqId, count] of Object.entries(eqCounts)) {
    if (count >= 10) {
      const eq = equipments.find((e) => e.id === eqId);
      if (eq) {
        needs.push({
          id: `need-high-${eqId}`,
          type: 'alta_procura',
          title: `Alta procura pelo equipamento "${eq.name}"`,
          description: `O equipamento "${eq.name}" registrou ${count} consultas nos últimos 14 dias, indicando possível necessidade de reforço no treinamento.`,
          recommendation:
            'Avaliar a necessidade de reforço no treinamento ou atualização das instruções do conteúdo.',
          severity: count >= 15 ? 'alta' : 'media',
          evidence: [
            `${count} acessos registrados nos últimos 14 dias`,
            `Setor: ${eq.sector}`,
            `Data da última atualização: ${eq.lastUpdated}`,
          ],
          relatedEquipmentId: eqId,
          relatedSector: eq.sector,
        });
      }
    }
  }

  // 2. Low completion rate
  for (const tr of trainings) {
    const trRecords = records.filter((r) => r.trainingId === tr.id);
    if (trRecords.length < 3) continue;
    const completed = trRecords.filter((r) => r.status === 'concluido').length;
    const rate = completed / trRecords.length;
    if (rate < 0.3) {
      needs.push({
        id: `need-low-${tr.id}`,
        type: 'baixa_conclusao',
        title: `Baixa conclusão do treinamento "${tr.title}"`,
        description: `Muitos funcionários iniciaram o conteúdo, mas apenas ${Math.round(rate * 100)}% concluíram o questionário.`,
        recommendation:
          'Verificar se o conteúdo está muito extenso ou se existem dificuldades de compreensão.',
        severity: rate < 0.2 ? 'alta' : 'media',
        evidence: [
          `${trRecords.length} funcionários iniciaram o treinamento`,
          `${completed} concluíram (${Math.round(rate * 100)}%)`,
          `Duração estimada: ${tr.durationMin} minutos`,
        ],
        relatedEquipmentId: tr.equipmentId,
        relatedSector: tr.sector,
      });
    }
  }

  // 3. Outdated content (>120 days)
  for (const eq of getOutdatedContents()) {
    const updated = new Date(eq.lastUpdated);
    const days = Math.floor((today.getTime() - updated.getTime()) / (1000 * 60 * 60 * 24));
    needs.push({
      id: `need-outdated-${eq.id}`,
      type: 'conteudo_desatualizado',
      title: `Conteúdo desatualizado: "${eq.name}"`,
      description: `O treinamento do equipamento "${eq.name}" não recebe atualização há ${days} dias.`,
      recommendation: 'Revisar o material e confirmar se as instruções continuam válidas.',
      severity: days > 180 ? 'alta' : 'media',
      evidence: [
        `Última atualização: ${eq.lastUpdated} (${days} dias atrás)`,
        `Responsável: ${eq.responsible}`,
        `Setor: ${eq.sector}`,
      ],
      relatedEquipmentId: eq.id,
      relatedSector: eq.sector,
    });
  }

  // 4. Sector with high demand
  const sectorDemand = getSectorsDemand();
  if (sectorDemand.length > 0 && sectorDemand[0].acessos > 15) {
    needs.push({
      id: `need-sector-${sectorDemand[0].sector}`,
      type: 'setor_alta_demanda',
      title: `Setor com alta demanda: ${sectorDemand[0].sector}`,
      description: `O setor "${sectorDemand[0].sector}" apresenta ${sectorDemand[0].acessos} acessos a conteúdos operacionais, sendo o de maior volume.`,
      recommendation:
        'Avaliar a necessidade de capacitação presencial complementar para o setor.',
      severity: sectorDemand[0].acessos > 25 ? 'alta' : 'media',
      evidence: [
        `${sectorDemand[0].acessos} acessos totais no setor`,
        `Setor com maior volume de consultas`,
      ],
      relatedSector: sectorDemand[0].sector as Sector,
    });
  }

  return needs.sort((a, b) => {
    const sevOrder = { alta: 0, media: 1, baixa: 2 };
    return sevOrder[a.severity] - sevOrder[b.severity];
  });
}

/* Personal history for employee */
export function getEmployeeHistory(employeeCode: string): AccessLog[] {
  return getAccessLogs().filter((l) => l.employeeCode === employeeCode);
}

export function getEmployeeTrainings(employeeCode: string): TrainingRecord[] {
  return getTrainingRecords().filter((r) => r.employeeCode === employeeCode);
}

export function getRecommendedTrainings(employeeCode: string): Training[] {
  const records = getEmployeeTrainings(employeeCode);
  const allTrainings = getTrainings();
  const completedIds = new Set(records.filter((r) => r.status === 'concluido').map((r) => r.trainingId));
  return allTrainings.filter((tr) => !completedIds.has(tr.id)).slice(0, 4);
}

export function getLastAccessedEquipments(employeeCode: string, limit = 5): Equipment[] {
  const history = getEmployeeHistory(employeeCode);
  const equipments = getEquipments();
  const seen = new Set<string>();
  const result: Equipment[] = [];
  for (const log of history) {
    if (!seen.has(log.equipmentId)) {
      seen.add(log.equipmentId);
      const eq = equipments.find((e) => e.id === log.equipmentId);
      if (eq) result.push(eq);
      if (result.length >= limit) break;
    }
  }
  return result;
}

export function getEquipmentsByEmployeeSector(employeeCode: string): Equipment[] {
  const employees = getEmployees();
  const emp = employees.find((e) => e.code === employeeCode);
  if (!emp) return [];
  return getEquipments().filter((e) => e.sector === emp.sector);
}

/* CSV import helpers */
export function applyImportedData(type: 'equipments' | 'employees' | 'accessLogs', data: Record<string, unknown>[]): void {
  if (type === 'equipments') {
    const existing = getEquipments();
    for (const row of data) {
      const eq = row as unknown as Equipment;
      if (eq.id) {
        const idx = existing.findIndex((e) => e.id === eq.id);
        if (idx >= 0) existing[idx] = { ...existing[idx], ...eq };
        else existing.push(eq);
      }
    }
    localStorage.setItem('capacitasau_equipments', JSON.stringify(existing));
  } else if (type === 'employees') {
    const existing = getEmployees();
    for (const row of data) {
      const emp = row as unknown as Employee;
      if (emp.code) {
        const idx = existing.findIndex((e) => e.code === emp.code);
        if (idx >= 0) existing[idx] = { ...existing[idx], ...emp };
        else existing.push(emp);
      }
    }
    localStorage.setItem('capacitasau_employees', JSON.stringify(existing));
  } else if (type === 'accessLogs') {
    const existing = getAccessLogs();
    for (const row of data) {
      const log = row as unknown as AccessLog;
      if (log.id) existing.push(log);
    }
    localStorage.setItem('capacitasau_access_logs', JSON.stringify(existing));
  }
}
