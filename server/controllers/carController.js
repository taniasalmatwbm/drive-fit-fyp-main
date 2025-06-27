const slugify  = require("slugify");
const carModel = require("../models/carModel");
const orderModel = require("../models/orderModel");
const brandModel = require("../models/carBrand");
 const path = require("path");
const multer = require("multer");
const dotenv = require("dotenv");
const braintree = require("braintree");
const fs = require('fs');
//const { google } = require('googleapis');
//const mime = require('mime-types');
 const { uploadFileToGoogleDrive } = require('../utils/googleDrive')
dotenv.config();

// ------------------ Braintree Setup ------------------
let gateway;

const isMock = (
  process.env.BRAINTREE_MERCHANT_ID === "fake-merchant-id" ||
  process.env.NODE_ENV === "development"
);

if (isMock) {
  gateway = {
    clientToken: {
      generate: (_, cb) => cb(null, { clientToken: "mocked-client-token" }),
    },
    transaction: {
      sale: (data, cb) =>
        cb(null, {
          success: true,
          transaction: { id: "mocked-id", amount: data.amount },
        }),
    },
  };
} else {
  gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
  });
}

// ------------------ Multer Setup ------------------
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, "uploads/"),
  filename: (_, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// const KEYFILEPATH = path.join(__dirname, "../controllers/cred.json");
// const SCOPES = ["https://www.googleapis.com/auth/drive"];

// // 🔐 Your Google auth logic
// const auth = new google.auth.GoogleAuth({
//   keyFile: KEYFILEPATH,
//   scopes: SCOPES,
// });

// const drive = google.drive({
//   version: 'v3',
//   auth,
// });

// const FOLDER_ID = '1LbbwJK78fjf_ZWYc1HZF5SwwU6reXomQ'; // 📁 Target folder

// const uploadFileToGoogleDrive = async (filePath, fileName) => {
//   const fileMetadata = {
//     name: fileName,
//     parents: [FOLDER_ID],
//   };

// //   const media = {
// //     mimeType: mime.lookup(filePath) || 'image/jpeg',
// //     body: fs.createReadStream(filePath),
// //   };
// const media = {
//     mimeType: mime.lookup(filePath) || 'application/octet-stream',
//     body: fs.createReadStream(filePath),
//   };

//   const response = await drive.files.create({
//     resource: fileMetadata,
//     media: media,
//     supportsAllDrives: true, // Important!
//     fields: 'id, webViewLink',
//   });

//   await drive.permissions.create({
//     fileId: response.data.id,
//     requestBody: {
//       role: 'reader',
//       type: 'anyone',
//     },
//   });

//   return response.data;
// };

// ------------------ Google Drive Setup ------------------
// const KEYFILEPATH = path.join(__dirname, "cred.json");
// const SCOPES = ["https://www.googleapis.com/auth/drive"];

// const auth = new google.auth.GoogleAuth({
//   keyFile: KEYFILEPATH,
//   scopes: SCOPES,
// });
// const drive = google.drive({ version: "v3", auth });
//const FOLDER_ID = "1LbbwJK78fjf_ZWYc1HZF5SwwU6reXomQ";






// ------------------ Utility: Get Google Drive File ID ------------------


const getDriveFileId = (url) => {
  if (!url || typeof url !== 'string') return null;
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)\//);
  return match ? match[1] : null;
};


// ------------------ Controllers ------------------
const createCar = async (req, res) => {
  try {
    const fields = [
      "name", "description", "brand", "price", "fuelType", "transmission",
      "engineSize", "mileage", "safetyrating", "warranty", "seater", "size", "fuelTank"
    ];

    console.log("📥 Files received:", req.files);
    console.log("📦 Body received:", req.body);

    for (let field of fields) {
      if (!req.body[field]) {
        return res.status(400).send({ success: false, message: `${field} is required` });
      }
    }

    // ✅ Upload images to Google Drive
    const uploadedFiles = await Promise.all(
      req.files.map(async (file) => {
        const result = await uploadFileToGoogleDrive(file.path, file.filename);
        fs.unlinkSync(file.path); // ✅ delete local file
        return result.webViewLink;
      })
    );

    // ✅ Create slug and car object
    const slug = slugify(req.body.name, { lower: true });

    const car = new carModel({
      ...req.body,
      slug,
      productPictures: uploadedFiles
    });

    await car.save();

    // ✅ Push car reference into brand
    const brand = await brandModel.findById(req.body.brand);
    brand.carInvoleInThisBrand.push(car);
    await brand.save();

    res.status(201).send({ success: true, message: "Car created successfully", car });

  } catch (err) {
    console.log('❌ Create Car Error:', err);
    return res.status(400).send({ success: false, message: `Error creating car`, err });
  }
};



// this changing right now
// const getAllCar = async (req, res) => {
//   try {
//     const cars = await carModel.find({}).populate("brand");
//     const updatedCars = cars.map(car => {
//       // Convert car images
//       car.productPictures = car.productPictures.map(pic => {
//         const fileId = getDriveFileId(pic);
//         return fileId
//           ? `https://lh3.googleusercontent.com/d/${fileId}=w1000?authuser=0`
//           : pic;
//       });

//       // Convert brand image(s)
//       if (Array.isArray(car.brand?.brandPictures)) {
//         car.brand.brandPictures = car.brand.brandPictures.map(pic => {
//           const fileId = getDriveFileId(pic);
//           return fileId
//             ? `https://lh3.googleusercontent.com/d/${fileId}=w1000?authuser=0`
//             : pic;
//         });
//       } else {
//         const fileId = getDriveFileId(car.brand?.brandPictures);
//         car.brand.brandPictures = fileId
//           ? `https://lh3.googleusercontent.com/d/${fileId}=w1000?authuser=0`
//           : car.brand.brandPictures;
//       }

//       return car;
//     });

//     res.status(200).send({
//       success: true,
//       totalCar: updatedCars.length,
//       cars: updatedCars
//     });
//   } catch (err) {
//     res.status(500).send({
//       success: false,
//       message: "Error getting cars",
//       error: err.message
//     });
//   }
// };

const getAllCar = async (req, res) => {
  try {
    const cars = await carModel.find({}).populate("brand");

    const updatedCars = cars.map(car => {
      // Car images
      car.productPictures = (car.productPictures || []).map(pic => {
        const fileId = getDriveFileId(pic);
        return fileId ? `https://lh3.googleusercontent.com/d/${fileId}=w1000?authuser=0` : pic;
      });

      // Brand images
      if (car.brand) {
        if (Array.isArray(car.brand.brandPictures)) {
          car.brand.brandPictures = car.brand.brandPictures.map(pic => {
            const fileId = getDriveFileId(pic);
            return fileId ? `https://lh3.googleusercontent.com/d/${fileId}=w1000?authuser=0` : pic;
          });
        } else if (typeof car.brand.brandPictures === 'string') {
          const fileId = getDriveFileId(car.brand.brandPictures);
          car.brand.brandPictures = fileId
            ? `https://lh3.googleusercontent.com/d/${fileId}=w1000?authuser=0`
            : car.brand.brandPictures;
        }
      }

      return car;
    });

    res.status(200).send({
      success: true,
      totalCar: updatedCars.length,
      cars: updatedCars
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Error getting cars",
      error: err.message
    });
  }
};



// const getCarById = async (req, res) => {
//   try {
//     const car = await carModel.findOne({ slug: req.params.slug }).populate("brand");

//     if (car) {
//       car.productPictures = car.productPictures.map(pic => {
//         const fileId = getDriveFileId(pic);
//         return fileId ? `https://lh3.googleusercontent.com/d/${fileId}=w1000?authuser=0` : pic;
//       });
//       if (car.brand?.brandPictures) {
//         const fileId = getDriveFileId(car.brand.brandPictures);
//         car.brand.brandPictures = fileId
//           ? `https://lh3.googleusercontent.com/d/${fileId}=w1000?authuser=0`
//           : car.brand.brandPictures;
//       }
//     }

//     res.status(200).send({ success: true, car });
//   } catch (err) {
//     res.status(500).send({ success: false, message: "Error finding car", error: err.message });
//   }
// };

// const deleteCar = async (req, res) => {
//   try {
//     const car = await carModel.findById(req.params.pid);
//     for (const pic of car.productPictures) {
//       fs.unlink(path.join(__dirname, "../uploads/", pic), () => {});
//     }
//     await carModel.findByIdAndDelete(req.params.pid);
//     res.status(200).send({ success: true, message: "Car deleted successfully" });
//   } catch (err) {
//     res.status(500).send({ success: false, message: "Error deleting car", error: err.message });
//   }
// };
const getCarById = async (req, res) => {
  try {
    const car = await carModel.findOne({ slug: req.params.slug }).populate("brand");

    if (car) {
      // Convert productPictures to Google Drive format
      car.productPictures = (car.productPictures || []).map(pic => {
        const fileId = getDriveFileId(pic);
        return fileId
          ? `https://lh3.googleusercontent.com/d/${fileId}=w1000?authuser=0`
          : pic;
      });

      // Handle both string and array for brand.brandPictures
      if (Array.isArray(car.brand?.brandPictures)) {
        car.brand.brandPictures = car.brand.brandPictures.map(pic => {
          const fileId = getDriveFileId(pic);
          return fileId
            ? `https://lh3.googleusercontent.com/d/${fileId}=w1000?authuser=0`
            : pic;
        });
      } else {
        const fileId = getDriveFileId(car.brand?.brandPictures);
        car.brand.brandPictures = fileId
          ? `https://lh3.googleusercontent.com/d/${fileId}=w1000?authuser=0`
          : car.brand.brandPictures;
      }
    }

    res.status(200).send({ success: true, car });
  } catch (err) {
    res.status(500).send({ success: false, message: "Error finding car", error: err.message });
  }
};

const deleteCar = async (req, res) => {
  try {
    const car = await carModel.findById(req.params.pid);
    if (!car) {
      return res.status(404).send({ success: false, message: "Car not found" });
    }

    // Only delete if images are local (not Google Drive)
    for (const pic of car.productPictures) {
      if (!pic.includes("googleusercontent.com")) {
        fs.unlink(path.join(__dirname, "../uploads/", pic), () => {});
      }
    }

    await carModel.findByIdAndDelete(req.params.pid);
    res.status(200).send({ success: true, message: "Car deleted successfully" });
  } catch (err) {
    res.status(500).send({ success: false, message: "Error deleting car", error: err.message });
  }
};

 
// const updatecar = async (req, res) => {
//   try {
//     const required = [
//       "name", "description", "fuelType", "transmission", "engineSize",
//       "mileage", "safetyrating", "warranty", "seater", "size", "fuelTank", "price"
//     ];

//     for (let field of required) {
//       if (!req.body[field]) {
//         return res.status(400).send({ success: false, message: `${field} is required` });
//       }
//     }

//     const car = await carModel.findByIdAndUpdate(
//       req.params.pid,
//       { ...req.body, slug: slugify(req.body.name, { lower: true }) },
//       { new: true }
//     );

//     res.status(201).send({ success: true, message: "Car updated successfully", car });
//   } catch (err) {
//     res.status(500).send({ success: false, message: "Error updating car", error: err.message });
//   }
// };

const updatecar = async (req, res) => {
  try {
    const required = [
      "name", "description", "fuelType", "transmission", "engineSize",
      "mileage", "safetyrating", "warranty", "seater", "size", "fuelTank", "price"
    ];

    for (let field of required) {
      if (!req.body[field]) {
        return res.status(400).send({ success: false, message: `${field} is required` });
      }
    }

    const updated = await carModel.findByIdAndUpdate(
      req.params.pid,
      {
        ...req.body,
        slug: slugify(req.body.name, { lower: true }),
      },
      { new: true }
    );

    res.status(201).send({ success: true, message: "Car updated successfully", car: updated });
  } catch (err) {
    res.status(500).send({ success: false, message: "Error updating car", error: err.message });
  }
};

// const relatedCar = async (req, res) => {
//   try {
//     const { cid, bid } = req.params;
//     const cars = await carModel.find({
//       brand: bid,
//       _id: { $ne: cid },
//     }).populate("brand");

//     cars.forEach(car => {
//       car.productPictures = car.productPictures.map(pic => {
//         const fileId = getDriveFileId(pic);
//         return fileId ? `https://lh3.googleusercontent.com/d/${fileId}=w1000?authuser=0` : pic;
//       });
//       if (car.brand?.brandPictures) {
//         const fileId = getDriveFileId(car.brand.brandPictures);
//         car.brand.brandPictures = fileId
//           ? `https://lh3.googleusercontent.com/d/${fileId}=w1000?authuser=0`
//           : car.brand.brandPictures;
//       }
//     });

//     res.status(200).send({ success: true, cars });
//   } catch (err) {
//     res.status(400).send({ success: false, message: "Error fetching related cars", error: err.message });
//   }
// };






// ------------------ Braintree Controllers ------------------


const relatedCar = async (req, res) => {
  try {
    const { cid, bid } = req.params;

    const cars = await carModel.find({
      brand: bid,
      _id: { $ne: cid },
    }).populate("brand");

    const updatedCars = cars.map(car => {
      // Update productPictures
      car.productPictures = (car.productPictures || []).map(pic => {
        const fileId = getDriveFileId(pic);
        return fileId
          ? `https://lh3.googleusercontent.com/d/${fileId}=w1000?authuser=0`
          : pic;
      });

      // Update brand brandPictures (if brand is populated)
      if (car.brand?.brandPictures) {
        if (Array.isArray(car.brand.brandPictures)) {
          car.brand.brandPictures = car.brand.brandPictures.map(pic => {
            const fileId = getDriveFileId(pic);
            return fileId
              ? `https://lh3.googleusercontent.com/d/${fileId}=w1000?authuser=0`
              : pic;
          });
        } else {
          const fileId = getDriveFileId(car.brand.brandPictures);
          car.brand.brandPictures = fileId
            ? `https://lh3.googleusercontent.com/d/${fileId}=w1000?authuser=0`
            : car.brand.brandPictures;
        }
      }

      return car;
    });

    res.status(200).send({ success: true, cars: updatedCars });
  } catch (err) {
    res.status(400).send({
      success: false,
      message: "Error fetching related cars",
      error: err.message,
    });
  }
};



const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, (err, response) => {
      if (err) return res.status(500).send(err);
      res.send(response);
    });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
};

const brainTreePaymentController = async (req, res) => {
  try {
    const { nonce, cart } = req.body;
    const total = cart.reduce((sum, item) => sum + item.price, 0);

    gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: { submitForSettlement: true },
      },
      async (error, result) => {
        if (result?.success) {
          await new orderModel({
            products: cart,
            payment: result.transaction,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error || { message: "Payment failed" });
        }
      }
    );
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
};

module.exports = {
  upload,
  createCar,
  getAllCar,
  getCarById,
  deleteCar,
  updatecar,
  relatedCar,
  braintreeTokenController,
  brainTreePaymentController,
};
