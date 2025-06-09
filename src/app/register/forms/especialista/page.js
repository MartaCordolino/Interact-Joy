'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import Image from 'next/image';
import AccessibilityControls from '@/components/AccessibilityControls';

export default function CadastroEspecialista() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    termos: false
  });
  const [erros, setErros] = useState({});
  const [submetendo, setSubmetendo] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });

    if (erros[name]) {
      setErros({ ...erros, [name]: '' });
    }
  };

  const validarFormulario = () => {
    const novoErros = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.nome.trim()) novoErros.nome = 'Nome é obrigatório';
    if (!emailRegex.test(formData.email)) novoErros.email = 'Email inválido';
    if (formData.senha.length < 6) novoErros.senha = 'Mínimo 6 caracteres';
    if (formData.senha !== formData.confirmarSenha) novoErros.confirmarSenha = 'Senhas diferentes';
    if (!formData.termos) novoErros.termos = 'Você deve aceitar os termos';

    return novoErros;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errosValidacao = validarFormulario();
    if (Object.keys(errosValidacao).length > 0) {
      setErros(errosValidacao);
      return;
    }

    setSubmetendo(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: formData.nome,
          email: formData.email,
          senha: formData.senha,
          perfil: 'especialista'
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMensagemSucesso('Cadastro realizado com sucesso! Redirecionando para login...');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setErros({ submit: data.error || 'Erro ao cadastrar' });
      }
    } catch (err) {
      setErros({ submit: 'Erro ao conectar com o servidor' });
    } finally {
      setSubmetendo(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <Head>
        <title>Cadastro Especialista</title>
      </Head>

      <AccessibilityControls />

      <main className="container mx-auto px-4 py-10 max-w-xl text-gray-800">
        <div className="text-center mb-6">
          <Image
            src="/images/Logo_Interact_Joy.png"
            alt="Logo Interact Joy"
            width={80}
            height={80}
            className="mx-auto animate-spin-slow"
          />
          <h1 className="text-3xl font-bold text-blue-800 mt-4 font-sans">Cadastro Especialista</h1>
          <p className="text-gray-600 text-sm">Profissional da área com acesso a gerenciamento de crianças</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4 text-base">
          <div>
            <label htmlFor="nome" className="block font-medium">Nome completo</label>
            <input type="text" id="nome" name="nome" placeholder="Digite seu nome completo" value={formData.nome} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-blue-500 focus:border-blue-500" />
            {erros.nome && <p className="text-red-600 text-sm mt-1">{erros.nome}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block font-medium">Email</label>
            <input type="email" id="email" name="email" placeholder="seu@email.com" value={formData.email} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-blue-500 focus:border-blue-500" />
            {erros.email && <p className="text-red-600 text-sm mt-1">{erros.email}</p>}
          </div>

          <div>
            <label htmlFor="senha" className="block font-medium">Senha</label>
            <input type="password" id="senha" name="senha" placeholder="Mínimo 6 caracteres" value={formData.senha} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-blue-500 focus:border-blue-500" />
            {erros.senha && <p className="text-red-600 text-sm mt-1">{erros.senha}</p>}
          </div>

          <div>
            <label htmlFor="confirmarSenha" className="block font-medium">Confirmar senha</label>
            <input type="password" id="confirmarSenha" name="confirmarSenha" placeholder="Digite a senha novamente" value={formData.confirmarSenha} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-blue-500 focus:border-blue-500" />
            {erros.confirmarSenha && <p className="text-red-600 text-sm mt-1">{erros.confirmarSenha}</p>}
          </div>

          <div className="flex items-start">
            <input id="termos" name="termos" type="checkbox" checked={formData.termos} onChange={handleChange} className="h-5 w-5 text-blue-600" />
            <label htmlFor="termos" className="ml-2 text-sm text-gray-700">
              Concordo com os <a href="/termos" className="text-blue-600 underline">termos de uso</a>
            </label>
          </div>
          {erros.termos && <p className="text-red-600 text-sm mt-1">{erros.termos}</p>}

          {erros.submit && <p className="text-red-600 text-sm text-center">{erros.submit}</p>}
          {mensagemSucesso && <p className="text-green-600 text-center text-sm font-medium">{mensagemSucesso}</p>}

          <button type="submit" disabled={submetendo} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg">
            {submetendo ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>
      </main>
    </div>
  );
}
