const fetch = require('node-fetch');

module.exports = async (req, res) => {
    const { domain } = req.body;

    if (!domain) {
        return res.status(400).json({ error: 'Domain is required' });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'API key is not set' });
    }

    const prompt = `Design a modern, professional logo for the domain '${domain}' that reflects its potential niche or use case. Use bold colors and clean lines.`;

    try {
        const response = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'dall-e-3',
                prompt: prompt,
                n: 1,
                size: '1024x1024'
            })
        });

        if (!response.ok) {
            throw new Error('Image generation failed');
        }

        const data = await response.json();
        const imageUrl = data.data[0].url;
        res.status(200).json({ imageUrl });
    } catch (error) {
        console.error('Image API Error:', error);
        res.status(500).json({ error: error.message });
    }
};
