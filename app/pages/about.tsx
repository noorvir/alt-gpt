import Link from 'next/link'
import Layout from '../components/Layout'
import {useState, useEffect} from "react";
import {fetchSSE} from "lib/fetch-sse";

const AboutPage = () => {
  const [transcription, setTranscription] = useState('');


  const handleFileChange = (event) => {
    const file = event.target.files[0];

    // Read the file into memory as an ArrayBuffer.
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = async () => {
      const audioData = reader.result;

      await fetchSSE('http://localhost:8080/transcribe', {
        method: 'POST',
        body: audioData,
        headers: {
          "Content-Type": "audio/wav",
        },
        onMessage(message) {
          console.debug('sse message', message)
          if (message === '[DONE]') {
            return
          }
          const data = JSON.parse(message)
          const text = data.message ?? ''

          setTranscription(prevTranscription => prevTranscription + text);
        }
      }).catch(err => {
        console.error(err)
      })
    };
  }

  return (
    <div>
      <input type="file" onChange={handleFileChange}/>
      <br/>
      <textarea value={transcription} readOnly/>
    </div>
  );
};


export default AboutPage
