

import React, { useState, useEffect } from 'react';

function BuscaUsuario() {
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [dadosUsuario, setDadosUsuario] = useState(null);
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [ordem, setOrdem] = useState('estrelas'); // Estado para armazenar a ordem de classificação

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

      // Ordenar os repositórios de acordo com a opção selecionada
      const repositoriosOrdenados = ordenarRepositorios(repositoriosData, ordem);
      usuarioData.repositorios = repositoriosOrdenados;

    } catch (error) {
      console.error(error);
      setErro(error.message);
      setDadosUsuario(null);
    } finally {
      setCarregando(false);
    }
  };

  // Função para ordenar os repositórios com base na opção selecionada
  const ordenarRepositorios = (repositorios, ordem) => {
    if (ordem === 'estrelas') {
      return repositorios.sort((a, b) => b.stargazers_count - a.stargazers_count);
    } else if (ordem === 'nome') {
      return repositorios.sort((a, b) => a.name.localeCompare(b.name));
    } else if (ordem === 'linguagem') {
      return repositorios.sort((a, b) => (a.language || '').localeCompare(b.language || ''));
    } else {
      return repositorios;
    }
  };

  // Função para atualizar a ordem de classificação
  const handleOrdenacao = (novaOrdem) => {
    setOrdem(novaOrdem);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Digite o nome de usuário do GitHub"
          value={nomeUsuario}
          onChange={handleChange}
        />
        <button type="submit" disabled={carregando}>Buscar</button> 
      </form>
      {carregando && <p>Carregando...</p>} 
      {erro && <p>{erro}</p>}
      {dadosUsuario && (
        <div>
          <h2>Dados do Usuário</h2>
          <p>Nome de Usuário: {dadosUsuario.login}</p>
          <p>Nome: {dadosUsuario.name}</p>
          <p>Seguidores: {dadosUsuario.followers}</p>
          <p>Seguindo: {dadosUsuario.following}</p>
          <p>URL do Avatar: <img src={dadosUsuario.avatar_url} alt="Avatar do Usuário" /></p>
          <p>Email: {dadosUsuario.email || 'Não disponível'}</p>
          <p>Bio: {dadosUsuario.bio || 'Não disponível'}</p>
          
          <div>
            <button onClick={() => handleOrdenacao('estrelas')}>Mais Estrelas</button>
            <button onClick={() => handleOrdenacao('nome')}>Nome</button>
            <button onClick={() => handleOrdenacao('linguagem')}>Linguagem</button>
          </div>

          <h2>Repositórios do Usuário</h2>
          {dadosUsuario.repositorios && dadosUsuario.repositorios.map((repo) => (
            <div key={repo.id}>
              <p>Nome do Repositório: {repo.name}</p>
              <p>Descrição: {repo.description || 'Sem descrição'}</p>
              <p>Número de Estrelas: {repo.stargazers_count}</p>
              <p>Linguagem: {repo.language || 'Não especificada'}</p>
              <p>Link: <a href={repo.html_url} target="_blank" rel="noopener noreferrer">{repo.html_url}</a></p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BuscaUsuario;
