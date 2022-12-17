package main

import (
	"fmt"
	"io"
	"log"
	"net/http"

	speech "cloud.google.com/go/speech/apiv1"
	"cloud.google.com/go/speech/apiv1/speechpb"
)

func transcribe(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Transcribing audio...")

	// Set the appropriate headers for SSE.
	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")

	// Read the audio data from the POST request.
	data, err := io.ReadAll(r.Body)
	if err != nil {
		log.Printf("Error reading audio data: %v", err)
		return
	}

	// Use the Google Cloud Speech-To-Text API to transcribe the audio.
	ctx := r.Context()
	client, err := speech.NewClient(ctx)
	if err != nil {
		log.Printf("Error creating Speech client: %v", err)
		return
	}
	defer client.Close()

	resp, err := client.Recognize(ctx, &speechpb.RecognizeRequest{
		Config: &speechpb.RecognitionConfig{
			Encoding: speechpb.RecognitionConfig_LINEAR16,
			//SampleRateHertz: 16000,
			LanguageCode: "en-US",
		},
		Audio: &speechpb.RecognitionAudio{
			AudioSource: &speechpb.RecognitionAudio_Content{Content: data},
		},
	})
	if err != nil {
		log.Printf("Error recognizing speech: %v", err)
		return
	}

	// Write the transcribed text as an SSE event to the client.
	for _, result := range resp.Results {
		for _, alt := range result.Alternatives {
			fmt.Fprintf(w, "data: %s\n\n", alt.Transcript)
			w.(http.Flusher).Flush()
		}
	}
}
