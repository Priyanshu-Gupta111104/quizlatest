import Result from '../models/result.js';

export const getResults = async (req, res) => {
    try {
        const results = await Result.find().sort({ score: -1 });
        res.status(200).json(results);
    } catch (error) {
        console.error("❌ Error fetching results:", error);
        res.status(500).json({ error: 'Failed to fetch results' });
    }
};
