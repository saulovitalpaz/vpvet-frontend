'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  AlertTriangle,
  FileText,
  Clock,
  Pill,
  Heart,
  Calendar,
  Home,
  MapPin,
  Baby
} from 'lucide-react';

interface ChiefComplaintSectionProps {
  data: any;
  onChange: (field: string, value: string) => void;
  isEditing: boolean;
  consultationData?: any;
}

export function ChiefComplaintSection({
  data,
  onChange,
  isEditing,
  consultationData
}: ChiefComplaintSectionProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <CardTitle className="text-lg text-gray-900">Queixa Principal e História</CardTitle>
              <p className="text-sm text-gray-500 mt-0.5">Informações detalhadas sobre o motivo da consulta</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-800">
              <strong>Importante:</strong> Registre a queixa principal de forma clara e objetiva,
              seguida por uma descrição cronológica detalhada do problema atual.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Chief Complaint */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <CardTitle className="text-base text-gray-900">Queixa Principal</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {isEditing ? (
            <Textarea
              value={data.chief_complaint || (consultationData?.chief_complaint || '')}
              onChange={(e) => onChange('chief_complaint', e.target.value)}
              placeholder="Descreva a principal razão da consulta de forma clara e concisa. Ex: 'Vômitos há 2 dias', 'Dificuldade para urinar', 'Ferida na pata esquerda'..."
              rows={4}
              className="text-sm"
            />
          ) : (
            <div className="px-3 py-2 bg-gray-50 rounded-md text-sm min-h-[100px]">
              {data.chief_complaint || consultationData?.chief_complaint || (
                <span className="text-gray-400 italic">Nenhuma queixa registrada</span>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Present Illness */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-blue-500" />
            <CardTitle className="text-base text-gray-900">História da Doença Atual</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            {/* Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Início dos Sintomas</Label>
                {isEditing ? (
                  <Input
                    type="text"
                    value={data.symptom_onset || ''}
                    onChange={(e) => onChange('symptom_onset', e.target.value)}
                    placeholder="Ex: 2 dias, 1 semana, 3 meses..."
                    className="text-sm"
                  />
                ) : (
                  <div className="px-3 py-2 bg-gray-50 rounded-md text-sm">
                    {data.symptom_onset || 'Não registrado'}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Evolução</Label>
                {isEditing ? (
                  <Input
                    type="text"
                    value={data.symptom_progression || ''}
                    onChange={(e) => onChange('symptom_progression', e.target.value)}
                    placeholder="Ex: Piorando, Melhorando, Estável, Intermitente..."
                    className="text-sm"
                  />
                ) : (
                  <div className="px-3 py-2 bg-gray-50 rounded-md text-sm">
                    {data.symptom_progression || 'Não registrado'}
                  </div>
                )}
              </div>
            </div>

            {/* Detailed History */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Descrição Detalhada</Label>
              {isEditing ? (
                <Textarea
                  value={data.present_illness || ''}
                  onChange={(e) => onChange('present_illness', e.target.value)}
                  placeholder="Descreva detalhadamente o início, evolução, características dos sintomas, tratamentos anteriores, e qualquer informação relevante sobre a condição atual. Inclua frequência, intensidade, fatores de melhora/piora, e sinais associados..."
                  rows={6}
                  className="text-sm"
                />
              ) : (
                <div className="px-3 py-2 bg-gray-50 rounded-md text-sm min-h-[150px]">
                  {data.present_illness || (
                    <span className="text-gray-400 italic">Nenhuma descrição registrada</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medical History */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-green-500" />
            <CardTitle className="text-base text-gray-900">Histórico Médico</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            {/* Previous Diseases */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Doenças Anteriores</Label>
              {isEditing ? (
                <Textarea
                  value={data.medical_history || ''}
                  onChange={(e) => onChange('medical_history', e.target.value)}
                  placeholder="Liste doenças anteriores, condições crônicas, problemas recorrentes..."
                  rows={4}
                  className="text-sm"
                />
              ) : (
                <div className="px-3 py-2 bg-gray-50 rounded-md text-sm min-h-[100px]">
                  {data.medical_history || (
                    <span className="text-gray-400 italic">Nenhum histórico registrado</span>
                  )}
                </div>
              )}
            </div>

            {/* Surgical History */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Histórico Cirúrgico</Label>
              {isEditing ? (
                <Textarea
                  value={data.surgical_history || ''}
                  onChange={(e) => onChange('surgical_history', e.target.value)}
                  placeholder="Descreva cirurgias anteriores com datas e procedimentos realizados..."
                  rows={3}
                  className="text-sm"
                />
              ) : (
                <div className="px-3 py-2 bg-gray-50 rounded-md text-sm min-h-[80px]">
                  {data.surgical_history || (
                    <span className="text-gray-400 italic">Nenhuma cirurgia registrada</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medications and Allergies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Medications */}
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <Pill className="w-5 h-5 text-purple-500" />
              <CardTitle className="text-base text-gray-900">Medicações em Uso</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {isEditing ? (
              <Textarea
                value={data.current_medications || ''}
                onChange={(e) => onChange('current_medications', e.target.value)}
                placeholder="Liste todos os medicamentos em uso atualmente, incluindo vitaminas, suplementos e fitoterápicos..."
                rows={4}
                className="text-sm"
              />
            ) : (
              <div className="px-3 py-2 bg-gray-50 rounded-md text-sm min-h-[100px]">
                {data.current_medications || (
                  <span className="text-gray-400 italic">Nenhuma medicação registrada</span>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Allergies */}
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <CardTitle className="text-base text-gray-900">Alergias</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {isEditing ? (
              <Textarea
                value={data.allergies || ''}
                onChange={(e) => onChange('allergies', e.target.value)}
                placeholder="Descreva qualquer alergia conhecida (medicamentos, alimentos, ambientais) e as reações apresentadas..."
                rows={4}
                className="text-sm"
              />
            ) : (
              <div className="px-3 py-2 bg-gray-50 rounded-md text-sm min-h-[100px]">
                {data.allergies || (
                  <span className="text-gray-400 italic">Nenhuma alergia registrada</span>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Vaccination and Preventive Care */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vaccination History */}
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <Heart className="w-5 h-5 text-emerald-500" />
              <CardTitle className="text-base text-gray-900">Histórico Vacinal</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {isEditing ? (
              <Textarea
                value={data.vaccination_history || ''}
                onChange={(e) => onChange('vaccination_history', e.target.value)}
                placeholder="Descreva o histórico de vacinação, incluindo datas das últimas doses e próximas doses previstas..."
                rows={4}
                className="text-sm"
              />
            ) : (
              <div className="px-3 py-2 bg-gray-50 rounded-md text-sm min-h-[100px]">
                {data.vaccination_history || (
                  <span className="text-gray-400 italic">Nenhum histórico vacinal registrado</span>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Preventive Care */}
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <Heart className="w-5 h-5 text-blue-500" />
              <CardTitle className="text-base text-gray-900">Cuidados Preventivos</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {isEditing ? (
              <Textarea
                value={data.preventive_care || ''}
                onChange={(e) => onChange('preventive_care', e.target.value)}
                placeholder="Descreva outros cuidados preventivos (desparasitação, pulgas/carrapatos, cuidados dentários, etc.)..."
                rows={4}
                className="text-sm"
              />
            ) : (
              <div className="px-3 py-2 bg-gray-50 rounded-md text-sm min-h-[100px]">
                {data.preventive_care || (
                  <span className="text-gray-400 italic">Nenhum cuidado preventivo registrado</span>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Environmental and Lifestyle Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Diet */}
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <Heart className="w-5 h-5 text-orange-500" />
              <CardTitle className="text-base text-gray-900">Dieta e Nutrição</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {isEditing ? (
              <Textarea
                value={data.diet || ''}
                onChange={(e) => onChange('diet', e.target.value)}
                placeholder="Descreva a dieta atual (ração, quantidade, frequência), petiscos, restrições alimentares, mudanças recentes..."
                rows={4}
                className="text-sm"
              />
            ) : (
              <div className="px-3 py-2 bg-gray-50 rounded-md text-sm min-h-[100px]">
                {data.diet || (
                  <span className="text-gray-400 italic">Nenhuma informação sobre dieta registrada</span>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Environment */}
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <Home className="w-5 h-5 text-teal-500" />
              <CardTitle className="text-base text-gray-900">Ambiente</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {isEditing ? (
              <Textarea
                value={data.environment || ''}
                onChange={(e) => onChange('environment', e.target.value)}
                placeholder="Descreva o ambiente onde o animal vive (apartamento/casa, acesso à rua, outros animais, clima, etc.)..."
                rows={4}
                className="text-sm"
              />
            ) : (
              <div className="px-3 py-2 bg-gray-50 rounded-md text-sm min-h-[100px]">
                {data.environment || (
                  <span className="text-gray-400 italic">Nenhuma informação ambiental registrada</span>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Additional History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Travel History */}
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-indigo-500" />
              <CardTitle className="text-base text-gray-900">Histórico de Viagens</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {isEditing ? (
              <Textarea
                value={data.travel_history || ''}
                onChange={(e) => onChange('travel_history', e.target.value)}
                placeholder="Descreva viagens recentes que possam ser relevantes para o quadro atual..."
                rows={3}
                className="text-sm"
              />
            ) : (
              <div className="px-3 py-2 bg-gray-50 rounded-md text-sm min-h-[80px]">
                {data.travel_history || (
                  <span className="text-gray-400 italic">Nenhuma viagem registrada</span>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reproductive History */}
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <Baby className="w-5 h-5 text-pink-500" />
              <CardTitle className="text-base text-gray-900">Histórico Reprodutivo</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {isEditing ? (
              <Textarea
                value={data.reproductive_history || ''}
                onChange={(e) => onChange('reproductive_history', e.target.value)}
                placeholder="Descreva informações reprodutivas relevantes (cio, gestações, castração, etc.)..."
                rows={3}
                className="text-sm"
              />
            ) : (
              <div className="px-3 py-2 bg-gray-50 rounded-md text-sm min-h-[80px]">
                {data.reproductive_history || (
                  <span className="text-gray-400 italic">Nenhuma informação reprodutiva registrada</span>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}