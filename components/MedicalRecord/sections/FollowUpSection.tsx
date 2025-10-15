'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  Heart,
  FileText,
  Activity
} from 'lucide-react';

interface FollowUpSectionProps {
  data: any;
  onChange: (field: string, value: string) => void;
  isEditing: boolean;
}

export function FollowUpSection({
  data,
  onChange,
  isEditing
}: FollowUpSectionProps) {
  const prognosisTypes = [
    'Excelente',
    'Bom',
    'Reservado',
    'Ruim',
    'Grave'
  ];

  const qualityOfLifeScores = [
    'Excelente - Normal, sem limitações',
    'Bom - Limitações mínimas',
    'Regular - Limitações moderadas, afeta atividades diárias',
    'Ruim - Limitações severas, conforto prejudicado',
    'Pobre - Sofrimento constante, sem qualidade de vida'
  ];

  const getPrognosisColor = (prognosis?: string) => {
    switch (prognosis) {
      case 'Excelente': return 'bg-green-100 text-green-700 border-green-200';
      case 'Bom': return 'bg-green-50 text-green-600 border-green-200';
      case 'Reservado': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Ruim': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Grave': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getFollowUpStatus = (followUpDate?: string) => {
    if (!followUpDate) return { status: 'none', color: 'bg-gray-100 text-gray-600 border-gray-200', text: 'Não agendado' };

    const today = new Date();
    const dueDate = new Date(followUpDate);
    const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilDue < 0) {
      return { status: 'overdue', color: 'bg-red-100 text-red-700 border-red-200', text: 'Atrasado' };
    } else if (daysUntilDue === 0) {
      return { status: 'today', color: 'bg-blue-100 text-blue-700 border-blue-200', text: 'Hoje' };
    } else if (daysUntilDue <= 7) {
      return { status: 'soon', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', text: 'Esta semana' };
    } else {
      return { status: 'future', color: 'bg-green-100 text-green-700 border-green-200', text: 'Agendado' };
    }
  };

  const followUpStatus = getFollowUpStatus(data.follow_up_date);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg text-gray-900">Acompanhamento e Prognóstico</CardTitle>
              <p className="text-sm text-gray-500 mt-0.5">Plano de acompanhamento e avaliação prognóstica</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Importante:</strong> Defina claramente o prognóstico, datas de acompanhamento
              e instruções específicas para o monitoramento do paciente.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Prognosis */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <Heart className="w-5 h-5 text-red-500" />
            <CardTitle className="text-base text-gray-900">Prognóstico</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Prognóstico</Label>
                {isEditing ? (
                  <Select value={data.prognosis || ''} onValueChange={(value) => onChange('prognosis', value)}>
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {prognosisTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="px-3 py-2 bg-gray-50 rounded-md text-sm">
                    {data.prognosis ? (
                      <Badge className={getPrognosisColor(data.prognosis)}>
                        {data.prognosis}
                      </Badge>
                    ) : (
                      'Não registrado'
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Data da Avaliação Prognóstica</Label>
                {isEditing ? (
                  <Input
                    type="date"
                    value={data.prognosis_date || new Date().toISOString().split('T')[0]}
                    onChange={(e) => onChange('prognosis_date', e.target.value)}
                    className="text-sm"
                  />
                ) : (
                  <div className="px-3 py-2 bg-gray-50 rounded-md text-sm">
                    {data.prognosis_date || new Date().toISOString().split('T')[0]}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Justificativa do Prognóstico</Label>
              {isEditing ? (
                <Textarea
                  value={data.prognosis_justification || ''}
                  onChange={(e) => onChange('prognosis_justification', e.target.value)}
                  placeholder="Explique os fatores que influenciam o prognóstico, including gravidade, resposta esperada ao tratamento, complicações potenciais..."
                  rows={4}
                  className="text-sm"
                />
              ) : (
                <div className="px-3 py-2 bg-gray-50 rounded-md text-sm min-h-[100px]">
                  {data.prognosis_justification || (
                    <span className="text-gray-400 italic">Nenhuma justificativa registrada</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Follow-up Schedule */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-blue-500" />
            <CardTitle className="text-base text-gray-900">Agenda de Acompanhamento</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Próxima Consulta
                </Label>
                {isEditing ? (
                  <Input
                    type="date"
                    value={data.follow_up_date || ''}
                    onChange={(e) => onChange('follow_up_date', e.target.value)}
                    className="text-sm"
                  />
                ) : (
                  <div className="px-3 py-2 bg-gray-50 rounded-md text-sm">
                    {data.follow_up_date ? (
                      <div className="flex items-center gap-2">
                        <span>{data.follow_up_date}</span>
                        <Badge className={followUpStatus.color}>
                          {followUpStatus.text}
                        </Badge>
                      </div>
                    ) : (
                      'Não agendado'
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Data de Reavaliação
                </Label>
                {isEditing ? (
                  <Input
                    type="date"
                    value={data.recheck_date || ''}
                    onChange={(e) => onChange('recheck_date', e.target.value)}
                    className="text-sm"
                  />
                ) : (
                  <div className="px-3 py-2 bg-gray-50 rounded-md text-sm">
                    {data.recheck_date || 'Não agendado'}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Instruções de Acompanhamento</Label>
              {isEditing ? (
                <Textarea
                  value={data.follow_up_instructions || ''}
                  onChange={(e) => onChange('follow_up_instructions', e.target.value)}
                  placeholder="Descreva o que o tutor deve observar, sinais de alerta, quando retornar, ajustes no tratamento..."
                  rows={4}
                  className="text-sm"
                />
              ) : (
                <div className="px-3 py-2 bg-gray-50 rounded-md text-sm min-h-[100px]">
                  {data.follow_up_instructions || (
                    <span className="text-gray-400 italic">Nenhuma instrução registrada</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quality of Life Assessment */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <Heart className="w-5 h-5 text-pink-500" />
            <CardTitle className="text-base text-gray-900">Avaliação da Qualidade de Vida</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Score de Qualidade de Vida</Label>
              {isEditing ? (
                <Select value={data.quality_of_life || ''} onValueChange={(value) => onChange('quality_of_life', value)}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {qualityOfLifeScores.map(score => (
                      <SelectItem key={score} value={score}>{score}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="px-3 py-2 bg-gray-50 rounded-md text-sm">
                  {data.quality_of_life || 'Não avaliado'}
                </div>
              )}
            </div>

            {data.quality_of_life && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Observações sobre Qualidade de Vida</Label>
                {isEditing ? (
                  <Textarea
                    value={data.quality_of_life_notes || ''}
                    onChange={(e) => onChange('quality_of_life_notes', e.target.value)}
                    placeholder="Descreva aspectos específicos que afetam a qualidade de vida: dor, mobilidade, apetite, comportamento, interação social..."
                    rows={3}
                    className="text-sm"
                  />
                ) : (
                  <div className="px-3 py-2 bg-gray-50 rounded-md text-sm min-h-[80px]">
                    {data.quality_of_life_notes || (
                      <span className="text-gray-400 italic">Nenhuma observação registrada</span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Emergency Instructions */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <CardTitle className="text-base text-gray-900">Instruções de Emergência</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {isEditing ? (
            <Textarea
              value={data.emergency_instructions || ''}
              onChange={(e) => onChange('emergency_instructions', e.target.value)}
              placeholder="Descreva sinais de emergência que requerem atenção imediata, contato de emergência, procedimentos de primeiros socorros, quando procurar emergência veterinária..."
              rows={4}
              className="text-sm"
            />
          ) : (
            <div className="px-3 py-2 bg-gray-50 rounded-md text-sm min-h-[100px]">
              {data.emergency_instructions || (
                <span className="text-gray-400 italic">Nenhuma instrução de emergência registrada</span>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Euthanasia Consideration */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-gray-600" />
            <CardTitle className="text-base text-gray-900">Considerações sobre Eutanásia (se aplicável)</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {isEditing ? (
            <Textarea
              value={data.euthanasia_consideration || ''}
              onChange={(e) => onChange('euthanasia_consideration', e.target.value)}
              placeholder="Documente discussões sobre qualidade de vida, critérios para decisão, alternativas consideradas, orientações éticas, planos finais..."
              rows={4}
              className="text-sm"
            />
          ) : (
            <div className="px-3 py-2 bg-gray-50 rounded-md text-sm min-h-[100px]">
              {data.euthanasia_consideration || (
                <span className="text-gray-400 italic">Nenhuma consideração registrada</span>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Notes */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-gray-500" />
            <CardTitle className="text-base text-gray-900">Notas de Acompanhamento</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {isEditing ? (
            <Textarea
              value={data.notes || ''}
              onChange={(e) => onChange('notes', e.target.value)}
              placeholder="Notas adicionais sobre o acompanhamento, progresso esperado, preocupações, recomendações finais..."
              rows={4}
              className="text-sm"
            />
          ) : (
            <div className="px-3 py-2 bg-gray-50 rounded-md text-sm min-h-[100px]">
              {data.notes || (
                <span className="text-gray-400 italic">Nenhuma nota adicional</span>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Veterinarian Notes */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
            <CardTitle className="text-base text-gray-900">Anotações do Veterinário</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {isEditing ? (
            <Textarea
              value={data.veterinarian_notes || ''}
              onChange={(e) => onChange('veterinarian_notes', e.target.value)}
              placeholder="Anotações profissionais internas, impressões clínicas, plano pessoal de acompanhamento, observações não compartilhadas com o tutor..."
              rows={4}
              className="text-sm"
            />
          ) : (
            <div className="px-3 py-2 bg-gray-50 rounded-md text-sm min-h-[100px]">
              {data.veterinarian_notes || (
                <span className="text-gray-400 italic">Nenhuma anotação do veterinário</span>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Follow-up Status Overview */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Calendar className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Próximo Acompanhamento</span>
              </div>
              <Badge className={followUpStatus.color}>
                {followUpStatus.text}
              </Badge>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Heart className="w-5 h-5 text-red-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Prognóstico</span>
              </div>
              <Badge className={data.prognosis ? getPrognosisColor(data.prognosis) : 'bg-gray-100 text-gray-600 border-gray-200'}>
                {data.prognosis || 'Não definido'}
              </Badge>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Qualidade de Vida</span>
              </div>
              <Badge className={data.quality_of_life ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'}>
                {data.quality_of_life ? 'Avaliada' : 'Não avaliada'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}