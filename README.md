# 🎓 KORA - Plataforma de Apoio Pedagógico para Cursinhos Populares

**KORA** é uma plataforma multiagente de IA desenvolvida para apoiar professores voluntários e coordenadores de cursinhos populares e projetos de extensão universitária. A partir de uma questão-exemplo, o sistema identifica as habilidades da **Base Nacional Comum Curricular (BNCC)** associadas, gera questões personalizadas em formato múltipla escolha (estilo ENEM) e fornece relatórios diagnósticos detalhados sobre o desempenho dos estudantes.

A plataforma atende instituições não-lucrativas que frequentemente carecem de tecnologias avançadas de apoio pedagógico, oferecendo uma ferramenta de diagnóstico coletivo e suporte docente baseada em inteligência artificial.

---

## 📑 Índice

1. [Visão Geral e Arquitetura](#-1-visão-geral-e-arquitetura)
2. [Estrutura do Projeto](#-2-estrutura-do-projeto)
3. [Configuração e Instalação](#️-3-configuração-e-instalação)
4. [Executando a Aplicação](#️-4-executando-a-aplicação)
5. [Endpoints da API](#-5-endpoints-da-api)
6. [Sistema de Agentes com Tool Calling](#-6-sistema-de-agentes-com-tool-calling)
7. [Sistema de Prompts Modularizado](#-7-sistema-de-prompts-modularizado)
8. [Sistema RAG - Base de Conhecimento BNCC](#-8-sistema-rag---base-de-conhecimento-bncc)
9. [Como Funciona na Prática](#-9-como-funciona-na-prática)
10. [Benefícios da Arquitetura](#-10-benefícios-da-arquitetura)

---

## 🚀 1. Visão Geral e Arquitetura

**KORA** é uma plataforma B2B educacional construída como uma API **FastAPI** e orquestrada com **LangChain**. A arquitetura é **baseada em sessões** para permitir que professores criem atividades diagnósticas, os alunos respondam de forma assíncrona e os educadores recebam relatórios detalhados sobre o desempenho da turma.

### 1.1. Stack Tecnológica

| Componente | Ferramenta | Propósito |
| :--- | :--- | :--- |
| **Servidor API** | **FastAPI** | Para criar endpoints de API rápidos, modernos e assíncronos. |
| **Orquestração de IA**| **LangChain (LCEL)** | Para definir e executar o fluxo de agentes (Interpretador -\> Criador -\> Resolução). |
| **RAG (BNCC)** | **LangChain + ChromaDB** | Para criar uma base de conhecimento vetorial das habilidades da BNCC e permitir a consulta semântica. |
| **Banco (Sessão)** | **SQLite + SQLAlchemy** | Para persistir o estado da sessão (ex: salvar o `gabarito_mestre` gerado). |
| **Validação** | **Pydantic** | Usado nativamente pelo FastAPI para validar dados de entrada e saída. |

### 1.2. Fluxo do Processo

A plataforma opera em dois estágios principais:

1.  **Estágio 1: Criação da Atividade Diagnóstica (`POST /api/v1/session/start`)**

    1.  O professor envia uma questão-exemplo (texto ou arquivo).
    2.  O `Agente Interpretador` (com RAG-BNCC) analisa o texto e identifica as habilidades BNCC.
    3.  O `Agente Criador` gera 3 questões múltipla escolha (A-E) baseadas nessas habilidades.
    4.  O `Agente Resolução` resolve as questões de forma independente e gera o `Gabarito Mestre`.
    5.  O `Agente Distratores` cria alternativas incorretas plausíveis para cada questão.
    6.  O sistema valida que as questões são solucionáveis (validação adversarial).
    7.  O `Gabarito Mestre` é **salvo no SQLite** associado a um novo `session_id`.
    8.  A API retorna as questões com alternativas e o `session_id` para o professor.

2.  **Estágio 2: Submissão e Relatório Diagnóstico (`POST /api/v1/session/{session_id}/submit`)**

    1.  Os alunos respondem as questões (A, B, C, D ou E) e o professor submete as respostas.
    2.  O sistema **busca no SQLite** o `Gabarito Mestre` usando o `session_id`.
    3.  O `Agente de Correção` compara as respostas dos alunos com o `Gabarito Mestre`.
    4.  A API retorna um `Relatório Diagnóstico` detalhado com:
        - Métricas de desempenho (acertos, erros, taxa de sucesso)
        - Correção detalhada de cada questão
        - Habilidades BNCC trabalhadas
        - Recomendações pedagógicas personalizadas

## 📁 2. Estrutura do Projeto

A arquitetura de pastas é organizada para separar responsabilidades (API, Lógica de Negócio, Banco de Dados, Prompts).

```
cora/
│
├── app/
│   ├── api/v1/endpoints/
│   │   └── session.py           # Rotas da API (/start, /submit, GET)
│   │
│   ├── core/
│   │   └── config.py            # Configurações (.env)
│   │
│   ├── db/
│   │   ├── database.py          # SQLAlchemy setup
│   │   ├── models.py            # Modelos do banco (SessaoEstudo)
│   │   └── schemas.py           # Schemas Pydantic
│   │
│   ├── services/
│   │   ├── agent_service.py     # Orquestração dos agentes
│   │   ├── tools.py             # Ferramentas dos agentes
│   │   └── rag_service.py       # ChromaDB + retriever BNCC
│   │
│   ├── prompts/                 # 📝 Sistema de prompts modularizado
│   │   ├── prompt_loader.py     # Carregador de prompts
│   │   ├── agente_interpretador_system.txt
│   │   ├── agente_interpretador_human.txt
│   │   ├── agente_criador_system.txt
│   │   ├── agente_criador_human.txt
│   │   ├── agente_resolucao_system.txt
│   │   ├── agente_resolucao_human.txt
│   │   ├── agente_correcao_system.txt
│   │   ├── agente_correcao_human.txt
│   │   ├── agente_distratores_system.txt
│   │   └── agente_distratores_human.txt
│   │
│   └── main.py                  # FastAPI app
│
├── data/Matemática/             # 📚 JSONs da BNCC
│   ├── BNCC 1° Ano - Matemática.json
│   ├── BNCC 2° Ano - Matemática.json
│   ├── ...
│   ├── BNCC 9° Ano - Matemática.json
│   ├── BNCC 1ª Série - Matemática.json
│   ├── BNCC 2ª Série - Matemática.json
│   └── BNCC 3ª Série - Matemática.json
│
├── scripts/
│   ├── ingest_bncc.py           # Ingestão do RAG (executar 1x)
│   └── run_backend_e2e_llm.py   # Teste end-to-end com LLMs reais
│
├── chroma_db/                   # 🗄️ Banco vetorial (criado automaticamente)
│   ├── chroma.sqlite3
│   └── ...
│
├── streamlit_app.py             # 🎨 Interface Streamlit para testes
├── .env.example
├── .gitignore
├── requirements.txt
└── README.md
```

## 🛠️ 3. Configuração e Instalação

### Pré-requisitos

- Python 3.10+
- Chave de API do Google Gemini (modelo: `gemini-2.5-flash`)

### Passos de Instalação

1. **Clonar o repositório:**
   ```bash
   git clone [URL_DO_SEU_REPOSITORIO]
   cd cora
   ```

2. **Criar e ativar um ambiente virtual:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # No Windows: .\venv\Scripts\activate
   ```

3. **Instalar as dependências:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configurar variáveis de ambiente:**
   - Copie o `.env.example` para um novo arquivo chamado `.env`
   - Preencha a chave de API do Google Gemini:
     ```
     GOOGLE_API_KEY=sua_chave_aqui
     LLM_PROVIDER=google
     LLM_MODEL=gemini-2.5-flash
     ```

5. **Ingerir dados da BNCC (OBRIGATÓRIO):**
   ```bash
   python scripts/ingest_bncc.py
   ```
   *Isso criará o banco vetorial `./chroma_db/` com todas as habilidades de Matemática.*

6. **Verificar estrutura de prompts:**
   ```bash
   ls app/prompts/
   # Deve mostrar todos os arquivos .txt dos prompts
   ```

7. **Inicializar banco SQLite:**
   *Criado automaticamente na primeira execução*

## ▶️ 4. Executando a Aplicação

### 4.1. Backend (API FastAPI)

Inicie o servidor **Uvicorn**:

```bash
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

- `app.main`: Refere-se ao arquivo `app/main.py`
- `app`: Refere-se à instância `app = FastAPI()` dentro do arquivo
- `--reload`: Reinicia o servidor automaticamente após salvar alterações no código

**Servidor rodando em**: `http://127.0.0.1:8000`
**Documentação interativa**: `http://127.0.0.1:8000/docs`

### 4.2. Interface Streamlit (Opcional)

Para testar a plataforma com interface gráfica:

```bash
streamlit run streamlit_app.py --server.port 8501
```

**Interface rodando em**: `http://localhost:8501`

A interface Streamlit permite:
- ✅ Criar atividades diagnósticas a partir de questões-exemplo
- ✅ Visualizar as 3 questões geradas com alternativas A-E
- ✅ Simular respostas de alunos
- ✅ Visualizar relatórios diagnósticos detalhados

---

## 📖 5. Endpoints da API

Documentação interativa (Swagger UI): **`http://127.0.0.1:8000/docs`**

### 5.1. Criar Atividade Diagnóstica

**Rota:** `POST /api/v1/session/start`
**Body:** `form-data` com uma chave `file` (arquivo de texto com a questão-exemplo)
**Resposta (Sucesso 200):**

```json
{
  "session_id": "a1b2-c3d4-e5f6-g7h8",
  "lista_de_questoes": [
    "1. Uma equipe de engenheiros projetou um reservatório...",
    "2. Um arquiteto está planejando a construção de um jardim...",
    "3. Para uma competição de matemática, os organizadores..."
  ],
  "questoes_geradas": [
    {
      "numero": 1,
      "enunciado": "Uma equipe de engenheiros projetou um reservatório...",
      "habilidades_combinadas": ["EF09MA08", "EF09MA03"],
      "alternativas": {
        "A": "125 m³",
        "B": "150 m³",
        "C": "175 m³",
        "D": "200 m³",
        "E": "225 m³"
      }
    }
  ]
}
```

### 5.2. Consultar Sessão

**Rota:** `GET /api/v1/session/{session_id}`
**Resposta (Sucesso 200):**

```json
{
  "session_id": "a1b2-c3d4-e5f6-g7h8",
  "questao_original": "O arquiteto Renzo Piano exibiu a maquete...",
  "lista_questoes": [...],
  "questoes_geradas": [...],
  "gabarito_mestre": {...},
  "habilidades_identificadas": {...},
  "created_at": "2025-11-09T10:00:00",
  "has_relatorio": false
}
```

### 5.3. Submeter Respostas e Obter Relatório Diagnóstico

**Rota:** `POST /api/v1/session/{session_id}/submit`
**Parâmetro de URL:** `session_id` (o ID recebido no passo 1)
**Body (JSON):**

```json
{
  "respostas": {
    "1": "A",
    "2": "B",
    "3": "C"
  }
}
```

**Resposta (Sucesso 200):**

```json
{
  "session_id": "a1b2-c3d4-e5f6-g7h8",
  "relatorio_diagnostico": {
    "total_questoes": 3,
    "acertos": 2,
    "erros": 1,
    "taxa_acerto": 66.67,
    "correcao_detalhada": [
      {
        "numero": 1,
        "questao": "Uma equipe de engenheiros...",
        "resposta_aluno": "A",
        "resposta_correta": "A",
        "status": "correto",
        "feedback": "Excelente! Você aplicou corretamente a fórmula do volume...",
        "passos_resolucao": ["Passo 1: ...", "Passo 2: ..."]
      }
    ],
    "habilidades_trabalhadas": [
      {
        "codigo": "EF09MA08",
        "habilidade": "Resolver e elaborar problemas que envolvam relações de proporcionalidade...",
        "desempenho": "Bom"
      }
    ],
    "recomendacoes": [
      "Revisar conceitos de proporcionalidade direta e inversa",
      "Praticar mais exercícios envolvendo escalas"
    ]
  }
}
```

---

## 🤖 6. Sistema de Agentes Multiagente

**KORA** utiliza uma arquitetura de **5 agentes especializados** baseada em **LangChain** e **Google Gemini 2.5 Flash**, onde cada agente tem uma responsabilidade específica no pipeline de geração e correção de questões.

### 6.1. Arquitetura de Agentes

```
┌─────────────────────────────────────────────────────────────┐
│                    PIPELINE MULTIAGENTE                      │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ 1. Agente       │    │ RAG ChromaDB     │    │ Prompts         │
│ Interpretador   │◄──►│ • buscar_bncc    │    │ • system.txt    │
│                 │    │ • buscar_conceito│    │ • human.txt     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │ Identifica habilidades BNCC
         ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ 2. Agente       │    │ Validação        │    │ • system.txt    │
│ Criador         │◄──►│ Adversarial      │    │ • human.txt     │
│                 │    │ (Solver valida)  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │ Gera 3 questões MC (A-E)
         ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ 3. Agente       │    │ Gabarito Mestre  │    │ • system.txt    │
│ Resolução       │◄──►│ (independente)   │    │ • human.txt     │
│                 │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │ Resolve questões de forma independente
         ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ 4. Agente       │    │ Distratores      │    │ • system.txt    │
│ Distratores     │◄──►│ Plausíveis       │    │ • human.txt     │
│                 │    │ (4 por questão)  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │ Gera alternativas incorretas plausíveis
         ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ 5. Agente       │    │ Relatório        │    │ • system.txt    │
│ Correção        │◄──►│ Diagnóstico      │    │ • human.txt     │
│                 │    │ Detalhado        │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### 6.2. Descrição dos Agentes

| Agente | Responsabilidade | Entrada | Saída |
|--------|------------------|---------|-------|
| **Interpretador** | Identifica habilidades BNCC na questão-exemplo usando RAG | Questão-exemplo (texto) | Habilidades BNCC identificadas + conceitos principais |
| **Criador** | Gera 3 questões múltipla escolha baseadas nas habilidades | Habilidades BNCC + conceitos | 3 questões (enunciado + habilidades combinadas) |
| **Resolução** | Resolve as questões de forma independente (sem acesso ao gabarito do criador) | 3 questões | Gabarito mestre (resposta final + passos + conceitos + erros comuns) |
| **Distratores** | Gera 4 alternativas incorretas plausíveis para cada questão | Enunciado + resposta correta | 4 distratores plausíveis |
| **Correção** | Compara respostas dos alunos com gabarito e gera relatório diagnóstico | Respostas alunos + gabarito mestre | Relatório diagnóstico detalhado |

### 6.3. Validação Adversarial

A plataforma implementa um sistema de **validação adversarial** para garantir que as questões geradas sejam solucionáveis:

1. **Criador** gera questão + gabarito esperado (oculto do Resolver)
2. **Resolver** tenta resolver a questão de forma independente
3. **Validação** compara as respostas usando equivalência numérica/semântica
4. **Aprovação**: Questão é aprovada apenas se Resolver conseguir chegar à resposta correta

Isso garante que as questões sejam:
- ✅ Solucionáveis com as informações fornecidas
- ✅ Não ambíguas
- ✅ Com nível de dificuldade adequado

### 6.4. Geração de Distratores

O **Agente Distratores** utiliza uma estratégia de 3 camadas para gerar alternativas incorretas plausíveis:

1. **Camada 1**: LLM gera distratores baseados em erros conceituais comuns
2. **Camada 2**: Fallback estruturado com JSON schema
3. **Camada 3**: Heurística numérica (perturbações de ±10%, ±20%, etc.) **preservando unidades**

Exemplo:
- Resposta correta: `93.75 km²`
- Distratores gerados: `84.375 km²`, `103.125 km²`, `75.0 km²`, `112.5 km²`

---

## 📝 7. Sistema de Prompts Modularizado

Os prompts dos agentes são mantidos em arquivos `.txt` separados para facilitar edição e versionamento.

### 7.1. Estrutura de Prompts

```
app/prompts/
├── __init__.py
├── prompt_loader.py                    # Carregador de prompts
├── agente_interpretador_system.txt     # Prompt sistema do interpretador
├── agente_interpretador_human.txt      # Prompt usuário do interpretador
├── agente_criador_system.txt           # Prompt sistema do criador
├── agente_criador_human.txt            # Prompt usuário do criador
├── agente_resolucao_system.txt         # Prompt sistema da resolução
├── agente_resolucao_human.txt          # Prompt usuário da resolução
├── agente_correcao_system.txt          # Prompt sistema da correção
└── agente_correcao_human.txt           # Prompt usuário da correção
```

### 7.2. Carregamento de Prompts

```python
from app.prompts.prompt_loader import prompt_loader

# Carrega um prompt específico
system_prompt = prompt_loader.load_prompt("agente_interpretador_system.txt")

# Carrega todos os prompts
all_prompts = prompt_loader.load_all_prompts()
```

### 7.3. Vantagens da Separação

- ✅ **Edição Fácil**: Modifique prompts sem tocar no código Python
- ✅ **Versionamento**: Controle de versão independente para prompts
- ✅ **Colaboração**: Diferentes pessoas podem trabalhar em prompts e código
- ✅ **Testes A/B**: Fácil comparação entre versões de prompts
- ✅ **Manutenção**: Prompts organizados e documentados

---

## 🔍 8. Sistema RAG - Base de Conhecimento BNCC

O sistema utiliza **Retrieval-Augmented Generation (RAG)** para consultar as habilidades da BNCC de Matemática de forma inteligente.

### 8.1. Estratégia de Chunking

Cada **habilidade BNCC individual** = 1 chunk no banco vetorial:

```json
{
  "page_content": "Ano: 8º\nUnidade Temática: Números\nObjeto: Notação científica\nCódigo: EF08MA01\nHabilidade: Efetuar cálculos com potências...",
  "metadata": {
    "ano": "8º",
    "unidade_tematica": "Números",
    "codigo_bncc": "EF08MA01",
    "componente": "Matemática"
  }
}
```

### 8.2. Banco Vetorial - ChromaDB

**Por que ChromaDB?**
- ✅ **Simplicidade**: Sem configuração de servidor
- ✅ **Persistência**: Salva automaticamente em disco
- ✅ **Integração**: Nativa com LangChain
- ✅ **Performance**: Adequada para ~300 habilidades de matemática
- ✅ **Filtros**: Busca por ano, unidade temática, etc.

### 8.3. Tipos de Busca Implementados

```python
# Busca semântica básica
rag.buscar_habilidades("função quadrática vértice")

# Busca com filtro por ano
rag.buscar_habilidades("geometria", ano_escolar="8º")

# Busca por conceitos específicos
rag.buscar_por_conceito(["função quadrática", "vértice"], "9º")

# Busca avançada com re-ranking
rag.buscar_habilidades_avancada("probabilidade", {"unidade_tematica": "Estatística"})
```

### 8.4. Setup do RAG

1. **Executar ingestão uma única vez**:
   ```bash
   python scripts/ingest_bncc.py
   ```

2. **Estrutura dos dados**:
   ```
   data/Matemática/
   ├── BNCC 1° Ano - Matemática.json
   ├── BNCC 2° Ano - Matemática.json
   ├── ...
   ├── BNCC 9° Ano - Matemática.json
   ├── BNCC 1ª Série - Matemática.json
   ├── BNCC 2ª Série - Matemática.json
   └── BNCC 3ª Série - Matemática.json
   ```

3. **Banco vetorial criado**:
   ```
   ./chroma_db/          # Pasta criada automaticamente
   ├── chroma.sqlite3    # Banco SQLite do ChromaDB
   └── ...              # Arquivos de índice vetorial
   ```



---

## 🧠 9. Como Funciona na Prática

### Exemplo de Fluxo Completo (Cursinho Popular)

**Contexto**: Professor de um cursinho popular quer criar uma atividade diagnóstica sobre escalas e proporcionalidade.

#### Passo 1: Criação da Atividade

1. **Professor envia**: Questão-exemplo sobre maquete e escala (ENEM 2011)
2. **Agente Interpretador**:
   - Busca no ChromaDB: `"escala maquete proporcionalidade área"`
   - Identifica habilidades: `EF09MA08` (proporcionalidade), `EF09MA03` (operações com números reais)
3. **Agente Criador**:
   - Gera 3 questões múltipla escolha sobre escalas, volumes e áreas
   - Combina 2-3 habilidades BNCC por questão
4. **Agente Resolução**:
   - Resolve as 3 questões de forma independente
   - Gera gabarito com: resposta final, passos de resolução, conceitos aplicados, erros comuns
5. **Validação Adversarial**:
   - Compara resposta do Criador vs Resolver
   - Aprova apenas questões solucionáveis
6. **Agente Distratores**:
   - Gera 4 alternativas incorretas plausíveis para cada questão
   - Preserva unidades (km², m³, cm, etc.)
   - Embaralha alternativas (A-E)
7. **Retorna**: 3 questões com alternativas + `session_id`

#### Passo 2: Aplicação com Alunos

8. **Professor aplica**: Atividade com os alunos do cursinho
9. **Alunos respondem**: Marcam alternativas A, B, C, D ou E
10. **Professor submete**: Respostas dos alunos via API

#### Passo 3: Relatório Diagnóstico

11. **Agente Correção**:
    - Recupera gabarito mestre do banco
    - Compara respostas dos alunos
    - Gera relatório com:
      - **Métricas**: Total de questões, acertos, erros, taxa de acerto
      - **Correção detalhada**: Feedback por questão, passos de resolução
      - **Habilidades BNCC**: Desempenho por habilidade trabalhada
      - **Recomendações**: Sugestões pedagógicas personalizadas
12. **Professor recebe**: Relatório diagnóstico completo para orientar intervenções pedagógicas

---

## 🎯 10. Benefícios para Cursinhos Populares

### 10.1. Benefícios Pedagógicos

- ✅ **Diagnóstico Coletivo**: Relatórios detalhados sobre desempenho da turma por habilidade BNCC
- ✅ **Personalização**: Questões adaptadas ao nível e contexto dos alunos
- ✅ **Alinhamento BNCC**: Todas as questões mapeadas para habilidades da Base Nacional
- ✅ **Feedback Detalhado**: Passos de resolução, conceitos aplicados e erros comuns
- ✅ **Recomendações Pedagógicas**: Sugestões de intervenção baseadas no desempenho

### 10.2. Benefícios Operacionais

- ✅ **Redução de Carga Docente**: Automatiza criação de questões e correção
- ✅ **Escalabilidade**: Atende múltiplas turmas e professores simultaneamente
- ✅ **Acessibilidade**: Plataforma web, sem necessidade de instalação
- ✅ **Custo Zero**: Tecnologia gratuita para instituições não-lucrativas
- ✅ **Apoio a Voluntários**: Facilita trabalho de professores sem formação pedagógica formal

### 10.3. Benefícios Técnicos

- ✅ **Modularidade**: Cada agente tem responsabilidade única e bem definida
- ✅ **Escalabilidade**: Fácil adicionar novos agentes ou componentes
- ✅ **Manutenibilidade**: Prompts separados do código facilitam ajustes
- ✅ **Rastreabilidade**: Logs detalhados das decisões dos agentes
- ✅ **Flexibilidade**: RAG permite consultas inteligentes à BNCC sem hardcoding
- ✅ **Persistência**: Sistema de sessões permite uso assíncrono
- ✅ **Testabilidade**: Componentes isolados facilitam testes unitários
- ✅ **Validação**: Sistema adversarial garante qualidade das questões geradas

---

## 📚 Referências e Recursos

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [LangChain Documentation](https://python.langchain.com/)
- [ChromaDB Documentation](https://docs.trychroma.com/)
- [BNCC - Base Nacional Comum Curricular](http://basenacionalcomum.mec.gov.br/)

---

## 📄 Licença

[Especificar licença do projeto]

---

## 👥 Contribuindo

[Instruções para contribuição]

---

## 🌟 Sobre o KORA

**KORA** (Plataforma de Apoio Pedagógico para Cursinhos Populares) é uma iniciativa dedicada a democratizar o acesso a tecnologias educacionais avançadas para instituições não-lucrativas que atendem populações vulneráveis.

### Público-Alvo

- 🎓 **Cursinhos Populares**: Preparatórios comunitários para ENEM e vestibulares
- 🏫 **Projetos de Extensão Universitária**: Iniciativas de apoio educacional
- 👥 **Professores Voluntários**: Educadores que atuam em contextos de vulnerabilidade social
- 📚 **Coordenadores Pedagógicos**: Gestores de programas educacionais não-lucrativos

### Missão

Fornecer ferramentas de diagnóstico pedagógico e apoio docente baseadas em IA para instituições que carecem de recursos tecnológicos, contribuindo para a redução de desigualdades educacionais no Brasil.

---

**Desenvolvido com ❤️ para a educação popular brasileira**