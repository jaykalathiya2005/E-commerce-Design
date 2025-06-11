const design = require('../models/Design.models');

exports.createDesign = async (req, res) => {
    try {
        let { userId, title, description, price } = req.body

        // let checkDesignNameIsExist = await design.findOne({ DesignName })

        // if (checkDesignNameIsExist) {
        //     return res.status(409).json({ status: 409, success: false, message: "DesignName already exist" })
        // }

        if (!req.files) {
            return res.status(403).json({ status: 403, success: false, message: "Image Filed Is required" })
        }
        const images = req.files
        let checkDesignNameIsExist = await design.create({
            userId,
            title,
            description,
            price,
            images: images.map(file => file.path)
        })

        return res.status(200).json({ status: 201, success: true, message: "Design Create successFully....", Design: checkDesignNameIsExist })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, success: false, message: error.message })
    }
}

exports.getAlldesign = async (req, res) => {
    try {
        let paginateddesign = await design.find();

        let count = paginateddesign.length;

        return res.json({ status: 200, TotalDesign: count, message: 'All Design Found Successfully..', Design: paginateddesign })

    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
}

exports.getdesignById = async (req, res) => {
    try {
        const designbyId = await design.findById(req.params.id);
        if (!designbyId) {
            return res.status(404).json({
                status: 404,
                message: "design not found",
            });
        } else {
            return res.status(200).json({
                status: 200,
                message: "design found successfully",
                Design: designbyId,
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 500,
            message: error.message,
        });
    }
};

exports.deleteDesign = async (req, res) => {
    try {
        let id = req.params.id;

        let checkDesign = design.findById(id);

        if (!checkDesign) {
            return res.json({ status: 404, message: "Design Not Found" })
        }

        checkDesign = await design.findByIdAndDelete(id);

        return res.json({ status: 200, message: "Design Removed Successfully.." })
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
}

// exports.updateDesign = async (req, res) => {
//     try {
//         let id = req.params.id;

//         let checkDesign = design.findById(id);

//         if (!checkDesign) {
//             return res.json({ status: 404, message: "Design Not Found" })
//         }

//         checkDesign = await design.findByIdAndUpdate(id, { ...req.body }, { new: true });

//         return res.json({ status: 200, message: "Design Updated Successfully..", Design: checkDesign })

//     } catch (error) {
//         res.json({ status: 500, message: error.message });
//         console.log(error);
//     }
// };

exports.updateDesign = async (req, res) => {
    try {
        const id = req.params.id;
        let updateDesignId = await design.findById(id);

        if (!updateDesignId) {
            return res.status(404).json({ status: 404, success: false, message: "Design Not Found" });
        }
        let imagesToKeep = [];
        if (req.body.existingImages) {
            try {
                imagesToKeep = JSON.parse(req.body.existingImages);
            } catch (error) {
                console.error("Error parsing existingImages:", error);
                return res.status(400).json({ status: 400, success: false, message: "Invalid image data format" });
            }
        }

        let newImages = [];
        if (req.files) {
            const files = req.files;
            newImages = files.map(file => file.path);
        }

        const combinedImages = [...imagesToKeep, ...newImages];

        // Build update object
        const updateData = {
            userId: req.body.userId,
            title: req.body.title,
            price: req.body.price,
            description: req.body.description,
            images: combinedImages,
        };

        const updatedDesign = await design.findByIdAndUpdate(id, updateData, { new: true });

        return res.status(200).json({
            status: 200,
            success: true,
            message: "Design Updated Successfully",
            data: updatedDesign
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, success: false, message: error.message });
    }
};