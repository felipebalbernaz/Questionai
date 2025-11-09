import type { SessionResponse, SubmitResponse } from "./types";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";

export const iniciarSessao = async (questaoTexto: string): Promise<SessionResponse> => {
  try {
    // Cria FormData com o arquivo de texto
    const formData = new FormData();
    const blob = new Blob([questaoTexto], { type: 'text/plain' });
    formData.append('file', blob, 'questao.txt');

    const response = await fetch(`${BACKEND_URL}/api/v1/session/start`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return {
      session_id: data.session_id,
      questoes_geradas: data.questoes_geradas || []
    };
  } catch (error) {
    console.error('Erro ao iniciar sessão:', error);
    throw error;
  }
};

export const submeterRespostas = async (
  sessionId: string,
  respostas: Record<string, string>
): Promise<SubmitResponse> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/session/${sessionId}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ respostas }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao submeter respostas:', error);
    throw error;
  }
};
