// // import { useEffect, useState } from 'react';
// // import AdminMenu from './AdminMenu';
// // import axios from 'axios';
// // import { useNavigate, useParams } from 'react-router-dom';
// // import toast from 'react-hot-toast';

// // const UpdateCar = () => {
// //   const params = useParams();
// //   const navigate = useNavigate();

// //   const [car, setCar] = useState({
// //     name: '',
// //     description: '',
// //     price: '',
// //     fuelType: '',
// //     transmission: '',
// //     engineSize: '',
// //     mileage: '',
// //     safetyrating: '',
// //     warranty: '',
// //     seater: '',
// //     size: '',
// //     fuelTank: '',
// //   });

// //   const [photo, setPhoto] = useState(null);
// //   const [id, setId] = useState('');

// //   const getSingleProduct = async () => {
// //     try {
// //       const { data } = await axios.get(`/api/car/getCarById-car/${params.slug}`);
// //       if (data?.car) {
// //         const {
// //           name, description, price, fuelType, transmission,
// //           engineSize, mileage, safetyrating, warranty,
// //           seater, size, fuelTank, _id,
// //         } = data.car;

// //         setCar({
// //           name, description, price, fuelType, transmission,
// //           engineSize, mileage, safetyrating, warranty,
// //           seater, size, fuelTank
// //         });
// //         setId(_id);
// //       } else {
// //         toast.error("Car not found.");
// //       }
// //     } catch (err) {
// //       toast.error("Failed to load car data");
// //       console.error(err);
// //     }
// //   };

// //   const handleChange = (e) => {
// //     setCar({ ...car, [e.target.name]: e.target.value });
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     try {
// //       const carData = new FormData();
// //       Object.entries(car).forEach(([key, value]) => {
// //         carData.append(key, value);
// //       });

// //       if (photo) {
// //         carData.append("photo", photo);
// //       }

// //       const { data } = await axios.put(`/api/car/update-car/${id}`, carData);

// //       if (data.success) {
// //         toast.success("Car Updated Successfully");
// //         navigate("/dashboard/admin/cars");
// //       } else {
// //         toast.error(data.message || "Update failed");
// //       }
// //     } catch (err) {
// //       toast.error("Update failed");
// //       console.error(err);
// //     }
// //   };

// //   const handleDelete = async () => {
// //     const confirm = window.confirm("Are you sure you want to delete this car?");
// //     if (!confirm) return;

// //     try {
// //       await axios.delete(`/api/car/delete-car/${id}`);
// //       toast.success("Car Deleted Successfully");
// //       navigate("/dashboard/admin/cars");
// //     } catch (err) {
// //       toast.error("Failed to delete car");
// //       console.error(err);
// //     }
// //   };

// //   useEffect(() => {
// //     getSingleProduct();
// //     window.scrollTo(0, 0);
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, []);

// //   const fields = [
// //     { name: 'name', label: 'Car Name' },
// //     { name: 'price', label: 'Car Price' },
// //     { name: 'fuelType', label: 'Fuel Type' },
// //     { name: 'transmission', label: 'Transmission' },
// //     { name: 'engineSize', label: 'Engine Size' },
// //     { name: 'mileage', label: 'Mileage' },
// //     { name: 'safetyrating', label: 'Safety Rating' },
// //     { name: 'warranty', label: 'Warranty' },
// //     { name: 'seater', label: 'Seater' },
// //     { name: 'size', label: 'Car Size' },
// //     { name: 'fuelTank', label: 'Fuel Tank' },
// //   ];

// //   return (
// //     <div className="container marginStyle">
// //       <div className="container-fluid">
// //         <div className="row">
// //           <div className="col-md-3">
// //             <AdminMenu />
// //           </div>
// //           <div className="col-md-9 my-3">
// //             <h1 className="text-center">Update Car</h1>
// //             <div className="m-1">
// //               {/* Image Upload */}
// //               <div className="mb-3">
// //                 <label className="btn btn-outline-secondary col-md-12">
// //                   {photo ? photo.name : "Upload Car Image"}
// //                   <input
// //                     type="file"
// //                     name="photo"
// //                     accept="image/*"
// //                     onChange={(e) => setPhoto(e.target.files[0])}
// //                     hidden
// //                   />
// //                 </label>
// //               </div>

// //               {/* Show current image if photo not updated */}
// //               {!photo && (
// //                 <div className="text-center mb-3">
// //                   <img
// //                     src={`/api/car/car-photo/${id}`}
// //                     alt="car"
// //                     height="200px"
// //                     className="img img-responsive"
// //                   />
// //                 </div>
// //               )}

// //               {fields.map(({ name, label }) => (
// //                 <div key={name} className="mb-3">
// //                   <input
// //                     type="text"
// //                     name={name}
// //                     value={car[name]}
// //                     placeholder={`Enter ${label}`}
// //                     className="form-control"
// //                     onChange={handleChange}
// //                   />
// //                 </div>
// //               ))}

// //               <div className="mb-3">
// //                 <textarea
// //                   rows={3}
// //                   name="description"
// //                   value={car.description}
// //                   placeholder="Enter Description"
// //                   className="form-control"
// //                   onChange={handleChange}
// //                 />
// //               </div>

// //               <div className="mb-3">
// //                 <button className="btn btn-success mx-2" onClick={handleSubmit}>
// //                   Update Car
// //                 </button>
// //                 <button className="btn btn-danger" onClick={handleDelete}>
// //                   Delete Car
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default UpdateCar;




//  import { useEffect, useState } from 'react';
// import AdminMenu from './AdminMenu';
// import axios from 'axios';
// import { useNavigate, useParams } from 'react-router-dom';
// import toast from 'react-hot-toast';

// const UpdateCar = () => {
//   const params = useParams();
//   const navigate = useNavigate();

//   const [car, setCar] = useState({
//     name: '',
//     description: '',
//     price: '',
//     fuelType: '',
//     transmission: '',
//     engineSize: '',
//     mileage: '',
//     safetyrating: '',
//     warranty: '',
//     seater: '',
//     size: '',
//     fuelTank: '',
//   });

//   const [id, setId] = useState('');

//   const getSingleProduct = async () => {
//     try {
//       // const { data } = await axios.get(`${process.env.REACT_APP_API || ''}/api/car/getCarById-car/${params.slug}`);
//       const { data } = await axios.get(`/api/car/getCarById-car/${params.slug}`);
//       if (data?.car) {
//         const {
//           name, description, price, fuelType, transmission,
//           engineSize, mileage, safetyrating, warranty,
//           seater, size, fuelTank, _id,
//         } = data.car;

//         setCar({
//           name, description, price, fuelType, transmission,
//           engineSize, mileage, safetyrating, warranty,
//           seater, size, fuelTank
//         });
//         setId(_id);
//       } else {
//         toast.error("Car not found.");
//       }
//     } catch (err) {
//       toast.error("Failed to load car data");
//       console.error(err);
//     }
//   };

//   const handleChange = (e) => {
//     setCar({ ...car, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const carData = new FormData();
//       Object.entries(car).forEach(([key, value]) => {
//         carData.append(key, value);
//       });

//     //   const { data } = await axios.put(`${process.env.REACT_APP_API || ''}/api/car/update-car/${id}`, carData);
//     const { data } = await axios.put(`/api/car/update-car/${id}`, carData);

//       if (data.success) {
//         toast.success("Car Updated Successfully");
//         navigate("/dashboard/admin/cars");
//       } else {
//         toast.error(data.message || "Update failed");
//       }
//     } catch (err) {
//       toast.error("Update failed");
//       console.error(err);
//     }
//   };

//   const handleDelete = async () => {
//     const confirm = window.confirm("Are you sure you want to delete this car?");
//     if (!confirm) return;

//     try {
//       // await axios.delete(`${process.env.REACT_APP_API || ''}/api/car/delete-car/${id}`);
//       await axios.delete(`/api/car/delete-car/${id}`);
//       toast.success("Car Deleted Successfully");
//       navigate("/dashboard/admin/cars");
//     } catch (err) {
//       toast.error("Failed to delete car");
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     getSingleProduct();
//     window.scrollTo(0, 0);
//   }, [getSingleProduct]);

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
//     { name: 'fuelTank', label: 'Fuel Tank' },
//   ];

//   return (
//     <div className="container marginStyle">
//       <div className="container-fluid">
//         <div className="row">
//           <div className="col-md-3">
//             <AdminMenu />
//           </div>
//           <div className="col-md-9 my-3">
//             <h1 className="text-center">Update Car</h1>
//             <div className="m-1">
//               {fields.map(({ name, label }) => (
//                 <div key={name} className="mb-3">
//                   <input
//                     type="text"
//                     name={name}
//                     value={car[name]}
//                     placeholder={`Enter ${label}`}
//                     className="form-control"
//                     onChange={handleChange}
//                   />
//                 </div>
//               ))}
//               <div className="mb-3">
//                 <textarea
//                   rows={3}
//                   name="description"
//                   value={car.description}
//                   placeholder="Enter Description"
//                   className="form-control"
//                   onChange={handleChange}
//                 />
//               </div>
//               <div className="mb-3">
//                 <button className="btn btn-success mx-2" onClick={handleSubmit}>
//                   Update Car
//                 </button>
//                 <button className="btn btn-danger" onClick={handleDelete}>
//                   Delete Car
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UpdateCar;


import { useEffect, useState } from 'react';
import AdminMenu from './AdminMenu';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const UpdateCar = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState({
    name: '', description: '', price: '', fuelType: '', transmission: '',
    engineSize: '', mileage: '', safetyrating: '', warranty: '',
    seater: '', size: '', fuelTank: ''
  });
  const [id, setId] = useState('');

  const getSingleCar = async () => {
    try {
      const { data } = await axios.get(`/api/car/getCarById-car/${params.slug}`);
      if (data?.car) {
        setCar({ ...data.car });
        setId(data.car._id);
      } else {
        toast.error("Car not found.");
      }
    } catch (err) {
      toast.error("Failed to load car data");
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setCar({ ...car, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(car).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const { data } = await axios.put(`/api/car/update-car/${id}`, formData);
      if (data.success) {
        toast.success("Car updated successfully");
        navigate("/dashboard/admin/cars");
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch (err) {
      toast.error("Update failed");
      console.error(err);
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm("Are you sure you want to delete this car?");
    if (!confirm) return;

    try {
      await axios.delete(`/api/car/delete-car/${id}`);
      toast.success("Car deleted successfully");
      navigate("/dashboard/admin/cars");
    } catch (err) {
      toast.error("Failed to delete car");
      console.error(err);
    }
  };

  useEffect(() => {
    getSingleCar();
    window.scrollTo(0, 0);
  }, []);

  const fields = [
    { name: 'name', label: 'Car Name' },
    { name: 'price', label: 'Car Price' },
    { name: 'fuelType', label: 'Fuel Type' },
    { name: 'transmission', label: 'Transmission' },
    { name: 'engineSize', label: 'Engine Size' },
    { name: 'mileage', label: 'Mileage' },
    { name: 'safetyrating', label: 'Safety Rating' },
    { name: 'warranty', label: 'Warranty' },
    { name: 'seater', label: 'Seater' },
    { name: 'size', label: 'Car Size' },
    { name: 'fuelTank', label: 'Fuel Tank' }
  ];

  return (
    <div className="container marginStyle">
      <div className="row">
        <div className="col-md-3"><AdminMenu /></div>
        <div className="col-md-9 my-3">
          <h1 className="text-center">Update Car</h1>
          <form onSubmit={handleSubmit}>
            {fields.map(({ name, label }) => (
              <div key={name} className="mb-3">
                <input
                  type="text"
                  name={name}
                  value={car[name]}
                  placeholder={`Enter ${label}`}
                  className="form-control"
                  onChange={handleChange}
                />
              </div>
            ))}
            <div className="mb-3">
              <textarea
                name="description"
                value={car.description}
                placeholder="Enter Description"
                rows={3}
                className="form-control"
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <button className="btn btn-success mx-2" type="submit">Update Car</button>
              <button className="btn btn-danger" type="button" onClick={handleDelete}>Delete Car</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateCar;
