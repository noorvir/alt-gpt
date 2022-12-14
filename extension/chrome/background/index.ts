import ExpiryMap from "expiry-map";
import { v4 as uuidv4 } from "uuid";
import Browser from "webextension-polyfill";
import { fetchSSE } from "extension/chrome/background/fetch-sse";

const KEY_ACCESS_TOKEN = "accessToken";

const cache = new ExpiryMap(10 * 1000);

async function getAccessToken() {
  if (cache.get(KEY_ACCESS_TOKEN)) {
    return cache.get(KEY_ACCESS_TOKEN);
  }
  const resp = await fetch("https://chat.openai.com/api/auth/session")
    .then((r) => r.json())
    .catch(() => ({}));
  if (!resp.accessToken) {
    throw new Error("UNAUTHORIZED");
  }
  cache.set(KEY_ACCESS_TOKEN, resp.accessToken);
  return resp.accessToken;
}

async function getAnswer(question: any, callback: any) {
  const accessToken = await getAccessToken();
  await fetchSSE("https://chat.openai.com/backend-api/conversation", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      action: "next",
      messages: [
        {
          id: uuidv4(),
          role: "user",
          content: {
            content_type: "text",
            parts: [question],
          },
        },
      ],
      model: "text-davinci-002-render",
      parent_message_id: uuidv4(),
    }),
    onMessage(message: string) {
      console.debug("sse message", message);
      if (message === "[DONE]") {
        return;
      }
      const data = JSON.parse(message);
      const text = data.message?.content?.parts?.[0];
      if (text) {
        callback(text);
      }
    },
  });
}

Browser.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener(async (msg) => {
    console.debug("received msg", msg);
    try {
      await getAnswer(msg.question, (answer: any) => {
        port.postMessage({ answer });
      });
    } catch (err) {
      console.error(err);
      // @ts-ignore
      port.postMessage({ error: err.message });
      cache.delete(KEY_ACCESS_TOKEN);
    }
  });
});
