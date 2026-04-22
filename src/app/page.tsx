"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Button from "@/components/ui/button";
import { FolderOpen, Lock, ArrowRight } from "lucide-react";
import { validateClientPassword } from "@/actions/client";

export default function Home() {
  const [clientName, setClientName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!clientName.trim() || !password.trim()) {
      setError("Por favor ingrese nombre y contraseña");
      setLoading(false);
      return;
    }

    const isValid = await validateClientPassword(
      clientName.trim().toLowerCase(),
      password.trim(),
    );

    if (isValid) {
      router.push(`/${clientName.trim().toLowerCase()}`);
    } else {
      setError("Nombre o contraseña incorrectos");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <div className="mx-auto w-32 h-32 mb-4 shadow-2xl rounded-xl overflow-hidden bg-white flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="SHA DE VENEZUELA"
              width={128}
              height={128}
              className="object-contain"
            />
          </div>
        </div>

        <Card className="shadow-2xl border-2">
          <CardHeader className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Acceder a Mis Archivos
            </h2>
            <p className="text-gray-600">
              Ingrese el nombre de su cliente para continuar
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Nombre del cliente (ej: empresa-abc)"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                  required
                  disabled={loading}
                />
              </div>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
                  {error}
                </div>
              )}
              <Button
                type="submit"
                variant="primary"
                className="w-full text-lg py-4"
                disabled={loading}
              >
                {loading ? (
                  "Verificando..."
                ) : (
                  <>
                    <ArrowRight className="w-5 h-5" />
                    Continuar
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-4 text-center text-gray-500 text-sm">
          <p>SHA DE VENEZUELA, C.A © {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  );
}
