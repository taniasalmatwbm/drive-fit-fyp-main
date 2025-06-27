import axios from 'axios';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/auth';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import login from '../images/login.png';
import '../styles/hero.css';
import '../styles/auth.css';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [auth, setAuth] = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const validateEmail = (email) => {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailPattern.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.trim()) {
            toast.error('Email is required');
            return;
        }
        if (!validateEmail(email)) {
            toast.error('Invalid Email Format');
            return;
        }
        if (!password.trim()) {
            toast.error('Password is required');
            return;
        }

        try {
            const res = await axios.post("/api/user/login", { email, password });
            if (res.data.success) {
                toast.success(res.data.message);
                setAuth({
                    ...auth,
                    user: res.data.user,
                    token: res.data.token
                });
                localStorage.setItem('auth', JSON.stringify(res.data));
                navigate(location.state || '/');
            } else {
                toast.error(res.data.message);
            }
        } catch (err) {
            console.error(err);
            toast.error('Something went wrong. Try again later.');
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className='marginStyle'>
            <div className="container d-flex justify-content-center align-items-center">
                <div className="row border rounded-5 p-3 bg-white shadow box-area reverseCol">
                    {/* Left Side Image */}
                    <div className="col-md-6 rounded-4 d-flex justify-content-center align-items-center flex-column left-box">
                        <div className="featured-image mb-3 animateImg">
                            <img src={login} className="img-fluid" width={500} alt="Login Illustration" />
                        </div>
                    </div>

                    {/* Right Side Form */}
                    <form className="col-md-6 right-box" onSubmit={handleSubmit}>
                        <div className="row align-items-center">
                            <div className="header-text mb-4">
                                <h2>Welcome</h2>
                                <p>We are happy to have you back!</p>
                            </div>

                            <div className="input-group d-flex align-items-center mb-3">
                                <div className="form-outline flex-fill mb-0">
                                    <input
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        type="email"
                                        placeholder='Your email ID'
                                        className="form-control"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="input-group d-flex flex-row align-items-center mb-3">
                                <div className="form-outline flex-fill mb-0">
                                    <input
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        type="password"
                                        placeholder='Your password'
                                        className="form-control"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="d-flex flex-row align-items-center mt-4">
                                <div className="form-outline flex-fill mb-0">
                                    <button
                                        className="btn btn-lg text-white"
                                        type="submit"
                                        style={{ backgroundColor: 'blueviolet', width: '100%' }}
                                    >
                                        Login
                                    </button>
                                </div>
                            </div>

                            <div className="d-flex flex-row align-items-center my-3">
                                <div className="form-outline flex-fill mb-0">
                                    <Link to='/register' className="btn btn-outline-dark btn-lg btn-block" style={{ width: '100%' }}>
                                        Register
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div >
        </div >
    );
};

export default Login;
