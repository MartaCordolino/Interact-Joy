'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import AccessibilityControls from '@/components/AccessibilityControls';
import { Eye, EyeOff } from 'lucide-react';

export default function CadastroEspecialista() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    termos: false
  });
  const [erros, setErros] = useState({});
  const [submetendo, setSubmetendo] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : (name === 'nome' ? value.toUpperCase() : value)
    });
    if (erros[name]) setErros({ ...erros, [name]: '' });
  };

  const validarFormulario = () => {
    const novoErros = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cpfRegex = /^\d{11}$/;
    if (!formData.nome.trim()) novoErros.nome = 'Nome é obrigatório';
    if (!cpfRegex.test(formData.cpf)) novoErros.cpf = 'CPF inválido (somente números)';
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
      const tipoPlano = localStorage.getItem('tipoPlano'); // ← recuperação

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: formData.nome,
          cpf: formData.cpf,
          email: formData.email,
          senha: formData.senha,
          perfil: 'especialista',
          tipoPlano: tipoPlano
        })
      });

      const data = await response.json();
      if (response.ok) {
        setMensagemSucesso('Cadastro realizado com sucesso! Redirecionando para login...');
        setTimeout(() => router.push('/login'), 2000);
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
      <Head><title>Cadastro Especialista</title></Head>
      <AccessibilityControls />

      <header className="flex justify-between items-center max-w-4xl mx-auto mb-6 px-2">
        <Link href="/home" className="text-blue-700 hover:underline text-lg">← Voltar</Link>
        <div className="flex items-center gap-3">
          <Image src="/images/Logo_Interact_Joy.png" alt="Logo" width={64} height={64} className="animate-spin-slow" />
          <h1 className="text-3xl font-bold">
            <span className="text-blue-700">Interact</span>{' '}
            <span className="text-green-600">Joy</span>
          </h1>
        </div>
        <div className="w-8" />
      </header>

      <main className="container mx-auto px-4 py-6 max-w-xl text-gray-800">
        <h2 className="text-2xl font-bold text-center mb-2">Cadastro de Especialista</h2>
        <p className="text-center text-sm text-gray-600 mb-6">Profissional com acesso ao gerenciamento de crianças</p>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4 text-base" aria-label="Formulário de cadastro do especialista">
          <div>
            <label htmlFor="nome" className="block font-medium">Nome completo</label>
            <input type="text" id="nome" name="nome" placeholder="Digite seu nome completo" value={formData.nome} onChange={handleChange} className="mt-1 block w-full rounded-md border p-2 uppercase" />
            {erros.nome && <p className="text-red-600 text-sm mt-1" role="alert">{erros.nome}</p>}
          </div>

          <div>
            <label htmlFor="cpf" className="block font-medium">CPF</label>
            <input type="text" id="cpf" name="cpf" placeholder="Somente números" value={formData.cpf} onChange={handleChange} className="mt-1 block w-full rounded-md border p-2" />
            {erros.cpf && <p className="text-red-600 text-sm mt-1" role="alert">{erros.cpf}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block font-medium">Email</label>
            <input type="email" id="email" name="email" placeholder="exemplo@email.com" value={formData.email} onChange={handleChange} className="mt-1 block w-full rounded-md border p-2" />
            {erros.email && <p className="text-red-600 text-sm mt-1" role="alert">{erros.email}</p>}
          </div>

          <div className="relative">
            <label htmlFor="senha" className="block font-medium">Senha</label>
            <input type={mostrarSenha ? 'text' : 'password'} id="senha" name="senha" placeholder="Mínimo 6 caracteres" value={formData.senha} onChange={handleChange} className="mt-1 block w-full rounded-md border p-2 pr-10" />
            <button type="button" onClick={() => setMostrarSenha(!mostrarSenha)} className="absolute top-9 right-3 text-gray-600" aria-label="Mostrar ou esconder senha">
              {mostrarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {erros.senha && <p className="text-red-600 text-sm mt-1" role="alert">{erros.senha}</p>}
          </div>

          <div className="relative">
            <label htmlFor="confirmarSenha" className="block font-medium">Confirmar senha</label>
            <input type={mostrarConfirmarSenha ? 'text' : 'password'} id="confirmarSenha" name="confirmarSenha" placeholder="Repita a senha" value={formData.confirmarSenha} onChange={handleChange} className="mt-1 block w-full rounded-md border p-2 pr-10" />
            <button type="button" onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)} className="absolute top-9 right-3 text-gray-600" aria-label="Mostrar ou esconder confirmação">
              {mostrarConfirmarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {erros.confirmarSenha && <p className="text-red-600 text-sm mt-1" role="alert">{erros.confirmarSenha}</p>}
          </div>

          <div className="flex items-start">
            <input id="termos" name="termos" type="checkbox" checked={formData.termos} onChange={handleChange} className="h-5 w-5 text-blue-600 mt-1" />
            <label htmlFor="termos" className="ml-2 text-sm text-gray-700">
              Concordo com os <a href="/termos" className="text-blue-600 underline">termos de uso</a>
            </label>
          </div>
          {erros.termos && <p className="text-red-600 text-sm mt-1" role="alert">{erros.termos}</p>}

          {erros.submit && <p className="text-red-600 text-sm text-center" role="alert">{erros.submit}</p>}
          {mensagemSucesso && <p className="text-green-600 text-center text-sm font-medium" role="status">{mensagemSucesso}</p>}

          <div className="flex justify-between gap-4 pt-2">
            <button type="button" onClick={() => router.push('/')} className="w-1/2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg">
              Cancelar
            </button>
            <button type="submit" disabled={submetendo} className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg">
              {submetendo ? 'Cadastrando...' : 'Cadastrar'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
