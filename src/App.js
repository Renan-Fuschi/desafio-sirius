import React, { useState } from 'react';

function App() {
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

export default App;
