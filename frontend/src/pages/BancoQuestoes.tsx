import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, CheckCircle, XCircle, AlertCircle, GraduationCap, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BancoQuestoes = () => {
  const navigate = useNavigate();
  const [filtroStatus, setFiltroStatus] = useState("todas");
  const [filtroDisciplina, setFiltroDisciplina] = useState("todas");

  // Mock data - substituir por dados reais da API
  const questoes = [
    {
      id: 1,
      enunciado: "Calcule o valor de x na equação 2x + 5 = 15",
      disciplina: "Matemática",
      tema: "Equações do 1º grau",
      habilidade: "EF09MA09",
      aluno: "João Silva",
      data: "2024-11-09",
      status: "pendente",
      confiabilidade: null
    },
    {
      id: 2,
      enunciado: "Qual é a área de um triângulo com base 10cm e altura 8cm?",
      disciplina: "Matemática",
      tema: "Geometria Plana",
      habilidade: "EF09MA14",
      aluno: "Maria Santos",
      data: "2024-11-08",
      status: "adequada",
      confiabilidade: 95
    },
    {
      id: 3,
      enunciado: "Resolva a inequação 3x - 7 > 2",
      disciplina: "Matemática",
      tema: "Inequações",
      habilidade: "EF09MA10",
      aluno: "Pedro Costa",
      data: "2024-11-08",
      status: "precisa_revisao",
      confiabilidade: 68
    },
    {
      id: 4,
      enunciado: "Calcule o perímetro de um quadrado com lado 5cm",
      disciplina: "Matemática",
      tema: "Geometria Plana",
      habilidade: "EF09MA14",
      aluno: "Ana Oliveira",
      data: "2024-11-07",
      status: "incoerente",
      confiabilidade: 32
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "adequada":
        return <Badge className="bg-green-600 flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Adequada</Badge>;
      case "precisa_revisao":
        return <Badge className="bg-yellow-600 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Precisa Revisão</Badge>;
      case "incoerente":
        return <Badge variant="destructive" className="flex items-center gap-1"><XCircle className="h-3 w-3" /> Incoerente</Badge>;
      default:
        return <Badge variant="outline">Pendente</Badge>;
    }
  };

  const getConfiabilidadeColor = (confiabilidade: number | null) => {
    if (!confiabilidade) return "text-muted-foreground";
    if (confiabilidade >= 80) return "text-green-600";
    if (confiabilidade >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const avaliarQuestao = (id: number, avaliacao: string) => {
    console.log(`Avaliando questão ${id} como ${avaliacao}`);
    // Implementar chamada à API
  };

  const questoesFiltradas = questoes.filter(q => {
    if (filtroStatus !== "todas" && q.status !== filtroStatus) return false;
    if (filtroDisciplina !== "todas" && q.disciplina !== filtroDisciplina) return false;
    return true;
  });

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
            <h1 className="text-xl font-bold">Kora - Banco de Questões</h1>
          </div>
          <div className="w-24"></div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Banco de Questões Geradas</h2>
          <p className="text-muted-foreground">
            Avalie a qualidade das questões geradas automaticamente pelos alunos
          </p>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              <CardTitle>Filtros</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="adequada">Adequada</SelectItem>
                    <SelectItem value="precisa_revisao">Precisa Revisão</SelectItem>
                    <SelectItem value="incoerente">Incoerente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Disciplina</label>
                <Select value={filtroDisciplina} onValueChange={setFiltroDisciplina}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a disciplina" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    <SelectItem value="Matemática">Matemática</SelectItem>
                    <SelectItem value="Português">Português</SelectItem>
                    <SelectItem value="Ciências">Ciências</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button variant="outline" className="w-full" onClick={() => {
                  setFiltroStatus("todas");
                  setFiltroDisciplina("todas");
                }}>
                  Limpar Filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total de Questões</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{questoes.length}</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-yellow-200 bg-yellow-50">
            <CardHeader className="pb-3">
              <CardDescription>Pendentes</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-yellow-600">
                {questoes.filter(q => q.status === "pendente").length}
              </p>
            </CardContent>
          </Card>
          <Card className="border-2 border-green-200 bg-green-50">
            <CardHeader className="pb-3">
              <CardDescription>Adequadas</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">
                {questoes.filter(q => q.status === "adequada").length}
              </p>
            </CardContent>
          </Card>
          <Card className="border-2 border-red-200 bg-red-50">
            <CardHeader className="pb-3">
              <CardDescription>Precisam Revisão</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-600">
                {questoes.filter(q => q.status === "precisa_revisao" || q.status === "incoerente").length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Questões */}
        <div className="space-y-4">
          {questoesFiltradas.map((questao) => (
            <Card key={questao.id} className="border-2">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-lg">Questão #{questao.id}</CardTitle>
                      {getStatusBadge(questao.status)}
                      {questao.confiabilidade && (
                        <span className={`text-sm font-semibold ${getConfiabilidadeColor(questao.confiabilidade)}`}>
                          Confiabilidade: {questao.confiabilidade}%
                        </span>
                      )}
                    </div>
                    <CardDescription>
                      Gerada por <strong>{questao.aluno}</strong> em {questao.data}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-secondary rounded-lg">
                  <p className="text-foreground font-medium">{questao.enunciado}</p>
                </div>

                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Disciplina:</span>
                    <p className="font-medium">{questao.disciplina}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Tema:</span>
                    <p className="font-medium">{questao.tema}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Habilidade BNCC:</span>
                    <p className="font-medium">{questao.habilidade}</p>
                  </div>
                </div>

                {questao.status === "pendente" && (
                  <div className="flex gap-3 pt-4 border-t">
                    <Button 
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => avaliarQuestao(questao.id, "adequada")}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Adequada
                    </Button>
                    <Button 
                      className="flex-1 bg-yellow-600 hover:bg-yellow-700"
                      onClick={() => avaliarQuestao(questao.id, "precisa_revisao")}
                    >
                      <AlertCircle className="mr-2 h-4 w-4" />
                      Precisa Revisão
                    </Button>
                    <Button 
                      variant="destructive"
                      className="flex-1"
                      onClick={() => avaliarQuestao(questao.id, "incoerente")}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Incoerente
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {questoesFiltradas.length === 0 && (
          <Card className="border-2 border-dashed">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Nenhuma questão encontrada com os filtros selecionados.</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default BancoQuestoes;

