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
Provide an extremely detailed analysis of the domain '${domain}' for a corporate client aiming to maximize its value. Structure the response as follows:

- Estimated Value: [Provide a specific numeric range, e.g., $500-$1,000, and explain factors like keyword demand, TLD rarity, and market trends]
- Best Use Case: [Go into extreme detail about the primary and best use case for this domain. Estimate potential revenue (e.g., $X/month), required resources (e.g., tech stack, team size, marketing budget), and timeline (e.g., 3-6 months to profitability). Include SEO strategies, content ideas, and monetization methods.]
- Competition Analysis: [Analyze the competitive landscape for this domain’s niche. Detail how to outperform competitors (e.g., better UX, unique content). Identify what competitors miss and what they need to succeed.]
- Domain Metrics:
  - Search Volume: [Estimated monthly searches]
  - Competition: [Low/Medium/High]
  - Related Keywords: [List of 5-10 keywords]
- Potential Buyers: [List at least 3 companies interested in buying. Include: Company|Website|Contact Page|Reason. Use real company websites (e.g., https://company.com) and contact pages (e.g., https://company.com/contact).]
- Potential Partnerships: [List at least 3 companies for partnerships. Include: Company|Website|Contact Page|Reason. Use real company websites and contact pages.]
- Relevant APIs: [List 3+ APIs to enhance a platform on this domain. Format as: API Name: Description (e.g., how it integrates).]

Ensure all data is actionable and detailed. If exact contact info isn’t available, provide company websites and contact pages. Never return "N/A" for Estimated Value—provide a fallback range if unsure.
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
                max_tokens: 1500 // Increased for detailed output
            })
        });

        if (!response.ok) {
            throw new Error('OpenAI API request failed');
        }

        const data = await response.json();
        res.status(200).json({ content: data.choices[0].message.content });
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: error.message });
    }
};
