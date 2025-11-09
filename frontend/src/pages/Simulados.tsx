import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Clock, FileText, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Simulados = () => {
  const navigate = useNavigate();
  const [simulados] = useState([
    {
      id: 1,
      titulo: "Simulado ENEM - Matemática",
      descricao: "45 questões de matemática e suas tecnologias",
      questoes: 45,
      tempo: "90 min",
      status: "disponivel",
      progresso: 0
    },
    {
      id: 2,
      titulo: "Simulado BNCC - 9º Ano",
      descricao: "30 questões baseadas nas habilidades do 9º ano",
      questoes: 30,
      tempo: "60 min",
      status: "em_andamento",
      progresso: 45
    },
    {
      id: 3,
      titulo: "Simulado Geometria",
      descricao: "20 questões focadas em geometria plana e espacial",
      questoes: 20,
      tempo: "40 min",
      status: "concluido",
      progresso: 100
    }
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "disponivel":
        return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Disponível</span>;
      case "em_andamento":
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">Em Andamento</span>;
      case "concluido":
        return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">Concluído</span>;
      default:
        return null;
    }
  };

  const getButtonText = (status: string) => {
    switch (status) {
      case "disponivel":
        return "Iniciar Simulado";
      case "em_andamento":
        return "Continuar";
      case "concluido":
        return "Ver Raio-X";
      default:
        return "Iniciar";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/student")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold">Kora - Simulados</h1>
          </div>
          <div className="w-24"></div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Simulados Disponíveis</h2>
          <p className="text-muted-foreground">
            Pratique com simulados completos e receba um Raio-X detalhado do seu desempenho
          </p>
        </div>

        <div className="grid gap-6">
          {simulados.map((simulado) => (
            <Card key={simulado.id} className="hover:shadow-lg transition-all border-2">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-xl">{simulado.titulo}</CardTitle>
                      {getStatusBadge(simulado.status)}
                    </div>
                    <CardDescription className="text-base">{simulado.descricao}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span>{simulado.questoes} questões</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{simulado.tempo}</span>
                    </div>
                  </div>

                  {simulado.status === "em_andamento" && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progresso</span>
                        <span className="font-medium">{simulado.progresso}%</span>
                      </div>
                      <Progress value={simulado.progresso} className="h-2" />
                    </div>
                  )}

                  <Button 
                    className="w-full" 
                    size="lg"
                    variant={simulado.status === "concluido" ? "outline" : "default"}
                  >
                    {getButtonText(simulado.status)}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8 border-2 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle>💡 Dica</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Ao finalizar um simulado, você receberá um <strong>Raio-X completo</strong> com:
              análise por habilidade BNCC, correção detalhada de cada questão e recomendações
              pedagógicas personalizadas.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Simulados;

