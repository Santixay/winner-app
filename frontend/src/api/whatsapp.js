import { api } from "./config";

export async function SendMessage(phone, message) {
  try {
    const response = await api().post("/whatsapp/sendmessage/" + phone, {
      message,
    });

    return response;
  } catch (error) {
    console.log(error);
  }
}
