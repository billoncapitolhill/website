# Website Roadmap

Website Features
 1. Live Bill Tracking:
 • Connects to government APIs (like Congress.gov (https://www.congress.gov/) in the U.S.).
 • Updates proposed bills in real time.
 2. Summarized Data:
 • Automatically extracts key information from the bill, such as:
 • Title
 • Summary
 • Sponsors
 • Committees involved
 • Current status (e.g., proposed, passed, under debate).
 • Simplifies language for easier understanding.
 3. Search and Filter Options:
 • Search by topic (e.g., healthcare, education, environment).
 • Filter by status, date, or sponsor.
 4. Notifications:
 • Alerts for new bills in user-specified categories.
 5. Public Engagement Tools:
 • Contact legislators.
 • Polls on public opinion.

Data Pipeline
 1. Source Data:
 • Use APIs like:
 • Congress.gov API (for U.S. bills).
 • Parliamentary monitoring services for other countries.
 • Scrape public websites if APIs are not available.
 2. Natural Language Processing (NLP):
 • Summarize complex bill texts.
 • Categorize bills by topic.
 • Highlight key sections like funding, penalties, or new policies.
 3. Visualization:
 • Graphs showing trends in legislation.
 • Maps linking bills to regions they affect.

Development Steps
 1. Back-End:
 • Build a server to fetch data from government APIs and process it.
 • Use Python (Flask or Django) or Node.js for scalability.
 2. Front-End:
 • Design user-friendly interfaces using React or Angular.
 • Include search bars, filters, and summaries.
 3. Database:
 • Store bill data and user preferences in a relational database (PostgreSQL).
 4. AI Summarization:
 • Use models like OpenAI’s GPT to summarize bill content dynamically.

Summarized Data Example

Sample Proposed Bill:
 • Title: Affordable Healthcare Expansion Act.
 • Summary: Expands Medicaid eligibility, introduces subsidies for low-income families, and caps prescription drug costs.
 • Sponsor: Sen. Jane Doe (D).
 • Status: Under committee review.
 • Impact:
 • Increases coverage by 15 million people.
 • Estimated cost: $200 billion over 10 years.
 • Public Sentiment:
 • 75% support based on user polls.
