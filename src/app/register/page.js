'use client';
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import AccessibilityControls from '../../components/AccessibilityControls';

export default function Register() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    userType: '',
    fullName: '',
    childName: '',
    childAge: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });

    // Limpar erros ao editar
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.userType) {
      newErrors.userType = 'Selecione quem você é';
    }
    
    return newErrors;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Nome completo é obrigatório';
    }
    
    if (formData.userType === 'parent' && !formData.childName.trim()) {
      newErrors.childName = 'Nome da criança é obrigatório';
    }
    
    if (formData.userType === 'parent') {
      if (!formData.childAge) {
        newErrors.childAge = 'Idade da criança é obrigatória';
      } else if (parseInt(formData.childAge) < 7) {
        newErrors.childAge = 'A idade mínima é 3 anos';
      }
    }
    
    return newErrors;
  };

  const validateStep3 = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Digite um email válido';
    }
    
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'A senha deve ter pelo menos 6 caracteres';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }
    
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'Você precisa concordar com os termos';
    }
    
    return newErrors;
  };

  const handleNextStep = () => {
    let stepErrors = {};
    
    if (step === 1) {
      stepErrors = validateStep1();
    } else if (step === 2) {
      stepErrors = validateStep2();
    }
    
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      
      // Som de erro suave - implementa RN-007
      const errorAudio = new Audio('/audio/gentle-error.mp3');
      errorAudio.play().catch(e => console.log('Áudio não pôde ser reproduzido:', e));
      
      return;
    }
    
    // Som de próximo passo - implementa RF-002
    const nextAudio = new Audio('/audio/next-step.mp3');
    nextAudio.play().catch(e => console.log('Áudio não pôde ser reproduzido:', e));
    
    setStep(step + 1);
    setErrors({});
  };

  const handlePrevStep = () => {
    setStep(step - 1);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const stepErrors = validateStep3();
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      
      // Som de erro suave
      const errorAudio = new Audio('/audio/gentle-error.mp3');
      errorAudio.play().catch(e => console.log('Áudio não pôde ser reproduzido:', e));
      
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulação de registro bem-sucedido
      // Em um app real, isso seria uma chamada de API
      setTimeout(() => {
        // Armazenar informações do usuário
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('userType', formData.userType);
        localStorage.setItem('userEmail', formData.email);
        localStorage.setItem('userName', formData.fullName);
        
        if (formData.userType === 'parent') {
          localStorage.setItem('childName', formData.childName);
          localStorage.setItem('childAge', formData.childAge);
        }
        
        // Som de sucesso - implementa RF-002 (reforço positivo)
        const successAudio = new Audio('/audio/register-success.mp3');
        successAudio.play().catch(e => console.log('Áudio não pôde ser reproduzido:', e));
        
        // Redirecionar para o dashboard após registro
        router.push('/dashboard');
        
        setIsSubmitting(false);
      }, 1500);
    } catch (err) {
      setErrors({ submit: 'Ocorreu um erro ao criar sua conta. Tente novamente.' });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <Head>
        <title>Criar Conta - Interact Joy</title>
        <meta name="description" content="Crie sua conta no Interact Joy" />
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

        <h1 className="text-3xl font-bold text-blue-800 mb-2 text-center">
          Criar Conta
        </h1>
        
        <div className="w-full max-w-md mb-8">
          {/* Indicador de progresso */}
          <div className="flex justify-between items-center mb-4">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
              1
            </div>
            <div className={`h-1 flex-1 mx-2 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
              2
            </div>
            <div className={`h-1 flex-1 mx-2 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
              3
            </div>
          </div>
        </div>

        {/* Card de cadastro */}
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
          {errors.submit && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 relative" role="alert">
              <span className="block sm:inline">{errors.submit}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-medium text-gray-800 mb-4">Quem é você?</h2>
                
                <div className="space-y-4">
                  <div className="flex flex-col">
                    <label className={`border rounded-lg p-4 flex items-center cursor-pointer ${formData.userType === 'parent' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
                      <input
                        type="radio"
                        name="userType"
                        value="parent"
                        checked={formData.userType === 'parent'}
                        onChange={handleChange}
                        className="h-5 w-5 text-blue-600"
                      />
                      <div className="ml-3">
                        <span className="text-lg font-medium text-gray-800">Sou responsável</span>
                        <p className="text-gray-600">Quero ajudar no desenvolvimento de uma criança</p>
                      </div>
                    </label>
                  </div>
                  
                  <div className="flex flex-col">
                    <label className={`border rounded-lg p-4 flex items-center cursor-pointer ${formData.userType === 'specialist' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
                      <input
                        type="radio"
                        name="userType"
                        value="specialist"
                        checked={formData.userType === 'specialist'}
                        onChange={handleChange}
                        className="h-5 w-5 text-blue-600"
                      />
                      <div className="ml-3">
                        <span className="text-lg font-medium text-gray-800">Sou especialista</span>
                        <p className="text-gray-600">Terapeuta, professor ou profissional da área</p>
                      </div>
                    </label>
                  </div>
                  
                  <div className="flex flex-col">
                    <label className={`border rounded-lg p-4 flex items-center cursor-pointer ${formData.userType === 'user' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
                      <input
                        type="radio"
                        name="userType"
                        value="user"
                        checked={formData.userType === 'user'}
                        onChange={handleChange}
                        className="h-5 w-5 text-blue-600"
                      />
                      <div className="ml-3">
                        <span className="text-lg font-medium text-gray-800">Sou usuário</span>
                        <p className="text-gray-600">Quero usar o aplicativo para meu desenvolvimento</p>
                      </div>
                    </label>
                  </div>
                </div>
                
                {errors.userType && (
                  <p className="text-red-600 text-sm">{errors.userType}</p>
                )}
                
                <div>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Continuar
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-medium text-gray-800 mb-4">Informações Pessoais</h2>
                
                <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Nome completo</label>
                  <input
                    type="text"
                    name="fullName"
                    id="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.fullName ? 'border-red-500' : ''}`}
                  />
                  {errors.fullName && (
                    <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>
                  )}
                </div>

                {formData.userType === 'parent' && (
                  <>
                    <div>
                      <label htmlFor="childName" className="block text-sm font-medium text-gray-700">Nome da criança</label>
                      <input
                        type="text"
                        name="childName"
                        id="childName"
                        value={formData.childName}
                        onChange={handleChange}
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.childName ? 'border-red-500' : ''}`}
                      />
                      {errors.childName && (
                        <p className="text-red-600 text-sm mt-1">{errors.childName}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="childAge" className="block text-sm font-medium text-gray-700">Idade da criança</label>
                      <input
                        type="number"
                        name="childAge"
                        id="childAge"
                        value={formData.childAge}
                        onChange={handleChange}
                        min="3"
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.childAge ? 'border-red-500' : ''}`}
                      />
                      {errors.childAge && (
                        <p className="text-red-600 text-sm mt-1">{errors.childAge}</p>
                      )}
                    </div>
                  </>
                )}

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="py-2 px-4 rounded-md text-blue-600 hover:underline"
                  >
                    Voltar
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Continuar
                  </button>
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-medium text-gray-800 mb-4">Dados de Acesso</h2>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.email ? 'border-red-500' : ''}`}
                  />
                  {errors.email && (
                    <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Senha</label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.password ? 'border-red-500' : ''}`}
                  />
                  {errors.password && (
                    <p className="text-red-600 text-sm mt-1">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirmar Senha</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>
                  )}
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="agreeTerms"
                      name="agreeTerms"
                      type="checkbox"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="agreeTerms" className="font-medium text-gray-700">
                      Eu concordo com os <a href="/terms" className="text-blue-600 underline">termos de uso</a>
                    </label>
                    {errors.agreeTerms && (
                      <p className="text-red-600 text-sm mt-1">{errors.agreeTerms}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="py-2 px-4 rounded-md text-blue-600 hover:underline"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Criando conta...' : 'Criar Conta'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}
