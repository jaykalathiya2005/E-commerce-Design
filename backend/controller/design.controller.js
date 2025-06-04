const design = require('../models/Design.models');

exports.createDesign = async (req, res) => {
    try {
        let { userId, title, description } = req.body

        // let checkDesignNameIsExist = await design.findOne({ DesignName })

        // if (checkDesignNameIsExist) {
        //     return res.status(409).json({ status: 409, success: false, message: "DesignName already exist" })
        // }

        if (!req.files) {
            return res.status(403).json({ status: 403, success: false, message: "Image Filed Is required" })
        }
        const images = req.files
        console.log('image', images);
        let checkDesignNameIsExist = await design.create({
            userId,
            title,
            description,
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
        const design = await design.findById(req.params.id);
        if (!design) {
            return res.status(404).json({
                status: 404,
                message: "design not found",
            });
        } else {
            return res.status(200).json({
                status: 200,
                message: "design found successfully",
                design,
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