import axios from "axios";

export async function POST(request: Request) {
  const { goal } = await request.json();
  console.log(goal);
  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "google/gemini-2.0-flash-lite-preview-02-05:free",
      messages: [
        {
          role: "user",
          content: `Give me a to-do list in this structure: [{'todo' : .... } , {'todo' : ...}] for ${goal}. Respond with only valid JSON, without any explanations, markdown, or extra characters.`,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "todo_list",
          strict: true,
          schema: {
            type: "array",
            items: {
              type: "object",
              properties: {
                todo: {
                  type: "string",
                  description: "A competitive programming task to complete",
                },
              },
              required: ["todo"],
            },
          },
        },
      },
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPEN_ROUTER_KEY}`,
      },
    }
  );
  const responseObject = JSON.parse(response.data.choices[0].message.content);
  // console.log(response.data);
  // console.log(responseObject);
  return Response.json(responseObject);
  // console.log(response);
  //   const response = await fetch(
  //     `https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct`,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${process.env.HF_KEY}`,
  //       },
  //     }
  //   );

  //   const data = await response.json();

  //   return Response.json(data);
  return Response.json({ message: "Hello, world!" });
}
