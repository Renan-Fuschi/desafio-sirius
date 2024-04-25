

import React, { useState } from 'react';
import './BuscaUsuario.css';

function BuscaUsuario() {
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [dadosUsuario, setDadosUsuario] = useState(null);
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(false);

  const handleChange = (evento) => {
    setNomeUsuario(evento.target.value);
  };

  const handleSubmit = async (evento) => {
    evento.preventDefault();

    try {
      setCarregando(true);

      const usuarioResponse = await fetch(`https://api.github.com/users/${nomeUsuario}`);
      if (!usuarioResponse.ok) {
        throw new Error('Usuário não encontrado');
      }
      const usuarioData = await usuarioResponse.json();
      setDadosUsuario(usuarioData);
      setErro(null);

      const repositoriosResponse = await fetch(`https://api.github.com/users/${nomeUsuario}/repos`);
      if (!repositoriosResponse.ok) {
        throw new Error('Erro ao buscar repositórios do usuário');
      }
      const repositoriosData = await repositoriosResponse.json();
      usuarioData.repositorios = repositoriosData;

    } catch (error) {
      console.error(error);
      setErro(error.message);
      setDadosUsuario(null);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="busca-usuario-container">
      <form onSubmit={handleSubmit} className="form-busca-usuario">
        <input
          type="text"
          placeholder="Digite o nome de usuário do GitHub"
          value={nomeUsuario}
          onChange={handleChange}
          className="input-busca-usuario"
        />
        <button type="submit" disabled={carregando} className="btn-busca-usuario">Buscar</button>
      </form>
      {carregando && <p>Carregando...</p>}
      {erro && <p className="erro-msg">{erro}</p>}
      {dadosUsuario && (
        <div className="dados-usuario-container">
          <h2>Dados do Usuário</h2>
          <div className="dados-usuario">
            <p><strong>Nome de Usuário:</strong> {dadosUsuario.login}</p>
            <p><strong>Nome:</strong> {dadosUsuario.name}</p>
            <p><strong>Seguidores:</strong> {dadosUsuario.followers}</p>
            <p><strong>Seguindo:</strong> {dadosUsuario.following}</p>
            <p><strong>URL do Avatar:</strong> <img src={dadosUsuario.avatar_url} alt="Avatar do Usuário" className="avatar-usuario" /></p>
            <p><strong>Email:</strong> {dadosUsuario.email || 'Não disponível'}</p>
            <p><strong>Bio:</strong> {dadosUsuario.bio || 'Não disponível'}</p>
          </div>

          <h2>Repositórios do Usuário</h2>
          <div className="repositorios-usuario">
            {dadosUsuario.repositorios && dadosUsuario.repositorios.map((repo) => (
              <div key={repo.id} className="repo-item">
                <p><strong>Nome do Repositório:</strong> {repo.name}</p>
                <p><strong>Descrição:</strong> {repo.description || 'Sem descrição'}</p>
                <p><strong>Número de Estrelas:</strong> {repo.stargazers_count}</p>
                <p><strong>Linguagem:</strong> {repo.language || 'Não especificada'}</p>
                <p><strong>Link:</strong> <a href={repo.html_url} target="_blank" rel="noopener noreferrer">{repo.html_url}</a></p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default BuscaUsuario;
