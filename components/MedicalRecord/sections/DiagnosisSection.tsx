'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert } from '@/components/ui/alert';
import {
  FileText,
  CheckCircle,
  AlertTriangle,
  Plus,
  X,
  Calendar,
  Clipboard
} from 'lucide-react';

interface DiagnosisSectionProps {
  data: any;
  differentialDiagnoses: string[];
  setDifferentialDiagnoses: (diagnoses: string[]) => void;
  onChange: (field: string, value: string) => void;
  isEditing: boolean;
}

export function DiagnosisSection({
  data,
  differentialDiagnoses,
  setDifferentialDiagnoses,
  onChange,
  isEditing
}: DiagnosisSectionProps) {
  const [newDifferentialDiagnosis, setNewDifferentialDiagnosis] = useState('');
  const [showAddDifferential, setShowAddDifferential] = useState(false);

  const addDifferentialDiagnosis = () => {
    if (newDifferentialDiagnosis.trim()) {
      setDifferentialDiagnoses([...differentialDiagnoses, newDifferentialDiagnosis.trim()]);
      setNewDifferentialDiagnosis('');
      setShowAddDifferential(false);
    }
  };

  const removeDifferentialDiagnosis = (index: number) => {
    setDifferentialDiagnoses(differentialDiagnoses.filter((_, i) => i !== index));
  };

  const getDiagnosisStatusColor = (diagnosis: string, type: 'provisional' | 'definitive') => {
    if (type === 'provisional') {
      return diagnosis ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-gray-50 text-gray-500 border-gray-200';
    } else {
      return diagnosis ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-500 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg text-gray-900">Diagnóstico</CardTitle>
              <p className="text-sm text-gray-500 mt-0.5">Diagnóstico diferencial, provisório e definitivo</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Alert variant="info">
            <div>
              <p className="text-sm">
                <strong>Importante:</strong> Registre os diagnósticos diferenciais considerados,
                o diagnóstico provisório inicial e, quando confirmado, o diagnóstico definitivo.
              </p>
            </div>
          </Alert>
        </CardContent>
      </Card>

      {/* Differential Diagnosis */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <CardTitle className="text-base text-gray-900">Diagnósticos Diferenciais</CardTitle>
            </div>
            {isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddDifferential(!showAddDifferential)}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Adicionar
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {/* Existing Differential Diagnoses */}
            {differentialDiagnoses.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {differentialDiagnoses.map((diagnosis, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                  >
                    {diagnosis}
                    {isEditing && (
                      <button
                        onClick={() => removeDifferentialDiagnosis(index)}
                        className="ml-2 hover:text-amber-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>Nenhum diagnóstico diferencial registrado</p>
              </div>
            )}

            {/* Add New Differential Diagnosis */}
            {isEditing && showAddDifferential && (
              <div className="border-2 border-dashed border-amber-300 rounded-lg p-4 bg-amber-50">
                <div className="space-y-3">
                  <Input
                    type="text"
                    value={newDifferentialDiagnosis}
                    onChange={(e) => setNewDifferentialDiagnosis(e.target.value)}
                    placeholder="Digite o diagnóstico diferencial..."
                    className="text-sm"
                    onKeyPress={(e) => e.key === 'Enter' && addDifferentialDiagnosis()}
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={addDifferentialDiagnosis}
                      disabled={!newDifferentialDiagnosis.trim()}
                      size="sm"
                      className="bg-amber-600 hover:bg-amber-700"
                    >
                      Adicionar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowAddDifferential(false);
                        setNewDifferentialDiagnosis('');
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Differential Diagnosis Notes */}
          {isEditing ? (
            <div className="mt-4 space-y-2">
              <Label className="text-sm font-medium text-gray-700">Considerações sobre Diagnósticos Diferenciais</Label>
              <Textarea
                value={data.differential_notes || ''}
                onChange={(e) => onChange('differential_notes', e.target.value)}
                placeholder="Descreva o raciocínio para considerar ou descartar cada diagnóstico diferencial..."
                rows={4}
                className="text-sm"
              />
            </div>
          ) : (
            data.differential_notes && (
              <div className="mt-4 space-y-2">
                <Label className="text-sm font-medium text-gray-700">Considerações</Label>
                <div className="px-3 py-2 bg-gray-50 rounded-md text-sm">
                  {data.differential_notes}
                </div>
              </div>
            )
          )}
        </CardContent>
      </Card>

      {/* Provisional Diagnosis */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <Clipboard className="w-5 h-5 text-blue-500" />
            <CardTitle className="text-base text-gray-900">Diagnóstico Provisório</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {isEditing ? (
            <Textarea
              value={data.provisional_diagnosis || ''}
              onChange={(e) => onChange('provisional_diagnosis', e.target.value)}
              placeholder="Registre o diagnóstico inicial baseado nos achados clínicos e exames disponíveis..."
              rows={4}
              className="text-sm"
            />
          ) : (
            <div className="px-3 py-2 bg-gray-50 rounded-md text-sm min-h-[100px]">
              {data.provisional_diagnosis || (
                <span className="text-gray-400 italic">Nenhum diagnóstico provisório registrado</span>
              )}
            </div>
          )}

          {/* Diagnosis Date */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Data do Diagnóstico
              </Label>
              {isEditing ? (
                <Input
                  type="date"
                  value={data.diagnosis_date || new Date().toISOString().split('T')[0]}
                  onChange={(e) => onChange('diagnosis_date', e.target.value)}
                  className="text-sm"
                />
              ) : (
                <div className="px-3 py-2 bg-gray-50 rounded-md text-sm">
                  {data.diagnosis_date || new Date().toISOString().split('T')[0]}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Confiança no Diagnóstico</Label>
              {isEditing ? (
                <Input
                  type="text"
                  value={data.diagnosis_confidence || ''}
                  onChange={(e) => onChange('diagnosis_confidence', e.target.value)}
                  placeholder="Ex: Alta, Moderada, Baixa..."
                  className="text-sm"
                />
              ) : (
                <div className="px-3 py-2 bg-gray-50 rounded-md text-sm">
                  {data.diagnosis_confidence || 'Não registrado'}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Definitive Diagnosis */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <CardTitle className="text-base text-gray-900">Diagnóstico Definitivo</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {isEditing ? (
            <Textarea
              value={data.definitive_diagnosis || ''}
              onChange={(e) => onChange('definitive_diagnosis', e.target.value)}
              placeholder="Registre o diagnóstico confirmado após exames complementares ou evolução do caso..."
              rows={4}
              className="text-sm"
            />
          ) : (
            <div className="px-3 py-2 bg-gray-50 rounded-md text-sm min-h-[100px]">
              {data.definitive_diagnosis || (
                <span className="text-gray-400 italic">Nenhum diagnóstico definitivo registrado</span>
              )}
            </div>
          )}

          {/* Diagnosis Confirmation */}
          {data.definitive_diagnosis && (
            <div className="mt-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Método de Confirmação</Label>
                  {isEditing ? (
                    <Input
                      type="text"
                      value={data.confirmation_method || ''}
                      onChange={(e) => onChange('confirmation_method', e.target.value)}
                      placeholder="Ex: Histopatologia, Cultura, Imagem..."
                      className="text-sm"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 rounded-md text-sm">
                      {data.confirmation_method || 'Não registrado'}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Data da Confirmação</Label>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={data.confirmation_date || ''}
                      onChange={(e) => onChange('confirmation_date', e.target.value)}
                      className="text-sm"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 rounded-md text-sm">
                      {data.confirmation_date || 'Não registrado'}
                    </div>
                  )}
                </div>
              </div>

              {/* Diagnostic Criteria */}
              {isEditing ? (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Critérios Diagnósticos</Label>
                  <Textarea
                    value={data.diagnostic_criteria || ''}
                    onChange={(e) => onChange('diagnostic_criteria', e.target.value)}
                    placeholder="Liste os critérios utilizados para confirmar o diagnóstico..."
                    rows={3}
                    className="text-sm"
                  />
                </div>
              ) : (
                data.diagnostic_criteria && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Critérios Diagnósticos</Label>
                    <div className="px-3 py-2 bg-gray-50 rounded-md text-sm">
                      {data.diagnostic_criteria}
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Diagnostic Summary */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-base text-gray-900">Resumo Diagnóstico</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {isEditing ? (
            <Textarea
              value={data.diagnostic_summary || ''}
              onChange={(e) => onChange('diagnostic_summary', e.target.value)}
              placeholder="Faça um resumo completo do processo diagnóstico, incluindo principais achados, exames realizados e conclusão final..."
              rows={6}
              className="text-sm"
            />
          ) : (
            <div className="px-3 py-2 bg-gray-50 rounded-md text-sm min-h-[150px]">
              {data.diagnostic_summary || (
                <span className="text-gray-400 italic">Nenhum resumo diagnóstico registrado</span>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Diagnostic Status Overview */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50 to-green-50">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <AlertTriangle className="w-5 h-5 text-amber-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Diferenciais</span>
              </div>
              <Badge className={differentialDiagnoses.length > 0 ? "bg-amber-100 text-amber-800 border-amber-200" : "bg-gray-100 text-gray-600 border-gray-200"}>
                {differentialDiagnoses.length} considerados
              </Badge>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Clipboard className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Provisório</span>
              </div>
              <Badge className={getDiagnosisStatusColor(data.provisional_diagnosis, 'provisional')}>
                {data.provisional_diagnosis ? 'Registrado' : 'Pendente'}
              </Badge>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Definitivo</span>
              </div>
              <Badge className={getDiagnosisStatusColor(data.definitive_diagnosis, 'definitive')}>
                {data.definitive_diagnosis ? 'Confirmado' : 'Pendente'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}