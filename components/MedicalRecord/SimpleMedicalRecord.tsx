'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Heart,
  Activity,
  Stethoscope,
  FileText,
  Pill,
  Calendar,
  User,
  Dog,
  Cat,
  Thermometer,
  Weight
} from 'lucide-react';

interface SimpleMedicalRecordProps {
  isMobile?: boolean;
}

export function SimpleMedicalRecord({ isMobile = false }: SimpleMedicalRecordProps) {
  const vitals = [
    { label: 'Temperatura', value: '38.5°C', icon: Thermometer, status: 'normal' },
    { label: 'Frequência Cardíaca', value: '120 bpm', icon: Heart, status: 'normal' },
    { label: 'Frequência Respiratória', value: '24 rpm', icon: Activity, status: 'normal' },
    { label: 'Peso', value: '25.5 kg', icon: Weight, status: 'normal' },
  ];

  const sections = [
    {
      title: 'Informações do Paciente',
      icon: User,
      content: 'Golden Retriever, 5 anos, macho, castrado',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      title: 'Histórico Médico',
      icon: FileText,
      content: 'Sem histórico prévio de doenças crônicas. Vacinação em dia.',
      color: 'bg-green-50 text-green-600'
    },
    {
      title: 'Diagnóstico',
      icon: Stethoscope,
      content: 'Dermatite alérgica leve. Recomendado tratamento com antihistamínicos.',
      color: 'bg-orange-50 text-orange-600'
    },
    {
      title: 'Tratamento',
      icon: Pill,
      content: 'Prednisona 10mg 1x/dia por 7 dias. Banho com shampoo medicado.',
      color: 'bg-purple-50 text-purple-600'
    },
    {
      title: 'Retorno',
      icon: Calendar,
      content: 'Reavaliação em 7 dias para acompanhamento.',
      color: 'bg-emerald-50 text-emerald-600'
    }
  ];

  return (
    <div className={`space-y-4 ${isMobile ? 'p-3' : 'p-6'}`}>
      {/* Header */}
      <Card className="border-0 shadow-sm">
        <CardHeader className={`${isMobile ? 'pb-3' : 'pb-4'}`}>
          <div className="flex items-center gap-3">
            <div className={` ${isMobile ? 'w-8 h-8' : 'w-10 h-10'} bg-emerald-50 rounded-lg flex items-center justify-center`}>
              <Dog className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-emerald-600`} />
            </div>
            <div className="flex-1">
              <CardTitle className={`${isMobile ? 'text-base' : 'text-lg'} text-gray-900`}>
                Prontuário Veterinário
              </CardTitle>
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>
                Exemplo de prontuário responsivo
              </p>
            </div>
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
              Ativo
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Vital Signs */}
      <Card className="border-0 shadow-sm">
        <CardHeader className={`${isMobile ? 'pb-3' : 'pb-4'}`}>
          <CardTitle className={`${isMobile ? 'text-base' : 'text-lg'} text-gray-900`}>
            Sinais Vitais
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className={`grid grid-cols-1 ${isMobile ? 'gap-3' : 'sm:grid-cols-2 lg:grid-cols-4 gap-4'}`}>
            {vitals.map((vital, index) => {
              const Icon = vital.icon;
              return (
                <div key={index} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-4 h-4 text-gray-600" />
                    <span className="text-xs font-medium text-gray-600">{vital.label}</span>
                  </div>
                  <p className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold text-gray-900`}>
                    {vital.value}
                  </p>
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      Normal
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Medical Sections */}
      <div className={`grid grid-cols-1 ${isMobile ? 'gap-3' : 'lg:grid-cols-2 gap-4'}`}>
        {sections.map((section, index) => {
          const Icon = section.icon;
          return (
            <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className={`${isMobile ? 'pb-2' : 'pb-3'}`}>
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 ${section.color} rounded-md flex items-center justify-center`}>
                    <Icon className="w-3 h-3" />
                  </div>
                  <CardTitle className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-900`}>
                    {section.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600 leading-relaxed`}>
                  {section.content}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Action Buttons */}
      <Card className="border-0 shadow-sm">
        <CardContent className={`${isMobile ? 'p-4' : 'p-6'}`}>
          <div className={`flex ${isMobile ? 'flex-col gap-2' : 'items-center justify-between'}`}>
            <div className={`${isMobile ? 'w-full' : 'flex items-center gap-2'}`}>
              <Button
                variant="outline"
                size={isMobile ? "sm" : "default"}
                className={isMobile ? "w-full" : ""}
              >
                Imprimir
              </Button>
              <Button
                variant="outline"
                size={isMobile ? "sm" : "default"}
                className={isMobile ? "w-full" : ""}
              >
                Exportar PDF
              </Button>
            </div>
            <Button
              className={`bg-emerald-600 hover:bg-emerald-700 ${isMobile ? "w-full" : ""}`}
              size={isMobile ? "sm" : "default"}
            >
              Editar Prontuário
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}