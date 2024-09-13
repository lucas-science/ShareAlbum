import React, { Component } from 'react';

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.create_url = `/create`;
    this.profil_url = `/profil`;
    this.join_url = '/join';
  }

  render() {
    return (
      <>
        <div className="min-h-screen bg-gray-100 flex flex-col justify-between">
          <div className="flex-grow flex items-center justify-center">
            <div className="bg-white p-8 rounded shadow-md text-center flex flex-col">
              <h1 className="text-2xl font-bold text-gray-800">Welcome to Album photo share!</h1>
              <a href={this.create_url} rel="noreferrer">
                <button className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  Create your Home Album
                </button>
              </a>
              <a href={this.profil_url}>
                <button className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  Your profil
                </button>
              </a>
            </div>
          </div>

          {/* Footer */}
          <footer className="bg-gray-800 text-white py-4">
            <div className="container mx-auto text-center">
              <a href="/ConditionUtilisation" className="text-gray-400 hover:text-white mx-4">Terms of Use</a>
              <a href="/PrivacyPolicy" className="text-gray-400 hover:text-white mx-4">Privacy Policy</a>
            </div>
          </footer>
        </div>
      </>
    );
  }
}

export default HomePage;
