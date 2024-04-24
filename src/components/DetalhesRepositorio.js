import React, { useState, useEffect } from 'react';

function DetalhesRepositorio({ match }) {
  const [repositorio, setRepositorio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRepositorio = async () => {
      const { repositorioId } = match.params;

      try {
        const response = await fetch(`https://api.github.com/repos/${repositorioId}`);
        if (!response.ok) {
          throw new Error('Erro ao buscar detalhes do repositório');
        }
        const data = await response.json();
        setRepositorio(data);
        setLoading(false);
        setError(null);
      } catch (error) {
        console.error(error);
        setLoading(false);
        setError(error.message);
      }
    };

    fetchRepositorio();
  }, [match.params]);

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!repositorio) {
    return <p>Repositório não encontrado</p>;
  }

  return (
    <div>
      <h2>Detalhes do Repositório</h2>
      <p>Nome: {repositorio.name}</p>
      <p>Descrição: {repositorio.description || 'Sem descrição'}</p>
      <p>Número de Estrelas: {repositorio.stargazers_count}</p>
      <p>Linguagem: {repositorio.language || 'Não especificada'}</p>
      <p>Link: <a href={repositorio.html_url} target="_blank" rel="noopener noreferrer">{repositorio.html_url}</a></p>
    </div>
  );
}

export default DetalhesRepositorio;
