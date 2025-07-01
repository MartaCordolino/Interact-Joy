'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import AccessibilityControls from '@/components/AccessibilityControls';
import FormCadastroCrianca from '@/components/FormCadastroCrianca';

export default function ParentDashboardPage() {
  const [settings, setSettings] = useState({ highContrast: false, largeText: false });
  const [loading, setLoading] = useState(true);
  const [childData, setChildData] = useState(null);
  const [progressData, setProgressData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();

  const textClass = settings.largeText ? 'text-lg' : 'text-base';

  const fetchData = useCallback(async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        router.push('/login');
        return;
      }

      const res = await fetch(`/api/users/${userId}`);
      const usuario = await res.json();

      if (!usuario?.filhos || usuario.filhos.length === 0) {
        setChildData(null);
        setShowForm(true);
        setLoading(false);
        return;
      }

      const crianca = usuario.filhos[0];
      setChildData(crianca);
      setShowForm(false);

      if (!crianca?.id) {
        console.warn('ID da criança não encontrado.');
        setLoading(false);
        return;
      }

      const [progressoRes, conquistasRes] = await Promise.all([
        fetch(`/api/progresso/${crianca.id}`),
        fetch(`/api/conquistas/${crianca.id}`)
      ]);

      const progressoJson = await progressoRes.json();
      const conquistasJson = await conquistasRes.json();

      const combinado = progressoJson.map((item) => {
        const conquistasDoJogo = conquistasJson.filter(c => c.id_jogo === item.jogo.id);
        return {
          game: item.jogo.nome,
          objective: item.objetivo ?? 'Objetivo não especificado',
          date: new Date(item.ultimo_acesso).toLocaleString('pt-BR'),
          progress: `${item.porcentagem}%`,
          achievements: conquistasDoJogo.map(c => c.tipo).join(', ') || 'Nenhuma'
        };
      });

      setProgressData(combinado);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const exportarPDF = () => {
    if (!childData) return alert('Informações da criança não encontradas.');

    const doc = new jsPDF();
    const dataAtual = new Date().toLocaleString('pt-BR');

    doc.setFontSize(18);
    doc.text('Relatório de Acompanhamento', 105, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`Emitido em: ${dataAtual}`, 105, 28, { align: 'center' });

    doc.setFontSize(12);
    doc.text(`
Nome: ${childData.nome}
Idade: ${childData.idade} anos
E-mail: ${childData.email}
Nível de Suporte: ${childData.nivelSuporteDescricao || childData.nivel_suporte}`,
      15, 45);

    if (progressData.length > 0) {
      autoTable(doc, {
        startY: 80,
        head: [['Jogo', 'Objetivo', 'Data/Hora', 'Progresso', 'Conquistas']],
        body: progressData.map(item => [
          item.game,
          item.objective,
          item.date,
          item.progress,
          item.achievements
        ])
      });
    } else {
      doc.setFontSize(12);
      doc.text('Nenhum progresso registrado até o momento.', 15, 80);
    }

    doc.output('dataurlnewwindow');
  };

  return (
    <div className={`min-h-screen ${settings.highContrast ? 'bg-black text-white' : 'bg-blue-50'}`}>
      <header className="relative flex items-center justify-between px-6 py-4 bg-gradient-to-r from-purple-500 to-blue-600 text-white">
        <Link href="/home" className="text-white hover:underline cursor-pointer text-2xl z-10">
          ← Voltar
        </Link>

        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-3 text-center">
          <Image
            src="/images/Logo_Interact_Joy.png"
            alt="Logo"
            width={80}
            height={80}
            className="animate-spin-slow"
          />
          <h1 className="text-3xl font-bold">
            <span className="text-white">Interact</span>{' '}
            <span className="text-green-300">Joy</span>
          </h1>
        </div>

        <div className="z-10">
          <AccessibilityControls settings={settings} onSettingsChange={setSettings} />
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {loading ? (
          <p className="text-center text-blue-800 font-medium text-lg">Carregando...</p>
        ) : !childData ? (
          <FormCadastroCrianca
            context="responsavel"
            open={showForm}
            onClose={() => setShowForm(false)}
            onSuccess={() => {
              setShowForm(false);
              fetchData();
            }}
          />
        ) : (
          <>
            <section className="bg-white shadow rounded-lg p-5">
              <h2 className="text-xl font-bold text-blue-700 mb-3">Informações da Criança</h2>
              <ul className="space-y-1">
                <li className={textClass}><strong>Nome:</strong> {childData?.nome}</li>
                <li className={textClass}><strong>Idade:</strong> {childData?.idade} anos</li>
                <li className={textClass}><strong>Email:</strong> {childData?.email}</li>
                <li className={textClass}><strong>Nível de Suporte:</strong> {childData?.nivelSuporteDescricao || childData?.nivel_suporte}</li>
              </ul>
            </section>

            <section className="bg-white shadow rounded-lg p-5">
              <h2 className="text-xl font-bold text-blue-700 mb-4">Progresso e Conquistas</h2>
              {progressData.length === 0 ? (
                <p className="text-gray-600">Nenhum progresso registrado até o momento.</p>
              ) : (
                <table className="w-full text-left border border-gray-300">
                  <thead className="bg-blue-100">
                    <tr>
                      <th className="py-2 px-3">Jogo</th>
                      <th className="py-2 px-3">Objetivo</th>
                      <th className="py-2 px-3">Data/Hora</th>
                      <th className="py-2 px-3">Progresso</th>
                      <th className="py-2 px-3">Conquistas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {progressData.map((item, index) => (
                      <tr key={index} className="odd:bg-white even:bg-gray-50">
                        <td className="py-2 px-3">{item.game}</td>
                        <td className="py-2 px-3">{item.objective}</td>
                        <td className="py-2 px-3">{item.date}</td>
                        <td className="py-2 px-3 text-green-600 font-semibold">{item.progress}</td>
                        <td className="py-2 px-3 text-purple-600 font-medium">{item.achievements}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>

            <div className="flex justify-end">
              <button
                onClick={exportarPDF}
                className="bg-green-500 hover:bg-green-400 font-bold text-white  px-4 py-2 rounded cursor-pointer"
              >
                Visualizar Relatório
              </button>
            </div>
          </>
        )}
      </main>

      <footer className="text-center text-sm text-gray-500 py-4">Interact Joy © 2025</footer>
    </div>
  );
}
