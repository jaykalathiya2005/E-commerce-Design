import React, { useState } from 'react'
import Header from '../Component/Header';
import Cards from '../Component/Cards';
import Profile from './Profile';

const Home = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [showProfile, setShowProfile] = useState(false);

    return (
        <div>
            <Header setSearchTerm={setSearchTerm} setShowProfile={setShowProfile} />
            {showProfile ? <Profile setShowProfile={setShowProfile} /> : <Cards searchTerm={searchTerm} />}

            {/* <Cards searchTerm={searchTerm} />

            <Profile /> */}
        </div>
    )
}

export default Home