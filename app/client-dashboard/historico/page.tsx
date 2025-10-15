'use client';

import { useState, useRef } from 'react';
import { usePublicAuth } from '@/contexts/PublicAuthContext';
import ClientSidebar from '@/components/ClientSidebar';
import {
  Clock,
  Plus,
  FileText,
  Image,
  Folder,
  X,
  Upload,
  Calendar,
  Heart,
  Trash2,
  Eye,
  Menu,
  Camera
} from 'lucide-react';
import Link from 'next/link';

interface HistoricalDocument {
  id: string;
  title: string;
  description?: string;
  fileUrl: string;
  fileType: 'pdf' | 'image' | 'document';
  fileSize: number;
  uploadDate: string;
  documentDate: string;
  petName: string;
  category: 'exam' | 'consultation' | 'vaccination' | 'other';
}

export default function HistoricoPage() {
  const { clientData, pets, loading } = usePublicAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [documentDate, setDocumentDate] = useState('');
  const [documentDescription, setDocumentDescription] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock historical documents
  const [documents, setDocuments] = useState<HistoricalDocument[]>([]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full w-12 h-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!clientData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acesso Restrito</h1>
          <p className="text-gray-600 mb-6">Você precisa estar autenticado para acessar esta página.</p>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
          >
            Voltar para o início
          </Link>
        </div>
      </div>
    );
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleCameraCapture = async () => {
    try {
      // Check if camera API is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Seu navegador não suporta acesso à câmera.');
        return;
      }

      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });

      // Create video element to show camera preview
      const video = document.createElement('video');
      video.srcObject = stream;
      video.style.display = 'block';

      // Create modal for camera preview
      const modal = document.createElement('div');
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
      `;

      const container = document.createElement('div');
      container.style.cssText = `
        background: white;
        padding: 20px;
        border-radius: 8px;
        max-width: 90%;
        max-height: 90%;
        display: flex;
        flex-direction: column;
        align-items: center;
      `;

      const title = document.createElement('h3');
      title.textContent = 'Tirar foto do documento';
      title.style.cssText = 'margin-bottom: 15px; color: #1f2937;';

      const captureBtn = document.createElement('button');
      captureBtn.textContent = '📸 Capturar Foto';
      captureBtn.style.cssText = `
        background: #10b981;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 6px;
        font-size: 16px;
        cursor: pointer;
        margin: 10px;
      `;

      const cancelBtn = document.createElement('button');
      cancelBtn.textContent = 'Cancelar';
      cancelBtn.style.cssText = `
        background: #ef4444;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 6px;
        font-size: 16px;
        cursor: pointer;
        margin: 10px;
      `;

      video.style.cssText = 'max-width: 100%; max-height: 400px; border-radius: 8px; margin-bottom: 15px;';

      const handleCapture = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);

        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `documento_${Date.now()}.jpg`, { type: 'image/jpeg' });
            setSelectedFiles(prev => [...prev, file]);
            document.body.removeChild(modal);
            stream.getTracks().forEach(track => track.stop());
          }
        }, 'image/jpeg');
      };

      captureBtn.onclick = handleCapture;
      cancelBtn.onclick = () => {
        document.body.removeChild(modal);
        stream.getTracks().forEach(track => track.stop());
      };

      container.appendChild(title);
      container.appendChild(video);
      container.appendChild(captureBtn);
      container.appendChild(cancelBtn);
      modal.appendChild(container);
      document.body.appendChild(modal);

      video.play();
    } catch (error) {
      console.error('Erro ao acessar câmera:', error);
      alert('Não foi possível acessar a câmera. Verifique se você deu permissão.');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return <FileText className="w-6 h-6 text-red-500" />;
      case 'image':
        return <Image className="w-6 h-6 text-green-500" />;
      default:
        return <FileText className="w-6 h-6 text-blue-500" />;
    }
  };

  const simulateUpload = async () => {
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setUploadProgress(i);
    }

    // Add documents to the list
    const newDocs: HistoricalDocument[] = selectedFiles.map((file, index) => ({
      id: `doc-${Date.now()}-${index}`,
      title: file.name,
      description: documentDescription || `Documento adicionado em ${new Date().toLocaleDateString('pt-BR')}`,
      fileUrl: URL.createObjectURL(file),
      fileType: file.type.startsWith('image/') ? 'image' : file.type === 'application/pdf' ? 'pdf' : 'document',
      fileSize: file.size,
      uploadDate: new Date().toISOString(),
      documentDate: documentDate || new Date().toISOString().split('T')[0],
      petName: pets[0]?.name || 'Pet não especificado',
      category: 'other' as const
    }));

    setDocuments(prev => [...newDocs, ...prev]);
    setSelectedFiles([]);
    setIsUploading(false);
    setShowUploadModal(false);
    setUploadProgress(0);
    setDocumentDate('');
    setDocumentDescription('');
  };

  const deleteDocument = (docId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== docId));
  };

  const groupedDocuments = documents.reduce((acc, doc) => {
    const category = doc.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(doc);
    return acc;
  }, {} as Record<string, HistoricalDocument[]>);

  const categoryLabels = {
    exam: 'Exames',
    consultation: 'Consultas',
    vaccination: 'Vacinas',
    other: 'Outros Documentos'
  };

  const categoryColors = {
    exam: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    consultation: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    vaccination: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    other: 'bg-gray-50 text-gray-700 border-gray-200'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50 flex relative">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <ClientSidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <main className="flex-1 lg:ml-0 relative z-10">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 h-[76px] relative z-20">
          <div className="flex items-center justify-between h-full">
            {/* Mobile menu button - Hide on tablet and desktop */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>

            <div className="hidden lg:flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Histórico Médico
                </h1>
                <p className="text-sm text-gray-500">
                  Documentos e registros importantes
                </p>
              </div>
            </div>

            {/* Mobile title */}
            <h1 className="lg:hidden text-lg font-bold text-gray-900">
              Histórico Médico
            </h1>

            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => setShowUploadModal(true)}
                className="inline-flex items-center px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Documento
              </button>

              <div className="hidden sm:block w-px h-8 bg-gray-200"></div>

              <div className="hidden sm:flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {clientData?.tutor_name?.split(' ').map(n => n[0]).join('').substring(0, 2) || 'T'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {clientData?.tutor_name || 'Tutor'}
                  </p>
                  <p className="text-xs text-gray-500">Portal do Tutor</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="p-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white border border-gray-200/60 shadow-sm rounded-lg p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-emerald-700" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total de Documentos</p>
                  <p className="text-2xl font-bold text-gray-900">{documents.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200/60 shadow-sm rounded-lg p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <Image className="w-6 h-6 text-emerald-700" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Imagens</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {documents.filter(doc => doc.fileType === 'image').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200/60 shadow-sm rounded-lg p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-emerald-700" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">PDFs</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {documents.filter(doc => doc.fileType === 'pdf').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200/60 shadow-sm rounded-lg p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <Folder className="w-6 h-6 text-emerald-700" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Categorias</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Object.keys(groupedDocuments).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Documents List */}
          {Object.keys(groupedDocuments).length > 0 ? (
            <div className="space-y-8">
              {Object.entries(groupedDocuments).map(([category, docs]) => (
                <div key={category}>
                  <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mr-3 ${categoryColors[category as keyof typeof categoryColors]}`}>
                      {categoryLabels[category as keyof typeof categoryLabels]}
                    </span>
                    <span className="text-sm text-gray-500">({docs.length} documentos)</span>
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {docs.map((doc) => (
                      <div key={doc.id} className="bg-white border border-gray-200/60 hover:border-gray-300 hover:shadow-sm transition-all duration-200 rounded-lg">
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              {getFileIcon(doc.fileType)}
                              <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-medium text-gray-900 truncate">
                                  {doc.title}
                                </h3>
                                <p className="text-xs text-gray-500">
                                  {formatFileSize(doc.fileSize)}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => deleteDocument(doc.id)}
                              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                              title="Remover documento"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="space-y-2 text-xs text-gray-600">
                            <div className="flex items-center">
                              <Heart className="w-3 h-3 mr-1 text-gray-400" />
                              {doc.petName}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                              Data: {new Date(doc.documentDate).toLocaleDateString('pt-BR')}
                            </div>
                            <div className="flex items-center">
                              <Upload className="w-3 h-3 mr-1 text-gray-400" />
                              Enviado: {new Date(doc.uploadDate).toLocaleDateString('pt-BR')}
                            </div>
                          </div>

                          {doc.description && (
                            <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                              {doc.description}
                            </p>
                          )}

                          <div className="mt-3 flex items-center justify-between">
                            <button
                              className="inline-flex items-center px-2 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 rounded hover:bg-emerald-100 transition-colors"
                              onClick={() => window.open(doc.fileUrl, '_blank')}
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              Visualizar
                            </button>
                            <a
                              href={doc.fileUrl}
                              download={doc.title}
                              className="inline-flex items-center px-2 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 rounded hover:bg-emerald-100 transition-colors"
                            >
                              Download
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Folder className="w-24 h-24 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Nenhum documento no histórico</h2>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Adicione exames anteriores, imagens, vacinas e outros documentos importantes para manter um histórico completo da saúde do seu pet.
              </p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Adicionar Primeiro Documento
              </button>
            </div>
          )}

          {/* Tips Section */}
          <div className="mt-12 bg-emerald-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-emerald-900 mb-4">Dicas para organizar o histórico</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-sm text-emerald-800">
                <h4 className="font-medium mb-1">📁 Organização</h4>
                <p>Categorize seus documentos para encontrar facilmente o que precisa.</p>
              </div>
              <div className="text-sm text-emerald-800">
                <h4 className="font-medium mb-1">📸 Qualidade</h4>
                <p>Adicione fotos claras de exames e documentos para melhor visualização.</p>
              </div>
              <div className="text-sm text-emerald-800">
                <h4 className="font-medium mb-1">🔄 Backup</h4>
                <p>Mantenha seus documentos importantes sempre acessíveis online.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setShowUploadModal(false)}></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Adicionar Documentos</h3>
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {!isUploading ? (
                  <>
                    {/* Date and Description Fields */}
                    <div className="space-y-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Data do Documento *
                        </label>
                        <input
                          type="date"
                          value={documentDate}
                          onChange={(e) => setDocumentDate(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          max={new Date().toISOString().split('T')[0]}
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Data em que o documento foi originalmente emitido
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Descrição (opcional)
                        </label>
                        <textarea
                          value={documentDescription}
                          onChange={(e) => setDocumentDescription(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          rows={3}
                          placeholder="Ex: Exame de sangue rotina, Vacinação antirrábica..."
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Selecione os arquivos
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-sm text-gray-600 mb-2">
                          Arraste arquivos aqui ou clique para selecionar
                        </p>
                        <p className="text-xs text-gray-500 mb-4">
                          PDFs, imagens (JPG, PNG) e documentos
                        </p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                        <div className="flex flex-col sm:flex-row gap-2 justify-center">
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors text-sm"
                          >
                            Selecionar Arquivos
                          </button>

                          {/* Camera Button for mobile */}
                          <button
                            type="button"
                            onClick={handleCameraCapture}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                          >
                            📷 Tirar Foto
                          </button>
                        </div>
                      </div>
                    </div>

                    {selectedFiles.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Arquivos selecionados ({selectedFiles.length})
                        </h4>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {selectedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <div className="flex items-center gap-2">
                                {getFileIcon(file.type)}
                                <span className="text-sm text-gray-700 truncate max-w-xs">
                                  {file.name}
                                </span>
                                <span className="text-xs text-gray-500">
                                  ({formatFileSize(file.size)})
                                </span>
                              </div>
                              <button
                                onClick={() => removeFile(index)}
                                className="p-1 text-gray-400 hover:text-red-600"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pet relacionado
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500">
                        {pets.map((pet) => (
                          <option key={pet.id} value={pet.id}>
                            {pet.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Categoria
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500">
                        <option value="exam">Exame</option>
                        <option value="consultation">Consulta</option>
                        <option value="vaccination">Vacina</option>
                        <option value="other">Outro</option>
                      </select>
                    </div>
                  </>
                ) : (
                  <div className="mb-4">
                    <div className="text-center">
                      <div className="animate-spin rounded-full w-12 h-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                      <p className="text-sm text-gray-600 mb-2">Enviando arquivos...</p>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">{uploadProgress}%</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {!isUploading && (
                  <>
                    <button
                      onClick={simulateUpload}
                      disabled={selectedFiles.length === 0}
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-emerald-600 text-base font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Fazer Upload
                    </button>
                    <button
                      onClick={() => setShowUploadModal(false)}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Cancelar
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}