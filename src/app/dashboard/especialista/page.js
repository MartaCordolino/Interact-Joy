'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { utils, writeFile } from 'xlsx';
import AccessibilityControls from '@/components/AccessibilityControls';
import habilidadesMap from '@/utils/habilidadesMap';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Pencil, Trash2, PlusCircle } from 'lucide-react';
import FormCadastroCrianca from '@/components/FormCadastroCrianca';

export default function EspecialistaDashboard() {
  const [children, setChildren] = useState([]);
  const [selectedChildren, setSelectedChildren] = useState([]);
  const [progresso, setProgresso] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const especialistaId = localStorage.getItem('userId');
    if (!especialistaId) return router.push('/login');

    const fetchChildrenAndProgress = async () => {
      const res = await fetch(`/api/users/${especialistaId}`);
      const data = await res.json();

      if (res.ok && data.criancas) {
        setChildren(data.criancas);
        const ids = data.criancas.map(c => c.id);
        const allProgress = [];

        for (const id of ids) {
          const resp = await fetch(`/api/progresso/${id}`);
          const progData = await resp.json();
          if (resp.ok && Array.isArray(progData)) {
            allProgress.push({ id, progresso: progData });
          }
        }

        setProgresso(allProgress);
      }
    };

    fetchChildrenAndProgress();
  }, [router]);

  const handleCheckboxChange = (id) => {
    setSelectedChildren(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleDelete = async (id) => {
    if (!confirm('Deseja mesmo excluir esta criança?')) return;
    await fetch(`/api/criancas/${id}`, { method: 'DELETE' });
    setChildren(prev => prev.filter(child => child.id !== id));
    setSelectedChildren(prev => prev.filter(i => i !== id));
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Relatório Interact Joy - Crianças Vinculadas', 14, 20);
    autoTable(doc, {
      startY: 30,
      head: [['ID', 'Nome', 'Idade', 'Email', 'Suporte']],
      body: children
        .filter(c => selectedChildren.includes(c.id))
        .map(c => [c.id, c.nome, c.idade, c.email, c.nivelSuporte])
    });
    doc.save('relatorio_interactjoy.pdf');
  };

  const exportToCSV = () => {
    const data = children
      .filter(c => selectedChildren.includes(c.id))
      .map(c => ({
        ID: c.id,
        Nome: c.nome,
        Idade: c.idade,
        Email: c.email,
        Suporte: c.nivelSuporte
      }));
    const worksheet = utils.json_to_sheet(data);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Crianças');
    writeFile(workbook, 'relatorio_interactjoy.csv');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-300 p-8">
      <AccessibilityControls />

      <header className="flex justify-between items-center mb-6">
        <Link href="/" className="text-white hover:underline text-2xl">← Voltar</Link>
        <div className="flex items-center gap-4">
          <Image src="/images/Logo_Interact_Joy.png" alt="Logo" width={100} height={100} className="animate-spin-slow" />
          <h1 className="text-3xl font-bold text-white">Interact Joy</h1>
        </div>
      </header>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-white">Painel do Especialista</h2>
        <div className="flex gap-2">
          <button onClick={() => setShowAddModal(true)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-1">
            <PlusCircle size={18} /> Cadastrar
          </button>
          <button onClick={exportToPDF} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">PDF</button>
          <button onClick={exportToCSV} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg">CSV</button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="w-full bg-blue-100">
          <thead>
            <tr className="bg-blue-200 text-blue-900">
              <th className="px-4 py-2 text-left">Selecionar</th>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Nome</th>
              <th className="px-4 py-2 text-left">Idade</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Suporte</th>
              <th className="px-4 py-2 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {children.map(child => (
              <tr key={child.id} className="hover:bg-blue-50">
                <td className="px-4 py-2">
                  <input type="checkbox" checked={selectedChildren.includes(child.id)} onChange={() => handleCheckboxChange(child.id)} />
                </td>
                <td className="px-4 py-2">{child.id}</td>
                <td className="px-4 py-2">{child.nome}</td>
                <td className="px-4 py-2">{child.idade}</td>
                <td className="px-4 py-2">{child.email}</td>
                <td className="px-4 py-2 capitalize">{child.nivelSuporte}</td>
                <td className="px-4 py-2">
                  <button className="text-red-600 hover:text-red-800" onClick={() => handleDelete(child.id)}>
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-blue bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <FormCadastroCrianca
              context="especialista"
              open={true}
              onClose={() => setShowAddModal(false)}
              onSuccess={(novaCrianca) => {
                setChildren(prev => [...prev, novaCrianca]);
                setShowAddModal(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
