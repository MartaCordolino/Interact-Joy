'use client';

import { useState } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AccessibilityControls from '../../components/AccessibilityControls';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
    rememberMe: false
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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
        body: JSON.stringify({
          email: formData.email,
          senha: formData.senha
        })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('userType', data.user?.perfil || '');
        localStorage.setItem('userEmail', formData.email);

        new Audio('/audio/login-success.mp3').play().catch(() => {});

        if (data.user.perfil === 'responsavel') {
          router.push('/dashboard/responsavel');
        } else if (data.user.perfil === 'especialista') {
          router.push('/dashboard/especialista');
        } else {
          router.push('/dashboard/usuario');
        }
      } else {
        setError(data.error || 'Credenciais inválidas.');
        setFormData({ email: '', senha: '', rememberMe: false });
        new Audio('/audio/gentle-error.mp3').play().catch(() => {});
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor.');
      setFormData({ email: '', senha: '', rememberMe: false });
      new Audio('/audio/gentle-error.mp3').play().catch(() => {});
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = () => {
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
    <div className="min-h-screen bg-blue-50 relative">
      <Head>
        <title>Login - Interact Joy</title>
        <meta name="description" content="Faça login no Interact Joy" />
      </Head>

      <AccessibilityControls />

      <main className="container mx-auto px-4 py-10 flex flex-col items-center min-h-screen">
        <div className="self-start mb-6">
          <Link href="/" className="flex items-center text-blue-600 font-medium" aria-label="Voltar para a tela inicial">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="ml-1">Voltar</span>
          </Link>
        </div>

        <Image
          src="/images/Logo_Interact_Joy.png"
          alt="Logo do Interact Joy"
          width={80}
          height={80}
          className="mb-6"
        />

        <h1 className="text-3xl font-bold text-blue-800 mb-8 text-center">
          Entrar no Interact Joy
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-gray-700 text-lg font-medium mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-lg"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="senha" className="block text-gray-700 text-lg font-medium mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  id="senha"
                  name="senha"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-lg"
                  value={formData.senha}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              <label htmlFor="rememberMe" className="ml-2 block text-gray-700">
                Lembrar de mim
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded-lg shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="mt-6">
            <button
              onClick={() => setShowResetModal(true)}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Esqueceu sua senha?
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Problemas com acesso? <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">Voltar à tela inicial</Link>
            </p>
          </div>
        </div>
      </main>

      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-100/60 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm relative">
            <button
              onClick={() => setShowResetModal(false)}
              className="absolute top-2 right-3 text-gray-600 text-xl"
              aria-label="Fechar"
            >
              &times;
            </button>
            <h2 className="text-2xl font-semibold text-blue-700 mb-4 text-center">Redefinição de Senha</h2>
            {resetSuccess ? (
              <p className="text-green-700 text-center">Senha enviada para o e-mail cadastrado.</p>
            ) : (
              <>
                <label htmlFor="resetEmail" className="block text-gray-700 mb-2">Digite seu e-mail:</label>
                <input
                  id="resetEmail"
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={handleResetPassword}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Confirmar
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function EyeIcon() {
  return (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gray-500">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7s-8.268-2.943-9.542-7z" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gray-500">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M3 3l3.59 3.59" />
    </svg>
  );
}
