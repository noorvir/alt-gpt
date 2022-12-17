import React, { useState, useEffect } from "react";
import axios from "axios";

const getAccessToken = async () => {
  const resp = await fetch("https://chat.openai.com/api/auth/session", {
    method: "GET",
    mode: "no-cors",
  })
    .then((r) => r.json())
    .catch(() => ({}));
  if (!resp.accessToken) {
    throw new Error("UNAUTHORIZED");
  }

  return resp.accessToken;
};

const EventStream = () => {
  const [data, setData] = useState("");
  const convURL = "https://chat.openai.com/backend-api/conversation";
  const sessURL = "http://www.example.com/api/getData";
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    getAccessToken().then((at) => {
      console.log(at);
      setAccessToken(at);
    });
  }, []);

  const handleClick = () => {
    axios
      .post(
        convURL,
        {
          action: "next",
          messages: [
            {
              id: "6d103c2a-b817-46f7-95d9-2c9581e2b7d1",
              role: "user",
              content: {
                content_type: "text",
                parts: ["what is the capital of goa and where is it located?"],
              },
            },
          ],
          parent_message_id: "809024e4-df80-4553-a92b-378cda9f4779",
          model: "text-davinci-002-render",
        },
        {
          headers: {
            // Authentication headers
            Authorization:
              "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1UaEVOVUpHTkVNMVFURTRNMEZCTWpkQ05UZzVNRFUxUlRVd1FVSkRNRU13UmtGRVFrRXpSZyJ9.eyJodHRwczovL2FwaS5vcGVuYWkuY29tL2F1dGgiOnsidXNlcl9pZCI6InVzZXItMUx3NVFBT1BGdmdqYWs3ZkZFZnZHOERiIn0sImlzcyI6Imh0dHBzOi8vYXV0aDAub3BlbmFpLmNvbS8iLCJzdWIiOiJnb29nbGUtb2F1dGgyfDExMTAzNzg1MTU5NTMzMDAyOTQ0MSIsImF1ZCI6WyJodHRwczovL2FwaS5vcGVuYWkuY29tL3YxIiwiaHR0cHM6Ly9vcGVuYWkuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTY3MDIzMTA1NywiZXhwIjoxNjcwMjQ1NDU3LCJhenAiOiJUZEpJY2JlMTZXb1RIdE45NW55eXdoNUU0eU9vNkl0RyIsInNjb3BlIjoib3BlbmlkIGVtYWlsIHByb2ZpbGUgbW9kZWwucmVhZCBtb2RlbC5yZXF1ZXN0IG9yZ2FuaXphdGlvbi5yZWFkIG9mZmxpbmVfYWNjZXNzIn0.HR3Uwfg4I7T3wB3y2efkFZR_gNjOgRhob-3qJlG8fCw2r1X3P2Q7e7jPX1km-9apkR1mR7YdkCjZC07hFoiaVkYuZphmbuiTU-i1mxbEp8NyuHacxQciFHVdXDjcdzJSG8I4BxBMWLC4qKFdGVywMi5VDTxwQRJk6kgPuIF0V04nKGIyAQt2C2mqJPiHxVg-VQ7sFk6rLfwLU_ytbJ0bvDnKSEdI0hnDT_TV5nmtzD5xERUO2RxrdyNMevt6u5QwQ1xqHdBniYwmU_fdExXsbOn67LHK8p6e-tAaqjDlnC94_rXDNfF3lSvECkgmBqCQ0gywtSnQ8xUM5fk8fsOJcg",
          },
        }
      )
      .then((response) => {
        const eventSource = new EventSource(response.data.eventStreamUrl);
        eventSource.onmessage = (event) => {
          setData(event.data);
        };

        return () => {
          eventSource.close();
        };
      });
  };

  return (
    <div>
      <textarea value={data} readOnly={true} />
      <button onClick={handleClick}>Click me</button>
    </div>
  );
};
export default EventStream;
