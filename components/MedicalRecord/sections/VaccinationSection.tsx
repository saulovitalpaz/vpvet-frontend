'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Syringe,
  Shield,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Plus,
  Trash2,
  Clock
} from 'lucide-react';

interface VaccinationSectionProps {
  vaccinations: Array<{
    vaccine: string;
    date: string;
    next_due?: string;
    veterinarian?: string;
    batch_number?: string;
  }>;
  setVaccinations: (vaccinations: any[]) => void;
  isEditing: boolean;
}

export function VaccinationSection({
  vaccinations,
  setVaccinations,
  isEditing
}: VaccinationSectionProps) {
  const [newVaccination, setNewVaccination] = useState({
    vaccine: '',
    date: '',
    next_due: '',
    veterinarian: '',
    batch_number: ''
  });

  const vaccineTypes = [
    'Raiva',
    'V4/V5 Felina',
    'V8/V10 Canina',
    'Leptospirose',
    'Tosse dos Canis',
    'Giardíase',
    'Influenza Canina',
    'Leucemia Felina (FeLV)',
    'Imunodeficiência Felina (FIV)',
    'Outra'
  ];

  const addVaccination = () => {
    if (newVaccination.vaccine && newVaccination.date) {
      setVaccinations([...vaccinations, newVaccination]);
      setNewVaccination({
        vaccine: '',
        date: '',
        next_due: '',
        veterinarian: '',
        batch_number: ''
      });
    }
  };

  const removeVaccination = (index: number) => {
    setVaccinations(vaccinations.filter((_, i) => i !== index));
  };

  const getVaccineStatus = (nextDue?: string) => {
    if (!nextDue) return { status: 'unknown', color: 'bg-gray-100 text-gray-700 border-gray-200', text: 'Não informado' };

    const today = new Date();
    const dueDate = new Date(nextDue);
    const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilDue < 0) {
      return { status: 'overdue', color: 'bg-red-100 text-red-700 border-red-200', text: 'Atrasada' };
    } else if (daysUntilDue <= 30) {
      return { status: 'due', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', text: 'Próxima' };
    } else {
      return { status: 'valid', color: 'bg-green-100 text-green-700 border-green-200', text: 'Em dia' };
    }
  };

  const groupVaccinationsByType = () => {
    const groups: { [key: string]: typeof vaccinations } = {};

    vaccinations.forEach(vacc => {
      const normalizedVaccine = vacc.vaccine.toLowerCase();
      let category = 'Outras';

      if (normalizedVaccine.includes('raiva')) category = 'Raiva';
      else if (normalizedVaccine.includes('felina') || normalizedVaccine.includes('felv') || normalizedVaccine.includes('fiv')) category = 'Felina';
      else if (normalizedVaccine.includes('v4') || normalizedVaccine.includes('v5') || normalizedVaccine.includes('v8') || normalizedVaccine.includes('v10') || normalizedVaccine.includes('canina') || normalizedVaccine.includes('lepto') || normalizedVaccine.includes('tosse') || normalizedVaccine.includes('giardia') || normalizedVaccine.includes('influenza')) category = 'Canina';

      if (!groups[category]) groups[category] = [];
      groups[category].push(vacc);
    });

    return groups;
  };

  const vaccinationGroups = groupVaccinationsByType();

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
              <Syringe className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <CardTitle className="text-lg text-gray-900">Histórico Vacinal</CardTitle>
              <p className="text-sm text-gray-500 mt-0.5">Registro completo de vacinas e datas de reforço</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <p className="text-sm text-emerald-800">
              <strong>Importante:</strong> Mantenha o histórico vacinal atualizado para garantir a proteção adequada do paciente
              e cumprir requisitos legais e de viagens.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Vaccination Overview */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-emerald-50 to-blue-50">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Syringe className="w-5 h-5 text-emerald-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Total de Vacinas</span>
              </div>
              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                {vaccinations.length} registradas
              </Badge>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Em Dia</span>
              </div>
              <Badge className="bg-green-100 text-green-800 border-green-200">
                {vaccinations.filter(v => getVaccineStatus(v.next_due).status === 'valid').length}
              </Badge>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="w-5 h-5 text-yellow-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Próximas</span>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                {vaccinations.filter(v => getVaccineStatus(v.next_due).status === 'due').length}
              </Badge>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Atrasadas</span>
              </div>
              <Badge className="bg-red-100 text-red-800 border-red-200">
                {vaccinations.filter(v => getVaccineStatus(v.next_due).status === 'overdue').length}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vaccination Groups */}
      {Object.keys(vaccinationGroups).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(vaccinationGroups).map(([category, vaccines]) => (
            <Card key={category} className="border-0 shadow-sm bg-white">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-blue-500" />
                  <CardTitle className="text-base text-gray-900">Vacinas {category}</CardTitle>
                  <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                    {vaccines.length} {vaccines.length === 1 ? 'dose' : 'doses'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {vaccines.map((vacc, index) => {
                    const status = getVaccineStatus(vacc.next_due);
                    return (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                            <Syringe className="w-4 h-4 text-emerald-500" />
                            <h4 className="font-medium text-gray-900">{vacc.vaccine}</h4>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={status.color}>
                              {status.text}
                            </Badge>
                            {isEditing && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeVaccination(vaccinations.indexOf(vacc))}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 h-auto"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div>
                            <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Data</p>
                            <p className="text-gray-900">{vacc.date}</p>
                          </div>
                          {vacc.next_due && (
                            <div>
                              <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Próxima Dose</p>
                              <p className="text-gray-900">{vacc.next_due}</p>
                            </div>
                          )}
                          {vacc.veterinarian && (
                            <div>
                              <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Veterinário</p>
                              <p className="text-gray-900">{vacc.veterinarian}</p>
                            </div>
                          )}
                          {vacc.batch_number && (
                            <div>
                              <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Lote</p>
                              <p className="text-gray-900 font-mono text-xs">{vacc.batch_number}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-12 text-center">
            <Syringe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma vacina registrada</h3>
            <p className="text-gray-600 mb-6">
              Este paciente ainda não possui histórico vacinal registrado.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Add New Vaccination Form */}
      {isEditing && (
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <Plus className="w-5 h-5 text-emerald-500" />
              <CardTitle className="text-base text-gray-900">Adicionar Nova Vacina</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Vacina</Label>
                  <Select value={newVaccination.vaccine} onValueChange={(value) => setNewVaccination({...newVaccination, vaccine: value})}>
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="Selecione a vacina..." />
                    </SelectTrigger>
                    <SelectContent>
                      {vaccineTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Data da Aplicação</Label>
                  <Input
                    type="date"
                    value={newVaccination.date}
                    onChange={(e) => setNewVaccination({...newVaccination, date: e.target.value})}
                    className="text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Próxima Dose (opcional)</Label>
                  <Input
                    type="date"
                    value={newVaccination.next_due}
                    onChange={(e) => setNewVaccination({...newVaccination, next_due: e.target.value})}
                    className="text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Veterinário (opcional)</Label>
                  <Input
                    type="text"
                    value={newVaccination.veterinarian}
                    onChange={(e) => setNewVaccination({...newVaccination, veterinarian: e.target.value})}
                    placeholder="Nome do veterinário"
                    className="text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Número do Lote (opcional)</Label>
                <Input
                  type="text"
                  value={newVaccination.batch_number}
                  onChange={(e) => setNewVaccination({...newVaccination, batch_number: e.target.value})}
                  placeholder="Número do lote da vacina"
                  className="text-sm"
                />
              </div>

              <Button
                onClick={addVaccination}
                disabled={!newVaccination.vaccine || !newVaccination.date}
                className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700"
              >
                <Plus className="w-4 h-4" />
                Adicionar Vacina
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Vaccination Notes */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-base text-gray-900">Observações sobre Vacinação</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <Alert variant="warning">
              <div>
                <p className="font-medium mb-1">Importante:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Vacinas são essenciais para prevenir doenças graves</li>
                  <li>Respeite o intervalo entre doses para garantir imunidade adequada</li>
                  <li>Alguns estabelecimentos exigem carteira de vacinação atualizada</li>
                  <li>Consulte um veterinário para estabelecer um cronograma personalizado</li>
                </ul>
              </div>
            </Alert>

            <Alert variant="info">
              <div>
                <p className="font-medium mb-1">Recomendações:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Mantenha sempre um registro atualizado das vacinas</li>
                  <li>Observe o animal por 24 horas após a vacinação</li>
                  <li>Comunique qualquer reação adversa ao veterinário</li>
                  <li>Não vacine animais doentes ou imunodeprimidos sem avaliação veterinária</li>
                </ul>
              </div>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}