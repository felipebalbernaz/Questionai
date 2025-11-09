import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, BarChart3, Sparkles, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Kora</h1>
              <p className="text-xs text-muted-foreground">inteligência educacional</p>
            </div>
          </div>
          <nav className="flex gap-3">
            <Button variant="ghost" onClick={() => navigate("/student")}>
              Área do Aluno
            </Button>
            <Button onClick={() => navigate("/teacher")}>
              Área do Professor
            </Button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-foreground mb-4">
            Kora — inteligência educacional para cursinhos populares
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Geração inteligente de questões e diagnóstico pedagógico baseado na BNCC
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          <Card className="hover:shadow-lg transition-all hover:border-primary/50 cursor-pointer border-2" onClick={() => navigate("/student")}>
            <CardHeader>
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <BookOpen className="h-7 w-7 text-primary" />
              </div>
              <CardTitle className="text-2xl">Área do Aluno</CardTitle>
              <CardDescription className="text-base">
                Pratique com questões geradas automaticamente e receba feedback personalizado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" size="lg" onClick={() => navigate("/student")}>
                Começar prática
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all hover:border-primary/50 cursor-pointer border-2" onClick={() => navigate("/teacher")}>
            <CardHeader>
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Users className="h-7 w-7 text-primary" />
              </div>
              <CardTitle className="text-2xl">Área do Professor</CardTitle>
              <CardDescription className="text-base">
                Acompanhe o desempenho dos alunos e identifique oportunidades de melhoria
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" size="lg" onClick={() => navigate("/teacher")}>
                Ver Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center p-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">IA Generativa</h3>
            <p className="text-muted-foreground">
              Gere questões similares baseadas na BNCC automaticamente
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Raio-X Pedagógico</h3>
            <p className="text-muted-foreground">
              Análise completa do desempenho com feedback personalizado
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Acompanhamento</h3>
            <p className="text-muted-foreground">
              Monitore o progresso e identifique áreas de melhoria
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Desenvolvido com ❤️ para a educação popular brasileira</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
