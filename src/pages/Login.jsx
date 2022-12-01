import React, { useState } from 'react';
import loginPic from '../images/loginP.jpg';
import { Link } from 'react-router-dom';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { loginRoute } from '../utils/ApiRoutes';

const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleClick = () => {
		setShowPassword(!showPassword);
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		if (!email || !password) {
			toast.warning('Provide all details', {
				position: toast.POSITION.TOP_RIGHT,
			});
			setLoading(false);
			return;
		}

		try {
			const config = {
				headers: {
					'Content-type': 'application/json',
				},
			};

			const { data } = await axios.post(
				loginRoute,
				{ email, password },
				config
			);

			toast.success('Login successfull', {
				position: toast.POSITION.TOP_RIGHT,
			});
			localStorage.setItem('userInfo', JSON.stringify(data));
			setLoading(false);
			navigate('/chat');
			window.location.reload();
		} catch (error) {
			toast.error('Invalid email and password', {
				position: toast.POSITION.TOP_RIGHT,
			});
			setLoading(false);
		}
	};
	return (
		<div>
			<img className='h-screen w-[100%] object-cover' src={loginPic} alt='/' />

			<div className='w-[450px] h-[430px] bg-gray-200/80  rounded-lg shadow-xl absolute top-[150px] left-[430px] flex flex-col justify-center items-center  '>
				<div className='py-10 w-full text-3xl text-center text-[#186eb5]'>
					ChatBox
				</div>
				<form
					className='pb-4 w-2/3 flex flex-col gap-y-4 '
					onSubmit={handleSubmit}
				>
					<div className=''>
						<input
							placeholder='Email'
							className='bg-transparent  border-b-[#736ff5] border-b-2 h-10 w-full outline-none text-xl shadow-none'
							onChange={(e) => setEmail(e.target.value)}
							value={email}
							required
						/>
					</div>

					<div className='flex items-center justify-center relative'>
						<input
							type={showPassword ? 'text' : 'password'}
							placeholder='Password'
							className='bg-transparent  border-b-[#736ff5] border-b-2 h-10 w-full outline-none text-xl shadow-none'
							onChange={(e) => setPassword(e.target.value)}
							value={password}
							required
						/>
						<div className='absolute right-2' onClick={handleClick}>
							{showPassword ? (
								<AiFillEyeInvisible size={20} />
							) : (
								<AiFillEye size={20} />
							)}
						</div>
					</div>

					<button
						type='submit'
						className='py-3 mt-7 mb-4 bg-[#cddc24] rounded-md text-xl'
					>
						{loading ? (
							<div className='flex items-center justify-center'>
								<div
									className='animate-spin  w-7 h-7 border-[3px] border-current border-t-transparent text-cyan-600 rounded-full inline-block '
									role='status'
									aria-label='loading'
								>
									<span className='sr-only'>Logging...</span>
								</div>
							</div>
						) : (
							'Login'
						)}
					</button>
					<ToastContainer />
					<div>
						<p className='text-[#5550e6] text-lg text-center'>
							Not yet registered?{' '}
							<Link to='/signup'>
								<span className='underline text-[#186eb5]'>Sign Up</span>
							</Link>
						</p>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Login;
