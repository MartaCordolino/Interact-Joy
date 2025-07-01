// Código atualizado do formulário de cadastro do responsável com melhorias visuais e nome em maiúsculas
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import AccessibilityControls from '@/components/AccessibilityControls';
import { Eye, EyeOff } from 'lucide-react';

export default function RegisterResponsavel() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    cpf: '',
    confirmarSenha: '',
    termos: false
  });
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : name === 'nome' ? value.toUpperCase() : value
    }));
    if (erro) setErro('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem('');
    setErro('');

    if (formData.senha !== formData.confirmarSenha) {
      setErro('As senhas não coincidem.');
      return;
    }

    if (!formData.termos) {
      setErro('Você deve aceitar os termos de uso.');
      return;
    }

    try {
      const tipoPlano = localStorage.getItem('tipoPlano') || 'mensal';
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'tipoPlano': tipoPlano
        },
        body: JSON.stringify({
          ...formData,
          nome: formData.nome.toUpperCase(),
          perfil: 'responsavel'
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setErro(data.error || 'Erro ao cadastrar');
        return;
      }
      localStorage.removeItem('tipoPlano');
      setMensagem('Cadastro realizado com sucesso! Redirecionando...');
      setTimeout(() => router.push('/login'), 2000);
    } catch (err) {
      console.error(err);
      setErro('Erro interno ao cadastrar.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 p-6 font-sans">
      <Head>
        <title>Cadastro - Responsável | Interact Joy</title>
      </Head>

      <AccessibilityControls />

      <header className="flex items-center justify-between mb-6">
        <Link href="/register/select" className="text-white hover:underline text-lg">← Voltar</Link>
        <div className="flex items-center gap-4">
          <Image 
            src="/images/Logo_Interact_Joy.png" 
            alt="Logo" 
            width={56} 
            height={56} 
            className="animate-spin-slow" 
          />
          <h1 className="text-3xl font-bold text-white">
            <span className="text-blue-800">Interact</span> <span className="text-green-400">Joy</span>
          </h1>
        </div>
        <div className="w-8" />
      </header>

      <main className="max-w-xl mx-auto bg-white bg-opacity-90 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-blue-800 mb-6">Cadastro de Responsável</h2>
        {mensagem && <p className="text-green-600 mb-4">{mensagem}</p>}
        {erro && <p className="text-red-600 mb-4">{erro}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-blue-900">Nome completo</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 uppercase"
              placeholder="Digite seu nome completo"
            />
          </div>

          <div>
            <label htmlFor="cpf" className="block text-sm font-medium text-blue-900">CPF</label>
            <input
              type="text"
              id="cpf"
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
              placeholder="000.000.000-00"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-blue-900">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
              placeholder="exemplo@email.com"
            />
          </div>

          <div className="relative">
            <label htmlFor="senha" className="block text-sm font-medium text-blue-900">Senha</label>
            <input
              type={mostrarSenha ? 'text' : 'password'}
              id="senha"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 pr-10"
              placeholder="Mínimo 6 caracteres"
            />
            <button type="button" onClick={() => setMostrarSenha(!mostrarSenha)} className="absolute top-9 right-3 text-gray-600" aria-label="Mostrar ou esconder senha">
              {mostrarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="relative">
            <label htmlFor="confirmarSenha" className="block text-sm font-medium text-blue-900">Confirmar senha</label>
            <input
              type={mostrarConfirmarSenha ? 'text' : 'password'}
              id="confirmarSenha"
              name="confirmarSenha"
              value={formData.confirmarSenha}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 pr-10"
              placeholder="Repita a senha"
            />
            <button type="button" onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)} className="absolute top-9 right-3 text-gray-600" aria-label="Mostrar ou esconder confirmação">
              {mostrarConfirmarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="flex items-start">
            <input id="termos" name="termos" type="checkbox" checked={formData.termos} onChange={handleChange} className="h-5 w-5 text-blue-600 mt-1" />
            <label htmlFor="termos" className="ml-2 text-sm text-gray-700">
              Concordo com os <a href="/termos" className="text-blue-600 underline">termos de uso</a>
            </label>
          </div>

          <div className="flex justify-between gap-4 pt-2">
            <button type="button" onClick={() => router.push('/')} className="w-1/2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg">
              Cancelar
            </button>
            <button type="submit" className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
              Finalizar Cadastro
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
