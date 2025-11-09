import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getTeacherDashboardData } from "@/utils/mockData";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const data = getTeacherDashboardData();

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend === "down") return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const getPerformanceBadge = (percent: number) => {
    if (percent >= 80) return <Badge className="bg-green-600">Excelente</Badge>;
    if (percent >= 60) return <Badge className="bg-blue-600">Bom</Badge>;
    if (percent >= 40) return <Badge className="bg-yellow-600">Regular</Badge>;
    return <Badge variant="destructive">Precisa Melhorar</Badge>;
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <h1 className="text-xl font-bold">Dashboard do Professor</h1>
          <div className="w-24" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total de Alunos</CardDescription>
              <CardTitle className="text-3xl">{data.totalAlunos}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Sessões Completadas</CardDescription>
              <CardTitle className="text-3xl">{data.totalSessoes}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Média Geral</CardDescription>
              <CardTitle className="text-3xl text-primary">{data.mediaGeral.toFixed(1)}%</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Questões Respondidas</CardDescription>
              <CardTitle className="text-3xl">{data.totalQuestoes}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Desempenho por Habilidade BNCC</CardTitle>
            <CardDescription>Média de acertos dos alunos por habilidade</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.habilidadesPorDesempenho.map((hab) => (
                <div key={hab.habilidade}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">{hab.habilidade}</span>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(hab.tendencia)}
                      <span className="text-sm font-semibold">{hab.percentual.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${hab.percentual}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Desempenho Individual dos Alunos</CardTitle>
            <CardDescription>Acompanhamento detalhado por aluno</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aluno</TableHead>
                  <TableHead className="text-center">Sessões</TableHead>
                  <TableHead className="text-center">Questões</TableHead>
                  <TableHead className="text-center">Acertos</TableHead>
                  <TableHead className="text-center">Aproveitamento</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead>Habilidades a Revisar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.alunos.map((aluno) => (
                  <TableRow key={aluno.id}>
                    <TableCell className="font-medium">{aluno.nome}</TableCell>
                    <TableCell className="text-center">{aluno.sessoesCompletadas}</TableCell>
                    <TableCell className="text-center">{aluno.totalQuestoes}</TableCell>
                    <TableCell className="text-center">{aluno.totalAcertos}</TableCell>
                    <TableCell className="text-center">
                      <span className="font-semibold">{aluno.percentualAcerto.toFixed(1)}%</span>
                    </TableCell>
                    <TableCell className="text-center">
                      {getPerformanceBadge(aluno.percentualAcerto)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {aluno.habilidadesRevisar.slice(0, 2).map((hab, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {hab}
                          </Badge>
                        ))}
                        {aluno.habilidadesRevisar.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{aluno.habilidadesRevisar.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default TeacherDashboard;
