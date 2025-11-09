#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Script de teste para verificar se o backend está pronto para integração com o frontend.
Testa os endpoints /start e /submit com dados reais.
"""

import requests
import json
import time
from pathlib import Path

BACKEND_URL = "http://127.0.0.1:8000"

def test_health():
    """Testa se o backend está rodando"""
    print("=" * 60)
    print("1. Testando saúde do backend...")
    print("=" * 60)
    
    try:
        response = requests.get(f"{BACKEND_URL}/")
        print(f"✓ Backend está rodando: {response.json()}")
        return True
    except Exception as e:
        print(f"✗ Backend não está rodando: {e}")
        print("\nInicie o backend com:")
        print("uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload")
        return False

def test_start_session():
    """Testa o endpoint /api/v1/session/start"""
    print("\n" + "=" * 60)
    print("2. Testando POST /api/v1/session/start")
    print("=" * 60)
    
    questao_texto = """
    O arquiteto Renzo Piano exibiu a maquete de um edifício assimétrico que tem um vão 
    aberto para a galeria principal, cuja medida da área é 1 672 m². Considere que a 
    escala da maquete exibida é 1 : 200. A medida da área do vão aberto nessa maquete, 
    em centímetro quadrado, é
    """
    
    # Cria arquivo temporário
    files = {
        'file': ('questao.txt', questao_texto.encode('utf-8'), 'text/plain')
    }
    
    try:
        print("Enviando questão-exemplo...")
        response = requests.post(
            f"{BACKEND_URL}/api/v1/session/start",
            files=files,
            timeout=300  # 5 minutos
        )
        
        if response.status_code == 200:
            data = response.json()
            session_id = data.get("session_id")
            questoes = data.get("questoes_geradas", [])
            
            print(f"✓ Sessão criada: {session_id}")
            print(f"✓ Questões geradas: {len(questoes)}")
            
            for i, q in enumerate(questoes, 1):
                print(f"\n--- Questão {i} ---")
                print(f"Enunciado: {q.get('enunciado', '')[:100]}...")
                print(f"Habilidades: {q.get('habilidades_combinadas', [])}")
                alternativas = q.get('alternativas', {})
                print(f"Alternativas: {list(alternativas.keys())}")
                
                if not alternativas:
                    print("⚠ ATENÇÃO: Questão sem alternativas!")
            
            return session_id, questoes
        else:
            print(f"✗ Erro {response.status_code}: {response.text}")
            return None, None
            
    except Exception as e:
        print(f"✗ Erro ao chamar /start: {e}")
        return None, None

def test_submit_answers(session_id):
    """Testa o endpoint /api/v1/session/{session_id}/submit"""
    print("\n" + "=" * 60)
    print("3. Testando POST /api/v1/session/{session_id}/submit")
    print("=" * 60)
    
    if not session_id:
        print("✗ Sem session_id, pulando teste de submit")
        return
    
    # Respostas mockadas (A, B, C)
    respostas = {
        "1": "A",
        "2": "B",
        "3": "C"
    }
    
    try:
        print(f"Submetendo respostas para sessão {session_id}...")
        response = requests.post(
            f"{BACKEND_URL}/api/v1/session/{session_id}/submit",
            json={"respostas": respostas},
            headers={"Content-Type": "application/json"},
            timeout=120
        )
        
        if response.status_code == 200:
            data = response.json()
            relatorio = data.get("relatorio_diagnostico", {})
            
            print(f"✓ Relatório gerado com sucesso!")
            print(f"\n--- Métricas ---")
            print(f"Total de questões: {relatorio.get('total_questoes')}")
            print(f"Total de acertos: {relatorio.get('total_acertos')}")
            print(f"Percentual: {relatorio.get('percentual_acerto', 0):.2f}%")
            print(f"\nResumo: {relatorio.get('resumo', '')[:200]}...")
            
            # Verifica campos obrigatórios
            campos_obrigatorios = [
                'total_questoes',
                'total_acertos', 
                'percentual_acerto',
                'resumo',
                'correcao_detalhada',
                'habilidades_a_revisar',
                'recomendacoes'
            ]
            
            print(f"\n--- Verificando campos obrigatórios ---")
            for campo in campos_obrigatorios:
                if campo in relatorio:
                    print(f"✓ {campo}")
                else:
                    print(f"✗ {campo} FALTANDO!")
            
            # Verifica correção detalhada
            correcao = relatorio.get('correcao_detalhada', [])
            print(f"\n--- Correção Detalhada ({len(correcao)} itens) ---")
            for i, item in enumerate(correcao, 1):
                print(f"\nQuestão {i}:")
                print(f"  Sua resposta: {item.get('sua_resposta')}")
                print(f"  Gabarito: {item.get('gabarito_correto')}")
                print(f"  Acertou: {item.get('acertou')}")
                print(f"  Feedback: {item.get('feedback', '')[:100]}...")
            
            return True
        else:
            print(f"✗ Erro {response.status_code}: {response.text}")
            return False
            
    except Exception as e:
        print(f"✗ Erro ao chamar /submit: {e}")
        return False

def test_cors():
    """Testa se CORS está habilitado"""
    print("\n" + "=" * 60)
    print("4. Testando CORS")
    print("=" * 60)
    
    try:
        response = requests.options(
            f"{BACKEND_URL}/api/v1/session/start",
            headers={
                "Origin": "http://localhost:5173",
                "Access-Control-Request-Method": "POST"
            }
        )
        
        cors_headers = {
            "Access-Control-Allow-Origin": response.headers.get("Access-Control-Allow-Origin"),
            "Access-Control-Allow-Methods": response.headers.get("Access-Control-Allow-Methods"),
            "Access-Control-Allow-Headers": response.headers.get("Access-Control-Allow-Headers"),
        }
        
        print("Headers CORS:")
        for key, value in cors_headers.items():
            if value:
                print(f"✓ {key}: {value}")
            else:
                print(f"✗ {key}: FALTANDO")
        
        if cors_headers["Access-Control-Allow-Origin"]:
            print("\n✓ CORS está habilitado!")
            return True
        else:
            print("\n✗ CORS NÃO está habilitado!")
            return False
            
    except Exception as e:
        print(f"✗ Erro ao testar CORS: {e}")
        return False

def main():
    print("\n" + "=" * 60)
    print("TESTE DE INTEGRAÇÃO FRONTEND ↔ BACKEND - KORA")
    print("=" * 60)
    
    # 1. Testa saúde
    if not test_health():
        return
    
    time.sleep(1)
    
    # 2. Testa /start
    session_id, questoes = test_start_session()
    
    if not session_id:
        print("\n✗ Falha ao criar sessão. Verifique os logs do backend.")
        return
    
    time.sleep(1)
    
    # 3. Testa /submit
    test_submit_answers(session_id)
    
    time.sleep(1)
    
    # 4. Testa CORS
    test_cors()
    
    print("\n" + "=" * 60)
    print("TESTE CONCLUÍDO!")
    print("=" * 60)
    print("\nSe todos os testes passaram, o backend está pronto para o frontend!")
    print("\nPróximos passos:")
    print("1. cd frontend")
    print("2. Crie .env com: VITE_BACKEND_URL=http://127.0.0.1:8000")
    print("3. npm install")
    print("4. npm run dev")
    print("5. Acesse http://localhost:5173")

if __name__ == "__main__":
    main()

