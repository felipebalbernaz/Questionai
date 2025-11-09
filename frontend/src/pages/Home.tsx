import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, BarChart3, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">KORA</h1>
          </div>
          <nav className="flex gap-4">
            <Button variant="ghost" onClick={() => navigate("/student")}>
              Área do Aluno
            </Button>
            <Button variant="ghost" onClick={() => navigate("/teacher")}>
              Área do Professor
            </Button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-foreground mb-4">
            Plataforma dos Cursinhos Populares
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Geração inteligente de questões baseadas na BNCC para potencializar o aprendizado
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/student")}>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Área do Aluno</CardTitle>
              <CardDescription>
                Pratique com questões geradas automaticamente e receba feedback personalizado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => navigate("/student")}>
                Começar Prática
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/teacher")}>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Área do Professor</CardTitle>
              <CardDescription>
                Acompanhe o desempenho dos alunos e identifique oportunidades de melhoria
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => navigate("/teacher")}>
                Ver Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">IA Generativa</h3>
            <p className="text-muted-foreground">
              Gere questões similares baseadas na BNCC automaticamente
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Relatórios Detalhados</h3>
            <p className="text-muted-foreground">
              Análise completa do desempenho com feedback personalizado
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Acompanhamento</h3>
            <p className="text-muted-foreground">
              Monitore o progresso e identifique áreas de melhoria
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
