
// src/app/register/forms/usuario/page.js
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import Image from 'next/image';
import AccessibilityControls from '@/components/AccessibilityControls';

export default function UsuarioRegister({ onSubmit, context = 'registro' }) {
  const router = useRouter();
  const [form, setForm] = useState({
    nome: '',
    idade: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    nivelSuporte: '',
    aceitarTermos: false
  });
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const limparCampos = () => {
    setForm({
      nome: '',
      idade: '',
      email: '',
      senha: '',
      confirmarSenha: '',
      nivelSuporte: '',
      aceitarTermos: false
    });
  };

  const exibirErro = (mensagem) => {
    setErro(mensagem);
    limparCampos();
    setTimeout(() => setErro(''), 4000);
  };

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

    const idade = parseInt(form.idade);
    if (!form.nome || !form.idade || !form.email || !form.senha || !form.confirmarSenha || !form.nivelSuporte) {
      return exibirErro('Preencha todos os campos obrigatórios.');
    }
    if (form.senha !== form.confirmarSenha) {
      return exibirErro('As senhas não coincidem.');
    }
    if (idade < 7 || idade > 12) {
      return exibirErro('A idade deve estar entre 7 e 12 anos.');
    }

    if (context === 'registro' && !form.aceitarTermos) {
      return exibirErro('Você precisa aceitar os termos de uso.');
    }

    setEnviando(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: form.nome.toUpperCase(),
          idade,
          email: form.email,
          senha: form.senha,
          nivelSuporte: form.nivelSuporte,
          perfil: 'autista'
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro ao cadastrar.');

      setSucesso(true);
      if (onSubmit) {
        onSubmit(); // usado por especialista ou responsável
      } else {
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch (err) {
      exibirErro(err.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <Head><title>Cadastro - Usuário | Interact Joy</title></Head>

      <AccessibilityControls />

      <header className="flex items-center justify-center mb-8 gap-4">
        <div className="w-16 h-16 animate-spin-slow">
          <Image src="/images/Logo_Interact_Joy.png" alt="Logo" width={64} height={64} />
        </div>
        <h1 className="text-3xl font-bold">
          <span className="text-blue-700">Interact</span>{' '}
          <span className="text-green-600">Joy</span>
        </h1>
      </header>

      <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold text-center text-blue-800 mb-4">
          Cadastro - Usuário (Criança)
        </h2>

        {erro && <p className="text-red-600 text-center mb-4">{erro}</p>}
        {sucesso && <p className="text-green-600 text-center mb-4 font-medium">Cadastro realizado com sucesso!</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome completo</label>
            <input
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              placeholder="Digite o nome completo"
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Idade</label>
            <input
              type="number"
              name="idade"
              value={form.idade}
              onChange={handleChange}
              placeholder="7 a 12 anos"
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              min={7}
              max={12}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="email@exemplo.com"
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Senha</label>
            <input
              type="password"
              name="senha"
              value={form.senha}
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              required
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
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nível de suporte</label>
            <select
              name="nivelSuporte"
              value={form.nivelSuporte}
              onChange={handleChange}
              className="block w-full border rounded-md p-2 border-gray-300"
              required
            >
              <option value="">Selecione</option>
              <option value="leve">Leve – apoio ocasional, maior autonomia</option>
              <option value="moderado">Moderado – apoio frequente, dificuldades sociais</option>
              <option value="intenso">Intenso – apoio constante, comunicação limitada</option>
            </select>
          </div>

          {context === 'registro' && (
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
          )}

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={limparCampos}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={enviando}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              {enviando ? 'Enviando...' : 'Cadastrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
