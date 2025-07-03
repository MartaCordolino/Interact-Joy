'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { utils, writeFile } from 'xlsx';
import AccessibilityControls from '@/components/AccessibilityControls';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Pencil, Trash2, PlusCircle, BarChart3, X } from 'lucide-react';
import FormCadastroCrianca from '@/components/FormCadastroCrianca';

export default function EspecialistaDashboard() {
  const [children, setChildren] = useState([]);
  const [filteredChildren, setFilteredChildren] = useState([]);
  const [selectedChildren, setSelectedChildren] = useState([]);
  const [progresso, setProgresso] = useState([]);
  const [conquistas, setConquistas] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editChild, setEditChild] = useState(null);
  const [showGraficoModal, setShowGraficoModal] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const router = useRouter();

  useEffect(() => {
    const especialistaId = localStorage.getItem('userId');
    if (!especialistaId) return router.push('/login');

    const fetchChildrenAndData = async () => {
      const res = await fetch(`/api/users/${especialistaId}`);
      const data = await res.json();

      if (res.ok && data.criancas) {
        const validChildren = data.criancas.filter(c => c.nome);
        setChildren(validChildren);
        setFilteredChildren(validChildren);

        const ids = validChildren.map(c => c.id);
        const allProgress = [];
        const allConquistas = [];

        for (const id of ids) {
          const [respP, respC] = await Promise.all([
            fetch(`/api/progresso/${id}`),
            fetch(`/api/conquistas/${id}`)
          ]);

          const dataP = await respP.json();
          const dataC = await respC.json();

          if (respP.ok && Array.isArray(dataP)) {
            allProgress.push({ id, progresso: dataP });
          }

          if (respC.ok && Array.isArray(dataC)) {
            allConquistas.push({ id, conquistas: dataC });
          }
        }

        setProgresso(allProgress);
        setConquistas(allConquistas);
      }
    };

    fetchChildrenAndData();
  }, [router]);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = children.filter(child => child.nome.toLowerCase().includes(term));
    setFilteredChildren(filtered);
    setCurrentPage(1);
  }, [searchTerm, children]);

  const handleCheckboxChange = (id) => {
    setSelectedChildren(prev => prev.includes(id) ? prev.filter(i => i !== id) : [id]);
  };

  const handleDelete = async () => {
    if (selectedChildren.length !== 1) return alert('Selecione uma única criança para excluir.');
    const id = selectedChildren[0];
    const confirmDelete = window.confirm('Deseja mesmo excluir esta criança?');
    if (!confirmDelete) return;
    await fetch(`/api/criancas/${id}`, { method: 'DELETE' });
    setChildren(prev => prev.filter(child => child.id !== id));
    setSelectedChildren([]);
  };

  const handleEdit = () => {
    if (selectedChildren.length !== 1) return alert('Selecione uma única criança para editar.');
    const crianca = children.find(c => c.id === selectedChildren[0]);
    if (crianca) setEditChild(crianca);
  };

  const handleShowGraficos = () => {
    if (selectedChildren.length !== 1) return alert('Selecione uma única criança para visualizar os gráficos.');
    setShowGraficoModal(selectedChildren[0]);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Relatório de Acompanhamento', 105, 20, { align: 'center' });
    autoTable(doc, {
      startY: 30,
      head: [['ID', 'Nome', 'Idade', 'Email', 'Suporte']],
      body: filteredChildren
        .filter(c => selectedChildren.includes(c.id))
        .map(c => [c.id, c.nome, c.idade, c.email, c.nivelSuporte || 'N/D'])
    });
    doc.save('relatorio_interactjoy.pdf');
  };

  const exportToCSV = () => {
    const data = filteredChildren
      .filter(c => selectedChildren.includes(c.id))
      .map(c => ({
        ID: c.id,
        Nome: c.nome,
        Idade: c.idade,
        Email: c.email,
        Suporte: c.nivelSuporte || 'N/D'
      }));
    const worksheet = utils.json_to_sheet(data);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Crianças');
    writeFile(workbook, 'relatorio_interactjoy.csv');
  };

  const progressoPorCrianca = (id) => {
    const dados = progresso.find(p => p.id === id);
    if (!dados) return [];
    return dados.progresso.map((jogo, i) => ({ jogo: `Jogo ${i + 1}`, porcentagem: jogo.porcentagem }));
  };

  const conquistasPorCrianca = (id) => {
    const dados = conquistas.find(p => p.id === id);
    const tipos = {};
    if (dados && Array.isArray(dados.conquistas)) {
      dados.conquistas.forEach(c => {
        tipos[c.tipo_conquista] = (tipos[c.tipo_conquista] || 0) + 1;
      });
    }
    return Object.entries(tipos).map(([tipo, count]) => ({ tipo, conquistas: count }));
  };

  const paginatedChildren = filteredChildren.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredChildren.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-300 p-8">
      <AccessibilityControls />

      <header className="flex justify-between items-center mb-6">
        <Link href="/home" className="text-white hover:underline text-2xl">← Voltar</Link>
        <div className="flex items-center gap-4">
          <Image src="/images/Logo_Interact_Joy.png" alt="Logo" width={100} height={100} className="animate-spin-slow" />
          <h1 className="text-3xl font-bold text-white">Interact Joy</h1>
        </div>
      </header>

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Buscar por nome"
          aria-label="Buscar por nome"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 rounded-md w-1/2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
        />
        <div className="flex gap-2">
          <button onClick={() => setShowAddModal(true)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-1 cursor-pointer">
            <PlusCircle size={18} /> Cadastrar
          </button>
          <button onClick={handleEdit} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer">Editar</button>
          <button onClick={handleShowGraficos} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg cursor-pointer">Gráficos</button>
          <button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg cursor-pointer">Excluir</button>
          <button onClick={exportToPDF} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg cursor-pointer">PDF</button>
          <button onClick={exportToCSV} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg cursor-pointer">CSV</button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg shadow mb-8">
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
            {paginatedChildren.map(child => (
              <tr key={child.id} className="hover:bg-blue-50">
                <td className="px-4 py-2">
                  <input type="checkbox" checked={selectedChildren.includes(child.id)} onChange={() => handleCheckboxChange(child.id)} />
                </td>
                <td className="px-4 py-2">{child.id}</td>
                <td className="px-4 py-2 uppercase">{child.nome}</td>
                <td className="px-4 py-2">{child.idade}</td>
                <td className="px-4 py-2">{child.email}</td>
                <td className="px-4 py-2 capitalize">{child.nivelSuporte || 'N/D'}</td>
                <td className="px-4 py-2 text-gray-500 text-sm">Use os botões acima</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border'}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {showGraficoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-xl w-full relative">
            <button onClick={() => setShowGraficoModal(null)} className="absolute top-2 right-2 text-red-600"><X /></button>
            <h3 className="text-xl font-bold mb-4">Desempenho de {filteredChildren.find(c => c.id === showGraficoModal)?.nome}</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={progressoPorCrianca(showGraficoModal)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="jogo" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="porcentagem" fill="#8884d8" name="Progresso" />
              </BarChart>
            </ResponsiveContainer>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={conquistasPorCrianca(showGraficoModal)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="tipo" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="conquistas" fill="#82ca9d" name="Conquistas" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

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

      {editChild && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full relative">
            <button onClick={() => setEditChild(null)} className="absolute top-2 right-2 text-red-600"><X /></button>
            <FormCadastroCrianca
              context="especialista"
              modo="editar"
              dados={editChild}
              onClose={() => setEditChild(null)}
              onSuccess={(atualizada) => {
                setChildren(prev => prev.map(c => c.id === atualizada.id ? atualizada : c));
                setEditChild(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
