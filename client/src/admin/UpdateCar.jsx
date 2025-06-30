

// import { useCallback, useEffect, useState } from 'react';
// import AdminMenu from './AdminMenu';
// import axios from 'axios';
// import { useNavigate, useParams } from 'react-router-dom';
// import toast from 'react-hot-toast';

// const UpdateCar = () => {
//   const params = useParams();
//   const navigate = useNavigate();

//   const [car, setCar] = useState({
//     name: '', description: '', price: '', fuelType: '', transmission: '',
//     engineSize: '', mileage: '', safetyrating: '', warranty: '',
//     seater: '', size: '', fuelTank: ''
//   });
//   const [id, setId] = useState('');

//   // const getSingleCar = async () => {
//   //   try {
//   //     const { data } = await axios.get(`/api/car/getCarById-car/${params.slug}`);
//   //     if (data?.car) {
//   //       setCar({ ...data.car });
//   //       setId(data.car._id);
//   //     } else {
//   //       toast.error("Car not found.");
//   //     }
//   //   } catch (err) {
//   //     toast.error("Failed to load car data");
//   //     console.error(err);
//   //   }
    
//   // };

  
//   const getSingleCar = useCallback(async () => {
//   try {
//     const { data } = await axios.get(`/api/car/getCarById-car/${params.slug}`);
//     if (data?.car) {
//       setCar({ ...data.car });
//       setId(data.car._id);
//     } else {
//       toast.error("Car not found.");
//     }
//   } catch (err) {
//     toast.error("Failed to load car data");
//     console.error(err);
//   }
// }, [params.slug]); // useCallback depends on params.slug

  
  
//   const handleChange = (e) => {
//     setCar({ ...car, [e.target.name]: e.target.value });
//   };
// // image ya file ky liye ye method
//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   try {
//   //     const formData = new FormData();
//   //     Object.entries(car).forEach(([key, value]) => {
//   //       formData.append(key, value);
//   //     });

//   //     const { data } = await axios.put(`/api/car/update-car/${id}`, formData);
//   //     if (data.success) {
//   //       toast.success("Car updated successfully");
//   //       navigate("/dashboard/admin/cars");
//   //     } else {
//   //       toast.error(data.message || "Update failed");
//   //     }
//   //   } catch (err) {
//   //     toast.error("Update failed");
//   //     console.error(err);
//   //   }
//   // };

//   // json ky liye ye method
//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   try {
//     const { data } = await axios.put(`/api/car/update-car/${id}`, car);
//     if (data.success) {
//       toast.success("Car updated successfully");
//       navigate("/dashboard/admin/cars");
//     } else {
//       toast.error(data.message || "Update failed");
//     }
//   } catch (err) {
//     toast.error("Update failed");
//     console.error(err);
//   }
// };

//   const handleDelete = async () => {
//     const confirm = window.confirm("Are you sure you want to delete this car?");
//     if (!confirm) return;

//     try {
//       await axios.delete(`/api/car/delete-car/${id}`);
//       toast.success("Car deleted successfully");
//       navigate("/dashboard/admin/cars");
//     } catch (err) {
//       toast.error("Failed to delete car");
//       console.error(err);
//       // res.status(500).send({ success: false, message: "Error updating car", error: err.message });
//     }
//   };

//   // useEffect(() => {
//   //   getSingleCar();
//   //   window.scrollTo(0, 0);
//   // }, [params.slug]);

//   useEffect(() => {
//   getSingleCar();
// }, [getSingleCar]);

//   const fields = [
//     { name: 'name', label: 'Car Name' },
//     { name: 'price', label: 'Car Price' },
//     { name: 'fuelType', label: 'Fuel Type' },
//     { name: 'transmission', label: 'Transmission' },
//     { name: 'engineSize', label: 'Engine Size' },
//     { name: 'mileage', label: 'Mileage' },
//     { name: 'safetyrating', label: 'Safety Rating' },
//     { name: 'warranty', label: 'Warranty' },
//     { name: 'seater', label: 'Seater' },
//     { name: 'size', label: 'Car Size' },
//     { name: 'fuelTank', label: 'Fuel Tank' }
//   ];

//   return (
//     <div className="container marginStyle">
//       <div className="row">
//         <div className="col-md-3"><AdminMenu /></div>
//         <div className="col-md-9 my-3">
//           <h1 className="text-center">Update Car</h1>
//           <form onSubmit={handleSubmit}>
//             {fields.map(({ name, label }) => (
//               <div key={name} className="mb-3">
//                 <input
//                   type="text"
//                   name={name}
//                   value={car[name]}
//                   placeholder={`Enter ${label}`}
//                   className="form-control"
//                   onChange={handleChange}
//                 />
//               </div>
//             ))}
//             <div className="mb-3">
//               <textarea
//                 name="description"
//                 value={car.description}
//                 placeholder="Enter Description"
//                 rows={3}
//                 className="form-control"
//                 onChange={handleChange}
//               />
//             </div>
//             <div className="mb-3">
//               <button className="btn btn-success mx-2" type="submit">Update Car</button>
//               <button className="btn btn-danger" type="button" onClick={handleDelete}>Delete Car</button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UpdateCar;



import { useEffect, useState } from 'react'
import AdminMenu from './AdminMenu'
import axios from 'axios'
import {useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'

const UpdateCar = () => {

    const params = useParams()

    const [name, setname] = useState('')
    const [description, setdescription] = useState('')
    const [price, setprice] = useState('');
    const [fuelType, setfuelType] = useState('');
    const [transmission, settransmission] = useState('');
    const [engineSize, setengineSize] = useState('');
    const [mileage, setmileage] = useState('');
    const [safetyrating, setsafetyrating] = useState('');
    const [warranty, setwarranty] = useState('');
    const [seater, setseater] = useState('');
    const [size, setsize] = useState('');
    const [fuelTank, setfuelTank] = useState('');
    const [id, setId] = useState('')

    const navigate = useNavigate();

    const getSingleProduct = async () => {
        try {
            const { data } = await axios.get(`/api/car/getCarById-car/${params.slug}`)
            setname(data.car.name)
            setdescription(data.car.description)
            setprice(data.car.price)
            setfuelType(data.car.fuelType)
            settransmission(data.car.transmission)
            setengineSize(data.car.engineSize)
            setmileage(data.car.mileage)
            setsafetyrating(data.car.safetyrating)
            setwarranty(data.car.warranty)
            setseater(data.car.seater)
            setsize(data.car.size)
            setfuelTank(data.car.fuelTank)
            setId(data.car._id)
        } catch (err) {
            console.log(err)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const carData = new FormData()
            carData.append('name', name)
            carData.append('price', price)
            carData.append('fuelType', fuelType)
            carData.append('transmission', transmission)
            carData.append('engineSize', engineSize)
            carData.append('mileage', mileage)
            carData.append('safetyrating', safetyrating)
            carData.append('warranty', warranty)
            carData.append('seater', seater)
            carData.append('size', size)
            carData.append('fuelTank', fuelTank)
            carData.append('description', description)

            const { data } = await axios.put(`/api/car/update-car/${id}`, carData)

            if (data.success) {
                toast.success('Car Updated Successfully')
                navigate('/dashboard/admin/cars')
            } else {
                toast.error(data.message)
            }
        } catch (err) {
            console.log(err)
        }
    }

    const handleDelete = async () => {
        try {
            const { data } = await axios.delete(`/api/car/delete-car/${id}`)
            toast.success('Car Deleted Successfully')
            navigate('/dashboard/admin/cars')
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getSingleProduct();
        window.scrollTo(0, 0)
    }, [])

    return (
        <div className='container marginStyle'>
            <div className='container-fluid'>
                <div className='row'>
                    <div className='col-md-3'>
                        <AdminMenu />
                    </div>
                    <div className='col-md-9 my-3'>
                        <h1 className='text-center'>Update Car</h1>
                        <div className='m-1'>
                            <div className='mb-3'>
                                <input type='text' value={name} placeholder='write a car Name' className='form-control' onChange={(e) => setname(e.target.value)} />
                            </div>
                            <div className='mb-3'>
                                <input type='text' value={price} placeholder='write a car Price' className='form-control' onChange={(e) => setprice(e.target.value)} />
                            </div>
                            <div className='mb-3'>
                                <input type='text' value={fuelType} placeholder='write a car Fuel Type' className='form-control' onChange={(e) => setfuelType(e.target.value)} />
                            </div>
                            <div className='mb-3'>
                                <input type='text' value={transmission} placeholder='write a car Transmission' className='form-control' onChange={(e) => settransmission(e.target.value)} />
                            </div>
                            <div className='mb-3'>
                                <input type='text' value={engineSize} placeholder='write a car EngineSize' className='form-control' onChange={(e) => setengineSize(e.target.value)} />
                            </div>
                            <div className='mb-3'>
                                <input type='text' value={mileage} placeholder='write a car Mileage' className='form-control' onChange={(e) => setmileage(e.target.value)} />
                            </div>
                            <div className='mb-3'>
                                <input type='text' value={safetyrating} placeholder='write a car Safetyrating' className='form-control' onChange={(e) => setsafetyrating(e.target.value)} />
                            </div>
                            <div className='mb-3'>
                                <input type='text' value={warranty} placeholder='write a car Warranty' className='form-control' onChange={(e) => setwarranty(e.target.value)} />
                            </div>
                            <div className='mb-3'>
                                <input type='text' value={seater} placeholder='write a car Seater' className='form-control' onChange={(e) => setseater(e.target.value)} />
                            </div>
                            <div className='mb-3'>
                                <input type='text' value={size} placeholder='write a car Size' className='form-control' onChange={(e) => setsize(e.target.value)} />
                            </div>
                            <div className='mb-3'>
                                <input type='text' value={fuelTank} placeholder='write a car FuelTank' className='form-control' onChange={(e) => setfuelTank(e.target.value)} />
                            </div>
                            <div className='mb-3'>
                                <textarea rows={3} type='text' value={description} placeholder='write a car Description' className='form-control' onChange={(e) => setdescription(e.target.value)} />
                            </div>
                            <div className='mb-3'>
                                <button className='btn btn-success mx-2' onClick={handleSubmit}>Update Car</button>
                                <button className='btn btn-danger' onClick={handleDelete}>Delete Car</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default UpdateCar
