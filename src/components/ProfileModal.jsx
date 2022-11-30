import React from 'react';
import { useState } from 'react';
import { AiFillEye } from 'react-icons/ai';
import { FaWindowClose } from 'react-icons/fa';

const ProfileModal = ({ user, children }) => {
	const [modal, setModal] = useState(false);

	const toggleModal = () => {
		setModal(!modal);
	};

	return (
		<>
			{children ? (
				<span onClick={toggleModal}>{children}</span>
			) : (
				<AiFillEye onClick={toggleModal} />
			)}
			{modal && (
				<div>
					<div
						onClick={toggleModal}
						className=' w-[100vw] h-[100vh] fixed bg-[rgba(49,49,49,0.9)] left-0 right-0 top-0 bottom-0'
					></div>
					<div
						className='absolute top-[25%] left-[35%] 
                      bg-[#f1f1f1] px-[14px] py-[28px] rounded-sm max-w-[600px] min-w-[400px]'
					>
						<h2 className='text-2xl uppercase text-center py-2 text-indigo-700'>
							{user.name}
						</h2>
						<img
							src={user?.picture}
							alt={user.name}
							className='object-cover rounded-full border-1 border-gray-50 h-[120px] w-[120px] mx-auto my-5'
						/>
						<h1 className='text-center text-lg mx-auto'>
							Email :{' '}
							<span className='underline text-[#186eb5]'>{user.email}</span>
						</h1>
						<button
							className='absolute top-3 right-3 px-1 py-2'
							onClick={toggleModal}
						>
							<FaWindowClose className='text-red-600' size={20} />
						</button>
					</div>
				</div>
			)}
		</>
	);
};

export default ProfileModal;
