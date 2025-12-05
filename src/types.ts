
export type Location = 'SMA' | 'PFU' | 'SCS';

export type Category = 'RECRUITMENT' | 'TURNOVER' | 'DHO' | 'PROJECTS';

// Removed ReportItem as it is no longer used
// export interface ReportItem { id: string; text: string; completed: boolean; }

export interface WeeklySection {
  recruitment: string;
  turnover: string; // Contratação e Desligamento
  dho: string;
  projects: string;
}

export type PipelineStatus = 'INTERACTION' | 'INTERVIEW_MARCO' | 'INTERVIEW_MANAGER' | 'PROPOSAL';

export interface PipelineCandidate {
  id: string;
  name: string;
  status: PipelineStatus;
}

export interface WeeklyData {
  id: string;
  weekRange: string;
  topPriorities: [string, string, string, string]; // Extended to 4 items
  priorityPipelines: [PipelineCandidate[], PipelineCandidate[], PipelineCandidate[], PipelineCandidate[]]; // Extended to 4 pipelines
  reportThisWeek: WeeklySection;
  reportNextWeek: WeeklySection;
}

export interface Candidate {
  id: string;
  name: string;
  role: string;
  stage: 'Triagem' | 'Entrevista' | 'Teste' | 'Proposta';
  location: Location;
}

export interface VacancyStats {
  location: Location;
  candidates: Candidate[];
}

// Strategic Types
export interface StrategicGoal {
  id: string;
  text: string;
  achieved: boolean;
}

export interface MonthlyReportSection {
  recruitment: string;
  turnover: string;
  dho: string;
  projects: string;
}

export type MonthKey = 'jan' | 'fev' | 'mar' | 'abr' | 'mai' | 'jun' | 'jul' | 'ago' | 'set' | 'out' | 'nov' | 'dez';

export interface StrategicData {
  semester1Goals: StrategicGoal[];
  semester2Goals: StrategicGoal[];
  monthlyReports: Record<MonthKey, MonthlyReportSection>;
}
