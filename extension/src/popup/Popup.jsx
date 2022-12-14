import "@picocss/pico";

import {useCallback, useEffect, useState} from "preact/hooks";
import {getUserConfig, updateUserConfig} from "../config";
import "./styles.css";

// function SpeechInput() {
//   const [transcript, setTranscript] = useState("");
//
//   const client = new SpeechClient();
//   const request = {
//     config: {
//       encoding: "LINEAR16",
//       sampleRateHertz: 16000,
//       languageCode: "en-US",
//     },
//   };
//
//   const microphone = new MicrophoneStream();
//   microphone.pipe(request);
//
//   // Create a readable stream for the transcription
//   client.streamingRecognize(request).on("data", (data) => {
//     // When data is received from the stream, append the transcription to the text box
//     setTranscript(transcript + data.results[0].alternatives[0].transcript);
//   });
//
//   return <textarea value={transcript} />;
// }

function Popup() {
  const [triggerMode, setTriggerMode] = useState();

  useEffect(() => {
    getUserConfig().then((config) => {
      setTriggerMode(config.triggerMode || "always");
    });
  }, []);

  const onTriggerModeChange = useCallback((e) => {
    const mode = e.target.value;
    setTriggerMode(mode);
    updateUserConfig({ triggerMode: mode });
  }, []);

  return (
    <div className="container">
      <form>
        <fieldset onChange={onTriggerModeChange}>
          <legend>Trigger Mode</legend>
          <input value={"Some prompt to chat gpt"} placeholder={""} />
          <button type="submit">Submit</button>
        </fieldset>

        {/*<SpeechInput/>*/}
      </form>
    </div>
  );
}

export default Popup;
