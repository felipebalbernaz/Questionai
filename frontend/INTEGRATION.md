# 🔗 KORA - Guia de Integração Frontend ↔ Backend

Este documento explica como o frontend React se conecta com o backend FastAPI.

## ✅ Status da Integração

- ✅ **API configurada** - `src/utils/api.ts` com chamadas reais ao backend
- ✅ **CORS habilitado** - Backend aceita requisições do frontend
- ✅ **Types sincronizados** - TypeScript types compatíveis com schemas Pydantic
- ✅ **Endpoints mapeados** - `/start` e `/submit` implementados

## 🔧 Configuração

### 1. Backend (FastAPI)

```bash
# No diretório raiz do projeto
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

**URL:** http://127.0.0.1:8000

### 2. Frontend (Vite + React)

Crie `.env` em `frontend/`:

```bash
VITE_BACKEND_URL=http://127.0.0.1:8000
```

Inicie o dev server:

```bash
cd frontend
npm install
npm run dev
```

**URL:** http://localhost:5173

## 📡 Endpoints Integrados

### 1. POST /api/v1/session/start

**Arquivo:** `src/utils/api.ts` → `iniciarSessao()`

**Request:**
```typescript
const formData = new FormData();
const blob = new Blob([questaoTexto], { type: 'text/plain' });
formData.append('file', blob, 'questao.txt');

fetch('http://127.0.0.1:8000/api/v1/session/start', {
  method: 'POST',
  body: formData,
});
```

**Response:**
```json
{
  "session_id": "uuid",
  "questoes_geradas": [
    {
      "numero": 1,
      "enunciado": "...",
      "habilidades_combinadas": ["EF09MA08"],
      "alternativas": {
        "A": "...",
        "B": "...",
        "C": "...",
        "D": "...",
        "E": "..."
      }
    }
  ]
}
```

### 2. POST /api/v1/session/{session_id}/submit

**Arquivo:** `src/utils/api.ts` → `submeterRespostas()`

**Request:**
```typescript
fetch(`http://127.0.0.1:8000/api/v1/session/${sessionId}/submit`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    respostas: {
      "1": "A",
      "2": "B",
      "3": "C"
    }
  }),
});
```

**Response:**
```json
{
  "relatorio_diagnostico": {
    "total_questoes": 3,
    "total_acertos": 2,
    "percentual_acerto": 66.67,
    "resumo": "...",
    "correcao_detalhada": [...],
    "habilidades_a_revisar": [...],
    "recomendacoes": "..."
  }
}
```

## 🎯 Fluxo Completo

### Passo 1: Gerar Questões

1. **Frontend:** Usuário cola questão em `StudentFlow.tsx`
2. **Frontend:** Clica em "Gerar Questões"
3. **Frontend:** `iniciarSessao(questaoTexto)` envia FormData
4. **Backend:** Recebe arquivo, extrai texto
5. **Backend:** Agente Interpretador identifica habilidades BNCC
6. **Backend:** Agente Criador gera 3 questões MC
7. **Backend:** Agente Resolução cria gabarito mestre
8. **Backend:** Agente Distratores gera alternativas A-E
9. **Backend:** Retorna `session_id` + `questoes_geradas`
10. **Frontend:** Armazena em `useState` e exibe questões

### Passo 2: Submeter Respostas

1. **Frontend:** Usuário seleciona alternativas (RadioGroup)
2. **Frontend:** Clica em "Submeter Respostas"
3. **Frontend:** `submeterRespostas(sessionId, respostas)` envia JSON
4. **Backend:** Recebe respostas, busca gabarito no banco
5. **Backend:** Agente Correção compara respostas com gabarito
6. **Backend:** Gera relatório diagnóstico
7. **Backend:** Retorna `relatorio_diagnostico`
8. **Frontend:** Exibe métricas, correção detalhada, recomendações

## 🐛 Troubleshooting

### Erro: "Failed to fetch"

**Causa:** Backend não está rodando ou CORS não configurado

**Solução:**
1. Verifique se backend está em http://127.0.0.1:8000
2. Verifique CORS em `app/main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Erro: "questoes_geradas is undefined"

**Causa:** Backend retornou estrutura diferente

**Solução:**
1. Verifique logs do backend
2. Confirme que `app/api/v1/endpoints/session.py` retorna `questoes_geradas`
3. Verifique se `app/db/schemas.py` tem campo `questoes_geradas` em `SessionStartResponse`

### Questões sem alternativas

**Causa:** Agente Distratores falhou

**Solução:**
1. Verifique logs do backend para erros no `_completar_e_embaralhar_alternativas`
2. Confirme que `app/services/agent_service.py` adiciona alternativas às questões
3. Verifique se Google Gemini API está funcionando

## 📝 Checklist de Integração

- [x] Backend rodando em http://127.0.0.1:8000
- [x] Frontend rodando em http://localhost:5173
- [x] `.env` criado no frontend com `VITE_BACKEND_URL`
- [x] CORS habilitado no backend
- [x] `src/utils/api.ts` usando fetch real (não mock)
- [x] Types em `src/utils/types.ts` compatíveis com backend
- [x] Endpoint `/start` retornando `questoes_geradas`
- [x] Endpoint `/submit` aceitando JSON com `respostas`
- [x] Schema `RelatorioDiagnostico` com campo `recomendacoes`

## 🚀 Teste Rápido

```bash
# Terminal 1: Backend
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload

# Terminal 2: Frontend
cd frontend
npm run dev

# Navegador
# 1. Acesse http://localhost:5173
# 2. Clique em "Área do Aluno"
# 3. Clique em "Gerar Questões"
# 4. Aguarde ~2-3 minutos
# 5. Responda as questões
# 6. Clique em "Submeter Respostas"
# 7. Veja o relatório
```

---

**Desenvolvido com ❤️ para a educação popular brasileira**

