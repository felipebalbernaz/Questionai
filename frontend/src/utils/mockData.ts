export interface AlunoData {
  id: string;
  nome: string;
  sessoesCompletadas: number;
  totalQuestoes: number;
  totalAcertos: number;
  percentualAcerto: number;
  habilidadesRevisar: string[];
}

export interface HabilidadeDesempenho {
  habilidade: string;
  percentual: number;
  tendencia: "up" | "down" | "stable";
}

export interface TeacherDashboardData {
  totalAlunos: number;
  totalSessoes: number;
  mediaGeral: number;
  totalQuestoes: number;
  alunos: AlunoData[];
  habilidadesPorDesempenho: HabilidadeDesempenho[];
}

export const getTeacherDashboardData = (): TeacherDashboardData => {
  const alunos: AlunoData[] = [
    {
      id: "1",
      nome: "Ana Silva",
      sessoesCompletadas: 8,
      totalQuestoes: 24,
      totalAcertos: 20,
      percentualAcerto: 83.33,
      habilidadesRevisar: ["EM13MAT310", "EM13MAT315"]
    },
    {
      id: "2",
      nome: "Bruno Santos",
      sessoesCompletadas: 12,
      totalQuestoes: 36,
      totalAcertos: 30,
      percentualAcerto: 83.33,
      habilidadesRevisar: ["EM13MAT309"]
    },
    {
      id: "3",
      nome: "Carla Oliveira",
      sessoesCompletadas: 6,
      totalQuestoes: 18,
      totalAcertos: 11,
      percentualAcerto: 61.11,
      habilidadesRevisar: ["EM13MAT309", "EM13MAT310", "EM13MAT312"]
    },
    {
      id: "4",
      nome: "Daniel Costa",
      sessoesCompletadas: 10,
      totalQuestoes: 30,
      totalAcertos: 27,
      percentualAcerto: 90.0,
      habilidadesRevisar: ["EM13MAT315"]
    },
    {
      id: "5",
      nome: "Elisa Ferreira",
      sessoesCompletadas: 5,
      totalQuestoes: 15,
      totalAcertos: 9,
      percentualAcerto: 60.0,
      habilidadesRevisar: ["EM13MAT309", "EM13MAT310", "EM13MAT312", "EM13MAT315"]
    },
    {
      id: "6",
      nome: "Felipe Lima",
      sessoesCompletadas: 9,
      totalQuestoes: 27,
      totalAcertos: 19,
      percentualAcerto: 70.37,
      habilidadesRevisar: ["EM13MAT312", "EM13MAT315"]
    },
    {
      id: "7",
      nome: "Gabriela Rocha",
      sessoesCompletadas: 11,
      totalQuestoes: 33,
      totalAcertos: 28,
      percentualAcerto: 84.85,
      habilidadesRevisar: ["EM13MAT310"]
    },
    {
      id: "8",
      nome: "Henrique Alves",
      sessoesCompletadas: 7,
      totalQuestoes: 21,
      totalAcertos: 12,
      percentualAcerto: 57.14,
      habilidadesRevisar: ["EM13MAT309", "EM13MAT310", "EM13MAT312"]
    },
    {
      id: "9",
      nome: "Isabela Martins",
      sessoesCompletadas: 13,
      totalQuestoes: 39,
      totalAcertos: 34,
      percentualAcerto: 87.18,
      habilidadesRevisar: ["EM13MAT315"]
    },
    {
      id: "10",
      nome: "João Pedro",
      sessoesCompletadas: 8,
      totalQuestoes: 24,
      totalAcertos: 15,
      percentualAcerto: 62.5,
      habilidadesRevisar: ["EM13MAT309", "EM13MAT312"]
    }
  ];

  const totalQuestoes = alunos.reduce((sum, a) => sum + a.totalQuestoes, 0);
  const totalAcertos = alunos.reduce((sum, a) => sum + a.totalAcertos, 0);
  const mediaGeral = (totalAcertos / totalQuestoes) * 100;

  const habilidades: HabilidadeDesempenho[] = [
    {
      habilidade: "EM13MAT309 - Relações métricas e trigonométricas",
      percentual: 68.5,
      tendencia: "down"
    },
    {
      habilidade: "EM13MAT310 - Resolver problemas de contagem",
      percentual: 72.3,
      tendencia: "stable"
    },
    {
      habilidade: "EM13MAT312 - Geometria espacial",
      percentual: 65.8,
      tendencia: "down"
    },
    {
      habilidade: "EM13MAT315 - Grandezas e medidas",
      percentual: 78.9,
      tendencia: "up"
    },
    {
      habilidade: "EM13MAT316 - Álgebra e funções",
      percentual: 82.1,
      tendencia: "up"
    }
  ];

  return {
    totalAlunos: alunos.length,
    totalSessoes: alunos.reduce((sum, a) => sum + a.sessoesCompletadas, 0),
    mediaGeral,
    totalQuestoes,
    alunos,
    habilidadesPorDesempenho: habilidades
  };
};
