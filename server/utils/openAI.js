async function azureopenai(filecontent) {
  let finaldata = {
    messages: [
      {
        role: "system",
        content: `You are a helpful assistant. User will give you a data, in that data user mentioned  Your role is to prepare question based on filecontent and generate approprite,
        And to verify is it ended with proper explantions or answers or not. The inputed data may a commucation between customer and
         agent regarding an issue.
        `,
      },
      {
        role: "user",
        content: filecontent,
      },
    ],
  };
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: process.env.AZURE_OPENAI_CHAT_COMPLETIONURL,
    headers: {
      "api-key": process.env.AZURE_OPENAI_API_KEY,
      "Content-Type": "application/json",
    },
    data: finaldata,
  };

  try {
    const response = await axios.request(config);
    console.log("Response....", response.data.choices[0]);
    return response.data.choices[0].message.content;
  } catch (error) {
    console.log("Error", error);
    return error;
  }
}
