import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { AlertCircle, Home } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Cliente No Encontrado
          </h1>
          <p className="text-gray-600 text-lg">
            Lo sentimos, no pudimos encontrar el cliente solicitado
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-100">
            <h3 className="font-semibold text-yellow-900 mb-2">
              ¿Qué puede haber pasado?
            </h3>
            <ul className="text-yellow-800 text-sm space-y-2 list-disc list-inside">
              <li>El nombre del cliente puede estar mal escrito</li>
              <li>El cliente puede no existir en nuestro sistema</li>
              <li>El enlace puede haber expirado</li>
            </ul>
          </div>

          <div className="space-y-4">
            <Button asChild variant="primary" className="w-full text-lg py-4">
              <Link href="/">
                <Home className="w-5 h-5" />
                Volver al Inicio
              </Link>
            </Button>
            
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
