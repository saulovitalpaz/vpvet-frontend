'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Activity,
  Camera,
  Microscope,
  Plus,
  Trash2,
  TestTube,
  FileText,
  Calendar
} from 'lucide-react';

interface DiagnosticTestsSectionProps {
  labTests: Array<{
    type: string;
    result: string;
    interpretation?: string;
    date: string;
  }>;
  imaging: Array<{
    type: string;
    result: string;
    interpretation?: string;
    date: string;
  }>;
  otherDiagnostics: Array<{
    type: string;
    result: string;
    interpretation?: string;
    date: string;
  }>;
  setLabTests: (tests: any[]) => void;
  setImaging: (imaging: any[]) => void;
  setOtherDiagnostics: (diagnostics: any[]) => void;
  isEditing: boolean;
}

export function DiagnosticTestsSection({
  labTests,
  imaging,
  otherDiagnostics,
  setLabTests,
  setImaging,
  setOtherDiagnostics,
  isEditing
}: DiagnosticTestsSectionProps) {
  const [newLabTest, setNewLabTest] = useState({
    type: '',
    result: '',
    interpretation: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [newImaging, setNewImaging] = useState({
    type: '',
    result: '',
    interpretation: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [newDiagnostic, setNewDiagnostic] = useState({
    type: '',
    result: '',
    interpretation: '',
    date: new Date().toISOString().split('T')[0]
  });

  const labTestTypes = [
    'Hemograma Completo',
    'Bioquímica Sanguínea',
    'Urinálise',
    'Análise de Fezes',
    'Cultura Microbiológica',
    'Teste de Sensibilidade Antimicrobiana',
    'Citológico',
    'Histopatológico',
    'PCR',
    'Teste Sorológico',
    'Teste de Coagulação',
    'Teste de Função Tireoidiana',
    'Outro'
  ];

  const imagingTypes = [
    'Radiografia',
    'Ultrassonografia',
    'Tomografia Computadorizada',
    'Ressonância Magnética',
    'Endoscopia',
    'Colonoscopia',
    'Broncoscopia',
    'Otoscopia',
    'Videolaringoscopia',
    'Outro'
  ];

  const diagnosticTypes = [
    'Eletrocardiograma',
    'Eletroencefalograma',
    'Teste Alérgico',
    'Teste de Tuberculina',
    'Exame Oftalmológico Completo',
    'Audiometria',
    'Teste de Pressão Arterial',
    'Teste de Função Pulmonar',
    'Biópsia',
    'Necropsia',
    'Outro'
  ];

  const addLabTest = () => {
    if (newLabTest.type && newLabTest.result) {
      setLabTests([...labTests, newLabTest]);
      setNewLabTest({
        type: '',
        result: '',
        interpretation: '',
        date: new Date().toISOString().split('T')[0]
      });
    }
  };

  const addImaging = () => {
    if (newImaging.type && newImaging.result) {
      setImaging([...imaging, newImaging]);
      setNewImaging({
        type: '',
        result: '',
        interpretation: '',
        date: new Date().toISOString().split('T')[0]
      });
    }
  };

  const addDiagnostic = () => {
    if (newDiagnostic.type && newDiagnostic.result) {
      setOtherDiagnostics([...otherDiagnostics, newDiagnostic]);
      setNewDiagnostic({
        type: '',
        result: '',
        interpretation: '',
        date: new Date().toISOString().split('T')[0]
      });
    }
  };

  const removeLabTest = (index: number) => {
    setLabTests(labTests.filter((_, i) => i !== index));
  };

  const removeImaging = (index: number) => {
    setImaging(imaging.filter((_, i) => i !== index));
  };

  const removeDiagnostic = (index: number) => {
    setOtherDiagnostics(otherDiagnostics.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-lg text-gray-900">Exames Diagnósticos</CardTitle>
              <p className="text-sm text-gray-500 mt-0.5">Resultados de exames laboratoriais, de imagem e outros testes</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-sm text-purple-800">
              <strong>Nota:</strong> Registre todos os exames realizados com seus resultados e interpretações.
              Inclua datas dos exames e valores de referência quando relevantes.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Laboratory Tests */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <Microscope className="w-5 h-5 text-blue-500" />
            <CardTitle className="text-base text-gray-900">Exames Laboratoriais</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            {/* Existing Lab Tests */}
            {labTests.length > 0 && (
              <div className="space-y-3">
                {labTests.map((test, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <TestTube className="w-4 h-4 text-blue-500" />
                        <h4 className="font-medium text-gray-900">{test.type}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">{test.date}</span>
                        {isEditing && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeLabTest(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 h-auto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Resultado</p>
                        <p className="text-sm text-gray-900 whitespace-pre-line">{test.result}</p>
                      </div>
                      {test.interpretation && (
                        <div>
                          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Interpretação</p>
                          <p className="text-sm text-gray-900">{test.interpretation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Lab Test Form */}
            {isEditing && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Tipo de Exame</Label>
                      <Select value={newLabTest.type} onValueChange={(value) => setNewLabTest({...newLabTest, type: value})}>
                        <SelectTrigger className="text-sm">
                          <SelectValue placeholder="Selecione o tipo..." />
                        </SelectTrigger>
                        <SelectContent>
                          {labTestTypes.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Data do Exame</Label>
                      <Input
                        type="date"
                        value={newLabTest.date}
                        onChange={(e) => setNewLabTest({...newLabTest, date: e.target.value})}
                        className="text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Resultado</Label>
                    <Textarea
                      value={newLabTest.result}
                      onChange={(e) => setNewLabTest({...newLabTest, result: e.target.value})}
                      placeholder="Descreva os resultados detalhadamente..."
                      rows={4}
                      className="text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Interpretação</Label>
                    <Textarea
                      value={newLabTest.interpretation}
                      onChange={(e) => setNewLabTest({...newLabTest, interpretation: e.target.value})}
                      placeholder="Interpretação dos resultados..."
                      rows={3}
                      className="text-sm"
                    />
                  </div>

                  <Button
                    onClick={addLabTest}
                    disabled={!newLabTest.type || !newLabTest.result}
                    className="w-full gap-2 bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar Exame Laboratorial
                  </Button>
                </div>
              </div>
            )}

            {!isEditing && labTests.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Microscope className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>Nenhum exame laboratorial registrado</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Imaging */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <Camera className="w-5 h-5 text-green-500" />
            <CardTitle className="text-base text-gray-900">Exames de Imagem</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            {/* Existing Imaging */}
            {imaging.length > 0 && (
              <div className="space-y-3">
                {imaging.map((img, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <Camera className="w-4 h-4 text-green-500" />
                        <h4 className="font-medium text-gray-900">{img.type}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">{img.date}</span>
                        {isEditing && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeImaging(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 h-auto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Achados</p>
                        <p className="text-sm text-gray-900 whitespace-pre-line">{img.result}</p>
                      </div>
                      {img.interpretation && (
                        <div>
                          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Interpretação</p>
                          <p className="text-sm text-gray-900">{img.interpretation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Imaging Form */}
            {isEditing && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Tipo de Exame</Label>
                      <Select value={newImaging.type} onValueChange={(value) => setNewImaging({...newImaging, type: value})}>
                        <SelectTrigger className="text-sm">
                          <SelectValue placeholder="Selecione o tipo..." />
                        </SelectTrigger>
                        <SelectContent>
                          {imagingTypes.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Data do Exame</Label>
                      <Input
                        type="date"
                        value={newImaging.date}
                        onChange={(e) => setNewImaging({...newImaging, date: e.target.value})}
                        className="text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Achados</Label>
                    <Textarea
                      value={newImaging.result}
                      onChange={(e) => setNewImaging({...newImaging, result: e.target.value})}
                      placeholder="Descreva os achados do exame..."
                      rows={4}
                      className="text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Interpretação</Label>
                    <Textarea
                      value={newImaging.interpretation}
                      onChange={(e) => setNewImaging({...newImaging, interpretation: e.target.value})}
                      placeholder="Interpretação dos achados..."
                      rows={3}
                      className="text-sm"
                    />
                  </div>

                  <Button
                    onClick={addImaging}
                    disabled={!newImaging.type || !newImaging.result}
                    className="w-full gap-2 bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar Exame de Imagem
                  </Button>
                </div>
              </div>
            )}

            {!isEditing && imaging.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Camera className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>Nenhum exame de imagem registrado</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Other Diagnostics */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-orange-500" />
            <CardTitle className="text-base text-gray-900">Outros Testes Diagnósticos</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            {/* Existing Other Diagnostics */}
            {otherDiagnostics.length > 0 && (
              <div className="space-y-3">
                {otherDiagnostics.map((test, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-orange-500" />
                        <h4 className="font-medium text-gray-900">{test.type}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">{test.date}</span>
                        {isEditing && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeDiagnostic(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 h-auto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Resultado</p>
                        <p className="text-sm text-gray-900 whitespace-pre-line">{test.result}</p>
                      </div>
                      {test.interpretation && (
                        <div>
                          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Interpretação</p>
                          <p className="text-sm text-gray-900">{test.interpretation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Diagnostic Form */}
            {isEditing && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Tipo de Teste</Label>
                      <Select value={newDiagnostic.type} onValueChange={(value) => setNewDiagnostic({...newDiagnostic, type: value})}>
                        <SelectTrigger className="text-sm">
                          <SelectValue placeholder="Selecione o tipo..." />
                        </SelectTrigger>
                        <SelectContent>
                          {diagnosticTypes.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Data do Teste</Label>
                      <Input
                        type="date"
                        value={newDiagnostic.date}
                        onChange={(e) => setNewDiagnostic({...newDiagnostic, date: e.target.value})}
                        className="text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Resultado</Label>
                    <Textarea
                      value={newDiagnostic.result}
                      onChange={(e) => setNewDiagnostic({...newDiagnostic, result: e.target.value})}
                      placeholder="Descreva os resultados do teste..."
                      rows={4}
                      className="text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Interpretação</Label>
                    <Textarea
                      value={newDiagnostic.interpretation}
                      onChange={(e) => setNewDiagnostic({...newDiagnostic, interpretation: e.target.value})}
                      placeholder="Interpretação dos resultados..."
                      rows={3}
                      className="text-sm"
                    />
                  </div>

                  <Button
                    onClick={addDiagnostic}
                    disabled={!newDiagnostic.type || !newDiagnostic.result}
                    className="w-full gap-2 bg-orange-600 hover:bg-orange-700"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar Teste Diagnóstico
                  </Button>
                </div>
              </div>
            )}

            {!isEditing && otherDiagnostics.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>Nenhum outro teste diagnóstico registrado</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}