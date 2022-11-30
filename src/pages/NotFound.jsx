import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
	return (
		<div className='flex flex-col items-center justify-center pt-20'>
			<div className='text-2xl'>This is not a valid page!</div>
			<Link to='/'>
				<div className='texl-lg py-10 text-indigo-600 underline'>Go Back</div>
			</Link>
		</div>
	);
};

export default NotFound;
