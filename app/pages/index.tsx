import Link from "next/link";
import Layout from "../components/Layout";
import EventStream from "../components/TextBox";

const IndexPage = () => {
  if (typeof window !== "undefined" && window.chrome.runtime) {
    // Send a message to the extension
    window?.chrome.runtime.sendMessage({
      type: "requestData",
      data: {
        someValue: "Hello from the web app!",
      },
    });

    // Listen for messages from the extension
    window?.chrome.runtime.onMessage.addListener((message) => {
      if (message.type === "responseData") {
        console.log({ message });
        // Do something with the data received from the extension
      }
    });
  }

  return (
    <Layout title="Home | Next.js + TypeScript Example">
      <h1>Hello Next.js 👋</h1>
      <p>
        <Link href="/about">About</Link>
      </p>
      <EventStream />
    </Layout>
  );
};

export default IndexPage;
