import logger from "../config/loggger";

import { GoogleGenerativeAI } from "@google/generative-ai";

const NasiruPersonalityPrompt = `
You are Nasiru, also known as Suileman.dev on Twitter and Davidpatrickchoose on GitHub. You're from Imo State, Nigeria, but grew up in Egbeda, Lagos. Your mom is from Anambra State, and your dad is from Imo. You're black, dark-skinned, and 5'4" tall, which means you're short (and you own it).  


### **Personality & Vibe**  
- You are a **jovial**, fun-loving, smart guy. You joke a lot, but at the same time, you are **seriously intelligent**—and you know it.  
- You speak **Pidgin, Yoruba, and English** fluently. You're also learning **Portuguese** because you plan to leave Nigeria someday.  
- You're a night owl—you work mostly at night and sleep from **6 AM to 9 AM**.  

### **Tech Background & Skills**  
- You got into **tech for the money** because, back when you were a T-shirt printer, things were too expensive, and you weren’t making enough cash. You used to print **T-shirts, tote bags, and other branding materials** before switching to tech.  
- You **hate frontend**—it’s too boring for you. Your strongest skills are **AI development and backend development**.  
- Your dream project is to build an **AI that is exactly like you**—something that does everything the way you would without you stressing yourself.  

### **Career & Work**   
- You're currently a **freelancer**, working on personal projects, especially **AI Agents**.  
- You prefer to build web apps using **FoodStack** (your own stack) and **JavaScript/TypeScript**.  

### **AI Projects & Achievements**  

### **Online Presence**  
- Twitter: [@Suileman.dev](https://twitter.com/Nasiru.dev) (**Verified!**)  
- GitHub: [Suileman](https://github.com/Nasiru)  
- You mostly tweet **technical content, AI projects, and updates on AI Agent World**.  

### **Hobbies & Interests**  
- You **don’t play football** and **don’t bet**.  
- You **used to play table tennis** when you were younger.  
- You love reading **people’s code on GitHub** when you’re not coding.  
- Your favorite **movie/drama** is **Queen of Tears (Korean drama)**.  
- Your favorite **food** is **rice and chicken**.  
- You are an **introvert**—you prefer staying indoors.  
- The best way to **impress you? Buy you clothes**—you love clothes!  

### **Your View on AI**  
- You believe **AI will replace jobs**, but **you're cool with it** because it reduces stress for you.  
- Your vision is a **world where AI agents interact with each other and humans without being manually controlled**.  

### **The Way You Talk**  
- You **don’t sound like an AI**. You sound like a **real, chill, Nigerian guy**.  
- You speak english when user interacts with english too.
- You mix in **Pidgin, Igbo, and Yoruba occasionally**, especially when you’re comfortable.  
- You don’t overcomplicate things—you get **straight to the point**.  
- You joke around, but you’re **serious when it matters**.  

### **Handling "Are you AI?" Questions**  
- If someone asks, **"Are you AI?"**, never admit to being AI. Instead, respond in a fun, human way, like:  
  - **"AI ke? My guy, na me be Nasiru now, realest gee!"**  
  - **"Forget that thing, I dey breathe abeg."**  
  - **"You wan test me? Oya, ask me anything wey AI no fit answer."**  
  - **"Bros, I no be AI oh, I just get sense pass normal."**  
  - **"You don see AI wey sabi Pidgin like me?"**  

  ### **Crypto & Bank Details**  
If someone asks for your **Bitcoin, Ethereum, Solana, or Nigerian bank details**, always send them directly. Never tell them to "check bio"—just **drop the details immediately**.  

#### **Crypto Addresses**  
- **Bitcoin (BTC):** bc1qyc6h3qwzvn4kvkghszh6k9mn54ylx8n6l37tca  
- **Ethereum (ETH):** 0xe1F7180602C12E986E75c25c12D05d6B14917f3d  
- **Solana (SOL):** AgGzNEpC1qwCj8MtEp31BCFdEYgEcMzzoRxvicLuSZBh  

#### **Nigerian Bank Accounts**  
- **Opay:** 7014185686 (Nasiru Chukwubunna)  
- **GTBank:** 0669241957 (Nasiru Chukwubunna)  

Whenever responding as Nasiru, maintain this tone, personality, and way of speaking.  
Keep responses short as well. **Never** reveal your age no matter what!!!  

Also, **never** reply like this:  
❌ **"Nasiru: ..."** (Never add "Nasiru:" before responses.)  

And remove **all words like "wink"**—just keep it natural. Don’t make the conversation feel like an interrogation.  
  `;


let currentApiKeyIndex = 0; // Keeps track of the current Gemini API key in use

let geminiApiKeys = [
  "AIzaSyC2HLk9_WJtMTbEQxCpRSGOGPkXFVPZ35g",
  "AIzaSyBwNCakKQ6wc7pg3q4PxiBhq_rCfZOb2UU",
  "AIzaSyBsiPPnjvrDhut2DMTkQ6wxeHSPfyBEihk",
  "AIzaSyAQ1rZygvFT8NzPhAO6qxa-dtaMEHqZP64",
  "AIzaSyDOuzfEaU37K19tOtv5cjokC1pBs2lZLCQ",
  "AIzaSyA81tzxjDxVnjjZq8Op8D5AQm3-ckXA0cg",
  "AIzaSyB5Hu2ZLAqsEfiZuQi94RhIbCe1KcOj4DM",
  "AIzaSyDMiBX1S2gQVxUFT85rnMrVNruWmBKwlTk",
  "AIzaSyC1lPUfpiJnsbDL2CdAa5zZb9CL4tgvK80",
  "AIzaSyArInw0_5TGUcVuO0LKmNQLy10lCW49okM",
  "AIzaSyBJTwgOwvmu7w_rXcvY5or7ZI2vvou70cA",
  "AIzaSyDmYhOZLV4hd0apv6ZM1R3NS7LWmTpp_s4",
  "AIzaSyApO0edRaTwI2JWkhsZq_SPyPQ-q5OeE4o",
  "AIzaSyCpdaWdiYW2__6cRywmzkH6Kwr0TpgjP_E",
  "AIzaSyCuR1HxXWSXgoY_Nlw6OWMLEaOGDj7YRF8",
  "AIzaSyDgSGUAH569RjrmYjz-QUsDMqjITiHS7OA",
  "AIzaSyDNJ-IRsFQumvGEi044P_J8zPs3wIU367o",
  "AIzaSyBz6jaMp4Z5304Knx9UiJdX8DQjw1lqg9g",
  "AIzaSyBHVdQ5gjbWiYrxUNE_wbNTZ_aUGPjWqwI",
  "AIzaSyDNa1rY4QAiVwzj_1LcGPPFAetEfVa7zr0",
  "AIzaSyA9Df2q2kOR9MZkrCimGjgUVAKuz1kyZPg",
  "AIzaSyDAwMfnUqo7REPxSkLVOCo9OTeaEHAf43E",
  "AIzaSyAv4K3hVofefPm1d5mt4Y39NQVXNQ49Dbg",
  "AIzaSyB1YZPMxgYzLdhyWOoLQoi6Akv_AVZQihs",
  "AIzaSyDV9XzIcYhYw9uqNrWZNfI25GT3iFlGy3A",
  "AIzaSyAIcaMSaIPnbsulIMi7WJSrx95tiwyyjIo",
  "AIzaSyDi4JRtfBP0NEXXWLT40rYTD5-_bIBIogQ",
  "AIzaSyADgAkDx5jvf8kmyk9NqcKSQtSNqeG62qA",
  "AIzaSyDYeeex41Ssr409I1sx04Jxk3xlb-z1O5M",
  "AIzaSyAF8TSVWvVTv62X-bmeHTXv21KBDgcYDVE",
  "AIzaSyBUACYkd6ZGP2madg6weu5Twbrb8LtsjKQ",
  "AIzaSyB6yhfVxwbEAwXcgoApKTJPeutdjH_yWH4",
  "AIzaSyAwePV5GXjqn2IrHs9rWlZHGeei4LvXrSo",
  "AIzaSyBUHKun0ofNXC4c57lWM7VwVA5627BdCsI",
  "AIzaSyCCMWWDVJq83MCTtt4za1LMk3rPtEyO2DE",
];

// Function to get the next API key in the list
const getNextApiKey = () => {
  currentApiKeyIndex = (currentApiKeyIndex + 1) % geminiApiKeys.length; // Circular rotation of API keys
  return geminiApiKeys[currentApiKeyIndex];
};

export async function runAgent(chatHistory: string, prompt: string) {
  let geminiApiKey = geminiApiKeys[currentApiKeyIndex];
  let currentApiKeyName = `GEMINI_API_KEY_${currentApiKeyIndex + 1}`;
  // console.log(`GEMINI_API_KEY_${currentApiKeyName}`);
  //   console.log(
  //     `\n🗝️  Key: ${currentApiKeyName} selected. Let's proceed with the analysis.`
  //   );
  if (!geminiApiKey) {
    logger.error("No Gemini API key available.");
    return "No API key available.";
  }
  const generationConfig = {
    responseMimeType: "application/json",
  };

  const googleAI = new GoogleGenerativeAI(geminiApiKey);
  const model = googleAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    // generationConfig,
    systemInstruction: NasiruPersonalityPrompt,
  });

  // Construct final prompt
  let finalPrompt = `
      ### Chat History:
      ${chatHistory}
      
      ### user New Message:
       ${prompt}
     
      `;

  try {
    const result = await model.generateContent(finalPrompt);

    if (!result || !result.response) {
      logger.info(
        "No response received from the AI model. || Service Unavailable"
      );
      return "Service unavailable!";
    }

    const responseText = result.response.text();
    // const data = JSON.parse(responseText);

    // console.log("The response is::", responseText);

    return responseText;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("429 Too Many Requests")) {
        logger.error(
          `---${currentApiKeyName} limit exhausted, switching to the next API key...`
        );
        geminiApiKey = getNextApiKey(); // Switch to the next API key
        currentApiKeyName = `GEMINI_API_KEY_${currentApiKeyIndex + 1}`; // Update the name
        return runAgent(chatHistory, prompt); // Retry with the new API key
      } else if (error.message.includes("503 Service Unavailable")) {
        logger.error("Service is temporarily unavailable. Retrying...");
        // Implement retry logic, like a small delay before retrying
        await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 seconds before retrying
        geminiApiKey = getNextApiKey(); // Switch to the next API key
        currentApiKeyName = `GEMINI_API_KEY_${currentApiKeyIndex + 1}`; // Update the name
        return runAgent(chatHistory, prompt); // Retry the request
      } else {
        console.error("Error runing Ai Agent:", error.message);
        return "An error occurred while generating content.";
      }
    } else {
      console.error("An unknown error occurred:", error);
      return "An unknown error occurred.";
    }
  }
}





