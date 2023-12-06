# Memory GPT

Memory GPT is a chatbot project that enhances ChatGPT with long-term memory capabilities, making conversations more fun and personal. The project runs on OpenAI's GPT-3.5-turbo by default, but this can be configured in the .env file.

The memory-retrieval algorithm fetches the most relevant message-response pairs from its memory based on a composite score. This score considers the recency of the message, its importance, and similarity to the current context. Min-max scaling is applied to each dimension to normalize the scores before combining them. The algorithm is inspired by (and closely resembles) the one presented in the paper [Generative Agents: Interactive Simulacra of Human Behavior](https://arxiv.org/abs/2304.03442) by Joon Sung Park, Joseph C. O'Brien, Carrie J. Cai, Meredith Ringel Morris, Percy Liang, and Michael S. Bernstein.


## Getting Started
1. Install the required dependencies:

`pip install -r requirements.txt`


1. Create a `.env` file in the project's root directory by copying the `.env.template` file:

`cp .env.template .env`


3. Edit the `.env` file and fill in the following information:


```
OPENAI_API_KEY=your-openai-api-key

PINECONE_API_KEY=your-pinecone-api-key

PINECONE_ENVIRONMENT=your-pinecone-environment

PINECONE_TABLE_NAME=your-table-name

GPT_MODEL=gpt-3.5-turbo
```


Replace the placeholders with your actual API keys and other required information. You can use gpt-4 if you want as well.

4. Run the `main.py` file:

`python main.py`

By default, the project runs on GPT-3.5-turbo. You can configure the model in the `.env` file.

Enjoy more engaging and context-aware conversations with Memory GPT!
