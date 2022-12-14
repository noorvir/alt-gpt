import { createParser } from "eventsource-parser";
import { streamAsyncIterable } from "extension/chrome/background/stream-async-iterable";

export async function fetchSSE(resource: string, options) {
  const { onMessage, ...fetchOptions } = options;
  const resp = await fetch(resource, fetchOptions);
  const parser = createParser((event) => {
    if (event.type === "event") {
      onMessage(event.data);
    }
  });
  // @ts-ignore
  for await (const chunk of streamAsyncIterable(resp.body)) {
    const str = new TextDecoder().decode(chunk);
    parser.feed(str);
  }
}
