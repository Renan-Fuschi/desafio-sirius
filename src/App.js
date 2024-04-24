import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import BuscaUsuario from './components/BuscaUsuario.js';
import DetalhesRepositorio from './components/DetalhesRepositorio'; // Importando o componente DetalhesRepositorio

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={BuscaUsuario} />
        <Route path="/repositorio/:repositorioId" component={DetalhesRepositorio} /> {/* Configurando a rota para o componente DetalhesRepositorio */}
      </Switch>
    </Router>
  );
}

export default App;

