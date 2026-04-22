# Portal de Clientes

Un portal profesional para compartir archivos con clientes, integrado con FileBrowser. Proporciona una experiencia de usuario premium en español con redirecciones dinámicas basadas en el nombre del cliente.

## Características

- **Interfaz en Español**: Todo el UI está traducido al español para una mejor experiencia
- **Redirecciones Dinámicas**: Los clientes acceden a sus archivos mediante URLs limpias (ej: `portal.com/nombre-cliente`)
- **Integración con FileBrowser API**: Conexión automática con FileBrowser para obtener enlaces de compartición
- **Server Actions**: Uso de Server Actions de Next.js para mejor rendimiento y seguridad
- **UI Moderna**: Diseño limpio y profesional con Tailwind CSS y Lucide Icons
- **Responsive**: Funciona perfectamente en dispositivos móviles y escritorio

## Configuración

### 1. Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
NEXT_PUBLIC_FILEBROWSER_URL=https://files.yourvps.com
FILEBROWSER_ADMIN_USERNAME=admin
FILEBROWSER_ADMIN_PASSWORD=your_password
PORTAL_NAME="Portal de Clientes"
COMPANY_NAME="Mi Empresa"
```

### 2. Requisitos de FileBrowser

Asegúrate de que tu instancia de FileBrowser:
- Tenga una carpeta por cada cliente en el directorio raíz
- El nombre de la carpeta debe coincidir con el slug del cliente (ej: `empresa-abc`)
- Tenga habilitada la API con credenciales de administrador

## Cómo Funciona

### Flujo de Usuario

1. El cliente visita `portal.com/nombre-cliente`
2. El portal verifica si existe una carpeta con ese nombre en FileBrowser
3. Si existe, obtiene o crea un enlace de compartición
4. Muestra una página de bienvenida con el botón para acceder a los archivos
5. El cliente es redirigido a FileBrowser con el enlace de acceso

### Estructura del Proyecto

```
src/
├── actions/
│   └── client.ts          # Server actions para API
├── app/
│   ├── [clientName]/      # Página dinámica del cliente
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página de inicio
├── components/
│   └── ui/                # Componentes UI reutilizables
├── lib/
│   └── utils.ts           # Utilidades
├── services/
│   └── filebrowser.ts     # Servicio de FileBrowser API
└── types/
    └── client.ts          # Definiciones de tipos TypeScript
```

## Desarrollo

### Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Construir para Producción

```bash
npm run build
npm start
```

## Despliegue en Coolify

Este proyecto está optimizado para desplegarse en Coolify:

1. Sube el código a un repositorio Git
2. En Coolify, crea un nuevo proyecto tipo "Next.js"
3. Configura las variables de entorno en el panel de Coolify
4. Despliega y Coolify manejará el build automático

## Personalización

### Cambiar Colores y Branding

Los colores principales se definen en los componentes UI. Puedes personalizar los gradientes en:
- `src/app/page.tsx` (homepage)
- `src/app/[clientName]/page.tsx` (página del cliente)
- `src/components/ui/button.tsx` (botones)

### Modificar Textos

Todos los textos están en español y se pueden modificar directamente en los componentes.

## Seguridad

- Las credenciales de FileBrowser se almacenan como variables de entorno
- Server Actions evitan exponer las credenciales en el cliente
- Los enlaces de compartición se generan dinámicamente

## Soporte

Para ayuda o preguntas, contacte a support@yourcompany.com
