'use client';

import { useState } from 'react';
import { usePublicAuth } from '@/contexts/PublicAuthContext';
import ClientSidebar from '@/components/ClientSidebar';
import {
  User,
  Mail,
  Phone,
  CreditCard,
  Pencil,
  Check,
  X,
  Key,
  Bell,
  ShieldCheck,
  Menu
} from 'lucide-react';
import Link from 'next/link';

export default function MeusDadosPage() {
  const { clientData, pets, loading } = usePublicAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    tutor_name: '',
    email: '',
    phone: '',
    tutor_cpf: ''
  });
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!clientData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acesso Restrito</h1>
          <p className="text-gray-600 mb-6">Você precisa estar autenticado para acessar esta página.</p>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Voltar para o início
          </Link>
        </div>
      </div>
    );
  }

  const startEditing = (section: string) => {
    setEditingSection(section);
    setFormData({
      tutor_name: clientData.tutor_name,
      email: clientData.email || '',
      phone: clientData.phone || '',
      tutor_cpf: clientData.tutor_cpf
    });
    setSaveStatus('idle');
  };

  const cancelEditing = () => {
    setEditingSection(null);
    setSaveStatus('idle');
  };

  const saveChanges = async () => {
    setSaveStatus('saving');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // In a real app, you would update the client data via API
    // For now, we'll just show success message
    setSaveStatus('saved');
    setTimeout(() => {
      setEditingSection(null);
      setSaveStatus('idle');
    }, 1500);
  };

  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatPhone = (phone: string) => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    } else if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50 flex relative">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <ClientSidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <main className="flex-1 lg:ml-0 relative z-10">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 h-[76px] relative z-20">
          <div className="flex items-center justify-between h-full">
            {/* Mobile menu button - Hide on tablet and desktop */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>

            <div className="hidden lg:flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Meus Dados
                </h1>
                <p className="text-sm text-gray-500">
                  Gerencie suas informações pessoais
                </p>
              </div>
            </div>

            {/* Mobile title */}
            <h1 className="lg:hidden text-lg font-bold text-gray-900">
              Meus Dados
            </h1>

            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden sm:block w-px h-8 bg-gray-200"></div>

              <div className="hidden sm:flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {clientData?.tutor_name?.split(' ').map(n => n[0]).join('').substring(0, 2) || 'T'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {clientData?.tutor_name || 'Tutor'}
                  </p>
                  <p className="text-xs text-gray-500">Portal do Tutor</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="p-8">
          {/* Profile Overview */}
          <div className="bg-white border border-gray-200/60 shadow-sm rounded-lg mb-6">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-emerald-700" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{clientData.tutor_name}</h2>
                  <p className="text-gray-600">Tutor de {pets.length} pet{pets.length !== 1 ? 's' : ''}</p>
                  <p className="text-sm text-gray-500">Membro desde {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{pets.length}</p>
                  <p className="text-sm text-gray-600">Pets Cadastrados</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">0</p>
                  <p className="text-sm text-gray-600">Consultas Realizadas</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">0</p>
                  <p className="text-sm text-gray-600">Exames Realizados</p>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white border border-gray-200/60 shadow-sm rounded-lg mb-6">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Informações Pessoais</h3>
                {editingSection !== 'personal' ? (
                  <button
                    onClick={() => startEditing('personal')}
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-emerald-700 bg-emerald-50 rounded-md hover:bg-emerald-100 transition-colors"
                  >
                    <Pencil className="w-4 h-4 mr-1" />
                    Editar
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={saveChanges}
                      disabled={saveStatus === 'saving'}
                      className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-emerald-700 bg-emerald-50 rounded-md hover:bg-emerald-100 transition-colors disabled:opacity-50"
                    >
                      {saveStatus === 'saving' ? (
                        <div className="animate-spin rounded-full w-4 h-4 border-b-2 border-emerald-600 mr-1"></div>
                      ) : saveStatus === 'saved' ? (
                        <Check className="w-4 h-4 mr-1" />
                      ) : (
                        <Check className="w-4 h-4 mr-1" />
                      )}
                      {saveStatus === 'saved' ? 'Salvo' : 'Salvar'}
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Cancelar
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo
                  </label>
                  {editingSection === 'personal' ? (
                    <input
                      type="text"
                      value={formData.tutor_name}
                      onChange={(e) => setFormData({...formData, tutor_name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="flex items-center text-gray-900">
                      <User className="w-4 h-4 mr-2 text-gray-400" />
                      {clientData.tutor_name}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CPF
                  </label>
                  <div className="flex items-center text-gray-900">
                    <CreditCard className="w-4 h-4 mr-2 text-gray-400" />
                    {formatCPF(clientData.tutor_cpf)}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-mail
                  </label>
                  {editingSection === 'personal' ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="seu@email.com"
                    />
                  ) : (
                    <div className="flex items-center text-gray-900">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      {clientData.email || 'Não informado'}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone
                  </label>
                  {editingSection === 'personal' ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="(00) 00000-0000"
                    />
                  ) : (
                    <div className="flex items-center text-gray-900">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      {clientData.phone ? formatPhone(clientData.phone) : 'Não informado'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white border border-gray-200/60 shadow-sm rounded-lg mb-6">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Segurança</h3>
                <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-emerald-700 bg-emerald-50 rounded-md hover:bg-emerald-100 transition-colors">
                  <Key className="w-4 h-4 mr-1" />
                  Alterar Senha
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Autenticação de Dois Fatores</p>
                      <p className="text-xs text-gray-500">Adicione uma camada extra de segurança à sua conta</p>
                    </div>
                  </div>
                  <button className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
                    Configurar
                  </button>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Notificações por E-mail</p>
                      <p className="text-xs text-gray-500">Receba alertas sobre consultas e exames</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Account Actions */}
          <div className="bg-white border border-gray-200/60 shadow-sm rounded-lg">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Gerenciamento da Conta</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Exportar Meus Dados</p>
                    <p className="text-xs text-gray-500">Baixe todas as suas informações e documentos</p>
                  </div>
                  <button className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
                    Exportar
                  </button>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Excluir Conta</p>
                    <p className="text-xs text-gray-500">Remova permanentemente sua conta e todos os dados</p>
                  </div>
                  <button className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100 transition-colors">
                    Excluir Conta
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tips Section */}
          <div className="mt-12 bg-emerald-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-emerald-900 mb-4">Dicas de Segurança</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-sm text-emerald-800">
                <h4 className="font-medium mb-1">🔐 Senha Forte</h4>
                <p>Use senhas com pelo menos 8 caracteres, incluindo letras, números e símbolos.</p>
              </div>
              <div className="text-sm text-emerald-800">
                <h4 className="font-medium mb-1">📱 Dados Atualizados</h4>
                <p>Mantenha suas informações de contato sempre atualizadas para comunicação importante.</p>
              </div>
              <div className="text-sm text-emerald-800">
                <h4 className="font-medium mb-1">🔒 Privacidade</h4>
                <p>Nunca compartilhe suas credenciais de acesso com outras pessoas.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}