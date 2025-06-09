'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import AccessibilityControls from '@/components/AccessibilityControls';

export default function SelectProfile() {
  const router = useRouter();
  const [selectedProfile, setSelectedProfile] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [plan, setPlan] = useState('mensal');
  const [confirmMessage, setConfirmMessage] = useState('');

  useEffect(() => {
    const audio = new Audio('/audio/select-profile.mp3');
    audio.play().catch(() => {});
  }, []);

  const handleContinue = () => {
    if (selectedProfile === 'responsavel' || selectedProfile === 'especialista') {
      setShowModal(true);
    } else if (selectedProfile === 'usuario') {
      router.push('/register/forms/usuario');
    }
  };

  const handleConfirmSubscription = () => {
    setConfirmMessage('Assinatura realizada com sucesso!');
    setTimeout(() => {
      const route = selectedProfile === 'responsavel' ? 'responsavel' : 'especialista';
      router.push(`/register/forms/${route}`);
    }, 1800);
  };

  const handleCancel = () => {
    setShowModal(false);
    setSelectedProfile('');
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6 font-sans cursor-pointer">
      <Head>
        <title>Selecionar Perfil - Interact Joy</title>
      </Head>

      <AccessibilityControls />

      <div className="max-w-4xl mx-auto">
        <div className="mb-6 text-left">
          <Link href="/" className="text-blue-700 hover:underline text-lg">
            ← Voltar 
          </Link>
        </div>

        <div className="text-center mb-10">
          <div className="animate-spin-slow mx-auto mb-2 w-20 h-20">
            <Image src="/images/Logo_Interact_Joy.png" alt="Logo Interact Joy" width={80} height={80} />
          </div>
          <h2 className="text-2xl font-bold text-blue-800 mb-1">Interact Joy</h2>
          <p className="text-gray-700 text-lg font-medium">Selecione abaixo seu perfil para continuar o cadastro.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              key: 'responsavel',
              title: 'Sou responsável',
              description: 'Pais ou cuidadores que desejam acompanhar o progresso da criança.'
            },
            {
              key: 'especialista',
              title: 'Sou especialista',
              description: 'Profissionais da saúde, terapeutas ou educadores especializados.'
            },
            {
              key: 'usuario',
              title: 'Sou usuário',
              description: 'Criança com TEA que deseja jogar e se desenvolver.'
            }
          ].map((profile) => (
            <button
              key={profile.key}
              onClick={() => setSelectedProfile(profile.key)}
              className={`border p-6 rounded-xl shadow-md text-left transition-all duration-300 hover:shadow-lg ${
                selectedProfile === profile.key ? 'border-blue-600 bg-blue-50' : 'border-gray-300'
              }`}
            >
              <h3 className="text-xl font-bold text-blue-800 mb-2">{profile.title}</h3>
              <p className="text-gray-600 text-base">{profile.description}</p>
            </button>
          ))}
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={handleContinue}
            disabled={!selectedProfile}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold text-lg shadow hover:bg-blue-700 disabled:opacity-50"
          >
            Continuar
          </button>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-blue-100 bg-opacity-80 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold text-blue-800 mb-4">Escolha seu plano de assinatura</h2>
              <p className="text-gray-700 text-base mb-4">
                Acesso completo ao acompanhamento de progresso e conquistas da(s) criança(s), relatórios personalizados e funcionalidades exclusivas para seu perfil.
              </p>
              <div className="flex flex-col space-y-3 mb-4">
                <label className="flex items-center text-base">
                  <input
                    type="radio"
                    name="plan"
                    value="mensal"
                    checked={plan === 'mensal'}
                    onChange={() => setPlan('mensal')}
                    className="mr-2"
                  />
                  Plano Mensal {selectedProfile === 'especialista' ? 'R$49,90/mês' : 'R$39,90/mês'}
                </label>
                <label className="flex items-center text-base">
                  <input
                    type="radio"
                    name="plan"
                    value="anual"
                    checked={plan === 'anual'}
                    onChange={() => setPlan('anual')}
                    className="mr-2"
                  />
                  Plano Anual {selectedProfile === 'especialista' ? 'R$499,00/ano' : 'R$399,00/ano'}
                </label>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 rounded-md text-blue-600 hover:underline"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmSubscription}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Confirmar
                </button>
              </div>
              {confirmMessage && (
                <p className="text-green-600 text-center mt-4 font-medium text-base">{confirmMessage}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
