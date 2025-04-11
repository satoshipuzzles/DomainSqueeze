// Temporarily disabled to focus on core data
module.exports = async (req, res) => {
    res.status(200).json({ error: 'Image generation disabled for debugging' });
};
