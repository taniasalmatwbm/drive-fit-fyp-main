

import { useEffect, useState } from 'react';
import { useCart } from '../context/cart';
import { useAuth } from '../context/auth';
import { Link, useNavigate } from 'react-router-dom';
import DropIn from 'braintree-web-drop-in';
import axios from 'axios';
import { HiOutlineTrash } from 'react-icons/hi';
import toast from 'react-hot-toast';

const Cart = () => {
  const [cart, setCart] = useCart();
  const [auth] = useAuth(); // assuming useAuth returns [auth, setAuth]
  const [clientToken, setClientToken] = useState('');
  const [instance, setInstance] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const totalPrice = () => {
    try {
      let total = cart?.reduce((acc, item) => {
        const cleanPrice =
          typeof item.price === 'string'
            ? item.price.replace(/\D/g, '')
            : item.price;
        return acc + parseInt(cleanPrice);
      }, 0);
      return total.toLocaleString('en-US', {
        style: 'currency',
        currency: 'INR',
      });
    } catch (error) {
      console.error(error);
      return '₹0';
    }
  };

  const removeCartItem = (pid) => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex((item) => item._id === pid);
      myCart.splice(index, 1);
      setCart(myCart);
      localStorage.setItem('cart', JSON.stringify(myCart));
      toast.success('Item Removed Successfully');
    } catch (err) {
      console.error(err);
    }
  };

  const getToken = async () => {
    try {
      const res = await axios.get('/api/car/braintree/token');
      setClientToken(res?.data?.clientToken);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getToken();
    window.scrollTo(0, 0);
  }, [auth?.token]);

  const handlePayment = async () => {
    try {
      setLoading(true);

      if (!instance) {
        toast.error('Payment instance not initialized');
        setLoading(false);
        return;
      }

      const { nonce } = await instance.requestPaymentMethod();

      const res = await axios.post('/api/car/braintree/payment', {
        nonce,
        cart,
      });

      if (res?.data?.ok) {
        localStorage.removeItem('cart');
        setCart([]);
        navigate('/dashboard/user/order');
        toast.success('Payment Completed Successfully');
      } else {
        toast.error('Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Something went wrong during payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-5">
      <section className="h-100 h-custom">
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col">
              <div className="card">
                <div className="card-body p-4">
                  <div className="row">
                    {/* LEFT SIDE */}
                    <div className="col-lg-7">
                      <h5 className="mb-3">
                        {!auth?.user ? 'Hello Guest' : `Hello ${auth.user.name}`}
                      </h5>
                      <hr />

                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                          <p className="mb-1">Shopping cart</p>
                          <p className="mb-0">
                            {cart?.length
                              ? `You have ${cart.length} items in your cart ${
                                  auth?.token ? '' : 'Please login to checkout!'
                                }`
                              : 'Your Cart Is Empty'}
                          </p>
                        </div>
                      </div>

                      {cart?.map((p, i) => (
                        <div className="card my-3 mb-lg-0" key={i}>
                          <div className="card-body">
                            <div className="d-flex justify-content-between">
                              <div className="d-flex flex-row align-items-center">
                                <div>
                                  <Link to={`/car/${p.slug}`} className="text-center">
                                    <img
                                      src={
                                        p.productPictures?.[0] ||
                                        '/default-car.jpg'
                                      }
                                      className="card-img-top"
                                      alt={p.name}
                                      style={{
                                        maxWidth: '100%',
                                        maxHeight: '80px',
                                        objectFit: 'contain',
                                      }}
                                    />
                                  </Link>
                                </div>
                                <div className="mx-2">
                                  <p className="sizePrice">
                                    <span className="badge rounded-pill text-bg-primary">
                                      {p.brand?.name || 'No Brand'}
                                    </span>
                                  </p>
                                  <p className="sizePrice">{p.name}</p>
                                </div>
                              </div>
                              <div className="text-center">
                                <p className="sizePrice">Rs. {p.price} Lakhs</p>
                                <button
                                  className="btn btn-danger"
                                  onClick={() => removeCartItem(p._id)}
                                >
                                  <HiOutlineTrash size={20} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="col-lg-5">
                      <div className="card text-white rounded-3 cartStyle">
                        <div className="card-body">
                          <div className="text-center">
                            <h2>Cart Summary</h2>
                            <p>Total | Checkout | Payment</p>
                            <hr />
                            <h4>Total: {totalPrice()} Lakhs</h4>

                            {auth?.user?.address ? (
                              <div className="mb-3">
                                <h4>Current Address</h4>
                                <h5>{auth.user.address}</h5>
                                <button
                                  className="btn btn-warning my-2"
                                  onClick={() =>
                                    navigate('/dashboard/user/profile')
                                  }
                                >
                                  Update Address
                                </button>
                              </div>
                            ) : (
                              <div className="mb-3">
                                {auth?.token ? (
                                  <button
                                    className="btn btn-outline-warning"
                                    onClick={() =>
                                      navigate('/dashboard/user/profile')
                                    }
                                  >
                                    Update Address
                                  </button>
                                ) : (
                                  <button
                                    className="btn btn-primary"
                                    onClick={() =>
                                      navigate('/login', {
                                        state: '/cart',
                                      })
                                    }
                                  >
                                    Please Login to Checkout
                                  </button>
                                )}
                              </div>
                            )}

                            <div className="mt-2">
                              {clientToken && auth?.token && cart?.length > 0 && (
                                       <>
                                       <DropIn
                                             options={{
                                         authorization: clientToken,
                                        paypal: { flow: 'vault' }, // optional
                                             }}
                                      onInstance={(instance) => {
                                       console.log("DropIn instance set:", instance); // ✅ debug
                                       setInstance(instance);
                                             }}
                                              />
                                             <button
                                         className="btn btn-dark mt-3"
                                             onClick={handlePayment}
                                         disabled={loading || !instance || !auth?.user?.address}
                                     >
                                          {loading ? 'Processing ....' : 'Make Payment'}
                                             </button>
                                             </>
                                            )}

                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* RIGHT END */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Cart;
