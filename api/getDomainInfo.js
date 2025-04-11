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
Imagine you’re a domain expert analyzing '${domain}' for a client. Provide a detailed report:

- Estimated Value: [Give a numeric range, e.g., $500-$1,000, with reasoning.]
- Best Use Case: [Detail the best use for '${domain}', e.g., revenue ($X/month), resources (tech stack, team, budget), timeline (e.g., 3-6 months).]
- Build It Prompt: [Prompt for an AI studio to build the best use case for '${domain}'. Include React+Tailwind frontend, Firebase backend, features (e.g., listings, Stripe payments), resources, and Firebase deployment.]
- SEO Audit: [5-10 keywords, backlink strategies, content ideas.]
- Market Trends: [2-3 trends relevant to '${domain}'.]
- Domain History: [Suggest WHOIS (https://whois.domaintools.com/${domain}) and archive.org (https://archive.org/web/).]
- Competition Analysis: [Competitive landscape, gaps to exploit.]
- Domain Metrics:
  - Search Volume: [Estimate, e.g., 1,000-5,000]
  - Competition: [Low/Medium/High]
  - Related Keywords: [5-10 keywords]
- Potential Buyers: [3+ companies: Company|Website|Contact Page|Reason.]
- Potential Partnerships: [3+ companies: Company|Website|Contact Page|Reason.]
- Relevant APIs: [3+ APIs: API Name: Description.]

Always provide concrete data, even if hypothetical.
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
                max_tokens: 2000
            })
        });

        const responseText = await response.text();
        console.log('OpenAI Response:', responseText); // Debug

        if (!response.ok) {
            throw new Error(`OpenAI API failed: ${responseText}`);
        }

        const data = JSON.parse(responseText);
        res.status(200).json({ content: data.choices[0].message.content });
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: error.message });
    }
};
