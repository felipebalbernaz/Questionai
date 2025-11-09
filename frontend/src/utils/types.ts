export interface Questao {
  enunciado: string;
  alternativas: Record<string, string>;
  gabarito: string;
  habilidades_combinadas?: string[];
}

export interface CorrecaoDetalhada {
  questao: string;
  sua_resposta: string;
  gabarito_correto: string;
  acertou: boolean;
  feedback: string;
}

export interface Relatorio {
  total_questoes: number;
  total_acertos: number;
  percentual_acerto: number;
  resumo: string;
  correcao_detalhada: CorrecaoDetalhada[];
  habilidades_a_revisar: string[];
  recomendacoes: string;
}

export interface SessionResponse {
  session_id: string;
  questoes_geradas: Questao[];
}

export interface SubmitResponse {
  relatorio_diagnostico: Relatorio;
}
