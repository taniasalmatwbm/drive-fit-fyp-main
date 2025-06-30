const  slugify  = require('slugify');
const brandModel = require('../models/carBrand');
 const { uploadFileToGoogleDrive } = require('../utils/googleDrive')
//const mime = require('mime-types'); 
const fs = require('fs');
const path = require('path');
const multer = require('multer');
//const { google } = require('googleapis');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });



// uploadFileToGooleDriveConcept
//Dynamic MIME type	✅ Done
// ✅ Public Access Permission	✅ Done
// ✅ Clean return (webViewLink)	✅ Done
// ✅ Efficient fs.createReadStream	✅ Done



const createBrand = async (req, res) => {
    try {
        const { name } = req.body;
        const files = req.files;

        if (!name) {
            return res.status(400).send({ message: 'Brand Name is Required' });
        }

        if (!files || files.length === 0) {
            return res.status(400).send({ message: 'Brand Image is Required' });
        }

        const existCategory = await brandModel.findOne({ name });
        if (existCategory) {
            return res.status(200).send({
                success: false,
                message: 'Name already exists',
            });
        }

        let uploadedImageLinks = [];

        for (const file of files) {
            const driveResponse = await uploadFileToGoogleDrive(file.path, file.filename);
            uploadedImageLinks.push(driveResponse.webViewLink);
            fs.unlinkSync(file.path); // delete local file
        }

        const brand = new brandModel({
            name,
            brandPictures: uploadedImageLinks, // now it's an array of links
            slug: slugify(name)
        });

        await brand.save();

        res.status(201).send({
            success: true,
            message: 'Brand Created Successfully',
            brand,
        });

    } catch (err) {
        console.log('Create Brand Error:', err);
        res.status(500).send({
            success: false,
            message: 'Error in creating Brand',
            err,
        });
    }
};



const getDriveFileId = (url) => {
    const regex = /\/d\/([a-zA-Z0-9_-]+)\//;
    const match = url.match(regex);
    return match ? match[1] : null;
};
// const getBrand = async (req, res) => {
//   try {
//     const brands = await brandModel.find({}).populate('carInvoleInThisBrand');

//     const updatedBrands = brands.map((brand) => {
//       const pictureLinks = Array.isArray(brand.brandPictures)
//   ? brand.brandPictures.map((pic) => {
//         const fileId = getDriveFileId(pic);
//         if (fileId) {
//           return `https://lh3.googleusercontent.com/d/${fileId}=w1000?authuser=0`;
//         }
//         return pic; // fallback if fileId not extracted
//       }):[];

//       // assign updated array back
//       brand.brandPictures = pictureLinks;

//       return brand;
//     });

//     res.status(200).send({
//       success: true,
//       totalBrand: updatedBrands.length,
//       message: 'All Brands',
//       brands: updatedBrands,
//     });
//   } catch (err) {
//     res.status(500).send({
//       success: false,
//       message: 'Error in Getting Brand',
//       err,
//     });
//   }
// };


const getBrand = async (req, res) => {
  try {
    const brands = await brandModel.find({}).populate('carInvoleInThisBrand');

    const updatedBrands = brands.map((brand) => {
      if (Array.isArray(brand.brandPictures)) {
        brand.brandPictures = brand.brandPictures.map((pic) => {
          const fileId = getDriveFileId(pic);
          return fileId ? `https://lh3.googleusercontent.com/d/${fileId}=w1000?authuser=0` : pic;
        });
      } else if (typeof brand.brandPictures === 'string') {
        const fileId = getDriveFileId(brand.brandPictures);
        brand.brandPictures = fileId
          ? `https://lh3.googleusercontent.com/d/${fileId}=w1000?authuser=0`
          : brand.brandPictures;
      } else {
        brand.brandPictures = []; // fallback for safety
      }

      return brand;
    });

    res.status(200).send({
      success: true,
      totalBrand: updatedBrands.length,
      message: 'All Brands',
      brands: updatedBrands,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: 'Error in Getting Brand',
      error: err.message,
    });
  }
};


const getBrandById = async (req, res) => {
    try {
        const brand = await brandModel.findOne({ slug: req.params.slug }).populate('carInvoleInThisBrand');

        if (!brand) {
            return res.status(404).send({
                success: false,
                message: "Brand not found"
            });
        }

        const convertDriveUrl = (url) => {
            const fileId = getDriveFileId(url);
            return fileId ? `https://lh3.googleusercontent.com/d/${fileId}=w1000?authuser=0` : url;
        };

        brand.brandPictures = convertDriveUrl(brand.brandPictures);

        brand.carInvoleInThisBrand.forEach(car => {
            car.productPictures = car.productPictures.map(picture => convertDriveUrl(picture));
        });

        res.status(200).send({
            success: true,
            message: "Brand By this Id",
            brand
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: "Error in Finding Brand Id",
            err
        });
    }
};

const updateBrand = async (req,res) => {
    try{
        const {name} = req.body
        const {id} = req.params

        const brand = await brandModel.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true})
        res.status(200).send({
            success:true,
            message:"Brand Updated Successfully",
            brand
        })
    }catch(err){
        res.status(500).send({
            success:false,
            message:"Error in Updating Brand",
            err
        })
    }
}


const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;

    // First, find the brand by ID
    const brand = await brandModel.findById(id);
    if (!brand) {
      return res.status(404).send({
        success: false,
        message: "Brand not found",
      });
    }

    // Optionally: log the image links if you want to delete from Google Drive later
    // console.log("Deleting brand with images:", brand.brandPictures);

    // Delete the brand from the database
    await brandModel.findByIdAndDelete(id);

    res.status(200).send({
      success: true,
      message: "Brand Deleted Successfully",
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Error in Deleting Brand",
      err,
    });
  }
};

// const deleteBrand = async (req,res) => {
//     try{
//         const {id} = req.params
//         try{
//             for(const x of carModel_.brandPictures){
//                 fs.unlink(path.join(__dirname, '../uploads/',x), (err)=> {
//                     if(err){
//                         throw err;
//                     }
//                 })                
//             }
//         }catch(e){
//             console.log("Delte: " +e)
//         }
//       const brand = await brandModel.findByIdAndDelete(id);
//       if(!brand){
//         res.status(200).send({
//             success:true,
//             message:"Brand Deleted Successfully"
//         })
//       }
        
//     }catch(err){
       

//         res.status(500).send({
//             success:false,
//             message:"Error in Deleting Brand",
//             err
//         })
//     }
// }

module.exports = {getBrand,getBrandById,createBrand,upload,updateBrand,deleteBrand}