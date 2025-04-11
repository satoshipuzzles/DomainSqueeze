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

    const prompt = `Design a modern logo for '${domain}' reflecting its niche.`;

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

        const responseText = await response.text();
        console.log('Image API Response:', responseText); // Debug

        if (!response.ok) {
            throw new Error(`Image generation failed: ${responseText}`);
        }

        const data = JSON.parse(responseText);
        const imageUrl = data.data[0].url;
        res.status(200).json({ imageUrl });
    } catch (error) {
        console.error('Image API Error:', error);
        res.status(500).json({ error: error.message });
    }
};
