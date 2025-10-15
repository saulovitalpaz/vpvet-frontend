'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Sidebar } from '@/components/Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatCPF, formatPhone } from '@/lib/utils';
import { UserPlus, Menu, Bell } from 'lucide-react';
import Link from 'next/link';

const patientSchema = z.object({
  // Tutor fields
  tutor_cpf: z.string().min(14, 'CPF inválido'),
  tutor_name: z.string().min(3, 'Nome do tutor é obrigatório'),
  tutor_phone: z.string().min(10, 'Telefone inválido'),
  tutor_email: z.string().email('Email inválido').optional().or(z.literal('')),
  // Animal fields
  animal_name: z.string().min(2, 'Nome do pet é obrigatório'),
  species: z.string().min(1, 'Selecione a espécie'),
  breed: z.string().optional(),
  birth_date: z.string().optional(),
  sex: z.string().min(1, 'Selecione o sexo'),
  weight: z.string().optional(),
  is_neutered: z.boolean().optional(),
});

type PatientFormData = z.infer<typeof patientSchema>;

function NovoPatienteContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      sex: '',
      species: '',
      is_neutered: false,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: PatientFormData) => {
      const payload = {
        tutor: {
          cpf: data.tutor_cpf.replace(/\D/g, ''),
          name: data.tutor_name,
          phone: data.tutor_phone.replace(/\D/g, ''),
          email: data.tutor_email || undefined,
        },
        animal: {
          name: data.animal_name,
          species: data.species,
          breed: data.breed || undefined,
          birth_date: data.birth_date || undefined,
          sex: data.sex,
          weight: data.weight ? parseFloat(data.weight) : undefined,
          is_neutered: data.is_neutered,
        },
      };
      return api.post('/patients', payload);
    },
    onSuccess: () => {
      router.push('/pacientes');
    },
  });

  const onSubmit = (data: PatientFormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <main className="flex-1 lg:ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>

            <div className="hidden lg:flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Novo Paciente</h1>
                <p className="text-sm text-gray-500">Cadastre um novo paciente e seu tutor</p>
              </div>
            </div>

            {/* Mobile title */}
            <h1 className="lg:hidden text-lg font-bold text-gray-900">
              Novo Paciente
            </h1>

            <div className="flex items-center gap-2 sm:gap-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full"></span>
              </button>
              <div className="hidden sm:flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user?.name?.split(' ').map(n => n[0]).join('').substring(0, 2) || 'SV'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Dr. {user?.name?.startsWith('Dr.') ? user.name.split(' ').slice(1).join(' ') : (user?.name || 'Saulo Vital')}
                  </p>
                  <p className="text-xs text-gray-500">Sistema</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 sm:p-8 max-w-4xl mx-auto">

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Tutor Information */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Informações do Tutor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tutor_cpf">CPF *</Label>
                  <Input
                    id="tutor_cpf"
                    type="text"
                    {...register('tutor_cpf')}
                    value={cpf}
                    onChange={(e) => {
                      const formatted = formatCPF(e.target.value);
                      setCpf(formatted);
                      setValue('tutor_cpf', formatted);
                    }}
                    placeholder="000.000.000-00"
                    maxLength={14}
                  />
                  {errors.tutor_cpf && <p className="text-sm text-red-600">{errors.tutor_cpf.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tutor_name">Nome Completo *</Label>
                  <Input id="tutor_name" {...register('tutor_name')} placeholder="João da Silva" />
                  {errors.tutor_name && <p className="text-sm text-red-600">{errors.tutor_name.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tutor_phone">Telefone *</Label>
                  <Input
                    id="tutor_phone"
                    type="tel"
                    {...register('tutor_phone')}
                    value={phone}
                    onChange={(e) => {
                      const formatted = formatPhone(e.target.value);
                      setPhone(formatted);
                      setValue('tutor_phone', formatted);
                    }}
                    placeholder="(33) 98888-8888"
                    maxLength={15}
                  />
                  {errors.tutor_phone && <p className="text-sm text-red-600">{errors.tutor_phone.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tutor_email">Email</Label>
                  <Input id="tutor_email" type="email" {...register('tutor_email')} placeholder="email@exemplo.com" />
                  {errors.tutor_email && <p className="text-sm text-red-600">{errors.tutor_email.message}</p>}
                </div>
                </div>
              </CardContent>
            </Card>

            {/* Animal Information */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Informações do Pet</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="animal_name">Nome do Pet *</Label>
                  <Input id="animal_name" {...register('animal_name')} placeholder="Rex" />
                  {errors.animal_name && <p className="text-sm text-red-600">{errors.animal_name.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="species">Espécie *</Label>
                  <Select id="species" {...register('species')}>
                    <option value="">Selecione...</option>
                    <option value="canine">Canino</option>
                    <option value="feline">Felino</option>
                    <option value="other">Outro</option>
                  </Select>
                  {errors.species && <p className="text-sm text-red-600">{errors.species.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="breed">Raça</Label>
                  <Input id="breed" {...register('breed')} placeholder="Golden Retriever" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birth_date">Data de Nascimento</Label>
                  <Input id="birth_date" type="date" {...register('birth_date')} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sex">Sexo *</Label>
                  <Select id="sex" {...register('sex')}>
                    <option value="">Selecione...</option>
                    <option value="male">Macho</option>
                    <option value="female">Fêmea</option>
                  </Select>
                  {errors.sex && <p className="text-sm text-red-600">{errors.sex.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Peso (kg)</Label>
                  <Input id="weight" type="number" step="0.1" {...register('weight')} placeholder="25.5" />
                </div>

                <div className="space-y-2 flex items-center gap-2 pt-8">
                  <input type="checkbox" id="is_neutered" {...register('is_neutered')} className="h-4 w-4" />
                  <Label htmlFor="is_neutered" className="cursor-pointer">
                    Castrado
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {mutation.isError && (
              <Alert variant="destructive">
                <AlertDescription>
                  Erro ao cadastrar paciente. {(mutation.error as any)?.response?.data?.error || 'Tente novamente.'}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Link href="/pacientes" className="w-full sm:w-auto">
                <Button type="button" variant="outline" disabled={mutation.isPending} className="w-full">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" disabled={mutation.isPending} className="bg-primary-600 hover:bg-primary-700 w-full sm:w-auto">
                {mutation.isPending ? 'Cadastrando...' : 'Cadastrar Paciente'}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default function NovoPatientePage() {
  return (
    <ProtectedRoute>
      <NovoPatienteContent />
    </ProtectedRoute>
  );
}
