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
    const audio = new Audio('/audio/selecione-perfil.mp3');
    audio.play().catch(() => {});
  }, []);

  const handleContinue = () => {
    if (selectedProfile === 'responsavel' || selectedProfile === 'especialista') {
      setShowModal(true);
    }
  };

  const handleConfirmSubscription = () => {
    setConfirmMessage('Assinatura realizada com sucesso!');
    setTimeout(() => {
      router.push(`/register/forms/${selectedProfile}`);
    }, 1800);
  };

  const handleCancel = () => {
    setShowModal(false);
    setSelectedProfile('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 p-6 font-sans">
      <Head>
        <title>Selecionar Perfil - Interact Joy</title>
      </Head>

      <AccessibilityControls />

      {/* Header padrão com logo maior, nome estilizado e link voltar */}
      <header className="flex flex-col items-center justify-center mb-8 border-b border-white/30 pb-4 relative">
        <Link
          href="/home"
          className="absolute left-0 top-2 text-white text-lg hover:underline ml-4"
        >
          ← Voltar
        </Link>
        <div className="w-24 h-24 animate-spin-slow">
          <Image src="/images/Logo_Interact_Joy.png" alt="Logo" width={150} height={150} />
        </div>
        <h1 className="text-5xl font-bold text-white mt-2">
          <span className="text-blue-900">Interact</span>{' '}
          <span className="text-green-400">Joy</span>
        </h1>
      </header>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-white text-3xl font-semibold shadow-sm">
            Selecione seu perfil para continuar:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 font-semibold gap-8">
          {[{
            key: 'responsavel',
            title: 'Sou responsável',
            description: 'Pais ou cuidadores que desejam acompanhar o progresso da criança.',
            icon: '🧑‍👧'
          }, {
            key: 'especialista',
            title: 'Sou especialista',
            description: 'Profissionais da saúde, terapeutas ou educadores especializados.',
            icon: '🧑‍⚕️'
          }].map((profile) => (
            <button
              key={profile.key}
              onClick={() => setSelectedProfile(profile.key)}
              aria-pressed={selectedProfile === profile.key}
              className={`cursor-pointer border-4 p-10 rounded-xl shadow-md text-left transition-transform duration-300 ease-in-out hover:shadow-xl hover:scale-105 ${
                selectedProfile === profile.key
                  ? 'border-blue-700 bg-white bg-opacity-100'
                  : 'border-white bg-white bg-opacity-90'
              }`}
            >
              <h3 className="text-2xl font-bold text-blue-800 mb-2 flex items-center gap-2">
                <span>{profile.icon}</span> {profile.title}
              </h3>
              <p className="text-gray-700 text-base">{profile.description}</p>
            </button>
          ))}
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={handleContinue}
            disabled={!selectedProfile}
            className="bg-blue-600 text-3x1 text-white px-6 py-3 rounded-lg font-semibold text-lg shadow hover:bg-blue-700 disabled:opacity-50"
          >
            Continuar
          </button>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-blue-100 bg-opacity-80 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-blue-800 mb-4">Escolha seu plano de assinatura</h2>
              <p className="text-gray-700 text-base mb-4 ">
                Acesso completo ao acompanhamento de progresso e conquistas da(s) criança(s), relatórios personalizados e funcionalidades exclusivas.
              </p>
              <fieldset>
                <legend className="text-base font-medium text-blue-800 mb-2">Plano</legend>
                <div role="radiogroup" className="flex flex-col space-y-3 mb-4">
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
              </fieldset>
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
                <p className="text-green-600 text-center mt-4 font-medium">{confirmMessage}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
