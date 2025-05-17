import { GoogleGenAI, createUserContent, createPartFromUri } from "@google/genai";
import fs from "fs";
import path from "path";
import mime from "mime-types";

export class ImageProcessor {
    private apiKeys: string[];
    private currentApiKeyIndex: number;
    private ai: GoogleGenAI;

    constructor() {
        // Initialize the list of API keys
        this.apiKeys = [
            "AIzaSyDAwMfnUqo7REPxSkLVOCo9OTeaEHAf43E",
            "AIzaSyAv4K3hVofefPm1d5mt4Y39NQVXNQ49Dbg",
            "AIzaSyB1YZPMxgYzLdhyWOoLQoi6Akv_AVZQihs",
            "AIzaSyDV9XzIcYhYw9uqNrWZNfI25GT3iFlGy3A",
            "AIzaSyAIcaMSaIPnbsulIMi7WJSrx95tiwyyjIo",
            "AIzaSyDi4JRtfBP0NEXXWLT40rYTD5-_bIBIogQ",
            "AIzaSyADgAkDx5jvf8kmyk9NqcKSQtSNqeG62qA",
            "AIzaSyDYeeex41Ssr409I1sx04Jxk3xlb-z1O5M",
        ];
        this.currentApiKeyIndex = 0;
        this.ai = new GoogleGenAI({ apiKey: this.apiKeys[this.currentApiKeyIndex] });
    }

    // Method to switch to the next API key if the current one fails
    private switchApiKey(): void {
        this.currentApiKeyIndex = (this.currentApiKeyIndex + 1) % this.apiKeys.length;
        this.ai = new GoogleGenAI({ apiKey: this.apiKeys[this.currentApiKeyIndex] });
        console.log(`🔄 Switched to API key: ${this.currentApiKeyIndex + 1}`);
    }

    // Method to process multiple image files
    private async processImages(images: string[], retryCount: number = 0, maxRetries: number = 3): Promise<any> {
        try {
            // Upload all images concurrently
            const uploadedFiles = await Promise.all(
                images.map(async (imageName) => {
                    const filePath = path.resolve(__dirname, "../../../downloads/images", imageName);

                    // Check if the file exists at the resolved path
                    if (!fs.existsSync(filePath)) {
                        throw new Error(`File not found: ${filePath}`);
                    }

                    // Log the local file name instead of uploading
                    console.log(`Uploading local file: ${imageName}`);

                    // Determine MIME type using mime-types
                    const mimeType = mime.lookup(imageName);
                    if (!mimeType || !mimeType.startsWith('image/')) {
                        throw new Error('Unsupported file format.');
                    }

                    // Upload the image file to Gemini server
                    const uploadedFile = await this.ai.files.upload({
                        file: filePath,
                        config: { mimeType: mimeType }, // Use the detected MIME type
                    });

                    return uploadedFile;
                })
            );

            // Create parts for each uploaded image using their URIs
            const imageParts = uploadedFiles.map((uploadedFile) =>
                createPartFromUri(uploadedFile.uri!, uploadedFile.mimeType!)
            );

            // System prompt for image duplication check

            const systemPrompt = `
            
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
Response:
{
  "message" : "response....",
}
`;

            // Generate content using Gemini (image duplication check)
            const result = await this.ai.models.generateContent({
                model: "gemini-2.0-flash",
                config: {
                    responseMimeType: "application/json",
                    systemInstruction: systemPrompt,
                },
                contents: createUserContent([
                    ...imageParts, // Spread the image parts to include all images
                    "Is any of this product image duplicated?",
                ]),
            });

            // Log the response
            console.log(result.text);

            // Check if the response is valid JSON
            if (!result.text) {
                throw new Error('Invalid response from the model.');
            }
            return JSON.parse(result.text);

        } catch (error) {
            if (retryCount < maxRetries) {
                if (error instanceof Error) {
                    if (error.message.includes("429 Too Many Requests")) {
                        console.error(`🚨 API key ${this.currentApiKeyIndex + 1} limit exhausted, switching...`);
                        this.switchApiKey();  // Switch to the next API key
                        // Retry the process with the new API key
                        await new Promise((resolve) => setTimeout(resolve, 5000)); // Optional: wait before retry
                        return this.processImages(images, retryCount + 1, maxRetries);
                    } else if (error.message.includes("503 Service Unavailable")) {
                        console.error("⏳ Service is unavailable. Retrying in 5 seconds...");
                        await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 seconds before retry
                        return this.processImages(images, retryCount + 1, maxRetries);
                    } else {
                        console.error("⚠ Error generating content:", error.message);
                    }
                } else {
                    console.error("❌ Unknown error:", error);
                }
            } else {
                console.error("Maximum retry attempts reached. Could not process the images.");
            }
        }
    }

    // Public method to process multiple images
    public async processImageFile(images: string[]): Promise<any> {
     return await this.processImages(images);
    }
}



// Example usage: Initialize the processor and process an image file

export async function replyImage(path: string) {
    try {

        const processor = new ImageProcessor();
        const imagePaths = ["gg56yu.jpg", "gy58hu.jpg", path]
        const result = await processor.processImageFile(imagePaths)
        if (!result || !result.message) {
            console.error("No response received from the AI model. || Service Unavailable");
            return "Service unavailable!";
        }

        return result.message;
    } catch (error) {
        console.error("Error running model:", error);
        if (error instanceof Error) {
            console.error("Error message:", error.message);
        } else {
            console.error("Unknown error:", error);
        }
    }
}

// runModel();