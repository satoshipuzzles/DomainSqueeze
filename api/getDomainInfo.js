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

    const prompt = `
Provide an extremely detailed analysis of the domain '${domain}' for a corporate client looking to maximize its value. Structure the response as follows:

- Estimated Value: [Provide a value range, e.g., $X-$Y, and explain the factors influencing it]
- Best Use Case: [Go into extreme detail about the primary and best use case for this domain. Estimate how much revenue it can generate, what resources (e.g., technology, team, marketing) are needed to achieve that, and how fast it can be done (timeline).]
- Competition Analysis: [Analyze the competitive landscape for this domain’s niche. Explain how competition can be improved (e.g., SEO strategies, content differentiation). Identify what other companies in this space miss and what they need to succeed.]
- Domain Metrics:
  - Search Volume: [Estimated monthly searches]
  - Competition: [Low/Medium/High]
  - Related Keywords: [List of relevant keywords]
- Potential Buyers: [Provide a table of companies that might be interested in buying the domain. Include company name, contact person, contact info (email or phone), and a compelling reason they would want the domain. Use this format: Company|Contact Person|Contact Info|Reason]
- Potential Partnerships: [Provide a table of companies that would be interested in a partnership (e.g., co-marketing, content collaboration). Include company name, contact person, contact info, and a reason for partnership. Use this format: Company|Contact Person|Contact Info|Reason]
- Relevant APIs: [List APIs that can be leveraged to enhance a platform built on this domain, with descriptions of how they can be used. Format as: API Name: Description]
`;

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
                max_tokens: 1000 // Increased to handle detailed response
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`OpenAI API request failed: ${errorText}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;
        res.status(200).json({ content });
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: error.message });
    }
};
