'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Stethoscope,
  Heart,
  Wind,
  Activity,
  Eye,
  Ear,
  Brain,
  Bone,
  Droplets
} from 'lucide-react';

interface ClinicalExaminationSectionProps {
  data: any;
  onChange: (field: string, value: string) => void;
  isEditing: boolean;
}

export function ClinicalExaminationSection({
  data,
  onChange,
  isEditing
}: ClinicalExaminationSectionProps) {
  const organSystems = [
    {
      id: 'skin_condition',
      label: 'Pele e Anexos',
      icon: Activity,
      placeholder: 'Descreva pele, pelagem, unhas, glândulas...',
      description: 'Avaliação da integridade da pele, pelame, unhas e glândulas'
    },
    {
      id: 'eyes',
      label: 'Olhos',
      icon: Eye,
      placeholder: 'Descreva conjuntiva, córnea, pupila, reflexos...',
      description: 'Exame oftalmológico completo'
    },
    {
      id: 'ears',
      label: 'Ouvidos',
      icon: Ear,
      placeholder: 'Descreva pavilhão auricular, canal auditivo, tímpano...',
      description: 'Avaliação otoscópica'
    },
    {
      id: 'nose',
      label: 'Nariz e Seios Paranasais',
      icon: Wind,
      placeholder: 'Descreva nariz, descarga, obstrução, seios...',
      description: 'Exame nasal e dos seios paranasais'
    },
    {
      id: 'mouth_teeth',
      label: 'Boca e Dentes',
      icon: Activity,
      placeholder: 'Descreva mucosa oral, dentes, gengivas, língua...',
      description: 'Avaliação da cavidade oral'
    },
    {
      id: 'lymph_nodes',
      label: 'Linfonodos',
      icon: Activity,
      placeholder: 'Descreva tamanho, consistência, mobilidade dos linfonodos...',
      description: 'Palpação dos linfonodos superficiais'
    },
    {
      id: 'cardiovascular_system',
      label: 'Sistema Cardiovascular',
      icon: Heart,
      placeholder: 'Descreva ausculta cardíaca, pulsos, murmúrios...',
      description: 'Exame do coração e vasos sanguíneos'
    },
    {
      id: 'respiratory_system',
      label: 'Sistema Respiratório',
      icon: Wind,
      placeholder: 'Descreva ausculta pulmonar, padrão respiratório, secreções...',
      description: 'Avaliação do trato respiratório'
    },
    {
      id: 'gastrointestinal_system',
      label: 'Sistema Gastrointestinal',
      icon: Activity,
      placeholder: 'Descreva abdômen, palpação, ruídos hidroaéreos, órgãos...',
      description: 'Exame abdominal e digestivo'
    },
    {
      id: 'musculoskeletal_system',
      label: 'Sistema Musculoesquelético',
      icon: Bone,
      placeholder: 'Descreva articulações, músculos, ossos, mobilidade...',
      description: 'Avaliação ortopédica e muscular'
    },
    {
      id: 'nervous_system',
      label: 'Sistema Nervoso',
      icon: Brain,
      placeholder: 'Descreva reflexos, sensibilidade, função motora, comportamento...',
      description: 'Exame neurológico completo'
    },
    {
      id: 'urogenital_system',
      label: 'Sistema Urogenital',
      icon: Droplets,
      placeholder: 'Descreva rins, bexiga, órgãos reprodutivos, externa...',
      description: 'Avaliação do trato urinário e reprodutivo'
    }
  ];

  const getSystemIcon = (systemId: string) => {
    const system = organSystems.find(s => s.id === systemId);
    return system?.icon || Activity;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg text-gray-900">Exame Clínico Sistêmico</CardTitle>
              <p className="text-sm text-gray-500 mt-0.5">Avaliação detalhada dos sistemas orgânicos</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Alert variant="info" className="mb-6">
            <div>
              <p className="text-sm">
                <strong>Nota:</strong> Registre os achados do exame físico sistemático para cada sistema orgânico.
                Inclua achados normais e anormais, com descrições detalhadas quando necessário.
              </p>
            </div>
          </Alert>
        </CardContent>
      </Card>

      {/* Organ Systems Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {organSystems.map((system) => {
          const Icon = system.icon;
          return (
            <Card key={system.id} className="border-0 shadow-sm bg-white hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
                    <Icon className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base text-gray-900">{system.label}</CardTitle>
                    <p className="text-xs text-gray-500 mt-0.5">{system.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {isEditing ? (
                  <Textarea
                    value={data[system.id] || ''}
                    onChange={(e) => onChange(system.id, e.target.value)}
                    placeholder={system.placeholder}
                    rows={4}
                    className="text-sm resize-none"
                  />
                ) : (
                  <div className="min-h-[100px] px-3 py-2 bg-gray-50 rounded-md text-sm">
                    {data[system.id] || (
                      <span className="text-gray-400 italic">Nenhum achado registrado</span>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary Section */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-base text-gray-900">Resumo do Exame Físico</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {isEditing ? (
            <Textarea
              value={data.physical_exam || ''}
              onChange={(e) => onChange('physical_exam', e.target.value)}
              placeholder="Faça um resumo dos principais achados do exame físico, destacando as anormalidades mais significativas..."
              rows={6}
              className="text-sm"
            />
          ) : (
            <div className="px-3 py-2 bg-gray-50 rounded-md text-sm min-h-[150px]">
              {data.physical_exam || (
                <span className="text-gray-400 italic">Nenhum resumo registrado</span>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Overall Assessment */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-base text-gray-900">Avaliação Geral do Estado Clínico</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* General Condition Score */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Condição Geral</Label>
              {isEditing ? (
                <Select value={data.general_condition || ''} onValueChange={(value) => onChange('general_condition', value)}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">Excelente</SelectItem>
                    <SelectItem value="good">Bom</SelectItem>
                    <SelectItem value="fair">Regular</SelectItem>
                    <SelectItem value="poor">Ruim</SelectItem>
                    <SelectItem value="critical">Crítico</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="px-3 py-2 bg-gray-50 rounded-md text-sm">
                  {data.general_condition || 'Não registrado'}
                </div>
              )}
            </div>

            {/* Pain Assessment */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Avaliação de Dor</Label>
              {isEditing ? (
                <Select value={data.pain_assessment || ''} onValueChange={(value) => onChange('pain_assessment', value)}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Ausente</SelectItem>
                    <SelectItem value="mild">Leve</SelectItem>
                    <SelectItem value="moderate">Moderada</SelectItem>
                    <SelectItem value="severe">Severa</SelectItem>
                    <SelectItem value="extreme">Extrema</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="px-3 py-2 bg-gray-50 rounded-md text-sm">
                  {data.pain_assessment || 'Não registrado'}
                </div>
              )}
            </div>

            {/* Emergency Status */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Status de Emergência</Label>
              {isEditing ? (
                <Select value={data.emergency_status || ''} onValueChange={(value) => onChange('emergency_status', value)}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stable">Estável</SelectItem>
                    <SelectItem value="critical">Crítico mas estável</SelectItem>
                    <SelectItem value="unstable">Instável</SelectItem>
                    <SelectItem value="emergency">Emergência</SelectItem>
                    <SelectItem value="critical_emergency">Emergência crítica</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="px-3 py-2 bg-gray-50 rounded-md text-sm">
                  {data.emergency_status || 'Não registrado'}
                </div>
              )}
            </div>
          </div>

          {/* Emergency Notes */}
          {isEditing ? (
            <div className="mt-4 space-y-2">
              <Label className="text-sm font-medium text-gray-700">Notas de Emergência / Observações Críticas</Label>
              <Textarea
                value={data.emergency_notes || ''}
                onChange={(e) => onChange('emergency_notes', e.target.value)}
                placeholder="Registre qualquer observação crítica ou procedimento de emergência realizado..."
                rows={3}
                className="text-sm"
              />
            </div>
          ) : (
            data.emergency_notes && (
              <div className="mt-4 space-y-2">
                <Label className="text-sm font-medium text-gray-700">Notas de Emergência</Label>
                <div className="px-3 py-2 bg-red-50 border border-red-200 rounded-md text-sm text-red-900">
                  {data.emergency_notes}
                </div>
              </div>
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
}