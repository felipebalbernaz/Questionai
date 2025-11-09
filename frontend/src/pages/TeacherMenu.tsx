import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BarChart3, BookOpen, FileText, GraduationCap, Library, PenTool } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TeacherMenu = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: "Raio-X",
      description: "Acompanhe o desempenho dos alunos e estatísticas gerais",
      icon: BarChart3,
      path: "/teacher/dashboard",
      color: "bg-blue-500",
      badge: null
    },
    {
      title: "Banco de Questões",
      description: "Visualize e avalie questões geradas pelos alunos",
      icon: Library,
      path: "/teacher/banco-questoes",
      color: "bg-purple-500",
      badge: "24 pendentes"
    },
    {
      title: "Gerador",
      description: "Crie questões personalizadas e simulados completos",
      icon: PenTool,
      path: "/teacher/gerar-questoes",
      color: "bg-green-500",
      badge: null
    },
    {
      title: " Gerenciar Simulados",
      description: "Gerencie simulados e atribua às turmas",
      icon: FileText,
      path: "/teacher/simulados",
      color: "bg-orange-500",
      badge: "5 ativos"
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
            <h1 className="text-xl font-bold">Kora - Área do Professor</h1>
          </div>
          <div className="w-24"></div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-3">Área do Professor</h2>
          <p className="text-xl text-muted-foreground">
            Gerencie questões, simulados e acompanhe o desempenho dos alunos
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
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
                  <CardTitle className="text-xl mb-2">{item.title}</CardTitle>
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
            <CardTitle>📊 Visão Geral</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-foreground">45</p>
                <p className="text-sm text-muted-foreground mt-1">Alunos ativos</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">156</p>
                <p className="text-sm text-muted-foreground mt-1">Questões geradas</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">89%</p>
                <p className="text-sm text-muted-foreground mt-1">Taxa de aprovação</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-orange-600">5</p>
                <p className="text-sm text-muted-foreground mt-1">Simulados ativos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Avisos */}
        <Card className="mt-6 border-2 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle>💡 Avisos Importantes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-muted-foreground">
              <li>• <strong>24 questões</strong> aguardando avaliação no Banco de Questões</li>
              <li>• <strong>Simulado ENEM 2024</strong> termina em 3 dias</li>
              <li>• <strong>5 alunos</strong> com desempenho abaixo de 60% - considere intervenção pedagógica</li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default TeacherMenu;

