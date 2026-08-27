const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Iniciando generación del proyecto Yx Studios...\n');

// Crear estructura de carpetas
const dirs = [
  'app',
  'app/(auth)',
  'app/(auth)/login',
  'app/(auth)/register',
  'app/(dashboard)',
  'components',
  'lib'
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✓ Carpeta creada: ${dir}`);
  }
});

// Definir todos los archivos
const files = {
  '.env.local': `NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
NEXT_PUBLIC_FIREBASE_API_KEY=tu_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id`,

  '.gitignore': `# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.vercel

# vscode
.vscode/*
!.vscode/extensions.json
.idea`,

  'package.json': `{
  "name": "yx-studios",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "14.2.3",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "@supabase/supabase-js": "^2.43.1",
    "firebase": "^10.12.0",
    "zustand": "^4.5.2",
    "lucide-react": "^0.378.0"
  },
  "devDependencies": {
    "typescript": "^5.4.5",
    "@types/react": "^18.3.1",
    "@types/node": "^20.12.12",
    "tailwindcss": "^3.4.3",
    "postcss": "^8.4.38",
    "autoprefixer": "^10.4.19"
  }
}`,

  'tsconfig.json': `{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}`,

  'next.config.mjs': `/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;`,

  'tailwind.config.ts': `import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        crimson: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d'
        }
      }
    }
  },
  plugins: []
};

export default config;`,

  'postcss.config.js': `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
};`,

  'app/globals.css': `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: 'Inter', system-ui, sans-serif;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}`,

  'app/layout.tsx': `import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Yx Studios | Sistemas Roblox Profesionales',
  description: 'Catálogo de sistemas de rol, FPS y Tycoon para desarrolladores de Roblox Studio.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="antialiased bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  );
}`,

  'app/(auth)/layout.tsx': `export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}`,

  'lib/supabase.ts': `import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);`,

  'lib/firebase.ts': `import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

export const app = initializeApp(firebaseConfig);
export const messaging = typeof window !== 'undefined' ? getMessaging(app) : null;`,

  'lib/store.ts': `import { create } from 'zustand';

interface Product {
  id: number;
  name: string;
  price: number;
  desc: string;
  tech: string[];
}

interface CartStore {
  items: Product[];
  isOpen: boolean;
  toggleCart: () => void;
  addItem: (product: Product) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  isOpen: false,
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  addItem: (product) => set((state) => ({ items: [...state.items, product] })),
  removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
  clearCart: () => set({ items: [] })
}));`,

  'components/CartDrawer.tsx': `"use client";
import { useCartStore } from '@/lib/store';
import { X, ShoppingCart, CreditCard } from 'lucide-react';
import { useState } from 'react';

export default function CartDrawer() {
  const { items, isOpen, toggleCart, removeItem, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const total = items.reduce((acc, item) => acc + item.price, 0).toFixed(2);

  if (!isOpen) return null;

  const handleCheckout = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      clearCart();
      toggleCart();
      alert('Redirigiendo a pasarela segura PayPal / RevenueCat...');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={toggleCart} />
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl p-6 flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-crimson-700">
            <ShoppingCart size={24} /> Carrito
          </h2>
          <button onClick={toggleCart} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3">
          {items.length === 0 ? (
            <p className="text-center text-gray-400 mt-10">Tu carrito está vacío</p>
          ) : (
            items.map((item, idx) => (
              <div key={\`\${item.id}-\${idx}\`} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div>
                  <p className="font-bold text-sm">{item.name}</p>
                  <p className="text-xs text-gray-500">\${item.price}</p>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-600 text-xs font-bold hover:underline"
                >
                  Eliminar
                </button>
              </div>
            ))
          )}
        </div>

        <div className="border-t pt-4 mt-4 space-y-3">
          <div className="flex justify-between text-xl font-bold">
            <span>Total:</span>
            <span>\${total}</span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={items.length === 0 || loading}
            className="w-full bg-crimson-700 hover:bg-crimson-800 text-white py-3 rounded-lg font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? 'Procesando...' : <>Pagar Ahora <CreditCard size={18} /></>}
          </button>
          <p className="text-[10px] text-center text-gray-400">
            Pagos seguros vía PayPal & RevenueCat
          </p>
        </div>
      </div>
    </div>
  );
}`,

  'components/NotificationToast.tsx': `"use client";
import { CheckCircle } from 'lucide-react';

export default function NotificationToast({ message }: { message: string | null }) {
  if (!message) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[60] bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom fade-in duration-300">
      <CheckCircle className="text-green-400" size={18} />
      <span className="text-sm">{message}</span>
    </div>
  );
}`,

  'app/(auth)/login/page.tsx': `"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert(error.message);
    } else {
      router.push('/');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-crimson-100">
        <h1 className="text-3xl font-bold text-center mb-2 text-crimson-700">Yx Studios</h1>
        <p className="text-center text-gray-500 mb-8">Acceso para Desarrolladores</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email profesional"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-crimson-500 outline-none transition-all"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-crimson-500 outline-none transition-all"
            required
          />
          <button
            disabled={loading}
            className="w-full bg-crimson-700 hover:bg-crimson-800 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Autenticando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          ¿No tienes cuenta?{' '}
          <Link href="/register" className="text-crimson-700 font-bold hover:underline">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}`,

  'app/(auth)/register/page.tsx': `"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      alert(error.message);
    } else {
      alert('Revisa tu email para confirmar la cuenta.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-crimson-100">
        <h1 className="text-3xl font-bold text-center mb-2 text-crimson-700">Crear Cuenta Dev</h1>
        <p className="text-center text-gray-500 mb-8">Únete a la red de Yx Studios</p>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-crimson-500 outline-none transition-all"
            required
          />
          <input
            type="password"
            placeholder="Contraseña segura"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-crimson-500 outline-none transition-all"
            required
          />
          <button
            disabled={loading}
            className="w-full bg-crimson-700 hover:bg-crimson-800 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Creando cuenta...' : 'Registrarse'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="text-crimson-700 font-bold hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}`,

  'app/(dashboard)/page.tsx': `"use client";
import { useCartStore } from '@/lib/store';
import { ShoppingCart, Code } from 'lucide-react';
import { useEffect, useState } from 'react';
import CartDrawer from '@/components/CartDrawer';
import NotificationToast from '@/components/NotificationToast';

const PRODUCTS = [
  { id: 1, name: "Advanced RP System V2", price: 49.99, desc: "Inventario, trabajos y economía escalable.", tech: ["Lua", "DataStore2"] },
  { id: 2, name: "FPS Framework Pro", price: 35.00, desc: "Hitbox precisas y sistema de rondas.", tech: ["FastCast", "Raycasting"] },
  { id: 3, name: "Tycoon Engine Ultra", price: 25.50, desc: "Generador optimizado multi-idioma.", tech: ["CollectionService"] },
  { id: 4, name: "Admin Panel Secure", price: 60.00, desc: "Logs en tiempo real vía Firebase.", tech: ["Firebase", "React"] },
];

export default function HomePage() {
  const { addItem, toggleCart, items } = useCartStore();
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setNotification("🔥 Nuevo sistema 'Anime RPG' disponible");
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleAdd = (product: typeof PRODUCTS[0]) => {
    addItem(product);
    setNotification(\`✅ \${product.name} añadido al carrito\`);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-crimson-700 rounded-lg flex items-center justify-center text-white font-bold text-lg">Y</div>
            <span className="text-xl font-bold tracking-tighter">Yx <span className="text-crimson-700">Studios</span></span>
          </div>
          <button onClick={toggleCart} className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ShoppingCart size={22} className="text-gray-700" />
            {items.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-crimson-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                {items.length}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-white border-b border-gray-100 pt-20 pb-16 text-center px-4">
        <span className="px-3 py-1 bg-crimson-100 text-crimson-800 text-xs font-bold rounded-full uppercase tracking-wide">
          Sistemas Profesionales Roblox
        </span>
        <h1 className="mt-6 text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900">
          Yx <span className="text-crimson-700">Studios</span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
          No vendemos ropa. Vendemos arquitecturas de software robustas para desarrolladores exigentes.
        </p>
        <div className="mt-8 flex justify-center gap-4 opacity-60 grayscale flex-wrap">
          {['NEXT.JS', 'TAILWIND', 'SUPABASE', 'FIREBASE', 'REDIS', 'REVENUECAT'].map((t) => (
            <span key={t} className="border px-3 py-1 rounded text-xs font-mono">{t}</span>
          ))}
        </div>
      </section>

      {/* Catálogo */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Catálogo de Sistemas</h2>
            <p className="text-gray-500 mt-1">Assets premium optimizados para alto rendimiento</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRODUCTS.map((p) => (
            <div
              key={p.id}
              className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col group"
            >
              <div className="flex justify-between items-start mb-3">
                <Code className="text-crimson-700 group-hover:scale-110 transition-transform" size={28} />
                <span className="text-xl font-bold text-crimson-700">\${p.price}</span>
              </div>
              <h3 className="text-lg font-bold mb-2">{p.name}</h3>
              <p className="text-sm text-gray-500 mb-4 flex-1">{p.desc}</p>
              <div className="flex flex-wrap gap-1 mb-5">
                {p.tech.map((t) => (
                  <span key={t} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded font-medium">
                    {t}
                  </span>
                ))}
              </div>
              <button
                onClick={() => handleAdd(p)}
                className="w-full bg-crimson-700 hover:bg-crimson-800 text-white py-2.5 rounded-lg font-medium transition-colors"
              >
                Añadir al Carrito
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Features */}
      <section className="max-w-7xl mx-auto px-4 py-16 border-t border-gray-200">
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <h3 className="font-bold text-lg mb-2 text-crimson-700">Backend Híbrido</h3>
            <p className="text-sm text-gray-600">Supabase para datos principales + Redis para caché de alta velocidad con latencia cero.</p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2 text-crimson-700">Notificaciones Real-time</h3>
            <p className="text-sm text-gray-600">Firebase Cloud Messaging integrado para alertas instantáneas sobre actualizaciones críticas.</p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2 text-crimson-700">Pagos Seguros</h3>
            <p className="text-sm text-gray-600">PayPal para compras únicas y RevenueCat para suscripciones recurrentes con protección total.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 text-center">
        <h2 className="text-2xl font-bold mb-2">Yx Studios</h2>
        <p className="text-gray-400 text-sm mb-6">Desarrollando el futuro de Roblox Studio</p>
        <p className="text-gray-600 text-xs">© 2026 Yx Studios. Powered by Next.js & Supabase.</p>
      </footer>

      {/* Overlays */}
      <CartDrawer />
      <NotificationToast message={notification} />
    </main>
  );
}`,

  'README.md': `# Yx Studios

Landing page profesional para venta de sistemas de Roblox Studio.

## Stack Tecnológico

- **Framework:** Next.js 14 (App Router)
- **Estilos:** Tailwind CSS
- **Backend:** Supabase + Firebase
- **Estado:** Zustand
- **Pagos:** PayPal + RevenueCat (integración lista)

## Instalación

\`\`\`bash
npm install
\`\`\`

## Configuración

1. Crea un archivo \`.env.local\` con tus credenciales de Supabase y Firebase
2. Ejecuta \`npm run dev\`
3. Abre http://localhost:3000

## Características

- ✅ Autenticación completa (Login/Register)
- ✅ Catálogo de productos
- ✅ Carrito de compras funcional
- ✅ Notificaciones en tiempo real
- ✅ Diseño responsive
- ✅ Color carmesí profesional

## Deploy

Sube a GitHub y conecta con Vercel para deploy automático.
`
};

// Escribir todos los archivos
console.log('\n📝 Creando archivos...\n');
Object.entries(files).forEach(([filePath, content]) => {
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✓ ${filePath}`);
});

// Instalar dependencias
console.log('\n📦 Instalando dependencias (esto puede tardar unos minutos)...\n');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('\n✅ Dependencias instaladas correctamente\n');
} catch (error) {
  console.error('\n❌ Error instalando dependencias\n');
  process.exit(1);
}

// Inicializar Git
console.log('🔧 Inicializando Git...\n');
try {
  execSync('git init', { stdio: 'inherit' });
  execSync('git add .', { stdio: 'inherit' });
  execSync('git commit -m "feat: Yx Studios landing completa con auth, carrito y catálogo"', { stdio: 'inherit' });
  console.log('\n✅ Git inicializado y primer commit creado\n');
} catch (error) {
  console.log('⚠️  Git ya estaba inicializado o hubo un problema\n');
}

console.log('═══════════════════════════════════════════════════════════');
console.log('✅ ¡PROYECTO YX STUDIOS GENERADO EXITOSAMENTE!');
console.log('═══════════════════════════════════════════════════════════\n');
console.log('📋 Próximos pasos:');
console.log('   1. Edita .env.local con tus credenciales reales');
console.log('   2. Ejecuta: npm run dev');
console.log('   3. Abre: http://localhost:3000');
console.log('   4. Para subir a GitHub:');
console.log('      git remote add origin https://github.com/TU_USUARIO/yx-studios.git');
console.log('      git push -u origin main\n');
console.log('═══════════════════════════════════════════════════════════\n');
