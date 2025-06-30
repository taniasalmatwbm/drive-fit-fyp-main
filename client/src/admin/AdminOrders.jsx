import  { useEffect, useState } from 'react';
import AdminMenu from './AdminMenu';
import { useAuth } from '../context/auth';
import moment from 'moment';
import axios from 'axios';
import { Select } from "antd";
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const { Option } = Select;

const AdminOrders = () => {
  const [statusOptions] = useState(["Not Process", "Processing", "Shipped", "Delivered", "Cancel"]);
  const [orders, setOrders] = useState([]);
  const [auth] = useAuth();

  const getOrders = async () => {
    try {
      // const { data } = await axios.get(`${process.env.REACT_APP_API || ''}/api/user/allOrders`);
      const { data } = await axios.get("/api/user/allOrders");
      setOrders(data);
    } catch (err) {
      toast.error('Failed to fetch orders');
    }
  };

  useEffect(() => {
    if (auth?.token) {
      getOrders();
      window.scrollTo(0, 0);
    }
  }, [auth?.token]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // await axios.put(`${process.env.REACT_APP_API || ''}/api/user/orderStatus/${orderId}`, { status: newStatus });
       await axios.put(`/api/user/orderStatus/${orderId}`, { status: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
      getOrders();
    } catch (error) {
      console.error(error);
      toast.error('Failed to update order status');
    }
  };

  return (
    <div className="container marginStyle">
      <div className="row">
        <div className="col-md-3">
          <AdminMenu />
        </div>
        <div className="col-md-9 my-3">
          <h1 className="text-center">Manage Orders</h1>
          {orders?.map((order, index) => (
            <div key={order._id} className="mb-5 border-bottom pb-3">
              <div className="table-responsive">
                <table className="table table-bordered text-center">
                  <thead className="table-dark">
                    <tr>
                      <th>Id</th>
                      <th>Status</th>
                      <th>Buyer</th>
                      <th>Date</th>
                      <th>Payment</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{index + 1}</td>
                      <td>
                        <Select
                          bordered={false}
                          onChange={(value) => handleStatusChange(order._id, value)}
                          defaultValue={order?.status}
                          style={{ width: '100%' }}
                        >
                          {statusOptions.map((status, idx) => (
                            <Option key={idx} value={status}>
                              {status}
                            </Option>
                          ))}
                        </Select>
                      </td>
                      <td>{order?.buyer?.name}</td>
                      <td>{moment(order?.createdAt).fromNow()}</td>
                      <td>
                        <span className={`badge text-bg-${order?.payment?.success ? 'success' : 'danger'}`}>
                          {order?.payment?.success ? "Success" : "Failed"}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="container">
                {order?.products?.map((product, i) => (
                  <div key={product._id || i} className="row my-2 p-3 card flex-row text-center">
                    <div className="col-md-4">
                      <Link to={`/car/${product.slug}`}>
                        <img
                          // src={`${process.env.REACT_APP_API || ''}/${product.productPictures[0]}`}
                           src={`${product.productPictures[0]}`}
                          style={{ maxWidth: '100%', maxHeight: '100px', objectFit: 'contain' }}
                          alt={product.name}
                        />
                      </Link>
                    </div>
                    <div className="col-md-8">
                      <p>{product.name}</p>
                      <p>Rs. {product.price} Lakhs</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
