import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import StudentMenu from "./pages/StudentMenu";
import StudentFlow from "./pages/StudentFlow";
import Simulados from "./pages/Simulados";
import RaioX from "./pages/RaioX";
import TeacherMenu from "./pages/TeacherMenu";
import TeacherDashboard from "./pages/TeacherDashboard";
import BancoQuestoes from "./pages/BancoQuestoes";
import GerarQuestoes from "./pages/GerarQuestoes";
import GestaoSimulados from "./pages/GestaoSimulados";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/student" element={<StudentMenu />} />
          <Route path="/student/pratica" element={<StudentFlow />} />
          <Route path="/student/simulados" element={<Simulados />} />
          <Route path="/student/raio-x" element={<RaioX />} />
          <Route path="/teacher" element={<TeacherMenu />} />
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          <Route path="/teacher/banco-questoes" element={<BancoQuestoes />} />
          <Route path="/teacher/gerar-questoes" element={<GerarQuestoes />} />
          <Route path="/teacher/simulados" element={<GestaoSimulados />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
