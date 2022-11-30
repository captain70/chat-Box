import React, { useState } from 'react';
import registerPic from '../images/register.jpg';
import profileImg from '../images/profile.png';
import { Link } from 'react-router-dom';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { FaPlusSquare } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [name, setname] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [profileImage, setProfileImage] = useState(null);
	const [imagePreview, setImagePreview] = useState(null);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleClick = () => {
		setShowPassword(!showPassword);
	};
	const validateImg = (e) => {
		const imgFile = e.target.files[0];
		if (imgFile.size >= 1048576) {
			return toast.warning('File must be less than 1mb', {
				position: toast.POSITION.TOP_RIGHT,
			});
		} else {
			setProfileImage(imgFile);
			setImagePreview(URL.createObjectURL(imgFile));
		}
	};

	const uploadProfile = async () => {
		const data = new FormData();
		data.append('file', profileImage);
		data.append('upload_preset', 'chat-box-app');
		try {
			setLoading(true);
			let res = await fetch(process.env.REACT_APP_CLOUDINARY, {
				method: 'post',
				body: data,
			});
			const urlData = await res.json();
			setLoading(false);

			return urlData.url;
		} catch (error) {
			setLoading(false);
			console.log(error);
		}
	};

	const handleSubmit = async (e) => {
		setLoading(true);
		e.preventDefault();
		if (!profileImage) {
			toast.warning('Please upload your profile picture!', {
				position: toast.POSITION.TOP_RIGHT,
			});
		}
		const url = await uploadProfile(profileImage);

		// registering user
		setLoading(true);
		if (!name || !email || !password) {
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
				'/api/user/register',
				{
					name,
					email,
					password,
					picture: url,
				},
				config
			);

			toast.success('Registeration Successfull', {
				position: toast.POSITION.TOP_RIGHT,
			});
			localStorage.setItem('userInfo', JSON.stringify(data));
			setLoading(false);
			navigate('/login');
		} catch (error) {
			toast.error('Invalid credentials', {
				position: toast.POSITION.TOP_RIGHT,
			});
			setLoading(false);
		}
	};

	return (
		<div>
			<img
				className=' object-cover h-screen w-[100%]'
				src={registerPic}
				alt='/'
			/>

			<div className='w-[420px] h-[292] bg-gray-200/80 rounded-lg shadow-xl absolute  top-[70px] left-[430px] flex flex-col justify-center items-center  '>
				<div className='py-5 w-full text-3xl text-center text-[#186eb5]'>
					ChatBox
				</div>
				<form
					className='pb-4 w-2/3 flex flex-col gap-y-3 '
					onSubmit={handleSubmit}
				>
					<div className='h-[110px] w-[110px] m-auto relative my-2'>
						<img
							src={imagePreview || profileImg}
							alt=''
							className=' object-cover rounded-3xl border-1 border-gray-50 h-[110px] w-[110px]'
						/>
						<label
							htmlFor='image-upload'
							className='absolute bottom-0 right-3 text-green-600 bg-white cursor-pointer z-30 '
						>
							<FaPlusSquare size={20} />
						</label>
						<input
							type='file'
							id='image-upload'
							accept='image/png, image/jpeg'
							hidden
							onChange={validateImg}
						/>
					</div>
					<input
						placeholder='Username'
						className='bg-transparent border-b-[#736ff5] border-b-2 h-10 w-full outline-none text-xl'
						onChange={(e) => setname(e.target.value)}
						value={name}
						required
					/>

					<input
						placeholder='Email'
						className='bg-transparent  border-b-[#736ff5] border-b-2 h-10 w-full outline-none text-xl'
						onChange={(e) => setEmail(e.target.value)}
						value={email}
						required
					/>
					<div className='flex items-center justify-center relative'>
						<input
							type={showPassword ? 'text' : 'password'}
							placeholder='Password'
							className='bg-transparent  border-b-[#736ff5] border-b-2 h-10 w-full outline-none text-xl'
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
						className='py-3 mt-3 mb-4 bg-[#cddc24] rounded-md text-xl'
					>
						{loading ? (
							<div className='flex items-center justify-center'>
								<div
									className='animate-spin  w-7 h-7 border-[3px] border-current border-t-transparent text-cyan-600 rounded-full inline-block '
									role='status'
									aria-label='loading'
								>
									<span className='sr-only'>Signing...</span>
								</div>
							</div>
						) : (
							'Sign Up'
						)}
					</button>
					<ToastContainer />
					<div>
						<p className='text-[#5550e6] text-lg text-center'>
							Already registered?{' '}
							<Link to='/login'>
								<span className='underline text-[#186eb5]'>Login</span>
							</Link>
						</p>
					</div>
				</form>
			</div>
		</div>
	);
};

export default SignUp;
