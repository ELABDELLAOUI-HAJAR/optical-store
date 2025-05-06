import React from 'react';

const Home = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <img 
        src={`${process.env.PUBLIC_URL}/macula.jpg`} 
        alt="Optical Store" 
        className="object-cover w-full h-[660px] md:h-[660px] lg:h-[720px]" 
      />
    </div>
  );
};

export default Home;