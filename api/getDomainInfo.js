const fetch = require('node-fetch');

module.exports = async (req, res) => {
    console.log('Received request:', req.body);
    const { domain } = req.body;

    if (!domain) {
        console.log('Domain is missing');
        return res.status(400).json({ error: 'Domain is required' });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        console.log('API key is not set');
        return res.status(500).json({ error: 'API key is not set' });
    }

    const prompt = `Please provide the following information for the domain '${domain}':\n\n` +
                   `Estimated Value: [value]\n` +
                   `Best Use Case: [description]\n` +
                   `Who to Sell To: [suggestions]\n` +
                   `Domain Metrics:\n- Estimated Search Volume: [number]\n- Other metrics: [details]`;

    try {
        console.log('Sending request to OpenAI');
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

        const responseBody = await response.text();
        console.log('OpenAI response status:', response.status);
        console.log('OpenAI response body:', responseBody);

        if (!response.ok) {
            throw new Error(`OpenAI API request failed: ${response.status} ${responseBody}`);
        }

        const data = JSON.parse(responseBody);
        const content = data.choices[0].message.content;
        res.status(200).json({ content });
    } catch (error) {
        console.error('Error in serverless function:', error);
        res.status(500).json({ error: error.message });
    }
};
