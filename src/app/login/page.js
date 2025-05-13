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
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Simulação de login bem-sucedido
      // Em um app real, isso seria uma chamada de API
      setTimeout(() => {
        // Verificação simplificada para demonstração
        if (formData.email && formData.password.length >= 6) {
          // Armazenar informações do usuário
          localStorage.setItem('userLoggedIn', 'true');
          localStorage.setItem('userType', 'registered');
          localStorage.setItem('userEmail', formData.email);
          
          // Som de sucesso - implementa RF-002 (reforço positivo)
          const successAudio = new Audio('/audio/login-success.mp3');
          successAudio.play().catch(e => console.log('Áudio não pôde ser reproduzido:', e));
          
          // Redirecionar para o dashboard
          router.push('/dashboard');
        } else {
          setError('Email ou senha inválidos. A senha deve ter pelo menos 6 caracteres.');
          // Som de erro (não punitivo) - implementa RN-007
          const errorAudio = new Audio('/audio/gentle-error.mp3');
          errorAudio.play().catch(e => console.log('Áudio não pôde ser reproduzido:', e));
        }
        setIsSubmitting(false);
      }, 1000);
    } catch (err) {
      setError('Ocorreu um erro ao fazer login. Tente novamente.');
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <Head>
        <title>Login - Interact Joy</title>
        <meta name="description" content="Faça login no Interact Joy" />
      </Head>

      {/* Controles de Acessibilidade */}
      <AccessibilityControls />

      <main className="container mx-auto px-4 py-10 flex flex-col items-center min-h-screen">
        {/* Botão voltar */}
        <div className="self-start mb-6">
          <Link href="/" className="flex items-center text-blue-600 font-medium" aria-label="Voltar para a tela inicial">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="ml-1">Voltar</span>
          </Link>
        </div>

        {/* Logo */}
        <div className="mb-6">
          <Image
           src="/images/Logo_Interact_Joy.png" 
    alt="Interact Joy Logo" 
    width={80}   // Tamanho ajustado conforme a classe w-20 (20 x 4px = 80px)
    height={80}  // Tamanho ajustado conforme a classe h-20 (20 x 4px = 80px)
  />
        </div>

        <h1 className="text-3xl font-bold text-blue-800 mb-8 text-center">
          Entrar no Interact Joy
        </h1>

        {/* Card de login */}
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 relative" role="alert">
              <span className="block sm:inline">{error}</span>
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
                aria-describedby="emailHelp"
              />
              <p id="emailHelp" className="mt-1 text-sm text-gray-500">
                Digite o email cadastrado
              </p>
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-700 text-lg font-medium mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-lg"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                >
                  {showPassword ? (
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gray-500">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gray-500">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
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

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Entrando...' : 'Entrar'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <Link href="/forgot-password" className="text-blue-600 hover:text-blue-800 font-medium">
                Esqueceu sua senha?
            </Link>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Ainda não tem uma conta?{' '}
              <Link href="/register" className="text-blue-600 hover:text-blue-800 font-medium">
                  Criar conta
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}