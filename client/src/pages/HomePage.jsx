import React, { Component } from 'react';

class HomePage extends Component {
  // Le constructeur initialise l'état, bien qu'il ne soit pas nécessaire ici.
  constructor(props) {
    super(props);
    this.create_url = `/create`;
    this.profil_url = `/profil`;
    this.join_url = '/join'
  }Z

  // Utilisation de componentDidMount pour remplacer useEffect

  render() {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow-md text-center flex flex-col">
          <h1 className="text-2xl font-bold text-gray-800">Welcome to Album photo share !</h1>
          <a href={this.create_url} rel="noreferrer">
            <button className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Create your Home Album
            </button>
          </a>
          <a href={this.join_url}>
            <button className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Join an Album
            </button>
          </a>
          <a href={this.profil_url}>
            <button className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Your profil
            </button>
          </a>
        </div>
      </div>
    );
  }
}

export default HomePage;
