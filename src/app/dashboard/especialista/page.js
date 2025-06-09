// src/app/dashboard/especialista/page.js
'use client';

import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import AccessibilityControls from '@/components/AccessibilityControls';

export default function EspecialistaDashboard() {
  const [selectedChildId, setSelectedChildId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [children, setChildren] = useState([
    { id: '1', name: 'Lucas Andrade', age: 8 },
    { id: '2', name: 'Lara Gomes', age: 10 },
    { id: '3', name: 'Tiago Menezes', age: 9 },
  ]);

  const [newChild, setNewChild] = useState({ name: '', age: '' });

  const mockProgress = {
    '1': [
      { skill: 'Comunicação', score: 60 },
      { skill: 'Emoções', score: 80 },
      { skill: 'Concentração', score: 50 },
    ],
    '2': [
      { skill: 'Comunicação', score: 90 },
      { skill: 'Emoções', score: 70 },
      { skill: 'Concentração', score: 85 },
    ],
    '3': [
      { skill: 'Comunicação', score: 40 },
      { skill: 'Emoções', score: 60 },
      { skill: 'Concentração', score: 70 },
    ],
  };

  const selectedChild = children.find(c => c.id === selectedChildId);

  const exportToPDF = () => {
    if (!selectedChildId) return;
    const doc = new jsPDF();
    doc.text(`Relatório de ${selectedChild.name}`, 14, 20);
    autoTable(doc, {
      startY: 30,
      head: [['Habilidade', 'Pontuação']],
      body: mockProgress[selectedChildId].map(row => [row.skill, `${row.score}%`])
    });
    doc.save(`relatorio-${selectedChild.name}.pdf`);
  };

  const filteredChildren = children.filter(child =>
    child.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id) => {
    setChildren(prev => prev.filter(child => child.id !== id));
    setSelectedChildId(null);
    setConfirmDeleteId(null);
  };

  const handleAddChild = () => {
    const newId = String(Date.now());
    setChildren([...children, { id: newId, name: newChild.name, age: Number(newChild.age) }]);
    setNewChild({ name: '', age: '' });
    setShowAddModal(false);
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <Head>
        <title>Dashboard Especialista</title>
      </Head>

      <AccessibilityControls />

      <header className="relative flex items-center justify-center mb-6">
  {/* Botão Voltar à esquerda, com position absoluta */}
  <Link 
    href="/" 
    className="text-2xl absolute left-0 text-blue-700 hover:underline"
  >
    ← Voltar
  </Link>

  {/* Logo e Título centralizados */}
  <div className="flex items-center gap-2">
    <Image 
      src="/images/Logo_Interact_Joy.png" 
      alt="Logo" 
      width={150} 
      height={150} 
      className="animate-spin-slow" 
    />
    <h1 className="text-4xl font-bold text-blue-800">
      Interact Joy
    </h1>
  </div>
</header>


      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <input
          type="text"
          placeholder="Buscar criança por nome..."
          className="w-full md:w-1/2 p-2 border rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
        >
          + Nova Criança
        </button>
      </div>

      <div className="mb-8">
        <label className="block mb-2 text-lg font-medium text-gray-700">Selecionar criança:</label>
        <select
          className="w-full p-3 border rounded-md"
          onChange={(e) => setSelectedChildId(e.target.value)}
          value={selectedChildId || ''}
        >
          <option value="">-- Escolha uma criança --</option>
          {filteredChildren.length > 0 ? (
            filteredChildren.map(child => (
              <option key={child.id} value={child.id}>{child.name} ({child.age} anos)</option>
            ))
          ) : (
            <option disabled>Nenhuma criança encontrada.</option>
          )}
        </select>
      </div>

      {selectedChild && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-blue-700">
              Progresso de {selectedChild.name}
            </h2>
            <button
              onClick={() => setConfirmDeleteId(selectedChild.id)}
              className="text-red-600 underline"
            >
              Excluir criança
            </button>
          </div>

          <div className="h-72 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockProgress[selectedChildId]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="skill" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="score" fill="#2563eb" name="Pontuação (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <button
            onClick={exportToPDF}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium"
          >
            Exportar em PDF
          </button>
        </div>
      )}

      {/* Modal Adicionar Criança */}
      {showAddModal && (
        <div className="fixed inset-0 bg-blue-100 bg-opacity-90 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold text-blue-800 mb-4">Nova Criança</h2>
            <input
              type="text"
              placeholder="Nome"
              value={newChild.name}
              onChange={(e) => setNewChild({ ...newChild, name: e.target.value })}
              className="w-full p-3 border rounded mb-3"
            />
            <input
              type="number"
              placeholder="Idade"
              value={newChild.age}
              onChange={(e) => setNewChild({ ...newChild, age: e.target.value })}
              className="w-full p-3 border rounded mb-4"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-md text-blue-600 hover:underline"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddChild}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Cadastrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmar Exclusão */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-semibold text-red-600 mb-4">
              Confirmar exclusão da criança?
            </h3>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 text-blue-600 hover:underline"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(confirmDeleteId)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
