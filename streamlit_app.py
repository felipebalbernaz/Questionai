import streamlit as st
import requests
import json
from typing import Dict, Optional
import time

st.set_page_config(page_title="KORA - Plataforma dos Cursinhos Populares", page_icon="🎓", layout="wide")

BACKEND_URL = "http://127.0.0.1:8000"

st.markdown("""<style>
.main-header { font-size: 2.5rem; font-weight: bold; color: #1f77b4; text-align: center; margin-bottom: 2rem; }
.step-header { font-size: 1.5rem; font-weight: bold; color: #2c3e50; margin-top: 2rem; padding: 0.5rem; background-color: #ecf0f1; border-left: 5px solid #3498db; }
.question-box { background-color: #f8f9fa; padding: 1.5rem; border-radius: 10px; border: 2px solid #dee2e6; margin-bottom: 1.5rem; }
</style>""", unsafe_allow_html=True)

for key in ["session_id", "questoes", "respostas", "relatorio", "step"]:
    if key not in st.session_state:
        st.session_state[key] = None if key in ["session_id", "relatorio"] else ([] if key in ["questoes"] else ({} if key == "respostas" else 1))

def reset_session():
    st.session_state.session_id = None
    st.session_state.questoes = []
    st.session_state.respostas = {}
    st.session_state.relatorio = None
    st.session_state.step = 1

def iniciar_sessao(questao_texto: str) -> Optional[Dict]:
    try:
        with st.spinner("Gerando questoes..."):
            files = {"file": ("questao.txt", questao_texto.encode("utf-8"), "text/plain")}
            response = requests.post(f"{BACKEND_URL}/api/v1/session/start", files=files, timeout=600)
            return response.json() if response.status_code == 200 else None
    except Exception as e:
        st.error(f"Erro: {str(e)}")
        return None

def buscar_questoes(session_id: str) -> Optional[Dict]:
    try:
        response = requests.get(f"{BACKEND_URL}/api/v1/session/{session_id}", timeout=30)
        return response.json() if response.status_code == 200 else None
    except:
        return None

def submeter_respostas(session_id: str, respostas: Dict) -> Optional[Dict]:
    try:
        with st.spinner("Corrigindo..."):
            response = requests.post(f"{BACKEND_URL}/api/v1/session/{session_id}/submit", json={"respostas": respostas}, timeout=300)
            return response.json() if response.status_code == 200 else None
    except:
        return None

st.markdown("<div class='main-header'>BNCC-Gen</div>", unsafe_allow_html=True)

with st.sidebar:
    st.header("Sobre")
    st.markdown("1. Cole questao\\n2. Gera 3 similares\\n3. Responda\\n4. Relatorio")
    st.divider()
    if st.button("Nova Sessao", use_container_width=True):
        reset_session()
        st.rerun()
    st.divider()
    # Correção
    if st.session_state.session_id: 
        st.success("Sessao ativa")
    else:
        st.info("Nenhuma sessao")

if st.session_state.step == 1:
    st.markdown("<div class='step-header'>Passo 1: Cole a Questao</div>", unsafe_allow_html=True)
    questao_exemplo = "O arquiteto Renzo Piano exibiu a maquete da nova sede do Museu Whitney de Arte Americana, um predio assimetrico que tem um vao aberto para a galeria principal, cuja medida da area e 1 672 m2. Considere que a escala da maquete exibida e 1 : 200. A medida da area do vao aberto nessa maquete, em centimetro quadrado, e"
    questao_texto = st.text_area("Questao:", value=questao_exemplo, height=200)
    col1, col2, col3 = st.columns([1, 2, 1])
    with col2:
        if st.button("Gerar Questoes", use_container_width=True, type="primary"):
            if questao_texto.strip():
                resultado = iniciar_sessao(questao_texto)
                if resultado:
                    st.session_state.session_id = resultado["session_id"]
                    st.session_state.questoes = resultado.get("questoes_geradas", [])
                    st.session_state.step = 2
                    st.success("Gerado!")
                    time.sleep(1)
                    st.rerun()

elif st.session_state.step == 2:
    st.markdown("<div class='step-header'>Passo 2: Responda</div>", unsafe_allow_html=True)
    if not st.session_state.questoes:
        dados = buscar_questoes(st.session_state.session_id)
        if dados:
            # Tenta primeiro questoes_geradas, depois lista_questoes
            st.session_state.questoes = dados.get("questoes_geradas", dados.get("lista_questoes", []))
    if st.session_state.questoes:
        st.info(f"Total: {len(st.session_state.questoes)} questoes")
        for idx, questao in enumerate(st.session_state.questoes, 1):
            st.markdown("<div class='question-box'>", unsafe_allow_html=True)
            st.markdown(f"### Questao {idx}")
            st.markdown(f"**{questao.get('enunciado', '')}**")
            habilidades = questao.get("habilidades_combinadas", [])
            if habilidades:
                st.caption(f"BNCC: {', '.join(habilidades)}")
            st.divider()
            alternativas = questao.get("alternativas", {})
            if alternativas:
                letras = sorted(alternativas.keys())
                resposta = st.radio("Escolha:", options=letras, format_func=lambda x: f"{x}) {alternativas[x]}", key=f"q_{idx}", index=None)
                if resposta:
                    st.session_state.respostas[str(idx)] = resposta
            st.markdown("</div>", unsafe_allow_html=True)
        st.divider()
        col1, col2, col3 = st.columns([1, 2, 1])
        with col2:
            completo = len(st.session_state.respostas) == len(st.session_state.questoes)
            if not completo:
                st.warning(f"{len(st.session_state.respostas)}/{len(st.session_state.questoes)} respondidas")
            if st.button("Submeter", use_container_width=True, type="primary", disabled=not completo):
                resultado = submeter_respostas(st.session_state.session_id, st.session_state.respostas)
                if resultado:
                    st.session_state.relatorio = resultado.get("relatorio_diagnostico", {})
                    st.session_state.step = 3
                    st.success("Submetido!")
                    time.sleep(1)
                    st.rerun()

elif st.session_state.step == 3:
    st.markdown("<div class='step-header'>Passo 3: Relatorio</div>", unsafe_allow_html=True)
    if st.session_state.relatorio:
        rel = st.session_state.relatorio
        col1, col2, col3 = st.columns(3)
        with col1:
            st.metric("Total", rel.get("total_questoes", 0))
        with col2:
            st.metric("Acertos", rel.get("total_acertos", 0))
        with col3:
            st.metric("Percentual", f"{rel.get('percentual_acerto', 0):.1f}%")
        st.divider()
        st.subheader("Resumo")
        st.info(rel.get("resumo", ""))
        st.divider()
        st.subheader("Correcao Detalhada")
        for item in rel.get("correcao_detalhada", []):
            icone = "OK" if item.get("acertou", False) else "X"
            with st.expander(f"{icone} {item.get('questao', '')[:80]}..."):
                st.markdown(f"**Sua resposta:** {item.get('sua_resposta', '')}")
                st.markdown(f"**Gabarito:** {item.get('gabarito_correto', '')}")
                st.markdown(f"**Feedback:** {item.get('feedback', '')}")
        st.divider()
        st.subheader("Habilidades a Revisar")
        for hab in rel.get("habilidades_a_revisar", []):
            st.markdown(f"- {hab}")
        st.divider()
        st.subheader("Recomendacoes")
        st.markdown(rel.get("recomendacoes", ""))
        st.divider()
        col1, col2 = st.columns(2)
        with col1:
            st.download_button("Baixar JSON", data=json.dumps(rel, indent=2, ensure_ascii=False), file_name="relatorio.json", mime="application/json", use_container_width=True)
        with col2:
            if st.button("Nova Sessao", use_container_width=True):
                reset_session()
                st.rerun()

