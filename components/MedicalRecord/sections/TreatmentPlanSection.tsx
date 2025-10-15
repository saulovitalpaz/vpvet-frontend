'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Pill,
  AlertTriangle,
  Clock,
  CheckCircle,
  Plus,
  Trash2,
  Calendar,
  Heart,
  Shield
} from 'lucide-react';

interface TreatmentPlanSectionProps {
  data: any;
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
  }>;
  procedures: Array<{
    name: string;
    date: string;
    description?: string;
  }>;
  setMedications: (medications: any[]) => void;
  setProcedures: (procedures: any[]) => void;
  onChange: (field: string, value: string) => void;
  isEditing: boolean;
}

export function TreatmentPlanSection({
  data,
  medications,
  procedures,
  setMedications,
  setProcedures,
  onChange,
  isEditing
}: TreatmentPlanSectionProps) {
  const [newMedication, setNewMedication] = useState({
    name: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: ''
  });

  const [newProcedure, setNewProcedure] = useState({
    name: '',
    date: '',
    description: ''
  });

  const addMedication = () => {
    if (newMedication.name && newMedication.dosage && newMedication.frequency) {
      setMedications([...medications, newMedication]);
      setNewMedication({
        name: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: ''
      });
    }
  };

  const addProcedure = () => {
    if (newProcedure.name) {
      setProcedures([...procedures, newProcedure]);
      setNewProcedure({
        name: '',
        date: '',
        description: ''
      });
    }
  };

  const removeMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const removeProcedure = (index: number) => {
    setProcedures(procedures.filter((_, i) => i !== index));
  };

  const treatmentPriorities = [
    'Emergência Imediata',
    'Urgente',
    'Prioritário',
    'Rotina',
    'Preventivo',
    'Paliativo'
  ];

  const treatmentTypes = [
    'Medicamentoso',
    'Cirúrgico',
    'Fisioterapia',
    'Nutricional',
    'Comportamental',
    'Hidratação',
    'Sangue/Hemoderivados',
    'Suporte Vital',
    'Outro'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
              <Pill className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <CardTitle className="text-lg text-gray-900">Plano de Tratamento</CardTitle>
              <p className="text-sm text-gray-500 mt-0.5">Medicações, procedimentos e recomendações</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <p className="text-sm text-emerald-800">
              <strong>Importante:</strong> Detalhe o plano de tratamento completo, incluindo medicações,
              procedimentos, dosagens, frequências e duração do tratamento.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Treatment Overview */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-base text-gray-900">Visão Geral do Tratamento</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Prioridade do Tratamento</Label>
              {isEditing ? (
                <Select value={data.treatment_priority || ''} onValueChange={(value) => onChange('treatment_priority', value)}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {treatmentPriorities.map(priority => (
                      <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="px-3 py-2 bg-gray-50 rounded-md text-sm">
                  {data.treatment_priority || 'Não registrado'}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Tipo Principal de Tratamento</Label>
              {isEditing ? (
                <Select value={data.treatment_type || ''} onValueChange={(value) => onChange('treatment_type', value)}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {treatmentTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="px-3 py-2 bg-gray-50 rounded-md text-sm">
                  {data.treatment_type || 'Não registrado'}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Plano de Tratamento Geral</Label>
            {isEditing ? (
              <Textarea
                value={data.treatment_plan || ''}
                onChange={(e) => onChange('treatment_plan', e.target.value)}
                placeholder="Descreva o plano de tratamento geral, objetivos terapêuticos e estratégias principais..."
                rows={6}
                className="text-sm"
              />
            ) : (
              <div className="px-3 py-2 bg-gray-50 rounded-md text-sm min-h-[150px]">
                {data.treatment_plan || (
                  <span className="text-gray-400 italic">Nenhum plano de tratamento registrado</span>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Emergency Treatment */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <CardTitle className="text-base text-gray-900">Tratamento de Emergência</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {isEditing ? (
            <Textarea
              value={data.emergency_treatment || ''}
              onChange={(e) => onChange('emergency_treatment', e.target.value)}
              placeholder="Descreva tratamentos emergenciais realizados, incluindo estabilização, suporte vital e procedimentos urgentes..."
              rows={4}
              className="text-sm"
            />
          ) : (
            <div className="px-3 py-2 bg-gray-50 rounded-md text-sm min-h-[100px]">
              {data.emergency_treatment || (
                <span className="text-gray-400 italic">Nenhum tratamento de emergência registrado</span>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Medications */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Pill className="w-5 h-5 text-purple-500" />
              <CardTitle className="text-base text-gray-900">Medicações Prescritas</CardTitle>
            </div>
            {isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('add-medication')?.scrollIntoView({ behavior: 'smooth' })}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Adicionar Medicamento
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            {/* Existing Medications */}
            {medications.length > 0 ? (
              <div className="space-y-3">
                {medications.map((med, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <Pill className="w-4 h-4 text-purple-500" />
                        <h4 className="font-medium text-gray-900">{med.name}</h4>
                      </div>
                      {isEditing && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMedication(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 h-auto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Dosagem</p>
                        <p className="text-gray-900">{med.dosage}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Frequência</p>
                        <p className="text-gray-900">{med.frequency}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Duração</p>
                        <p className="text-gray-900">{med.duration}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Status</p>
                        <Badge className="bg-green-50 text-green-700 border-green-200 text-xs">
                          Prescrito
                        </Badge>
                      </div>
                    </div>

                    {med.instructions && (
                      <div className="mt-3">
                        <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Instruções</p>
                        <p className="text-sm text-gray-900">{med.instructions}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <Pill className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>Nenhuma medicação prescrita</p>
              </div>
            )}

            {/* Add New Medication Form */}
            {isEditing && (
              <div id="add-medication" className="border-2 border-dashed border-purple-300 rounded-lg p-4 bg-purple-50">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 text-sm">Adicionar Nova Medicação</h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Nome do Medicamento</Label>
                      <Input
                        type="text"
                        value={newMedication.name}
                        onChange={(e) => setNewMedication({...newMedication, name: e.target.value})}
                        placeholder="Ex: Amoxicilina"
                        className="text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Dosagem</Label>
                      <Input
                        type="text"
                        value={newMedication.dosage}
                        onChange={(e) => setNewMedication({...newMedication, dosage: e.target.value})}
                        placeholder="Ex: 500mg"
                        className="text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Frequência</Label>
                      <Input
                        type="text"
                        value={newMedication.frequency}
                        onChange={(e) => setNewMedication({...newMedication, frequency: e.target.value})}
                        placeholder="Ex: 12/12 horas"
                        className="text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Duração</Label>
                      <Input
                        type="text"
                        value={newMedication.duration}
                        onChange={(e) => setNewMedication({...newMedication, duration: e.target.value})}
                        placeholder="Ex: 7 dias"
                        className="text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Instruções Adicionais</Label>
                    <Textarea
                      value={newMedication.instructions}
                      onChange={(e) => setNewMedication({...newMedication, instructions: e.target.value})}
                      placeholder="Instruções de administração, efeitos colaterais, restrições..."
                      rows={3}
                      className="text-sm"
                    />
                  </div>

                  <Button
                    onClick={addMedication}
                    disabled={!newMedication.name || !newMedication.dosage || !newMedication.frequency}
                    className="w-full gap-2 bg-purple-600 hover:bg-purple-700"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar Medicamento
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Procedures */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-blue-500" />
              <CardTitle className="text-base text-gray-900">Procedimentos</CardTitle>
            </div>
            {isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('add-procedure')?.scrollIntoView({ behavior: 'smooth' })}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Adicionar Procedimento
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            {/* Existing Procedures */}
            {procedures.length > 0 ? (
              <div className="space-y-3">
                {procedures.map((proc, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-blue-500" />
                        <h4 className="font-medium text-gray-900">{proc.name}</h4>
                      </div>
                      {isEditing && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeProcedure(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 h-auto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Data Agendada</p>
                        <p className="text-gray-900">{proc.date}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Status</p>
                        <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs">
                          Agendado
                        </Badge>
                      </div>
                    </div>

                    {proc.description && (
                      <div className="mt-3">
                        <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Descrição</p>
                        <p className="text-sm text-gray-900">{proc.description}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <Shield className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>Nenhum procedimento agendado</p>
              </div>
            )}

            {/* Add New Procedure Form */}
            {isEditing && (
              <div id="add-procedure" className="border-2 border-dashed border-blue-300 rounded-lg p-4 bg-blue-50">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 text-sm">Adicionar Novo Procedimento</h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Nome do Procedimento</Label>
                      <Input
                        type="text"
                        value={newProcedure.name}
                        onChange={(e) => setNewProcedure({...newProcedure, name: e.target.value})}
                        placeholder="Ex: Cirurgia de castração"
                        className="text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Data Agendada</Label>
                      <Input
                        type="date"
                        value={newProcedure.date}
                        onChange={(e) => setNewProcedure({...newProcedure, date: e.target.value})}
                        className="text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Descrição</Label>
                    <Textarea
                      value={newProcedure.description}
                      onChange={(e) => setNewProcedure({...newProcedure, description: e.target.value})}
                      placeholder="Descrição do procedimento, preparação, pós-operatório..."
                      rows={3}
                      className="text-sm"
                    />
                  </div>

                  <Button
                    onClick={addProcedure}
                    disabled={!newProcedure.name}
                    className="w-full gap-2 bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar Procedimento
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Outpatient Care */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <Heart className="w-5 h-5 text-pink-500" />
            <CardTitle className="text-base text-gray-900">Cuidados Ambulatoriais</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {isEditing ? (
            <Textarea
              value={data.outpatient_care || ''}
              onChange={(e) => onChange('outpatient_care', e.target.value)}
              placeholder="Descreva os cuidados domiciliares, monitoramento, restrições e instruções para o tutor..."
              rows={4}
              className="text-sm"
            />
          ) : (
            <div className="px-3 py-2 bg-gray-50 rounded-md text-sm min-h-[100px]">
              {data.outpatient_care || (
                <span className="text-gray-400 italic">Nenhum cuidado ambulatorial registrado</span>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <CardTitle className="text-base text-gray-900">Recomendações Gerais</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {isEditing ? (
            <Textarea
              value={data.recommendations || ''}
              onChange={(e) => onChange('recommendations', e.target.value)}
              placeholder="Recomendações gerais, mudanças no estilo de vida, acompanhamento, prevenção..."
              rows={4}
              className="text-sm"
            />
          ) : (
            <div className="px-3 py-2 bg-gray-50 rounded-md text-sm min-h-[100px]">
              {data.recommendations || (
                <span className="text-gray-400 italic">Nenhuma recomendação registrada</span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}