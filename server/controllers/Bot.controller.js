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
    let csmQuestions = [
      {
        "question_id": 1,
        "question": "How can I reset my password?",
        "answer": "To reset your password, go to the login page of yuva.com and click on 'Forgot Password.' You'll receive a password reset link via email.",
        "category": "Account Management",
        "priority": "High"
      },
      {
        "question_id": 2,
        "question": "What are the payment methods available?",
        "answer": "We accept credit/debit cards, PayPal, and direct bank transfers. Additional methods may be available depending on your location.",
        "category": "Billing",
        "priority": "Medium"
      },
      {
        "question_id": 3,
        "question": "How do I track my order?",
        "answer": "Once your order has been shipped, you will receive an email with a tracking number and a link to track your shipment.",
        "category": "Orders and Shipping",
        "priority": "High"
      },
      {
        "question_id": 4,
        "question": "Can I change the delivery address after placing an order?",
        "answer": "You can change the delivery address if the order hasn’t been shipped. Contact customer support for assistance.",
        "category": "Orders and Shipping",
        "priority": "Medium"
      },
      {
        "question_id": 5,
        "question": "How do I update my contact information?",
        "answer": "You can update your contact information by logging into your account and navigating to the 'Account Settings' section.",
        "category": "Account Management",
        "priority": "Low"
      },
      {
        "question_id": 6,
        "question": "Why was my payment declined?",
        "answer": "Payments can be declined for several reasons, such as incorrect card details or insufficient funds. Please check with your bank for more details.",
        "category": "Billing",
        "priority": "High"
      },
      {
        "question_id": 7,
        "question": "Can I cancel my subscription at any time?",
        "answer": "Yes, you can cancel your subscription anytime through the 'Subscription' section in your account settings.",
        "category": "Subscription",
        "priority": "Medium"
      },
      {
        "question_id": 8,
        "question": "How do I contact customer support?",
        "answer": "You can contact customer support through our website’s 'Contact Us' page or by calling our support line at 1-800-123-4567.",
        "category": "General Inquiry",
        "priority": "Low"
      },
      {
        "question_id": 9,
        "question": "What is your return policy?",
        "answer": "You can return items within 30 days of purchase for a full refund, provided they are in their original condition.",
        "category": "Returns and Refunds",
        "priority": "Medium"
      },
      {
        "question_id": 10,
        "question": "How long does it take to process a refund?",
        "answer": "Refunds are typically processed within 5-7 business days after we receive your returned item.",
        "category": "Returns and Refunds",
        "priority": "Medium"
      }
    ]
    

    return new Promise(async (resolve, reject) => {
      try {
        const data = JSON.stringify({
          "messages": [
            {
              "role": "system",
              "content": `You are a virtual Customer Success Manager (CSM) .Please provide the appropriate reply to the user given Question or answer by taking reference of this Information :Infromation \n j${JSON.stringify(csmQuestions)}
                if it is a greeting greet the user Note :The answer should be straight forward
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
