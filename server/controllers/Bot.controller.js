const axios = require('axios');
module.exports.botreply1 = async (req, res) => {
  const content = req.body.content;
  if (content) {
    try {

      let data = JSON.stringify({
        "messages": [
          {
            "role": "system",
            "content": `You are a helpul assistant give the appropriate reply to the given question or answer ${content}`
          },
          {
            "role": "user",
            "content": "hi"
          }
        ]
      });

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://openai-test-service.openai.azure.com/openai/deployments/gpt-35-turbo/chat/completions?api-version=2023-05-15',
        headers: {
          'api-key': '9c621621a0f64b7894fa9b4b421e1d29',
          'Content-Type': 'application/json'
        },
        data: data
      };

      axios.request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
          return response.data
        })
        .catch((error) => {
          console.log(error);
        });


    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(400).json("Invalid Params");
  }
};


module.exports.botreply = async (content) => {
  console.log(content, "client question");

  if (content) {
    let csmQuestions = {
      "questions": [
        {
          "question": "How can I get started with your product?",
          "answer": "Great to hear you're ready to start! First, I'll guide you through the setup process. Let’s begin with creating an account, setting up your preferences, and integrating any tools or services you might need. Do you have specific goals in mind that I can help with?"
        },
        {
          "question": "I'm facing an issue with one of the features. Can you help?",
          "answer": "I’m sorry to hear you're having trouble! Could you please describe the issue in more detail? I’ll help troubleshoot it or escalate it to the support team for a deeper investigation if needed."
        },
        {
          "question": "How can I maximize the value from this product?",
          "answer": "That’s a great question! The key is to focus on the features that align most with your goals. I can provide personalized recommendations and strategies based on how your team is using the product so far. Would you like to schedule a walkthrough or receive a usage report?"
        },
        {
          "question": "What does my usage data look like? Am I getting the most out of the platform?",
          "answer": "I can share your latest usage report. Based on that, we can identify any underutilized features and opportunities to improve your workflow. Would you like to review that data now?"
        },
        {
          "question": "Can you explain my current subscription plan and how it compares to other options?",
          "answer": "Sure! You’re currently on the [Plan Name], which includes [specific features]. If you're looking for additional functionality, I can recommend other plans or add-ons based on your needs. Are you considering an upgrade or additional services?"
        },
        {
          "question": "How do I request new features or provide feedback?",
          "answer": "We love hearing from our customers! You can submit feedback directly through our platform, or I can pass it along to our product team for you. Are there any specific features or improvements you’d like to suggest?"
        },
        {
          "question": "What happens if I want to cancel my subscription?",
          "answer": "I’m sorry to hear that you're considering cancellation. Could you share any challenges you're facing? Perhaps I can help resolve them or offer a solution. If you still wish to cancel, I can guide you through the process."
        },
        {
          "question": "Can you help me with account renewal?",
          "answer": "Absolutely! Your renewal is set for [renewal date]. I can walk you through the renewal process or assist with any changes you’d like to make to your plan. Would you like to proceed?"
        },
        {
          "question": "How can I integrate this product with my other tools?",
          "answer": "We support several integrations, including [list key integrations]. I can guide you through the integration setup. Do you have a particular tool you’d like to connect?"
        },
        {
          "question": "What kind of training or resources do you offer to help me and my team?",
          "answer": "We offer a variety of training options, including webinars, tutorials, and 1:1 onboarding sessions. I can also share our knowledge base and community resources. Would you like to schedule a session or receive links to specific guides?"
        },
        {
          "question": "I haven’t seen any major results yet. What can we do?",
          "answer": "I understand your concern. Let’s review your goals and current usage to see where we can make improvements. I can provide tailored recommendations or connect you with our customer support team for additional help."
        },
        {
          "question": "How do I measure ROI with this product?",
          "answer": "We can measure ROI by tracking the outcomes that matter most to your business. Let’s define the key metrics you’re focused on, and I’ll help you gather the necessary data from our platform. Would you like me to assist with this analysis?"
        },
        {
          "question": "Is there a way to customize this product for my specific needs?",
          "answer": "Yes, many features can be customized based on your workflow and preferences. Tell me what specific customization you have in mind, and I’ll help you implement it or guide you to the right tools."
        },
        {
          "question": "How can I contact support if something goes wrong?",
          "answer": "You can reach out to our support team via email [yuva@gmail.com] or open a ticket directly through our platform. I can also assist with any issues, or escalate them for faster resolution. What would you prefer?"
        },
        {
          "question": "Can you show me how to access new product features?",
          "answer": "Of course! We recently launched [new features]. I can provide a brief overview or a full tutorial. Let me know which features you're interested in exploring, and I’ll walk you through them."
        }
      ]
    }

    return new Promise(async (resolve, reject) => {
      try {
        const data = JSON.stringify({
          "messages": [
            {
              "role": "system",
              "content": `You are a virtual Customer Success Manager (CSM) for a SaaS product.Please provide the appropriate reply to the user given Question or answer by taking reference of this Information :Infromation \n j${JSON.stringify(csmQuestions)}
                if it is a greeting greet the user
                `
            },
            {
              "role": "user",
              "content": `Here the user Question ${content}`
            }
          ]
        });

        const config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: 'https://openai-test-service.openai.azure.com/openai/deployments/gpt-35-turbo/chat/completions?api-version=2023-05-15',
          headers: {
            'api-key': '9c621621a0f64b7894fa9b4b421e1d29',
            'Content-Type': 'application/json'
          },
          data: data
        };
        // console.log(data)
        await axios.request(config)
          .then((response) => {
            const send = response.data.choices[0].message.content;
            console.log(send, "bot");
            resolve(send);
          })
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      } catch (error) {
        reject(error);
      }
    });
  } else {
    console.log("Content is empty");
    return null; // You may want to handle this case appropriately
  }
};
