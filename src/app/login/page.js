'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AccessibilityControls from '@/components/AccessibilityControls';
import { motion } from 'framer-motion';
import { LogIn } from 'lucide-react';

function useDebounce(value, delay = 600) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', senha: '', rememberMe: false });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [perfilDetectado, setPerfilDetectado] = useState(null);

  const debouncedEmail = useDebounce(formData.email);

  useEffect(() => {
    const fetchPerfil = async () => {
      if (debouncedEmail && debouncedEmail.includes('@')) {
        try {
          const res = await fetch(`/api/users/email/${debouncedEmail}`);
          if (!res.ok) throw new Error();
          const data = await res.json();
          setPerfilDetectado(data.perfil ?? null);
        } catch {
          setPerfilDetectado(null);
        }
      }
    };
    fetchPerfil();
  }, [debouncedEmail]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, senha: formData.senha })
      });

      const data = await res.json();
      console.log(data.user);
      if (!res.ok || !data?.user) {
        setError(data.error || 'Credenciais inválidas.');
        setFormData({ email: '', senha: '', rememberMe: false });
        return;
      }

      const { perfil, planoAtivo, id, email, nome, criancaId, faixa_etaria, nivel_suporte, idade } = data.user;

      if (!planoAtivo && perfil !== 'autista') {
        setError('Plano de assinatura inativo. Renove para continuar.');
        setFormData({ email: '', senha: '', rememberMe: false });
        return;
      }

      localStorage.clear();
      localStorage.setItem('userLoggedIn', 'true');
      localStorage.setItem('userType', perfil);
      localStorage.setItem('userId', id);
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userName', nome);

      if (perfil === 'autista') {
        if (criancaId) localStorage.setItem('criancaId', criancaId);
        if (typeof idade === 'number') localStorage.setItem('userAge', idade.toString());
        if (faixa_etaria) localStorage.setItem('ageGroup', faixa_etaria);
        if (nivel_suporte) {
          localStorage.setItem('supportLevel', nivel_suporte);
          localStorage.setItem('userSupport', nivel_suporte);
          localStorage.setItem('criancaNome', nome);
        }
        router.push('/dashboard/usuario');
      } else if (perfil === 'responsavel') {
        router.push('/dashboard/responsavel');
      } else if (perfil === 'especialista') {
        router.push('/dashboard/especialista');
      } else {
        setError('Perfil de usuário desconhecido.');
      }

    } catch (err) {
      console.error('Erro de login:', err);
      setError('Erro ao conectar com o servidor.');
      setFormData({ email: '', senha: '', rememberMe: false });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = () => {
    if (perfilDetectado === 'autista') {
      setResetSuccess(true);
      setTimeout(() => {
        setShowResetModal(false);
        setResetSuccess(false);
        setResetEmail('');
      }, 2500);
      return;
    }

    if (resetEmail.trim()) {
      setResetSuccess(true);
      setTimeout(() => {
        setShowResetModal(false);
        setResetSuccess(false);
        setResetEmail('');
      }, 2500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-purple-500 p-6">
      <Head><title>Login - Interact Joy</title></Head>
      <AccessibilityControls />

      <motion.header className="flex justify-center items-center mb-7" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <Image src="/images/Logo_Interact_Joy.png" alt="Logo" width={128} height={128} className="animate-spin-slow" />
        <h1 className="text-5xl font-bold">
          <span className="text-blue-800 font-bold">Interact</span>
          <span className="text-green-300 font-bold"> Joy</span>
        </h1>
      </motion.header>

      <main className="max-w-md mx-auto bg-white px-8 py-6 rounded-2xl shadow-xl" aria-label="Formulário de login">
        <motion.h2 className="text-2xl font-bold flex items-center gap-2 mb-6 text-blue-700" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <LogIn className="w-6 h-6" /> Login
        </motion.h2>

        {error && (
          <motion.div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-800">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Digite seu email"
              className="w-full px-4 py-3 mt-1 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="senha" className="block text-sm font-medium text-gray-800">Senha</label>
            <div className="relative">
              <input
                id="senha"
                name="senha"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Digite sua senha"
                className="w-full px-4 py-3 mt-1 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={formData.senha}
                onChange={handleChange}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 flex items-center text-sm" aria-label="Mostrar ou esconder senha">
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="rememberMe"
              name="rememberMe"
              type="checkbox"
              className="h-5 w-5 text-blue-600 border-gray-300 rounded"
              checked={formData.rememberMe}
              onChange={handleChange}
            />
            <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700">Lembrar de mim</label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
          >
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            onClick={() => setShowResetModal(true)}
            className={`text-sm text-blue-600 cursor-pointer hover:underline ${perfilDetectado === 'autista' ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={perfilDetectado === 'autista'}
          >
            Esqueceu a senha?
          </button>
        </div>

        <div className="text-center mt-2">
          <Link href="/home" className="text-sm text-blue-600 hover:underline">Criar conta</Link>
        </div>
      </main>

      {showResetModal && (
        <motion.div className="fixed inset-0 bg-purple-100/80 flex items-center justify-center z-50" role="dialog" aria-modal="true" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <motion.div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm relative" initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
            <button onClick={() => setShowResetModal(false)} className="absolute top-2 right-4 text-2xl text-gray-500 hover:text-gray-700">&times;</button>
            <h2 className="text-lg font-bold text-blue-700 mb-4 text-center">Redefinição de senha</h2>
            {resetSuccess ? (
              <p className="text-green-600 text-center">
                {perfilDetectado === 'autista'
                  ? 'Este perfil não permite redefinição de senha. Procure seu responsável.'
                  : 'Senha enviada para seu email'}
              </p>
            ) : (
              <>
                <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-700 mb-2">Digite seu email:</label>
                <input
                  id="resetEmail"
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Email para redefinir senha"
                  placeholder="exemplo@email.com"
                />
                <button
                  onClick={handleResetPassword}
                  disabled={!resetEmail.trim()}
                  className={`w-full py-2 rounded-lg text-white transition-all ${
                    resetEmail.trim() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  Confirmar
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
