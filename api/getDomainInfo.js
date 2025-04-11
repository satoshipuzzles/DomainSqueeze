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

    const prompt = `Provide a comprehensive analysis for the domain '${domain}' including:
    - Estimated Value: [value range]
    - Best Use Case: [description]
    - Potential Buyers: [names and contact info]
    - Recent Sale Analysis: [comparable domains and prices]
    - Domain Metrics:
      - Search Volume: [number]
      - Competition: [Low/Medium/High]
      - Related Keywords: [list]`;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 500
            })
        });

        if (!response.ok) {
            throw new Error('API request failed');
        }

        const data = await response.json();
        const content = data.choices[0].message.content;
        res.status(200).json({ content });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
