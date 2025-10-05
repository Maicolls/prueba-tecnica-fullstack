# Sistema de Gestión Financiera - Prueba Técnica Fullstack

## 📝 Descripción

Sistema completo de gestión financiera desarrollado con Next.js, TypeScript y PostgreSQL. Permite gestionar ingresos/egresos, usuarios y generar reportes con control de acceso basado en roles.

### ✅ Estado del Proyecto

**Proyecto completamente funcional y desplegado** ✨

- ✅ Autenticación con GitHub OAuth (Better Auth)
- ✅ Control de roles (ADMIN/USER)  
- ✅ CRUD completo de movimientos financieros
- ✅ Gestión de usuarios con roles
- ✅ Reportes con gráficos y exportación CSV/PDF
- ✅ API REST documentada con Swagger
- ✅ Testing implementado con Jest
- ✅ Base de datos PostgreSQL en Supabase
- ✅ Deploy en Vercel

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 18+ 
- npm o bun
- Cuenta en GitHub (para OAuth)
- Cuenta en Supabase (para base de datos)

### Instalación Local

1. **Clonar el repositorio**
```bash
git clone <https://github.com/Maicolls/prueba-tecnica-fullstack.git>
cd prueba-tecnica-fullstack
```

2. **Instalar dependencias**
```bash
npm install
# o
bun install
```

3. **Configurar variables de entorno**
Crear archivo `.env.local` con:
```env
# Database
DATABASE_URL="postgresql://usuario:password@host:5432/database?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://usuario:password@host:5432/database"

# Better Auth
BETTER_AUTH_SECRET="tu-secret-key-de-32-caracteres"
BETTER_AUTH_URL="http://localhost:3000"

# GitHub OAuth
GITHUB_CLIENT_ID="tu-github-client-id"
GITHUB_CLIENT_SECRET="tu-github-client-secret"
```

4. **Configurar base de datos**
```bash
npx prisma generate
npx prisma db push
```

5. **Ejecutar en desarrollo**
```bash
npm run dev
# o
bun dev
```

6. **Acceder a la aplicación**
- App: http://localhost:3000 (o puerto disponible)
- API Docs: http://localhost:3000/docs

## Arquitectura Técnica

### Stack Tecnológico

**Frontend:**
- ⚡ Next.js 15.5.4 (Pages Router)
- 🔷 TypeScript 
- 🎨 Tailwind CSS + Shadcn UI
- 📊 Recharts (gráficos)
- 🧪 Jest + React Testing Library

**Backend:**
- 🔌 Next.js API Routes
- 🛢️ PostgreSQL (Supabase)
- 🔗 Prisma ORM 6.16.3
- 📚 Swagger/OpenAPI docs

**Autenticación:**
- 🔐 Better Auth 1.1.1
- 🐙 GitHub OAuth Provider
- 🗄️ Prisma Database Adapter

**Deploy:**
- 🚀 Vercel (Frontend + API)
- ☁️ Supabase (Database)

## 📂 Estructura del Proyecto

```
├── components/ui/          # Componentes Shadcn UI
├── lib/
│   ├── auth/              # Configuración Better Auth
│   └── utils.ts           # Utilidades generales
├── pages/
│   ├── api/               # API Routes
│   │   ├── auth/          # Endpoints autenticación
│   │   ├── users/         # CRUD usuarios  
│   │   ├── movements/     # CRUD movimientos
│   │   └── reports/       # API reportes
│   ├── index.tsx          # Dashboard principal
│   ├── login.tsx          # Login con GitHub
│   ├── movimientos.tsx    # Gestión movimientos
│   ├── usuarios.tsx       # Gestión usuarios  
│   ├── reportes.tsx       # Reportes y gráficos
│   └── docs.tsx           # Documentación API
├── prisma/
│   └── schema.prisma      # Modelo de base de datos
└── styles/
    └── globals.css        # Estilos globales
```

## 🔐 Configuración de Autenticación

### GitHub OAuth Setup

1. Ve a [GitHub Developer Settings](https://github.com/settings/developers)
2. Crea nueva OAuth App:
   - **Application name:** Tu app name
   - **Homepage URL:** `http://localhost:3000` (desarrollo)
   - **Callback URL:** `http://localhost:3000/api/auth/callback/github`

3. Copia Client ID y Client Secret al `.env.local`

### Supabase Setup

1. Crea proyecto en [Supabase](https://supabase.com)
2. Ve a Settings > Database  
3. Copia la connection string
4. **Importante:** Usa "Session" pooler, no "Transaction"

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Tests con cobertura  
npm run test:coverage

# Watch mode
npm run test:watch
```

**Tests implementados:**
- ✅ Componente Login (4 tests)
- ✅ Funcionalidad básica Movimientos (3 tests)
- ✅ Configuración Jest + React Testing Library

## 📡 API Documentation

### Endpoints Disponibles

**Autenticación:**
- `GET /api/auth/session` - Obtener sesión actual
- `POST /api/auth/sign-in` - Iniciar sesión  
- `POST /api/auth/sign-out` - Cerrar sesión

**Usuarios:**
- `GET /api/users` - Listar usuarios
- `PUT /api/users` - Actualizar usuario

**Movimientos:**
- `GET /api/movements` - Listar movimientos  
- `POST /api/movements` - Crear movimiento
- `PUT /api/movements` - Actualizar movimiento
- `DELETE /api/movements` - Eliminar movimiento

**Reportes:**
- `GET /api/reports/stats` - Estadísticas y gráficos

### Swagger Documentation

Accede a la documentación completa en: `/docs`

## 🎯 Funcionalidades Implementadas

### ✅ Requisitos Completados

**🏠 Dashboard Principal**
- ✅ Página de inicio con navegación por tarjetas
- ✅ Control de acceso basado en roles
- ✅ Redirección automática según permisos

**🔐 Autenticación & Roles**  
- ✅ Login con GitHub OAuth
- ✅ Roles ADMIN/USER implementados
- ✅ Nuevos usuarios asignados como ADMIN automáticamente
- ✅ Protección de rutas por roles

**💰 Gestión de Movimientos**
- ✅ CRUD completo (Crear, Leer, Actualizar, Eliminar)
- ✅ Tabla responsiva con filtros
- ✅ Formularios con validación
- ✅ Tipos: INCOME/EXPENSE  
- ✅ Campos: concepto, monto, fecha, usuario

**👥 Gestión de Usuarios (Solo ADMIN)**
- ✅ Lista de usuarios registrados  
- ✅ Edición de roles
- ✅ Información: nombre, email, rol
- ✅ Protegido por autenticación

**📊 Reportes (Solo ADMIN)**
- ✅ Gráfico de movimientos por tipo (Recharts)
- ✅ Estadísticas en tiempo real
- ✅ Saldo actual calculado
- ✅ Exportación CSV funcional
- ✅ Exportación PDF funcional
- ✅ Datos reales de la base de datos

**📚 Documentación API**
- ✅ Swagger UI en `/docs`  
- ✅ Todos los endpoints documentados
- ✅ Ejemplos de request/response
- ✅ Esquemas de validación

## 🚀 Deploy en Vercel

### Configuración Variables de Entorno

En tu dashboard de Vercel, configura:

```env
DATABASE_URL=tu-supabase-connection-string
DIRECT_URL=tu-supabase-direct-url  
BETTER_AUTH_SECRET=tu-secret-de-32-chars
BETTER_AUTH_URL=https://tu-app.vercel.app
GITHUB_CLIENT_ID=tu-github-client-id
GITHUB_CLIENT_SECRET=tu-github-client-secret
```

### Pasos de Deploy

1. **Conectar repositorio a Vercel**
2. **Configurar variables de entorno** 
3. **Actualizar GitHub OAuth:**
   - Homepage URL: `https://tu-app.vercel.app`
   - Callback URL: `https://tu-app.vercel.app/api/auth/callback/github`
4. **Deploy automático** ✨

### Build Commands

```json
{
  "buildCommand": "npm run build",
  "installCommand": "npm install", 
  "framework": "nextjs"
}
```

## 🧩 Comandos Útiles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción  
npm run start        # Servidor de producción
npm run lint         # Linter ESLint
npm test             # Ejecutar tests

# Base de datos  
npx prisma generate  # Generar cliente Prisma
npx prisma db push   # Sincronizar schema
npx prisma studio    # Interfaz visual BD

# Utilidades
npm run type-check   # Verificar TypeScript
```

## 🔧 Resolución de Problemas

### Problemas Comunes

**❌ Error de conexión Supabase:**
```
Error: Invalid connection string
```
**✅ Solución:** Usar Session pooler, no Transaction pooler

**❌ Build failed con ESLint:**  
```
Error: ESLint found errors
```
**✅ Solución:** Ya configurado `ignoreDuringBuilds: true`

**❌ Puerto 3000 ocupado:**
```
Error: Port 3000 already in use  
```
**✅ Solución:** App configurada para puerto 3002 automáticamente

### Variables de Entorno Requeridas

```env
DATABASE_URL          # Conexión PostgreSQL
DIRECT_URL           # URL directa (sin pooler)
BETTER_AUTH_SECRET   # 32 caracteres mínimo
BETTER_AUTH_URL      # URL base de la app
GITHUB_CLIENT_ID     # OAuth GitHub
GITHUB_CLIENT_SECRET # OAuth GitHub  
```
## ✨ Características Destacadas

- 🚀 **Performance:** Build optimizado, componentes lazy-loaded
- 🔒 **Seguridad:** RBAC, validación de entrada, sesiones seguras
- 🎨 **UI/UX:** Diseño moderno con Tailwind + Shadcn  
- 📱 **Responsive:** Adaptable a diferentes dispositivos
- 🧪 **Testing:** Suite de pruebas automatizadas
- 📊 **Analytics:** Reportes dinámicos con exportación
- 🔄 **Real-time:** Datos actualizados en tiempo real

## 📄 Licencia

Este proyecto es parte de una prueba técnica y está disponible solo para propósitos de evaluación.

---

**🎯 Status:** ✅ Completamente funcional y listo para producción
---
## Imagenes del proyecto
--
**Login 
<img width="1365" height="602" alt="Login" src="https://github.com/user-attachments/assets/316ac4cc-c2fa-4a9c-85d7-cdc251d8b51d" />
--
**Home
<img width="1354" height="603" alt="home" src="https://github.com/user-attachments/assets/55eab948-c742-4418-91ed-429c4331dc0a" />
--
** Movimientos
<img width="1362" height="596" alt="movimientos " src="https://github.com/user-attachments/assets/c71e4d15-eb59-41c8-bb94-1dc5ffd0f130" />
--
** Usuarios
<img width="1364" height="606" alt="Usuarios" src="https://github.com/user-attachments/assets/d3a457fc-5c18-4dac-a4da-24a1be30184c" />
--
** Reportes
<img width="1195" height="594" alt="Reportes" src="https://github.com/user-attachments/assets/a74df9d9-44a2-4949-a5a0-40b1a4000a2f" />


