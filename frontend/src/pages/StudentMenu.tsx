import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BookOpen, FileText, GraduationCap, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const StudentMenu = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: "Prática Inteligente",
      description: "Cole uma questão e gere questões similares para praticar",
      icon: BookOpen,
      path: "/student/pratica",
      color: "bg-blue-500",
      badge: null
    },
    {
      title: "Simulados",
      description: "Resolva simulados completos e teste seus conhecimentos",
      icon: FileText,
      path: "/student/simulados",
      color: "bg-green-500",
      badge: "3 disponíveis"
    },
    {
      title: "Raio-X",
      description: "Acompanhe sua evolução e veja seu histórico completo",
      icon: Zap,
      path: "/student/raio-x",
      color: "bg-primary",
      badge: null
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold">Kora - Área do Aluno</h1>
          </div>
          <div className="w-24"></div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-3">Bem-vindo à sua área de estudos</h2>
          <p className="text-xl text-muted-foreground">
            Escolha como você quer praticar hoje
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Card 
                key={idx} 
                className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-primary/50 group"
                onClick={() => navigate(item.path)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 ${item.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    {item.badge && (
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-2xl mb-2">{item.title}</CardTitle>
                  <CardDescription className="text-base">
                    {item.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" size="lg">
                    Acessar
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Estatísticas Rápidas */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>📊 Suas Estatísticas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-foreground">12</p>
                <p className="text-sm text-muted-foreground mt-1">Práticas realizadas</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">72.5%</p>
                <p className="text-sm text-muted-foreground mt-1">Taxa de acerto</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">+12%</p>
                <p className="text-sm text-muted-foreground mt-1">Evolução</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dica do Dia */}
        <Card className="mt-6 border-2 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle>💡 Dica do Dia</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              A prática regular é fundamental para o aprendizado. Tente resolver pelo menos 
              <strong> 3 questões por dia</strong> para manter o ritmo e consolidar os conceitos!
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default StudentMenu;

