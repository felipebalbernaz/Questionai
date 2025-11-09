import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, GraduationCap, Plus, Edit, Trash2, Users, Calendar, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

const GestaoSimulados = () => {
  const navigate = useNavigate();

  // Mock data - substituir por dados reais da API
  const [simulados] = useState([
    {
      id: 1,
      nome: "Simulado ENEM 2024 - Matemática",
      disciplina: "Matemática",
      questoes: 45,
      dataInicio: "2024-11-10",
      dataFim: "2024-11-20",
      status: "ativo",
      turmas: ["9º A", "9º B"],
      alunosInscritos: 45,
      alunosConcluiram: 12,
      mediaGeral: 68.5
    },
    {
      id: 2,
      nome: "Avaliação Diagnóstica - Álgebra",
      disciplina: "Matemática",
      questoes: 20,
      dataInicio: "2024-11-05",
      dataFim: "2024-11-12",
      status: "ativo",
      turmas: ["8º A"],
      alunosInscritos: 28,
      alunosConcluiram: 28,
      mediaGeral: 72.3
    },
    {
      id: 3,
      nome: "Simulado Geometria Espacial",
      disciplina: "Matemática",
      questoes: 15,
      dataInicio: "2024-10-20",
      dataFim: "2024-10-30",
      status: "encerrado",
      turmas: ["9º A", "9º B", "9º C"],
      alunosInscritos: 67,
      alunosConcluiram: 65,
      mediaGeral: 75.8
    },
    {
      id: 4,
      nome: "Preparatório ENEM - Funções",
      disciplina: "Matemática",
      questoes: 30,
      dataInicio: "2024-11-25",
      dataFim: "2024-12-05",
      status: "agendado",
      turmas: ["3º A", "3º B"],
      alunosInscritos: 0,
      alunosConcluiram: 0,
      mediaGeral: 0
    }
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ativo":
        return <Badge className="bg-green-600">Ativo</Badge>;
      case "agendado":
        return <Badge className="bg-blue-600">Agendado</Badge>;
      case "encerrado":
        return <Badge variant="outline">Encerrado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getProgressoColor = (concluiram: number, inscritos: number) => {
    if (inscritos === 0) return "bg-gray-300";
    const percentual = (concluiram / inscritos) * 100;
    if (percentual >= 80) return "bg-green-600";
    if (percentual >= 50) return "bg-yellow-600";
    return "bg-red-600";
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/teacher")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold">Kora - Gestão de Simulados</h1>
          </div>
          <Button onClick={() => navigate("/teacher/gerar-questoes")}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Simulado
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Gestão de Simulados</h2>
          <p className="text-muted-foreground">
            Crie, edite e acompanhe simulados atribuídos às turmas
          </p>
        </div>

        {/* Estatísticas */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total de Simulados</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{simulados.length}</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-green-200 bg-green-50">
            <CardHeader className="pb-3">
              <CardDescription>Ativos</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">
                {simulados.filter(s => s.status === "ativo").length}
              </p>
            </CardContent>
          </Card>
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardHeader className="pb-3">
              <CardDescription>Agendados</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">
                {simulados.filter(s => s.status === "agendado").length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Alunos Participando</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">
                {simulados.reduce((acc, s) => acc + s.alunosInscritos, 0)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Simulados */}
        <div className="space-y-4">
          {simulados.map((simulado) => (
            <Card key={simulado.id} className="border-2">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-xl">{simulado.nome}</CardTitle>
                      {getStatusBadge(simulado.status)}
                    </div>
                    <CardDescription className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        {simulado.questoes} questões
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {simulado.dataInicio} até {simulado.dataFim}
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Turmas */}
                <div>
                  <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Turmas atribuídas:
                  </p>
                  <div className="flex gap-2">
                    {simulado.turmas.map((turma, idx) => (
                      <Badge key={idx} variant="outline">{turma}</Badge>
                    ))}
                  </div>
                </div>

                {/* Progresso */}
                {simulado.status !== "agendado" && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progresso de Conclusão</span>
                      <span className="font-medium">
                        {simulado.alunosConcluiram} / {simulado.alunosInscritos} alunos
                        {simulado.alunosInscritos > 0 && 
                          ` (${((simulado.alunosConcluiram / simulado.alunosInscritos) * 100).toFixed(0)}%)`
                        }
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${getProgressoColor(simulado.alunosConcluiram, simulado.alunosInscritos)}`}
                        style={{ 
                          width: simulado.alunosInscritos > 0 
                            ? `${(simulado.alunosConcluiram / simulado.alunosInscritos) * 100}%` 
                            : '0%' 
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Média Geral */}
                {simulado.status === "encerrado" && (
                  <div className="p-4 bg-primary/5 rounded-lg border-l-4 border-primary">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Média Geral da Turma</span>
                      <span className="text-2xl font-bold text-primary">{simulado.mediaGeral.toFixed(1)}%</span>
                    </div>
                  </div>
                )}

                {/* Ações */}
                <div className="flex gap-3 pt-4 border-t">
                  {simulado.status === "ativo" && (
                    <>
                      <Button variant="outline" className="flex-1">
                        Ver Resultados Parciais
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Gerenciar Alunos
                      </Button>
                    </>
                  )}
                  {simulado.status === "encerrado" && (
                    <Button className="flex-1">
                      Ver Relatório Completo
                    </Button>
                  )}
                  {simulado.status === "agendado" && (
                    <>
                      <Button variant="outline" className="flex-1">
                        Editar Configurações
                      </Button>
                      <Button className="flex-1">
                        Atribuir Alunos
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Informações */}
        <Card className="mt-8 border-2 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle>💡 Dicas de Gestão</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-muted-foreground">
            <p>
              • <strong>Simulados Ativos:</strong> Acompanhe o progresso em tempo real e envie lembretes aos alunos
            </p>
            <p>
              • <strong>Simulados Agendados:</strong> Configure com antecedência e atribua às turmas desejadas
            </p>
            <p>
              • <strong>Simulados Encerrados:</strong> Acesse relatórios detalhados e análise por habilidade BNCC
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default GestaoSimulados;

