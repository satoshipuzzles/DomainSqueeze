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
Imagine you’re a domain valuation and development expert analyzing '${domain}' for a client who wants to maximize its potential. Provide a detailed report structured as follows, ensuring every section is filled with actionable insights. If unsure, make educated guesses based on typical domain trends and explain your reasoning.

- Estimated Value: [Hypothetically, what would this domain be worth on the market? Provide a specific numeric range, e.g., $500-$1,000, based on factors like keyword strength, TLD appeal, and niche demand. Explain your logic.]
- Best Use Case: [Describe in extreme detail the primary and best use case for '${domain}'. Estimate potential revenue (e.g., $X/month), required resources (e.g., tech stack like React+Firebase, 3-person team, $5k marketing budget), and timeline (e.g., 3-6 months to profitability). Include SEO strategies, content ideas, and monetization methods like ads or e-commerce.]
- Build It Prompt: [Provide a detailed prompt the user can copy into an AI studio (e.g., Replit or Firebase) to build the best use case for '${domain}'. Include: 1) Frontend (React, Tailwind), 2) Backend (Firebase), 3) Features (e.g., listings, payments via Stripe), 4) Resources (tech stack, team, budget), 5) Deployment (Firebase Hosting). Tailor it to the Best Use Case above.]
- SEO Audit: [Suggest 5-10 keywords, backlink strategies (e.g., guest posts on niche blogs), and content ideas (e.g., blog posts, landing pages) tailored to '${domain}'.]
- Market Trends: [Highlight 2-3 current industry trends relevant to '${domain}’s niche, e.g., "e-commerce growth" or "AI adoption".]
- Domain History: [Suggest checking historical data with tools like WHOIS (https://whois.domaintools.com/${domain}) and archive.org (https://archive.org/web/). Provide a brief hypothetical history if no data is assumed.]
- Competition Analysis: [Analyze the competitive landscape for '${domain}’s niche. Detail how to outperform competitors (e.g., better UX, unique content). Identify 2-3 gaps competitors miss and how to exploit them.]
- Domain Metrics:
  - Search Volume: [Estimate monthly searches, e.g., 1,000-5,000]
  - Competition: [Low/Medium/High]
  - Related Keywords: [List 5-10 keywords]
- Potential Buyers: [List 3+ companies interested in buying. Format: Company|Website|Contact Page|Reason. Use real websites (e.g., https://company.com) and contact pages (e.g., https://company.com/contact).]
- Potential Partnerships: [List 3+ companies for partnerships. Format: Company|Website|Contact Page|Reason.]
- Relevant APIs: [List 3+ APIs to enhance a platform on '${domain}'. Format: API Name: Description.]

Ensure every section has concrete, actionable data. For Estimated Value, always provide a numeric range and justification, even if hypothetical. Tailor the Build It Prompt to the specific Best Use Case provided.
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
                max_tokens: 2500 // Increased for build prompt
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
