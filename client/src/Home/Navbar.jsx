import  { useEffect, useState } from 'react';
import { BiMenuAltRight } from 'react-icons/bi';
import '../styles/navbar.css';
import logo from '../images/logo.png';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/auth';
import { useCart } from '../context/cart';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import toast from 'react-hot-toast';

const Navbar = () => {
  const [auth, setAuth] = useAuth();
  const [cart] = useCart();
  const [click, setClick] = useState(false);
  const [color, setColor] = useState(false);

  const handleClick = () => setClick(!click);

  // Scroll color change
  useEffect(() => {
    const handleScroll = () => {
      setColor(window.scrollY >= 90);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Logout
  const handleLogout = () => {
    setAuth({ ...auth, user: null, token: '' });
    localStorage.removeItem('auth');
    toast.success('Logged Out Successfully');
  };

  // Collapse nav on link click
  useEffect(() => {
    const navBarLinks = document.querySelectorAll('.nav-link');
    const navCollapse = document.querySelector('.navbar-collapse.collapse');

    const handleNavClick = () => {
      if (navCollapse?.classList.contains('show')) {
        navCollapse.classList.remove('show');
      }
    };

    navBarLinks.forEach((link) => {
      link.addEventListener('click', handleNavClick);
    });

    return () => {
      navBarLinks.forEach((link) => {
        link.removeEventListener('click', handleNavClick);
      });
    };
  }, []);

  return (
    <header className={color ? 'header_wrapper header-scrolled' : 'header_wrapper'}>
      <nav className="navbar navbar-expand-lg fixed-top">
        <div className="container-fluid mx-3">
          <Link to="/">
            <img src={logo} alt="logo" style={{ width: '130px' }} />
          </Link>
          <button
            className="navbar-toggler pe-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
            onClick={handleClick}
          >
            <BiMenuAltRight size={35} />
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav menu-navbar-nav">
              <li className="nav-item">
                <Link to="/" className="nav-link">Home</Link>
              </li>
              <li className="nav-item">
                <Link to="/about" className="nav-link">About</Link>
              </li>
              <li className="nav-item">
                <Link to="/brands" className="nav-link">Brands</Link>
              </li>
              <li className="nav-item">
                <Link to="/cars" className="nav-link">Cars</Link>
              </li>
              <li className="nav-item">
                <Link to="/cart" className="nav-link d-flex align-items-center">
                  <AiOutlineShoppingCart size={25} color="blueviolet" />
                  <span className="badge ms-2" >
                    {cart?.length}
                  </span>
                </Link>
              </li>
            </ul>

            {!auth.user ? (
              <ul className="navbar-nav text-center">
                <li className="nav-item">
                  <Link to="/login" className="nav-link learn-more-btn btn-extra-header">Login</Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="nav-link learn-more-btn">Register</Link>
                </li>
              </ul>
            ) : (
              <ul className="navbar-nav text-center">
                <li className="nav-item">
                  <Link
                    to={`/dashboard/${auth?.user?.role === 1 ? 'admin' : 'user'}`}
                    className="nav-link learn-more-btn"
                  >
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    onClick={handleLogout}
                    to="/login"
                    className="nav-link learn-more-btn-logout"
                  >
                    Logout
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
