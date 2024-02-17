const axios = require("axios");
async function azureopenai(filecontent) {
  console.log(filecontent["1"], "check");

  let data1 = JSON.stringify({
    messages: [
      {
        role: "system",
        content: `Generate a series of meaningful questions based on the provided user resume. Your questions should cover different sections of the resume, such as skills, experiences, and education. Aim to craft questions that delve into specific details mentioned in the resume and would prompt insightful responses from the user.

        Note: Your questions should be tailored to the content of the user's resume 
        
        Response Format: Provide the questions as an array`,
      },
      {
        role: "user",
        content: filecontent["1"],
      },
    ],
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://openai-test-service.openai.azure.com/openai/deployments/gpt-35-turbo/chat/completions?api-version=2023-05-15",
    headers: {
      "api-key": "9c621621a0f64b7894fa9b4b421e1d29",
      "Content-Type": "application/json",
    },
    data: data1,
  };

  await axios
    .request(config)
    .then((response) => {
      console.log(response.data.choices[0].message.content);
      return response.data.choices[0].message.content;
    })
    .catch((error) => {
      console.log(error);
    });
}
module.exports.azureopenai = azureopenai;

// ` You are helpful assistant.I have trascrition of audio file which is a conversation, The Trascription is
//                          ${JSON.stringify(transcription)}.
//                          Your task is to reply with a best suitable answer from the trascription for the  question.
//                         Question: ${JSON.stringify(prompt)}
//                          Note: You should be reply answer to the question from the audio trascription only.`;
