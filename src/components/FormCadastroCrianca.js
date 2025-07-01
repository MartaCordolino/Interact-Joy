'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

export default function FormCadastroCrianca({ context = 'responsavel', onSuccess = () => {}, onClose }) {
  const router = useRouter();
  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    idade: '',
    nivelSuporte: '',
    aceitarTermos: false
  });
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso(false);

    const idade = parseInt(form.idade);

    if (!form.nome || !form.email || !form.senha || !form.nivelSuporte || !form.idade) {
      return setErro('Preencha todos os campos obrigatórios.');
    }

    if (isNaN(idade) || idade < 7 || idade > 12) {
      return setErro('A idade deve estar entre 7 e 12 anos.');
    }

    if (form.senha !== form.confirmarSenha) {
      return setErro('As senhas não coincidem.');
    }

    if (!form.aceitarTermos) {
      return setErro('Você precisa aceitar os termos de uso.');
    }

    const userId = localStorage.getItem('userId');
    if (!userId) return setErro('Usuário não autenticado.');

    setEnviando(true);

    try {
      const response = await fetch('/api/criancas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: form.nome.toUpperCase(),
          email: form.email,
          senha: form.senha,
          idade,
          faixaEtaria: idade <= 9 ? 'faixa_7_9' : 'faixa_10_12',
          nivelSuporte: form.nivelSuporte,
          perfil: 'autista',
          [`${context}Id`]: parseInt(userId)
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro ao cadastrar');

      setSucesso(true);
      onSuccess(data.novaCrianca || {});
    } catch (err) {
      setErro(err.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-center text-blue-800 mb-2">Cadastro da Criança</h2>

      {erro && <p className="text-red-600 text-sm font-medium" role="alert">{erro}</p>}
      {sucesso && <p className="text-green-600 text-sm font-medium">Cadastro realizado com sucesso!</p>}

      <div>
        <label className="block text-sm font-medium text-gray-700">Nome completo</label>
        <input
          type="text"
          name="nome"
          value={form.nome}
          onChange={handleChange}
          placeholder="Digite o nome da criança"
          className="w-full p-2 border rounded-md uppercase"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email da criança</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="exemplo@email.com"
          className="w-full p-2 border rounded-md"
          required
        />
      </div>

      <div className="relative">
        <label className="block text-sm font-medium text-gray-700">Senha</label>
        <input
          type={mostrarSenha ? 'text' : 'password'}
          name="senha"
          value={form.senha}
          onChange={handleChange}
          placeholder="Crie uma senha"
          className="w-full p-2 border rounded-md pr-10"
          required
        />
        <button
          type="button"
          onClick={() => setMostrarSenha(!mostrarSenha)}
          className="absolute top-9 right-2 text-gray-500"
          aria-label="Mostrar senha"
        >
          {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Confirmar Senha</label>
        <input
          type="password"
          name="confirmarSenha"
          value={form.confirmarSenha}
          onChange={handleChange}
          placeholder="Confirme a senha"
          className="w-full p-2 border rounded-md"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Idade</label>
        <input
          type="number"
          name="idade"
          min="7"
          max="12"
          value={form.idade}
          onChange={handleChange}
          placeholder="Idade entre 7 e 12"
          className="w-full p-2 border rounded-md"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Nível de Suporte</label>
        <select
          name="nivelSuporte"
          value={form.nivelSuporte}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          required
        >
          <option value="">Selecione</option>
          <option value="leve">Leve - Pequeno suporte em interação social e comunicação</option>
          <option value="moderado">Moderado - Suporte substancial, dificuldades frequentes</option>
          <option value="intenso">Intenso - Suporte muito substancial e constante</option>
        </select>
      </div>

      <div className="flex items-start">
        <input
          type="checkbox"
          name="aceitarTermos"
          checked={form.aceitarTermos}
          onChange={handleChange}
          className="h-5 w-5 text-blue-600"
          required
        />
        <label className="ml-2 text-sm">
          Aceito os <a href="/home" className="text-blue-600 underline">termos de uso</a>
        </label>
      </div>

      <div className="flex justify-between gap-4 mt-4">
        {typeof onClose === 'function' && (
          <button
            type="button"
            onClick={onClose}
            className="w-1/2 border border-gray-400 text-gray-700 py-2 rounded hover:bg-gray-100"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={enviando}
          className="w-1/2 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          {enviando ? 'Cadastrando...' : 'Cadastrar Criança'}
        </button>
      </div>
    </form>
  );
}
