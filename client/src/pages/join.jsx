import React, { Component } from 'react';

class Join extends Component {
  // Le constructeur initialise l'état, bien qu'il ne soit pas nécessaire ici.
  constructor(props) {
    super(props);
  }

  // Utilisation de componentDidMount pour remplacer useEffect
  render() {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow-md text-center flex flex-col">
          <h1 className="text-2xl font-bold text-gray-800">Join</h1>
        </div>
      </div>
    );
  }
}

export default Join;
