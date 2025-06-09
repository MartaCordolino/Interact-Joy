'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import Image from 'next/image';
import AccessibilityControls from '@/components/AccessibilityControls';

export default function CadastroResponsavel() {
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

  const limparCampos = () => {
    setForm({
      nome: '',
      email: '',
      senha: '',
      confirmarSenha: '',
      aceitarTermos: false
    });
  };

  const exibirErro = (mensagem) => {
    setErro(mensagem);
    limparCampos();
    setTimeout(() => setErro(''), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    if (!form.nome || !form.email || !form.senha || !form.confirmarSenha) {
      return exibirErro('Preencha todos os campos obrigatórios.');
    }
    if (form.senha !== form.confirmarSenha) {
      return exibirErro('As senhas não coincidem.');
    }
    if (!form.aceitarTermos) {
      return exibirErro('Você precisa aceitar os termos de uso.');
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
          perfil: 'responsavel'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao registrar.');
      }

      setSucesso(true);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      exibirErro(err.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <Head>
        <title>Cadastro Responsável - Interact Joy</title>
      </Head>

      <AccessibilityControls />

      <main className="container mx-auto px-4 py-10 max-w-xl">
        <div className="text-center mb-6">
          <Image
            src="/images/Logo_Interact_Joy.png"
            alt="Logo Interact Joy"
            width={80}
            height={80}
            className="mx-auto animate-spin-slow"
          />
          <h1 className="text-3xl font-bold text-blue-800 mt-4">Cadastro - Responsável</h1>
          <p className="text-gray-600">Preencha os dados abaixo para criar sua conta</p>
        </div>

        {erro && <p className="text-red-600 text-center mb-4">{erro}</p>}
        {sucesso && <p className="text-green-600 text-center mb-4">Cadastro realizado com sucesso!</p>}

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome completo</label>
            <input
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              placeholder="Digite seu nome completo"
              className="mt-1 block w-full rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="seuemail@exemplo.com"
              className="mt-1 block w-full rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Senha</label>
            <input
              type="password"
              name="senha"
              value={form.senha}
              onChange={handleChange}
              placeholder="Crie uma senha"
              className="mt-1 block w-full rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Confirmar senha</label>
            <input
              type="password"
              name="confirmarSenha"
              value={form.confirmarSenha}
              onChange={handleChange}
              placeholder="Repita sua senha"
              className="mt-1 block w-full rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-start">
            <input
              id="aceitarTermos"
              name="aceitarTermos"
              type="checkbox"
              checked={form.aceitarTermos}
              onChange={handleChange}
              className="h-5 w-5 text-blue-600"
            />
            <label htmlFor="aceitarTermos" className="ml-2 text-sm text-gray-700">
              Concordo com os <a href="/termos" className="text-blue-600 underline">termos de uso</a>
            </label>
          </div>

          <button
            type="submit"
            disabled={enviando}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
          >
            {enviando ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>
      </main>
    </div>
  );
}
