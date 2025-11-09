import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download, GraduationCap, TrendingUp, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RaioX = () => {
  const navigate = useNavigate();

  // Mock data - substituir por dados reais da API
  const estatisticas = {
    totalPraticas: 12,
    totalQuestoes: 36,
    taxaAcerto: 72.5,
    habilidadesMaisDesafiadoras: [
      "EF09MA08 - Proporcionalidade e escalas",
      "EF09MA14 - Geometria espacial",
      "EF09MA03 - Operações com números reais"
    ]
  };

  const historico = [
    {
      id: 1,
      data: "2024-11-09",
      tipo: "Prática Inteligente",
      questoes: 3,
      acertos: 2,
      percentual: 66.7
    },
    {
      id: 2,
      data: "2024-11-08",
      tipo: "Simulado ENEM",
      questoes: 45,
      acertos: 34,
      percentual: 75.6
    },
    {
      id: 3,
      data: "2024-11-07",
      tipo: "Prática Inteligente",
      questoes: 3,
      acertos: 3,
      percentual: 100
    }
  ];

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
            <h1 className="text-xl font-bold">Kora - Raio-X</h1>
          </div>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Baixar PDF
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold">Seu Raio-X Completo</h2>
          </div>
          <p className="text-muted-foreground">
            Acompanhe sua evolução e identifique áreas de melhoria
          </p>
        </div>

        {/* Estatísticas Gerais */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="border-2">
            <CardHeader className="pb-3">
              <CardDescription>Total de Práticas</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-foreground">{estatisticas.totalPraticas}</p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="pb-3">
              <CardDescription>Questões Resolvidas</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-foreground">{estatisticas.totalQuestoes}</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20 bg-primary/5">
            <CardHeader className="pb-3">
              <CardDescription>Taxa de Acerto</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-primary">{estatisticas.taxaAcerto}%</p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="pb-3">
              <CardDescription>Evolução</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-green-600" />
                <p className="text-4xl font-bold text-green-600">+12%</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráfico de Evolução - Placeholder */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Evolução por Habilidade BNCC</CardTitle>
            <CardDescription>Acompanhe seu progresso ao longo do tempo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-secondary rounded-lg">
              <p className="text-muted-foreground">Gráfico de evolução (em desenvolvimento)</p>
            </div>
          </CardContent>
        </Card>

        {/* Habilidades Mais Desafiadoras */}
        <Card className="mb-8 border-2 border-primary/20">
          <CardHeader>
            <CardTitle>📚 Habilidades BNCC Mais Desafiadoras</CardTitle>
            <CardDescription>Áreas que precisam de mais atenção</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {estatisticas.habilidadesMaisDesafiadoras.map((hab, idx) => (
                <li key={idx} className="flex items-start gap-3 p-3 bg-secondary rounded-lg">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {idx + 1}
                  </span>
                  <span className="text-foreground">{hab}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Histórico de Práticas */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Práticas e Simulados</CardTitle>
            <CardDescription>Suas últimas atividades</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {historico.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/50 transition-colors">
                  <div className="flex-1">
                    <p className="font-semibold">{item.tipo}</p>
                    <p className="text-sm text-muted-foreground">{item.data}</p>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <p className="font-semibold">{item.questoes}</p>
                      <p className="text-muted-foreground">questões</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold">{item.acertos}</p>
                      <p className="text-muted-foreground">acertos</p>
                    </div>
                    <div className="text-center min-w-[80px]">
                      <p className={`text-2xl font-bold ${item.percentual >= 70 ? 'text-green-600' : 'text-yellow-600'}`}>
                        {item.percentual.toFixed(1)}%
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recomendações */}
        <Card className="mt-8 border-2 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle>💡 Recomendações Pedagógicas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              Com base no seu desempenho, recomendamos focar em <strong>geometria espacial</strong> e 
              <strong> proporcionalidade</strong>. Continue praticando regularmente para consolidar 
              os conceitos. Sua evolução tem sido consistente - mantenha o ritmo!
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default RaioX;

