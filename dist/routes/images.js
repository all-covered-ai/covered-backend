"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
require("../types/express");
const router = (0, express_1.Router)();
// Placeholder route - will implement file upload later
router.post('/upload', auth_1.authenticateUser, async (req, res) => {
    res.json({
        success: false,
        error: 'Image upload not yet implemented'
    });
});
router.get('/:id', auth_1.authenticateUser, async (req, res) => {
    res.json({
        success: false,
        error: 'Image retrieval not yet implemented'
    });
});
router.delete('/:id', auth_1.authenticateUser, async (req, res) => {
    res.json({
        success: false,
        error: 'Image deletion not yet implemented'
    });
});
exports.default = router;
//# sourceMappingURL=images.js.map