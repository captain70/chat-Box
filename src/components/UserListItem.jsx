import React from 'react';

const UserListItem = ({ user, handleFunction }) => {
	return (
		<div className='mt-4'>
			<div
				onClick={handleFunction}
				className='bg-[#E8E8E8] hover:bg-cyan-400 hover:text-white cursor-pointer w-100 flex items-center text-gray-900 border-lg my-2 px-3 py-2 rounded-xl'
			>
				<img
					src={user?.picture}
					alt={user?.name}
					className=' object-cover rounded-3xl border-1 border-gray-50 h-[40px] w-[40px] mr-6'
				/>

				<h1 className='text-[#186eb5] font-semibold capitalize '>
					{user?.name}
				</h1>
			</div>
		</div>
	);
};

export default UserListItem;
