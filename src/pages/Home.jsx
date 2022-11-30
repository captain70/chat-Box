import React from 'react';
import { BiChat } from 'react-icons/bi';
import { Link } from 'react-router-dom';

const Home = () => {
	return (
		<div className='bg-[#fcfbf7] h-screen w-full flex flex-col items-center pt-44 '>
			<h1 className='text-3xl text-[#26d5d5] pb-6'>
				Linking with the people around Us
			</h1>
			<p className='pb-12 text-lg text-stone-800 bg-'>
				ChatBox connecting the coperate world
			</p>
			<Link to='/login'>
				<button className='flex items-center justify-center gap-x-2 rounded-lg bg-[#cddc24] p-3 mt-3 text-xl'>
					Let's Chat
					<BiChat />
				</button>
			</Link>
		</div>
	);
};

export default Home;
