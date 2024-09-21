import React, { Component } from 'react';
import {Link, Route, Routes} from 'react-router-dom';

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
          <div className="min-h-screen bg-white flex flex-col">
            {/* Header Section */}
            <header className="w-full flex items-center justify-between px-4 py-4">
              <div className="flex items-center space-x-2">
                <img src="/logo_HomeSnapshots.ico" alt="HomeSnapshots Logo" className="h-8 w-8" />
                <h1 className=" text-lg md:text-2xl font-bold">HomeSnapshots</h1>
              </div>
              <Link to='/profil'>
                <button className="bg-blue-500 text-white rounded-full px-4 py-2 text-sm">Let’s begin</button>
              </Link>
            </header>

            {/* Main Section - Gather your moments */}
            <section className="flex flex-col lg:flex-row flex-grow items-center justify-around">
              <div className="w-full lg:w-1/2 flex justify-center lg:h-full">
                <img src="illustration_phone.png" alt="Phone and images illustration" className="w-3/5 lg:w-2/3 h-auto" />
              </div>
              
              {/* Contenu avec flex-grow pour occuper l'espace restant */}
              <div className="w-full lg:w-1/2 flex flex-col h-full p-10">
                <div className="text-center">
                  <h3 className="text-2xl font-semibold mb-2">Gather your moments</h3>
                  <h3 className="text-2xl font-semibold">Share your memories.</h3>
                  <Link to='/create'>
                    <button className="bg-yellow-400 text-white font-semibold py-2 px-6 rounded-full mt-20">
                      Create your Album
                    </button>
                  </Link>
                </div>

                {/* Section qui prend le reste de la place */}
                <div className="flex-grow flex flex-col justify-end items-center my-5">
                  <p className="text-gray-500">What is HomeSnapshots?</p>
                  <span className="ml-2 text-gray-400 text-2xl">⬇️</span>
                </div>
              </div>
            </section>
          </div>




          {/* Middle Section - Create photo albums */}
          <section className="min-h-screen flex flex-col items-center justify-around mt-8 space-y-4">
            <p className="text-lg text-gray-700 text-center px-4">
              With HomeSnapshots, you can create photo albums that you share with your friends.
            </p>
            <div className="border rounded-lg p-4 w-72 bg-gray-100 shadow-lg">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">Home Album</h3>
                <button className="bg-yellow-400 text-white px-3 py-1 rounded-full text-sm">Share</button>
              </div>
              {/* Example images grid */}
              <div className="grid grid-cols-2 gap-2">
                {/* Add placeholders for photos */}
                <img src="illustration_selfie_1.jpg" alt="Album photo 1" className="rounded-md" />
                <img src="illustration_selfie_2.jpg" alt="Album photo 3" className="rounded-md" />
                <img src="illustration_selfie_1.jpg" alt="Album photo 2" className="rounded-md" />
                <img src="illustration_selfie_2.jpg" alt="Album photo 4" className="rounded-md" />
                <img src="illustration_selfie_1.jpg" alt="Album photo 5" className="rounded-md" />
                <img src="illustration_selfie_2.jpg" alt="Album photo 6" className="rounded-md" />
              </div>
              <button className="bg-blue-500 text-white mt-4 py-2 w-full rounded-full">Add a photo</button>
            </div>
          </section>

          {/* Final Section - Share with QR */}
          <section className="min-h-screen flex flex-col items-center justify-around mt-8 space-y-4">
            <p className="text-lg text-gray-700 text-center px-4">
              You just need to share your album with a QR code. You and your friends can add photos to this shared album!
            </p>
            <div>
              <img src="illustration_homme_phone.png" alt="Person taking a photo illustration" className="w-64 h-auto" />
            </div>
            <Link to='/create'>
              <button className="bg-yellow-400 text-white font-semibold py-2 px-6 rounded-full">Create your Album</button>
            </Link>
          </section>
        {/* Footer */}
        <footer className="bg-gray-800 text-white py-4">
          <div className="container mx-auto text-center">
            <a href="/ConditionUtilisation" className="text-gray-400 hover:text-white mx-4 underline-offset-auto">Terms of Use</a>
            <a href="/PrivacyPolicy" className="text-gray-400 hover:text-white mx-4 underline-offset-auto  ">Privacy Policy</a>
          </div>
        </footer>
      </>
    );
  }
}

export default HomePage;
