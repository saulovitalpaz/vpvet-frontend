'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showTestAccounts, setShowTestAccounts] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = (userEmail: string, userPassword: string) => {
    setEmail(userEmail);
    setPassword(userPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50/50 px-4 py-8">
      <div className="w-full max-w-md">
        {/* Back to home */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-8 transition-all duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
          Voltar para início
        </Link>

        <Card className="border border-gray-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-sm bg-white/95">
          <CardContent className="p-8">
            {/* Logo and branding */}
            <div className="flex flex-col items-center mb-7">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-600/20 ring-1 ring-emerald-600/10">
                <span className="text-white font-bold text-2xl tracking-tight">VP</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">VPVET</h1>
              <p className="text-sm text-gray-500 mt-1.5">Sistema de Gestão Veterinária</p>
            </div>

            {/* Security badge */}
            <div className="mb-7 flex items-center gap-2.5 text-sm text-gray-600">
              <div className="w-8 h-8 rounded-lg border border-emerald-200/60 bg-emerald-50/50 flex items-center justify-center flex-shrink-0">
                <Shield className="w-4 h-4 text-emerald-600" strokeWidth={2.5} />
              </div>
              <span className="font-medium text-gray-700">Acesso seguro e protegido</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  disabled={isLoading}
                  className="h-11 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 focus:ring-4 transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                  className="h-11 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 focus:ring-4 transition-all duration-200"
                />
              </div>

              {error && (
                <Alert variant="destructive" className="bg-red-50 border-red-200">
                  <AlertDescription className="text-red-800 text-sm">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full h-11 text-base font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-600/30 transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  'Entrar no Sistema'
                )}
              </Button>
            </form>

            {/* Development/Test Mode Toggle */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowTestAccounts(!showTestAccounts)}
                  className="text-xs text-gray-500 hover:text-gray-700 font-medium w-full text-center transition-colors"
                >
                  {showTestAccounts ? 'Ocultar' : 'Mostrar'} contas de teste
                </button>

                {showTestAccounts && (
                  <div className="mt-4 space-y-2">
                    <p className="text-xs font-medium text-gray-600 mb-3">Acesso rápido (desenvolvimento):</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => quickLogin('saulo@vpvet.com', 'senha123')}
                      className="w-full text-xs justify-start border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                      disabled={isLoading}
                    >
                      <span className="font-semibold mr-2">Dr. Saulo:</span> saulo@vpvet.com
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => quickLogin('maria@petcare.com', 'senha123')}
                      className="w-full text-xs justify-start border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                      disabled={isLoading}
                    >
                      <span className="font-semibold mr-2">Secretária:</span> maria@petcare.com
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security footer */}
        <p className="mt-6 text-center text-xs text-gray-500">
          Seus dados estão protegidos com criptografia de ponta a ponta
        </p>
      </div>
    </div>
  );
}
