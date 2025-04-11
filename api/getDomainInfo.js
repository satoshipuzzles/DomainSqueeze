const fetch = require('node-fetch');

module.exports = async (req, res) => {
    const { domain } = req.body;

    if (!domain) {
        return res.status(400).json({ error: 'Domain is required' });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        console.error('API key not set in environment');
        return res.status(500).json({ error: 'API key is not configured on the server' });
    }

    const prompt = `
Analyze '${domain}' as a domain expert and provide:

- Estimated Value: [Numeric range, e.g., $500-$1,000, with reasoning.]
- Best Use Case: [Detailed use case for '${domain}', e.g., revenue ($X/month), resources (tech stack, team, budget), timeline.]
- Build It Prompt: [Prompt for AI studio to build the best use case for '${domain}'. Use React+Tailwind frontend, Firebase backend, features (e.g., listings, Stripe), resources, Firebase deployment.]
- SEO Audit: [5-10 keywords, backlink strategies, content ideas.]
- Market Trends: [2-3 trends.]
- Domain History: [Suggest WHOIS (https://whois.domaintools.com/${domain}) and archive.org (https://archive.org/web/).]
- Competition Analysis: [Landscape, gaps.]
- Domain Metrics:
  - Search Volume: [Estimate]
  - Competition: [Low/Medium/High]
  - Related Keywords: [5-10]
- Potential Buyers: [3+: Company|Website|Contact Page|Reason.]
- Potential Partnerships: [3+: Company|Website|Contact Page|Reason.]
- Relevant APIs: [3+: API Name: Description.]

Provide concrete data, even if hypothetical.
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
        console.log('OpenAI Raw Response:', responseText);

        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.status} - ${responseText}`);
        }

        let data;
        try {
            data = JSON.parse(responseText);
        } catch (jsonError) {
            throw new Error(`Invalid JSON from OpenAI: ${responseText}`);
        }

        if (!data.choices || !data.choices[0].message.content) {
            throw new Error('No valid content in OpenAI response');
        }

        res.status(200).json({ content: data.choices[0].message.content });
    } catch (error) {
        console.error('Error in getDomainInfo:', error.message);
        res.status(500).json({ error: error.message });
    }
};
