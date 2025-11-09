import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { iniciarSessao, submeterRespostas } from "@/utils/api";
import type { Questao, Relatorio } from "@/utils/types";

const StudentFlow = () => {
  const [step, setStep] = useState(1);
  const [questionText, setQuestionText] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [respostas, setRespostas] = useState<Record<string, string>>({});
  const [relatorio, setRelatorio] = useState<Relatorio | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleGenerateQuestions = async () => {
    if (!questionText.trim()) {
      toast({ title: "Erro", description: "Digite uma questão", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const result = await iniciarSessao(questionText);
      setSessionId(result.session_id);
      setQuestoes(result.questoes_geradas);
      setStep(2);
      toast({ title: "Sucesso!", description: "Questões geradas com sucesso" });
    } catch (error) {
      toast({ title: "Erro", description: "Falha ao gerar questões", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (Object.keys(respostas).length !== questoes.length) {
      toast({ title: "Atenção", description: "Responda todas as questões", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const result = await submeterRespostas(sessionId!, respostas);
      setRelatorio(result.relatorio_diagnostico);
      setStep(3);
      toast({ title: "Sucesso!", description: "Respostas enviadas!" });
    } catch (error) {
      toast({ title: "Erro", description: "Falha ao enviar respostas", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const resetSession = () => {
    setStep(1);
    setQuestionText("");
    setSessionId(null);
    setQuestoes([]);
    setRespostas({});
    setRelatorio(null);
  };

  const downloadReport = () => {
    const dataStr = JSON.stringify(relatorio, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'relatorio.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <h1 className="text-xl font-bold">KORA - Área do Aluno</h1>
          <Button variant="outline" onClick={resetSession}>Nova Sessão</Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Progress value={(step / 3) * 100} className="h-2" />
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span className={step >= 1 ? "text-primary font-semibold" : ""}>1. Cole a Questão</span>
            <span className={step >= 2 ? "text-primary font-semibold" : ""}>2. Responda</span>
            <span className={step >= 3 ? "text-primary font-semibold" : ""}>3. Relatório</span>
          </div>
        </div>

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Passo 1: Cole a Questão</CardTitle>
              <CardDescription>
                Cole uma questão de referência e geraremos 3 questões similares para você praticar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Cole sua questão aqui..."
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                rows={8}
                className="resize-none"
              />
              <Button onClick={handleGenerateQuestions} disabled={loading} className="w-full">
                {loading ? "Gerando..." : "Gerar Questões"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Passo 2: Responda as Questões</CardTitle>
                <CardDescription>
                  Total: {questoes.length} questões | Respondidas: {Object.keys(respostas).length}
                </CardDescription>
              </CardHeader>
            </Card>

            {questoes.map((questao, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle className="text-lg">Questão {idx + 1}</CardTitle>
                  <p className="text-foreground mt-2">{questao.enunciado}</p>
                  {questao.habilidades_combinadas && (
                    <p className="text-xs text-muted-foreground mt-2">
                      BNCC: {questao.habilidades_combinadas.join(", ")}
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={respostas[String(idx + 1)]}
                    onValueChange={(value) => setRespostas({ ...respostas, [String(idx + 1)]: value })}
                  >
                    {Object.entries(questao.alternativas).map(([letra, texto]) => (
                      <div key={letra} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-accent">
                        <RadioGroupItem value={letra} id={`q${idx}-${letra}`} />
                        <Label htmlFor={`q${idx}-${letra}`} className="cursor-pointer flex-1">
                          {letra}) {texto}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>
            ))}

            <Button onClick={handleSubmit} disabled={loading} className="w-full">
              {loading ? "Enviando..." : "Submeter Respostas"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {step === 3 && relatorio && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Passo 3: Seu Relatório</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-secondary rounded-lg">
                    <p className="text-2xl font-bold text-foreground">{relatorio.total_questoes}</p>
                    <p className="text-sm text-muted-foreground">Total</p>
                  </div>
                  <div className="text-center p-4 bg-secondary rounded-lg">
                    <p className="text-2xl font-bold text-primary">{relatorio.total_acertos}</p>
                    <p className="text-sm text-muted-foreground">Acertos</p>
                  </div>
                  <div className="text-center p-4 bg-secondary rounded-lg">
                    <p className="text-2xl font-bold text-foreground">{relatorio.percentual_acerto.toFixed(1)}%</p>
                    <p className="text-sm text-muted-foreground">Aproveitamento</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-primary/5 rounded-lg border-l-4 border-primary">
                    <h3 className="font-semibold mb-2">Resumo</h3>
                    <p className="text-muted-foreground">{relatorio.resumo}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Correção Detalhada</h3>
                    <div className="space-y-2">
                      {relatorio.correcao_detalhada.map((item, idx) => (
                        <Card key={idx}>
                          <CardHeader>
                            <CardTitle className="text-sm flex items-center gap-2">
                              <span className={item.acertou ? "text-green-600" : "text-red-600"}>
                                {item.acertou ? "✓" : "✗"}
                              </span>
                              {item.questao.substring(0, 80)}...
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="text-sm space-y-2">
                            <p><strong>Sua resposta:</strong> {item.sua_resposta}</p>
                            <p><strong>Gabarito:</strong> {item.gabarito_correto}</p>
                            <p className="text-muted-foreground">{item.feedback}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-secondary rounded-lg">
                    <h3 className="font-semibold mb-2">Habilidades a Revisar</h3>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {relatorio.habilidades_a_revisar.map((hab, idx) => (
                        <li key={idx}>{hab}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-secondary rounded-lg">
                    <h3 className="font-semibold mb-2">Recomendações</h3>
                    <p className="text-muted-foreground">{relatorio.recomendacoes}</p>
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <Button onClick={downloadReport} variant="outline" className="flex-1">
                    <Download className="mr-2 h-4 w-4" />
                    Baixar JSON
                  </Button>
                  <Button onClick={resetSession} className="flex-1">
                    Nova Sessão
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentFlow;
