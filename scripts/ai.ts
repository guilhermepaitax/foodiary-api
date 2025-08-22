import 'dotenv/config';

import OpenAI from 'openai';

const client = new OpenAI();

async function main() {
  const response = await client.chat.completions.create({
    model: 'gpt-4.1-mini',
    messages: [
      {
        role: 'user',
        content: 'me conte uma piada',
      },
    ],
  });

  console.log(JSON.stringify(response, null, 2));
}

main();
