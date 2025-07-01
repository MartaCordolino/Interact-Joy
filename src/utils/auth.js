// src/utils/auth.js

import bcrypt from 'bcryptjs';

/**
 * Gera o hash seguro da senha.
 * @param {string} senha - A senha em texto puro.
 * @returns {Promise<string>} - A senha criptografada.
 */
export async function hashSenha(senha) {
  const saltRounds = 10;
  return await bcrypt.hash(senha, saltRounds);
}

/**
 * Compara a senha digitada com a senha armazenada no banco.
 * @param {string} senhaDigitada - A senha inserida pelo usuário.
 * @param {string} senhaSalva - A senha já criptografada no banco.
 * @returns {Promise<boolean>} - true se a senha estiver correta, false caso contrário.
 */
export async function compararSenha(senhaDigitada, senhaSalva) {
  return await bcrypt.compare(senhaDigitada, senhaSalva);
}
