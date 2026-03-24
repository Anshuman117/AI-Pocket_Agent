import axios from "axios";

export const AIChatModel = async (messages: any) => {

  // ✅ remove image field
  const cleanMessages = messages.map((msg: any) => ({
    role: msg.role,
    content: msg.content,
  }));

  const response = await axios.post(
    "https://kravixstudio.com/api/v1/chat",
    {
      message: cleanMessages, // ✅ correct key
      aiModel: "gpt-4.1-mini",
      outputType: "text",
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer " +
          process.env.EXPO_PUBLIC_KRAVIX_STUDIO_API_KEY,
      },
    }
  );

  console.log(response.data);
  return response.data;
};