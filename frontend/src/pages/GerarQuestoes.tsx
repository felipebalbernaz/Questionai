import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, GraduationCap, Sparkles, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const GerarQuestoes = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [modo, setModo] = useState<"individual" | "simulado">("individual");
  const [disciplina, setDisciplina] = useState("");
  const [tema, setTema] = useState("");
  const [habilidade, setHabilidade] = useState("");
  const [quantidade, setQuantidade] = useState("3");
  const [questaoReferencia, setQuestaoReferencia] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGerar = async () => {
    if (!disciplina || !tema) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha disciplina e tema para continuar",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    // Simular geração
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Questões geradas com sucesso!",
        description: `${quantidade} questão(ões) de ${disciplina} - ${tema} foram geradas.`
      });
    }, 2000);
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
            <h1 className="text-xl font-bold">Kora - Gerar Questões</h1>
          </div>
          <div className="w-24"></div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Gerador de Questões</h2>
          <p className="text-muted-foreground">
            Crie questões personalizadas ou simulados completos baseados na BNCC
          </p>
        </div>

        {/* Seletor de Modo */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <Card 
            className={`cursor-pointer border-2 transition-all ${modo === "individual" ? "border-primary bg-primary/5" : "hover:border-primary/50"}`}
            onClick={() => setModo("individual")}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${modo === "individual" ? "bg-primary" : "bg-secondary"}`}>
                  <Sparkles className={`h-6 w-6 ${modo === "individual" ? "text-white" : "text-muted-foreground"}`} />
                </div>
                <div>
                  <CardTitle>Questões Individuais</CardTitle>
                  <CardDescription>Gere questões específicas</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card 
            className={`cursor-pointer border-2 transition-all ${modo === "simulado" ? "border-primary bg-primary/5" : "hover:border-primary/50"}`}
            onClick={() => setModo("simulado")}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${modo === "simulado" ? "bg-primary" : "bg-secondary"}`}>
                  <FileText className={`h-6 w-6 ${modo === "simulado" ? "text-white" : "text-muted-foreground"}`} />
                </div>
                <div>
                  <CardTitle>Simulado Completo</CardTitle>
                  <CardDescription>Crie um simulado com múltiplas questões</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Formulário */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>
              {modo === "individual" ? "Configurar Questões" : "Configurar Simulado"}
            </CardTitle>
            <CardDescription>
              Preencha os campos abaixo para gerar {modo === "individual" ? "questões" : "um simulado"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Filtros Básicos */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="disciplina">Disciplina *</Label>
                <Select value={disciplina} onValueChange={setDisciplina}>
                  <SelectTrigger id="disciplina">
                    <SelectValue placeholder="Selecione a disciplina" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="matematica">Matemática</SelectItem>
                    <SelectItem value="portugues">Português</SelectItem>
                    <SelectItem value="ciencias">Ciências</SelectItem>
                    <SelectItem value="historia">História</SelectItem>
                    <SelectItem value="geografia">Geografia</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tema">Tema *</Label>
                <Select value={tema} onValueChange={setTema}>
                  <SelectTrigger id="tema">
                    <SelectValue placeholder="Selecione o tema" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="algebra">Álgebra</SelectItem>
                    <SelectItem value="geometria">Geometria</SelectItem>
                    <SelectItem value="proporcionalidade">Proporcionalidade</SelectItem>
                    <SelectItem value="estatistica">Estatística</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="habilidade">Habilidade BNCC (opcional)</Label>
              <Select value={habilidade} onValueChange={setHabilidade}>
                <SelectTrigger id="habilidade">
                  <SelectValue placeholder="Selecione uma habilidade específica" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EF09MA08">EF09MA08 - Proporcionalidade e escalas</SelectItem>
                  <SelectItem value="EF09MA09">EF09MA09 - Equações do 1º grau</SelectItem>
                  <SelectItem value="EF09MA10">EF09MA10 - Inequações</SelectItem>
                  <SelectItem value="EF09MA14">EF09MA14 - Geometria espacial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantidade">
                {modo === "individual" ? "Quantidade de Questões" : "Número de Questões no Simulado"}
              </Label>
              <Input
                id="quantidade"
                type="number"
                min="1"
                max={modo === "individual" ? "10" : "50"}
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                {modo === "individual" ? "Máximo: 10 questões" : "Recomendado: 20-45 questões"}
              </p>
            </div>

            {modo === "individual" && (
              <div className="space-y-2">
                <Label htmlFor="referencia">Questão de Referência (opcional)</Label>
                <Textarea
                  id="referencia"
                  placeholder="Cole uma questão de referência para gerar questões similares..."
                  value={questaoReferencia}
                  onChange={(e) => setQuestaoReferencia(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Se fornecida, as questões geradas serão similares a esta
                </p>
              </div>
            )}

            {modo === "simulado" && (
              <div className="space-y-2">
                <Label htmlFor="nome-simulado">Nome do Simulado</Label>
                <Input
                  id="nome-simulado"
                  placeholder="Ex: Simulado ENEM 2024 - Matemática"
                />
              </div>
            )}

            <Button 
              className="w-full" 
              size="lg"
              onClick={handleGerar}
              disabled={loading}
            >
              {loading ? (
                "Gerando..."
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  {modo === "individual" ? "Gerar Questões" : "Criar Simulado"}
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Informações */}
        <Card className="mt-6 border-2 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle>💡 Como Funciona</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-muted-foreground">
            <p>
              <strong>Questões Individuais:</strong> Gere questões específicas para praticar temas pontuais. 
              Você pode fornecer uma questão de referência para criar questões similares.
            </p>
            <p>
              <strong>Simulado Completo:</strong> Crie um simulado com múltiplas questões baseadas nos 
              filtros selecionados. Ideal para avaliações e preparação para provas.
            </p>
            <p className="text-sm pt-2 border-t">
              ⚠️ As questões são geradas automaticamente usando IA e baseadas na BNCC. 
              Recomendamos revisar as questões antes de aplicá-las aos alunos.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default GerarQuestoes;

