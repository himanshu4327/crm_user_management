const Center = require("../models/centerModel");

// CREATE Center
exports.createCenter = async (req, res) => {
    try {
        const { name, location } = req.body;

        const existing = await Center.findOne({ name });
        if (existing) {
            return res.status(400).json({
                status: false,
                message: "Center already exists"
            });
        }

        const center = await Center.create({ name, location });

        res.status(201).json({
            status: true,
            message: "Center created successfully",
            data: center
        });
    } catch (error) {
        console.error("Create Center Error:", error);
        res.status(500).json({ status: false, message: "Server error" });
    }
};

// GET All Centers
exports.getCenters = async (req, res) => {
    try {
        const centers = await Center.find().sort({ createdAt: -1 });

        res.status(200).json({
            status: true,
            data: centers
        });
    } catch (error) {
        console.error("Get Centers Error:", error);
        res.status(500).json({ status: false, message: "Server error" });
    }
};

// GET Single Center
exports.getCenterById = async (req, res) => {
    try {
        const { id } = req.params;
        const center = await Center.findById(id);

        if (!center) {
            return res.status(404).json({
                status: false,
                message: "Center not found"
            });
        }

        res.status(200).json({
            status: true,
            data: center
        });
    } catch (error) {
        console.error("Get Center Error:", error);
        res.status(500).json({ status: false, message: "Server error" });
    }
};

// UPDATE Center
exports.updateCenter = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, location } = req.body;

        const center = await Center.findByIdAndUpdate(
            id,
            { name, location },
            { new: true }
        );

        if (!center) {
            return res.status(404).json({
                status: false,
                message: "Center not found"
            });
        }

        res.status(200).json({
            status: true,
            message: "Center updated successfully",
            data: center
        });
    } catch (error) {
        console.error("Update Center Error:", error);
        res.status(500).json({ status: false, message: "Server error" });
    }
};

// DELETE Center
exports.deleteCenter = async (req, res) => {
    try {
        const { id } = req.params;

        const center = await Center.findByIdAndDelete(id);

        if (!center) {
            return res.status(404).json({
                status: false,
                message: "Center not found"
            });
        }

        res.status(200).json({
            status: true,
            message: "Center deleted successfully"
        });
    } catch (error) {
        console.error("Delete Center Error:", error);
        res.status(500).json({ status: false, message: "Server error" });
    }
};
