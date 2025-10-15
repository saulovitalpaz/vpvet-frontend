'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Stethoscope, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { usePublicAuth } from '@/contexts/PublicAuthContext';
import { formatCPF } from '@/lib/utils';

export default function Home() {
  const router = useRouter();
  const { login } = useAuth();
  const { searchResult, loginClient } = usePublicAuth();

  // Partner login state
  const [partnerEmail, setPartnerEmail] = useState('');
  const [partnerPassword, setPartnerPassword] = useState('');
  const [partnerError, setPartnerError] = useState('');
  const [partnerLoading, setPartnerLoading] = useState(false);

  // Public access state
  const [publicCpf, setPublicCpf] = useState('');
  const [publicCode, setPublicCode] = useState('');
  const [publicError, setPublicError] = useState('');
  const [publicLoading, setPublicLoading] = useState(false);

  const handlePartnerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPartnerError('');
    setPartnerLoading(true);

    try {
      await login(partnerEmail, partnerPassword);
    } catch (err: any) {
      setPartnerError(err.response?.data?.error || 'Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setPartnerLoading(false);
    }
  };

  const handlePublicAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setPublicError('');
    setPublicLoading(true);

    try {
      // Try to login as client first - this gives access to full dashboard
      const loginSuccess = await loginClient(publicCpf, publicCode);

      if (loginSuccess) {
        // If login succeeds, redirect to client dashboard
        router.push('/client-dashboard');
      } else {
        // If login fails, fall back to single result lookup
        await searchResult(publicCpf, publicCode);
        router.push('/resultados');
      }
    } catch (err: any) {
      setPublicError(err.message || 'Erro ao consultar resultados.');
    } finally {
      setPublicLoading(false);
    }
  };

  const quickLogin = (userEmail: string, userPassword: string) => {
    setPartnerEmail(userEmail);
    setPartnerPassword(userPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50">
      {/* Hero Section */}
      <section className="px-4 py-16 lg:py-24">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
              <span className="text-white font-bold text-3xl tracking-tight">VP</span>
            </div>
            <div className="text-left">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">VPVET</h1>
              <p className="text-lg text-gray-600">Vital Paz Veterinária</p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 mb-6">
            <Stethoscope className="w-5 h-5 text-emerald-600" />
            Diagnóstico por Imagem Veterinária
          </div>

          
          <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span>Ultrassonografia</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span>Radiologia</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span>Laudos Especializados</span>
            </div>
          </div>
        </div>

        {/* Unified Login Section */}
        <div className="max-w-md mx-auto">
          <Card className="border border-gray-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-sm bg-white/95">
            <CardContent className="p-8">
              {/* Security badge */}
              <div className="mb-7 flex items-center gap-2.5 text-sm text-gray-600">
                <div className="w-8 h-8 rounded-lg border border-emerald-200/60 bg-emerald-50/50 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4 h-4 text-emerald-600" strokeWidth={2.5} />
                </div>
                <span className="font-medium text-gray-700">Acesso seguro e protegido</span>
              </div>

              <Tabs defaultValue="partner" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="partner">Clínicas Parceiras</TabsTrigger>
                  <TabsTrigger value="public">Consultar Resultados</TabsTrigger>
                </TabsList>

                {/* Partner Login */}
                <TabsContent value="partner">
                  <form onSubmit={handlePartnerLogin} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="partner-email" className="text-sm font-medium text-gray-700">
                        Email
                      </Label>
                      <Input
                        id="partner-email"
                        type="email"
                        value={partnerEmail}
                        onChange={(e) => setPartnerEmail(e.target.value)}
                        placeholder="seu@email.com"
                        required
                        disabled={partnerLoading}
                        className="h-11 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 focus:ring-4 transition-all duration-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="partner-password" className="text-sm font-medium text-gray-700">
                        Senha
                      </Label>
                      <Input
                        id="partner-password"
                        type="password"
                        value={partnerPassword}
                        onChange={(e) => setPartnerPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        disabled={partnerLoading}
                        className="h-11 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 focus:ring-4 transition-all duration-200"
                      />
                    </div>

                    {partnerError && (
                      <Alert variant="destructive" className="bg-red-50 border-red-200">
                        <AlertDescription className="text-red-800 text-sm">
                          {partnerError}
                        </AlertDescription>
                      </Alert>
                    )}

                    <Button
                      type="submit"
                      className="w-full h-11 text-base font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-600/30 transition-all duration-200"
                      disabled={partnerLoading}
                    >
                      {partnerLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Entrando...
                        </>
                      ) : (
                        <>
                          Acessar Portal
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </form>

                  {/* Development/Test Mode */}
                  {process.env.NODE_ENV === 'development' && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <p className="text-xs font-medium text-gray-600 mb-3">Acesso rápido (desenvolvimento):</p>
                      <div className="space-y-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => quickLogin('saulo@vpvet.com', 'senha123')}
                          className="w-full text-xs justify-start border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                          disabled={partnerLoading}
                        >
                          <span className="font-semibold mr-2">Dr. Saulo:</span> saulo@vpvet.com
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => quickLogin('maria@petcare.com', 'senha123')}
                          className="w-full text-xs justify-start border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                          disabled={partnerLoading}
                        >
                          <span className="font-semibold mr-2">Secretária:</span> maria@petcare.com
                        </Button>
                      </div>
                    </div>
                  )}
                </TabsContent>

                {/* Public Access */}
                <TabsContent value="public">
                  <form onSubmit={handlePublicAccess} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="public-cpf" className="text-sm font-medium text-gray-700">
                        CPF do Tutor
                      </Label>
                      <Input
                        id="public-cpf"
                        type="text"
                        value={publicCpf}
                        onChange={(e) => setPublicCpf(formatCPF(e.target.value))}
                        placeholder="000.000.000-00"
                        maxLength={14}
                        required
                        disabled={publicLoading}
                        className="h-11 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 focus:ring-4 transition-all duration-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="public-code" className="text-sm font-medium text-gray-700">
                        Código de Acesso
                      </Label>
                      <Input
                        id="public-code"
                        type="text"
                        value={publicCode}
                        onChange={(e) => setPublicCode(e.target.value.toUpperCase())}
                        placeholder="ABC123"
                        maxLength={8}
                        required
                        disabled={publicLoading}
                        className="h-11 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 focus:ring-4 transition-all duration-200 uppercase"
                      />
                      <p className="text-xs text-gray-500">
                        O código foi fornecido pela clínica junto com o resultado
                      </p>
                    </div>

                    {publicError && (
                      <Alert variant="destructive" className="bg-red-50 border-red-200">
                        <AlertDescription className="text-red-800 text-sm">
                          {publicError}
                        </AlertDescription>
                      </Alert>
                    )}

                    <Button
                      type="submit"
                      className="w-full h-11 text-base font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-600/30 transition-all duration-200"
                      disabled={publicLoading}
                    >
                      {publicLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Consultando...
                        </>
                      ) : (
                        'Consultar Resultado'
                      )}
                    </Button>
                  </form>

                  <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200/60">
                    <h3 className="font-semibold text-sm mb-2 text-gray-900">Instruções:</h3>
                    <ul className="text-xs text-gray-700 space-y-1">
                      <li>• O código de acesso é fornecido pela clínica veterinária</li>
                      <li>• Use o CPF do tutor do animal</li>
                      <li>• Os resultados ficam disponíveis por 90 dias</li>
                    </ul>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center text-sm text-gray-600">
            <p>&copy; 2025 VPVET - Vital Paz Veterinária. Dr. Saulo Vital Paz - Diagnóstico por Imagem Veterinária.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}