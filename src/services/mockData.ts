
import { WeeklyData, Candidate, StrategicData, MonthKey, MonthlyReportSection } from '../types';

export const generateWeeks = (): WeeklyData[] => {
  return [
    {
      id: 'w-current',
      weekRange: '01 Dez - 07 Dez, 2025',
      topPriorities: ['Gerente de Vendas (SMA)', 'Analista Fiscal (PFU)', 'Programa de Estágio 2026', 'Possíveis Entradas'],
      priorityPipelines: [
        [
          { id: '1', name: 'Ana Souza', status: 'INTERVIEW_MANAGER' },
          { id: '2', name: 'Carlos Lima', status: 'INTERACTION' },
          { id: '3', name: 'Pedro Sales', status: 'PROPOSAL' }
        ], 
        [
          { id: '4', name: 'Roberto Firmino', status: 'INTERVIEW_MARCO' },
          { id: '5', name: 'Julia Roberts', status: 'INTERACTION' }
        ],       
        [
          { id: '6', name: 'Lucas Tech', status: 'INTERACTION' },
          { id: '7', name: 'Fernanda UX', status: 'INTERVIEW_MANAGER' }
        ],
        [
          { id: '8', name: 'Mariana Silva (Banco)', status: 'INTERACTION' },
          { id: '9', name: 'Felipe Costa (Indicação)', status: 'INTERACTION' }
        ]               
      ],
      reportThisWeek: {
        recruitment: "- Fechada vaga de Dev Senior (SCS)\n- Triagem de 50 CVs para Comercial",
        turnover: "- Onboarding de 3 novos analistas",
        dho: "- Pesquisa de Clima disparada",
        projects: "- Revisão de PDI iniciada"
      },
      reportNextWeek: {
        recruitment: "- Iniciar hunting para Tech Lead",
        turnover: "- Entrevista de desligamento (João Silva)",
        dho: "- Treinamento de Liderança Módulo 1",
        projects: "- Planejamento Estratégico 2026"
      }
    },
    {
      id: 'w-prev-1',
      weekRange: '24 Nov - 30 Nov, 2025',
      topPriorities: ['Analista de RH (SCS)', 'Dev Senior (SCS)', 'Analista Fiscal (PFU)', 'Possíveis Entradas'],
      priorityPipelines: [
        [
          { id: '10', name: 'Marcos Dev', status: 'INTERACTION' },
          { id: '11', name: 'João Pedro', status: 'INTERVIEW_MARCO' }
        ],
        [
          { id: '12', name: 'Lucas Silva', status: 'INTERACTION' }
        ],
        [
          { id: '13', name: 'Roberto Firmino', status: 'INTERACTION' }
        ],
        []
      ],
      reportThisWeek: {
        recruitment: "- Entrevistas finais Dev Senior",
        turnover: "- Sem movimentações",
        dho: "- Planejamento da festa de fim de ano",
        projects: "- Reunião de alinhamento com Diretoria"
      },
      reportNextWeek: {
        recruitment: "- Fechar vaga Dev Senior",
        turnover: "",
        dho: "- Disparar pesquisa de clima",
        projects: ""
      }
    },
    {
      id: 'w-prev-2',
      weekRange: '17 Nov - 23 Nov, 2025',
      topPriorities: ['Auxiliar Adm (SMA)', 'Dev Senior (SCS)', 'Coordenador Logística', 'Possíveis Entradas'],
      priorityPipelines: [
        [
           { id: '16', name: 'Carlos Lima', status: 'INTERACTION' }
        ],
        [
          { id: '17', name: 'Marcos Dev', status: 'INTERACTION' },
          { id: '18', name: 'Pedro Santos', status: 'INTERACTION' }
        ],
        [],
        []
      ],
      reportThisWeek: {
        recruitment: "- Abertura de vagas Novembro",
        turnover: "- 3 Desligamentos (Produção)",
        dho: "",
        projects: "- Atualização das políticas de benefícios"
      },
      reportNextWeek: {
        recruitment: "",
        turnover: "",
        dho: "",
        projects: ""
      }
    }
  ];
};

const emptyReport: MonthlyReportSection = {
  recruitment: '',
  turnover: '',
  dho: '',
  projects: ''
};

const months: MonthKey[] = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

const initialReports = months.reduce((acc, month) => {
  acc[month] = { ...emptyReport };
  return acc;
}, {} as Record<MonthKey, MonthlyReportSection>);

// Pre-fill November (Previous month relative to Dec 2025)
initialReports['nov'] = {
  recruitment: 'Fechamos 15 vagas no total este mês, reduzindo o SLA médio para 25 dias. Destaque para a rápida reposição na área comercial.',
  turnover: 'Tivemos 2 desligamentos voluntários na unidade PFU. Entrevistas de desligamento apontam busca por melhores salários.',
  dho: 'Pesquisa de clima teve 90% de adesão. Iniciamos os grupos focais para tratar os pontos de atenção em Comunicação Interna.',
  projects: 'A implantação do ponto eletrônico facial foi concluída em todas as unidades com sucesso.'
};

export const initialStrategicData: StrategicData = {
  semester1Goals: [
    { id: 'g1', text: 'Implementar novo sistema de ATS', achieved: true },
    { id: 'g2', text: 'Reduzir turnover em 10%', achieved: false },
    { id: 'g3', text: 'Finalizar ciclo de Avaliação de Desempenho', achieved: true }
  ],
  semester2Goals: [
    { id: 'g4', text: 'Lançar Universidade Corporativa', achieved: false },
    { id: 'g5', text: 'Revisão do plano de Cargos e Salários', achieved: false },
    { id: 'g6', text: 'Certificação Great Place to Work', achieved: false }
  ],
  monthlyReports: initialReports
};

export const initialCandidates: Candidate[] = [
  { id: 'c1', name: 'Ana Souza', role: 'Gerente Comercial', stage: 'Entrevista', location: 'SMA' },
  { id: 'c2', name: 'Carlos Lima', role: 'Auxiliar Adm', stage: 'Triagem', location: 'SMA' },
  { id: 'c3', name: 'Roberto Firmino', role: 'Analista Fiscal', stage: 'Proposta', location: 'PFU' },
  { id: 'c4', name: 'Julia Roberts', role: 'Assistente RH', stage: 'Teste', location: 'PFU' },
  { id: 'c5', name: 'Marcos Dev', role: 'Dev Fullstack', stage: 'Entrevista', location: 'SCS' },
  { id: 'c6', name: 'Lucas Tech', role: 'Tech Lead', stage: 'Triagem', location: 'SCS' },
  { id: 'c7', name: 'Fernanda UX', role: 'Designer', stage: 'Proposta', location: 'SCS' },
  { id: 'c8', name: 'Pedro Sales', role: 'Vendedor Interno', stage: 'Triagem', location: 'SMA' },
];
