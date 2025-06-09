'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import Image from 'next/image';
import AccessibilityControls from '@/components/AccessibilityControls';

export default function UsuarioRegister() {
  const router = useRouter();
  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    aceitarTermos: false
  });
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso(false);

    if (!form.nome || !form.email || !form.senha || !form.confirmarSenha) {
      return setErro('Preencha todos os campos obrigatórios.');
    }
    if (form.senha !== form.confirmarSenha) {
      return setErro('As senhas não coincidem.');
    }
    if (!form.aceitarTermos) {
      return setErro('Você precisa aceitar os termos de uso.');
    }

    setEnviando(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: form.nome,
          email: form.email,
          senha: form.senha,
          perfil: 'autista'
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro ao cadastrar');

      setSucesso(true);
      setTimeout(() => {
        router.push('/login');
      }, 1800);
    } catch (err) {
      setErro(err.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <Head>
        <title>Cadastrar como Usuário - Interact Joy</title>
      </Head>

      <AccessibilityControls />

      <div className="flex flex-col items-center mb-6">
        <Image
          src="/images/Logo_Interact_Joy.png"
          alt="Logo Interact Joy"
          width={100}
          height={100}
          className="animate-spin-slow mb-2"
        />
        <h1 className="text-2xl font-bold text-blue-800">Interact Joy</h1>
      </div>

      <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold text-center text-blue-800 mb-4">
          Cadastro - Usuário
        </h2>

        {erro && <p className="text-red-600 mb-4 text-center">{erro}</p>}
        {sucesso && <p className="text-green-600 mb-4 text-center font-medium">Cadastro realizado com sucesso!</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome completo</label>
            <input
              type="text"
              name="nome"
              id="nome"
              placeholder="Digite seu nome completo"
              value={form.nome}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="seu@email.com"
              value={form.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="senha" className="block text-sm font-medium text-gray-700">Senha</label>
            <input
              type="password"
              name="senha"
              id="senha"
              placeholder="Mínimo 6 caracteres"
              value={form.senha}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-700">Confirmar Senha</label>
            <input
              type="password"
              name="confirmarSenha"
              id="confirmarSenha"
              placeholder="Repita sua senha"
              value={form.confirmarSenha}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="flex items-start">
            <input
              id="aceitarTermos"
              name="aceitarTermos"
              type="checkbox"
              checked={form.aceitarTermos}
              onChange={handleChange}
              className="h-5 w-5 text-blue-600 rounded"
            />
            <label htmlFor="aceitarTermos" className="ml-2 text-sm text-gray-700">
              Aceito os <a href="/termos" className="text-blue-600 underline">termos de uso</a>
            </label>
          </div>

          <button
            type="submit"
            disabled={enviando}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            {enviando ? 'Enviando...' : 'Cadastrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
