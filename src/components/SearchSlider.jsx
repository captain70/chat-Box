import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { IoMdNotifications } from 'react-icons/io';
import { FaWindowClose } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { ChatState } from '../context/ChatProvider';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserListItem from './UserListItem';
// import { render } from 'react-dom';
import { Badge } from '@react-md/badge';
import { getSender } from '../config/ChatLogics';
import { chatRoute, searchRoute } from '../utils/ApiRoutes';

const SearchSlider = () => {
	const [search, setSearch] = useState('');
	const [searchResult, setSearchResult] = useState([]);
	const [loading, setLoading] = useState(false);
	const [loadingChat, setLoadingChat] = useState(false);

	const [isOpen, setIsOpen] = useState(false);
	const {
		setSelectedChat,
		user,
		notification,
		setNotification,
		chats,
		setChats,
	} = ChatState();

	const navigate = useNavigate();

	const handleLogOut = () => {
		localStorage.removeItem('userInfo');
		navigate('/');
		window.location.reload();
	};
	const showDrawer = () => {
		setIsOpen(!isOpen);
	};

	const handleSearch = async (e) => {
		e.preventDefault();
		if (!search) {
			toast.warning('Please enter a search query', {
				position: toast.POSITION.TOP_LEFT,
			});

			return;
		}
		try {
			setLoading(true);
			const config = {
				headers: {
					Authorization: `Bearer ${user.user.token}`,
				},
			};
			const { data } = await axios.get(
				`${searchRoute}?search=${search}`,
				config
			);

			setLoading(false);
			setSearchResult(data.users);
		} catch (error) {
			toast.error('Error fetching query', {
				position: toast.POSITION.TOP_LEFT,
			});
		}
	};

	const accessChat = async (userId) => {
		try {
			setLoadingChat(true);
			const config = {
				headers: {
					'Content-type': 'application/json',
					Authorization: `Bearer ${user.user.token}`,
				},
			};
			const { data } = await axios.post(chatRoute, { userId }, config);

			if (!chats.find((chat) => chat._id === data._id)) {
				setChats([data, ...chats]);
				setLoadingChat(false);
				setIsOpen(false);
			} else {
				setSelectedChat(data);
				setLoadingChat(false);
				setIsOpen(false);
			}
		} catch (error) {
			toast.error('Error fetching chat', {
				position: toast.POSITION.TOP_LEFT,
			});
		}
	};

	return (
		<div>
			<div className='flex justify-between items-center bg-white w-[100%] px-1 py-2 shadow-lg'>
				<button
					className='relative px-3 hidden md:flex rounded-lg border-[1.5px] border-indigo-700 outline-none w-40 text-center'
					onClick={showDrawer}
				>
					search users
				</button>
				<FiSearch
					className='hidden md:block absolute top-[20px] left-[130px] text-gray-600 '
					onClick={showDrawer}
				/>
				<h1 className='text-[#186eb5] text-2xl tracking-widest font-semibold'>
					Chat Box
				</h1>

				<div>
					<ul className='flex items-center justify-center capitalize ml-3'>
						<div className='relative'>
							<Badge className='text-red-700 absolute top-[0.5px] left-4'>
								{notification.length}
							</Badge>
							<IoMdNotifications className='mr-2' size={20} />
							<h2 className='text-center'>
								{' '}
								{/* {!notification.length && 'No New Messages'} */}
								{notification.map((notif) => (
									<div
										key={notif._id}
										onClick={() => {
											setSelectedChat(notif.chat);
											setNotification(notification.filter((n) => n !== notif));
										}}
										className='cursor-pointer'
									>
										<dic className='bg-cyan-400 rounded-lg px-1'>
											{`New Message from ${getSender(
												user.user,
												notif.chat.users
											)}`}
										</dic>
									</div>
								))}
							</h2>
						</div>
						<h2 className='text-[#186eb5] mr-1 md:mr-3 text-lg'>
							welcome,{'  '}
							<span className='text-indigo-700 ml-1'>{user.user?.name}</span>
						</h2>
						<img
							src={user.user?.picture}
							alt=''
							className=' object-cover rounded-3xl border-1 border-gray-50 h-[40px] w-[40px] mr-6'
						/>
						<li
							className='text-[#186eb5] hover:text-[#0487f2] text-lg mr-3 md:mr-2 cursor-pointer'
							onClick={handleLogOut}
						>
							LogOut
						</li>
					</ul>
				</div>
			</div>

			{/* drawer init and toggle  */}
			{
				<>
					<div
						onClick={showDrawer}
						className={`${
							isOpen &&
							'w-screen h-screen fixed bg-[rgba(49,49,49,0.9)] left-0 right-0 top-0 bottom-0 ease-in-out duration-300 delay-150'
						}`}
					></div>
					<div className='flex items-end justify-end px-4'>
						<div
							className={`top-0 left-0 w-[25vw] bg-white shadow-2xl p-10 fixed h-full z-40 ease-in-out duration-300 delay-150 ${
								isOpen ? 'translate-x-0 ' : '-translate-x-full '
							}`}
						>
							<button
								className='absolute top-3 right-3 px-1 py-1'
								onClick={showDrawer}
							>
								<FaWindowClose className='text-red-600' size={20} />
							</button>
							<div className='px-2'>
								<h1 className='text-2xl text-[#186eb5] my-5 text-center'>
									Chat Box
								</h1>
								<form
									onSubmit={handleSearch}
									className='text-gray-800 focus-within:text-cyan-400 focus-within:bg-white/40 focus-within:shadow rounded search transition duration-300 flex items-center justify-center w-full'
								>
									<div className='relative w-full flex'>
										<div className='absolute top-0 bottom-0 h-full flex items-center mb-auto left-4 cursor-pointer mr-1 '>
											<FiSearch size={18} />
										</div>
										<input
											type='text'
											placeholder='Search User'
											className=' text-md text-gray-500 placeholder-gray-500 placeholder:italic w-full rounded-l py-3 pr-4 pl-12 bg-gray-200 bg-opacity-75 outline-none transition-all focus-within:bg-white/70'
											value={search}
											onChange={(e) => setSearch(e.target.value)}
										/>
									</div>
									<button
										type='submit'
										className='bg-cyan-500 p-3 text-white rounded-r'
									>
										Go
									</button>
									<ToastContainer />
								</form>

								<div className='relative'>
									{loading ? (
										<div role='status' className='max-w-sm animate-pulse pt-3'>
											<div className='h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4'></div>
											<div className='h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5'></div>
											<div className='h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5'></div>
											<div className='h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[330px] mb-2.5'></div>
											<div className='h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[300px] mb-2.5'></div>
											<div className='h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]'></div>
											<span className='sr-only'>Loading...</span>
										</div>
									) : (
										searchResult?.map((result) => (
											<UserListItem
												key={result._id}
												user={result}
												handleFunction={() => accessChat(result._id)}
											/>
										))
									)}
									{loadingChat && (
										<div className='flex items-center justify-center'>
											<div
												className='animate-spin  w-10 h-10 border-[3px] border-current border-t-transparent text-cyan-600 rounded-full  mt-6 inline-block '
												role='status'
												aria-label='loading'
											>
												<span className='sr-only'>Loading...</span>
											</div>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				</>
			}
		</div>
	);
};

export default SearchSlider;
