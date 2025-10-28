'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Thermometer,
  Heart,
  Wind,
  Weight,
  Gauge,
  Activity,
  User,
  Dog,
  Cat
} from 'lucide-react';

interface PatientInfoSectionProps {
  data: any;
  onChange: (field: string, value: string) => void;
  isEditing: boolean;
  patientData: any;
}

export function PatientInfoSection({
  data,
  onChange,
  isEditing,
  patientData
}: PatientInfoSectionProps) {
  const getSpeciesIcon = (species: string) => {
    const normalizedSpecies = species?.toLowerCase();
    if (normalizedSpecies === 'canine') {
      return Dog;
    } else if (normalizedSpecies === 'feline') {
      return Cat;
    }
    return User;
  };

  return (
    <div className="space-y-6">
      {/* Patient Header */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
              {(() => {
                const AnimalIcon = getSpeciesIcon(patientData.species);
                return <AnimalIcon className="w-5 h-5 text-emerald-600" />;
              })()}
            </div>
            <div>
              <CardTitle className="text-lg text-gray-900">Informações do Paciente</CardTitle>
              <p className="text-sm text-gray-500 mt-0.5">Sinais vitais e dados básicos</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Temperature */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-red-500" />
                Temperatura
              </Label>
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <Input
                    type="text"
                    value={data.temperature || ''}
                    onChange={(e) => onChange('temperature', e.target.value)}
                    placeholder="38.5"
                    className="text-sm"
                  />
                ) : (
                  <div className="w-full px-3 py-2 bg-gray-50 rounded-md text-sm">
                    {data.temperature || 'Não registrado'}
                  </div>
                )}
                <span className="text-sm text-gray-500">°C</span>
              </div>
            </div>

            {/* Heart Rate */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" />
                Frequência Cardíaca
              </Label>
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <Input
                    type="text"
                    value={data.heart_rate || ''}
                    onChange={(e) => onChange('heart_rate', e.target.value)}
                    placeholder="120"
                    className="text-sm"
                  />
                ) : (
                  <div className="w-full px-3 py-2 bg-gray-50 rounded-md text-sm">
                    {data.heart_rate || 'Não registrado'}
                  </div>
                )}
                <span className="text-sm text-gray-500">bpm</span>
              </div>
            </div>

            {/* Respiratory Rate */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Wind className="w-4 h-4 text-blue-500" />
                Frequência Respiratória
              </Label>
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <Input
                    type="text"
                    value={data.respiratory_rate || ''}
                    onChange={(e) => onChange('respiratory_rate', e.target.value)}
                    placeholder="24"
                    className="text-sm"
                  />
                ) : (
                  <div className="w-full px-3 py-2 bg-gray-50 rounded-md text-sm">
                    {data.respiratory_rate || 'Não registrado'}
                  </div>
                )}
                <span className="text-sm text-gray-500">rpm</span>
              </div>
            </div>

            {/* Weight */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Weight className="w-4 h-4 text-purple-500" />
                Peso
              </Label>
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <Input
                    type="text"
                    value={data.weight || ''}
                    onChange={(e) => onChange('weight', e.target.value)}
                    placeholder="25.5"
                    className="text-sm"
                  />
                ) : (
                  <div className="w-full px-3 py-2 bg-gray-50 rounded-md text-sm">
                    {data.weight || 'Não registrado'}
                  </div>
                )}
                <span className="text-sm text-gray-500">kg</span>
              </div>
            </div>

            {/* Blood Pressure */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Gauge className="w-4 h-4 text-indigo-500" />
                Pressão Arterial
              </Label>
              {isEditing ? (
                <Input
                  type="text"
                  value={data.blood_pressure || ''}
                  onChange={(e) => onChange('blood_pressure', e.target.value)}
                  placeholder="120/80"
                  className="text-sm"
                />
              ) : (
                <div className="px-3 py-2 bg-gray-50 rounded-md text-sm">
                  {data.blood_pressure || 'Não registrado'}
                </div>
              )}
            </div>

            {/* Hydration Status */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-500" />
                Estado de Hidratação
              </Label>
              {isEditing ? (
                <Select value={data.hydration_status || ''} onValueChange={(value) => onChange('hydration_status', value)}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="mild">Desidratação leve</SelectItem>
                    <SelectItem value="moderate">Desidratação moderada</SelectItem>
                    <SelectItem value="severe">Desidratação grave</SelectItem>
                    <SelectItem value="overhydrated">Hidratado em excesso</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="px-3 py-2 bg-gray-50 rounded-md text-sm">
                  {data.hydration_status || 'Não registrado'}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Patient Information */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg text-gray-900">Avaliação Geral</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Body Condition */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Condição Corporal</Label>
              {isEditing ? (
                <Select value={data.body_condition || ''} onValueChange={(value) => onChange('body_condition', value)}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="very_thin">Muito magro (1-3)</SelectItem>
                    <SelectItem value="thin">Magro (4-5)</SelectItem>
                    <SelectItem value="ideal">Ideal (6-7)</SelectItem>
                    <SelectItem value="overweight">Sobrepeso (8-9)</SelectItem>
                    <SelectItem value="obese">Obeso (10)</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="px-3 py-2 bg-gray-50 rounded-md text-sm">
                  {data.body_condition || 'Não registrado'}
                </div>
              )}
            </div>

            {/* Attitude */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Atitude</Label>
              {isEditing ? (
                <Select value={data.attitude || ''} onValueChange={(value) => onChange('attitude', value)}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alert">Alerta</SelectItem>
                    <SelectItem value="depressed">Deprimido</SelectItem>
                    <SelectItem value="lethargic">Létargico</SelectItem>
                    <SelectItem value="agitated">Agitado</SelectItem>
                    <SelectItem value="aggressive">Agressivo</SelectItem>
                    <SelectItem value="nervous">Nervoso</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="px-3 py-2 bg-gray-50 rounded-md text-sm">
                  {data.attitude || 'Não registrado'}
                </div>
              )}
            </div>

            {/* Posture */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Postura</Label>
              {isEditing ? (
                <Select value={data.posture || ''} onValueChange={(value) => onChange('posture', value)}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="sternal">Esternal</SelectItem>
                    <SelectItem value="lateral">Lateral</SelectItem>
                    <SelectItem value="orthopneic">Ortopneica</SelectItem>
                    <SelectItem value="prayer">Oração</SelectItem>
                    <SelectItem value="abdominal">Abdominal</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="px-3 py-2 bg-gray-50 rounded-md text-sm">
                  {data.posture || 'Não registrado'}
                </div>
              )}
            </div>

            {/* Gait */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Marcha</Label>
              {isEditing ? (
                <Select value={data.gait || ''} onValueChange={(value) => onChange('gait', value)}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="weak">Fraqueza</SelectItem>
                    <SelectItem value="ataxic">Atáxica</SelectItem>
                    <SelectItem value="paresis">Paresia</SelectItem>
                    <SelectItem value="paralysis">Paralisia</SelectItem>
                    <SelectItem value="lameness">Claudicação</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="px-3 py-2 bg-gray-50 rounded-md text-sm">
                  {data.gait || 'Não registrado'}
                </div>
              )}
            </div>
          </div>

          {/* Membranes Mucosas and Capillary Refill Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
            {/* Mucous Membranes */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Membranas Mucosas</Label>
              {isEditing ? (
                <Select value={data.mucous_membranes || ''} onValueChange={(value) => onChange('mucous_membranes', value)}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pink_rosy">Róseas</SelectItem>
                    <SelectItem value="pale">Pálidas</SelectItem>
                    <SelectItem value="cyanotic">Cianóticas</SelectItem>
                    <SelectItem value="icteric">Ictéricas</SelectItem>
                    <SelectItem value="injected">Injetadas</SelectItem>
                    <SelectItem value="petechial">Petéquias</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="px-3 py-2 bg-gray-50 rounded-md text-sm">
                  {data.mucous_membranes || 'Não registrado'}
                </div>
              )}
            </div>

            {/* Capillary Refill Time */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Tempo de Preenchimento Capilar</Label>
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <Input
                    type="text"
                    value={data.capillary_refill_time || ''}
                    onChange={(e) => onChange('capillary_refill_time', e.target.value)}
                    placeholder="2"
                    className="text-sm"
                  />
                ) : (
                  <div className="w-full px-3 py-2 bg-gray-50 rounded-md text-sm">
                    {data.capillary_refill_time || 'Não registrado'}
                  </div>
                )}
                <span className="text-sm text-gray-500">segundos</span>
              </div>
            </div>
          </div>

          {/* General Condition Notes */}
          <div className="mt-6 space-y-2">
            <Label className="text-sm font-medium text-gray-700">Observações Gerais</Label>
            {isEditing ? (
              <Textarea
                value={data.skin_condition || ''}
                onChange={(e) => onChange('skin_condition', e.target.value)}
                placeholder="Descreva condições da pele, pelagem, olhos, ouvidos, etc..."
                rows={4}
                className="text-sm"
              />
            ) : (
              <div className="px-3 py-2 bg-gray-50 rounded-md text-sm min-h-[100px]">
                {data.skin_condition || 'Nenhuma observação registrada'}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}