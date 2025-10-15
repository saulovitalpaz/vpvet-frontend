'use client';

import { FormEvent, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePublicAuth } from '@/contexts/PublicAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatCPF } from '@/lib/utils';
import { FileText, Download, CheckCircle2, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface ExamResult {
  id: string;
  animal_name: string;
  exam_type: string;
  exam_date: string;
  findings: string;
  impression: string;
  pdf_url?: string;
  veterinarian: string;
}

export default function ResultadosPage() {
  const router = useRouter();
  const { clientData, resultData, loading, error, searchResult, clearResult, loginClient } = usePublicAuth();

  const [cpf, setCpf] = useState('');
  const [code, setCode] = useState('');

  // Redirect authenticated clients to dashboard
  useEffect(() => {
    if (clientData) {
      router.replace('/client-dashboard');
    }
  }, [clientData, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Try to login as client first - this gives access to full dashboard
    const loginSuccess = await loginClient(cpf, code);

    if (!loginSuccess) {
      // If login fails, fall back to single result lookup
      await searchResult(cpf, code);
    }
  };

  const handleReset = () => {
    clearResult();
    setCpf('');
    setCode('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50">
      {/* Simple Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-all duration-200 group">
            <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
            Voltar para início
          </Link>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">VP</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">VPVET</h1>
              <p className="text-xs text-gray-600">Consulta de Resultados</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="border border-gray-200/60 shadow-sm">
            {!resultData ? (
              <>
                <CardHeader className="text-center p-6 sm:p-8">
                  <CardTitle className="text-xl sm:text-2xl font-semibold text-gray-900">Consulta de Resultados de Exames</CardTitle>
                  <CardDescription className="mt-2 text-sm sm:text-base text-gray-600">
                    Digite o CPF do tutor e o código de acesso fornecido pela clínica
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 sm:pt-8 p-4 sm:p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="cpf" className="text-sm font-medium text-gray-700">CPF do Tutor</Label>
                      <Input
                        id="cpf"
                        type="text"
                        value={cpf}
                        onChange={(e) => setCpf(formatCPF(e.target.value))}
                        placeholder="000.000.000-00"
                        maxLength={14}
                        required
                        disabled={loading}
                        className="text-lg h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="code" className="text-sm font-medium text-gray-700">Código de Acesso</Label>
                      <Input
                        id="code"
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        placeholder="ABC123"
                        maxLength={8}
                        required
                        disabled={loading}
                        className="text-lg uppercase h-12"
                      />
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                        O código foi fornecido pela clínica junto com o resultado
                      </p>
                    </div>

                    {error && (
                      <Alert variant="destructive" className="bg-red-50 border-red-200">
                        <AlertDescription className="text-red-800">{error}</AlertDescription>
                      </Alert>
                    )}

                    <Button
                      type="submit"
                      className="w-full h-12 text-base sm:text-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Consultando...
                        </>
                      ) : (
                        'Consultar Resultado'
                      )}
                    </Button>
                  </form>

                  <div className="mt-6 sm:mt-8 p-4 sm:p-5 bg-gray-50 rounded-lg border border-gray-200/60">
                    <h3 className="font-semibold text-sm mb-3 text-gray-900">Instruções:</h3>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 flex-shrink-0"></span>
                        <span>O código de acesso é fornecido pela clínica veterinária</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 flex-shrink-0"></span>
                        <span>Use o CPF do tutor do animal</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 flex-shrink-0"></span>
                        <span>Os resultados ficam disponíveis por 90 dias</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </>
            ) : (
              <>
                <CardHeader className="border-b p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-gray-700" />
                      </div>
                      <CardTitle className="text-xl sm:text-2xl font-semibold text-gray-900">Resultado do Exame</CardTitle>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleReset} className="gap-2 w-full sm:w-auto">
                      <FileText className="w-4 h-4" />
                      Nova Consulta
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 pt-6 p-4 sm:p-6">
                  {/* Patient Info */}
                  <div className="bg-gray-50 p-4 sm:p-5 rounded-lg border border-gray-200/60">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Paciente</p>
                        <p className="font-bold text-gray-900 mt-1">{resultData.animal_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Data do Exame</p>
                        <p className="font-bold text-gray-900 mt-1">{new Date(resultData.exam_date).toLocaleDateString('pt-BR')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Tipo de Exame</p>
                        <p className="font-bold text-gray-900 mt-1">{resultData.exam_type}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Veterinário</p>
                        <p className="font-bold text-gray-900 mt-1">{resultData.veterinarian}</p>
                      </div>
                    </div>
                  </div>

                  {/* Findings */}
                  <div>
                    <h3 className="font-semibold text-base sm:text-lg mb-3 text-gray-900">
                      Achados do Exame
                    </h3>
                    <div className="bg-gray-50 border border-gray-200/60 rounded-lg p-4 sm:p-5">
                      <p className="whitespace-pre-wrap text-gray-700 leading-relaxed text-sm sm:text-base">{resultData.findings}</p>
                    </div>
                  </div>

                  {/* Impression */}
                  <div>
                    <h3 className="font-semibold text-base sm:text-lg mb-3 text-gray-900">
                      Impressão Diagnóstica
                    </h3>
                    <div className="bg-gray-50 border border-gray-200/60 rounded-lg p-4 sm:p-5">
                      <p className="whitespace-pre-wrap text-gray-700 leading-relaxed text-sm sm:text-base">{resultData.impression}</p>
                    </div>
                  </div>

                  {/* PDF Download */}
                  {resultData.pdf_url && (
                    <div className="pt-4 border-t">
                      <a href={resultData.pdf_url} target="_blank" rel="noopener noreferrer" className="block">
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium" size="lg">
                          <Download className="mr-2 h-5 w-5" />
                          Baixar Laudo Completo (PDF)
                        </Button>
                      </a>
                    </div>
                  )}

                  {/* Important Notice */}
                  <Alert className="bg-yellow-50 border-yellow-200">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    <AlertDescription className="text-xs sm:text-sm text-yellow-900 font-medium ml-2">
                      <strong>Importante:</strong> Este resultado é apenas para fins informativos. Consulte sempre o médico veterinário responsável para interpretação e orientações de tratamento.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </>
            )}
          </Card>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="border-t bg-gray-50 mt-16">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center text-sm text-gray-600">
            <p>&copy; 2025 VPVET - Vital Paz Veterinária. Dr. Saulo Vital Paz - Diagnóstico por Imagem Veterinária.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}