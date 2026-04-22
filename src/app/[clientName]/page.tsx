'use client';

import { useEffect, useState, use } from 'react';
import Image from 'next/image';
import { getClientInfo } from '@/actions/client';
import { FileBrowserService } from '@/services/filebrowser';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { FolderOpen, ShieldCheck, File as FileIcon, Download, X, Image as ImageIcon, FileText, ChevronLeft, Home } from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: Promise<{
    clientName: string;
  }>;
}

export default function ClientPage({ params }: PageProps) {
  const { clientName } = use(params);
  const [clientInfo, setClientInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [previewFile, setPreviewFile] = useState<any>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [currentPath, setCurrentPath] = useState<string>('');
  const fileBrowser = new FileBrowserService();

  useEffect(() => {
    async function loadClientInfo() {
      const info = await getClientInfo(clientName);
      setClientInfo(info);
      setLoading(false);
    }
    loadClientInfo();
  }, [clientName]);

  const loadFiles = async (path: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/files?clientName=${clientName}&path=${encodeURIComponent(path)}`);
      const data = await response.json();
      setClientInfo({ ...clientInfo, files: data.items || [] });
      setCurrentPath(path);
    } catch (error) {
      console.error('Error loading files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileClick = async (file: any) => {
    if (file.isDir) {
      // Navigate into directory
      const newPath = currentPath ? `${currentPath}/${file.name}` : `/${file.name}`;
      await loadFiles(newPath);
    } else {
      // Preview file
      const apiUrl = `/api/file?path=${encodeURIComponent(file.path)}`;
      setPreviewFile(file);
      setPreviewUrl(apiUrl);
    }
  };

  const handleBack = async () => {
    if (!currentPath) return;
    const pathParts = currentPath.split('/').filter(Boolean);
    pathParts.pop();
    const newPath = pathParts.length > 0 ? `/${pathParts.join('/')}` : '';
    await loadFiles(newPath);
  };

  const handleBreadcrumbClick = async (index: number) => {
    const pathParts = currentPath.split('/').filter(Boolean);
    const newPath = index === 0 ? '' : `/${pathParts.slice(0, index).join('/')}`;
    await loadFiles(newPath);
  };

  const isImageFile = (fileName: string) => {
    const ext = fileName.toLowerCase().split('.').pop();
    return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '');
  };

  const isPdfFile = (fileName: string) => {
    return fileName.toLowerCase().endsWith('.pdf');
  };

  const isTextFile = (fileName: string) => {
    const ext = fileName.toLowerCase().split('.').pop();
    return ['txt', 'md', 'json', 'xml', 'csv'].includes(ext || '');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="text-center">
          <FolderOpen className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!clientInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mb-6">
              <ShieldCheck className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Cliente No Encontrado
            </h1>
            <p className="text-gray-600">
              El cliente "{clientName}" no existe en nuestro sistema.
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            <Button asChild variant="outline" className="w-full">
              <Link href="/">Volver al Inicio</Link>
            </Button>

            <div className="pt-4 border-t border-gray-100">
              <p className="text-center text-sm text-gray-500">
                ¿Necesita ayuda?{' '}
                <a href="mailto:support@yourcompany.com" className="text-blue-600 hover:underline">
                  Contacte a Soporte
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const files = clientInfo.files || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="container mx-auto max-w-4xl py-8">
        <Card className="mb-6">
          <CardHeader className="text-center">
            <div className="mx-auto w-40 h-40 mb-6">
              <Image
                src="/logo.png"
                alt="SHA DE VENEZUELA"
                width={160}
                height={160}
                className="object-contain"
              />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Bienvenido, {clientInfo.name}
            </h1>
            <p className="text-gray-600 text-lg">
              Portal de Archivos Seguro
            </p>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {currentPath && (
                  <Button variant="outline" onClick={handleBack}>
                    <ChevronLeft className="w-4 h-4" />
                    Atrás
                  </Button>
                )}
                <h2 className="text-2xl font-bold text-gray-900">
                  Sus Archivos ({files.length})
                </h2>
              </div>
            </div>
            {currentPath && (
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                <button
                  onClick={() => loadFiles('')}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <Home className="w-4 h-4" />
                </button>
                <span>/</span>
                {currentPath.split('/').filter(Boolean).map((part, index) => (
                  <span key={index}>
                    <button
                      onClick={() => handleBreadcrumbClick(index + 1)}
                      className="text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      {part}
                    </button>
                    {index < currentPath.split('/').filter(Boolean).length - 1 && <span>/</span>}
                  </span>
                ))}
              </div>
            )}
          </CardHeader>
          <CardContent>
            {files.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FolderOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>No hay archivos disponibles</p>
              </div>
            ) : (
              <div className="space-y-2">
                {files.map((file: any) => (
                  <div
                    key={file.path}
                    className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleFileClick(file)}
                  >
                    <div className="flex items-center gap-3">
                      {file.isDir && <FolderOpen className="w-8 h-8 text-purple-600" />}
                      {isImageFile(file.name) && <ImageIcon className="w-8 h-8 text-blue-600" />}
                      {isPdfFile(file.name) && <FileText className="w-8 h-8 text-red-600" />}
                      {!file.isDir && !isImageFile(file.name) && !isPdfFile(file.name) && <FileIcon className="w-8 h-8 text-blue-600" />}
                      <div>
                        <p className="font-medium text-gray-900">{file.name}</p>
                        <p className="text-sm text-gray-500">
                          {file.size ? `${(file.size / 1024).toFixed(2)} KB` : ''}
                        </p>
                      </div>
                    </div>
                    {!file.isDir && (
                      <Button
                        asChild
                        variant="outline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <a
                          href={`/api/file?path=${encodeURIComponent(file.path)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm py-1"
                        >
                          <Download className="w-4 h-4" />
                          Descargar
                        </a>
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Button asChild variant="outline">
            <Link href="/">Volver al Inicio</Link>
          </Button>
        </div>
      </div>

      {/* Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setPreviewFile(null)}>
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <CardHeader className="flex flex-row items-center justify-between">
              <h2 className="text-xl font-bold">{previewFile.name}</h2>
              <Button variant="outline" onClick={() => setPreviewFile(null)}>
                <X className="w-5 h-5" />
              </Button>
            </CardHeader>
            <CardContent>
              {isImageFile(previewFile.name) && (
                <img
                  src={previewUrl}
                  alt={previewFile.name}
                  className="max-w-full h-auto mx-auto"
                />
              )}
              {isPdfFile(previewFile.name) && (
                <iframe
                  src={previewUrl}
                  className="w-full h-[70vh]"
                  title={previewFile.name}
                />
              )}
              {!isImageFile(previewFile.name) && !isPdfFile(previewFile.name) && (
                <div className="text-center py-8">
                  <FileIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 mb-4">Vista previa no disponible para este tipo de archivo</p>
                  <Button asChild>
                    <a
                      href={`/api/file?path=${encodeURIComponent(previewFile.path)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Descargar Archivo
                    </a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
