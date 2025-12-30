const express = require('express');
const multer = require('multer');
const router = express.Router();
const supabase = require('../config/supabaseClient');
const { protect, admin } = require('../middleware/authMiddleware');

const storage = multer.memoryStorage();
const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed!'));
        }
        cb(null, true);
    }
});

router.post('/', protect, admin, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            res.status(400);
            throw new Error('No file uploaded');
        }

        const file = req.file;
        const fileExt = file.originalname.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { data, error } = await supabase
            .storage
            .from('images')
            .upload(filePath, file.buffer, {
                contentType: file.mimetype
            });

        if (error) {
            throw error;
        }

        const { data: { publicUrl } } = supabase
            .storage
            .from('images')
            .getPublicUrl(filePath);

        res.send(publicUrl);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: error.message });
    }
});

module.exports = router;
