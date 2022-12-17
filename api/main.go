package main

import (
	"log"
	"net/http"

	"github.com/go-chi/chi"
)

const (
	port = ":8080"
)

func main() {
	r := chi.NewRouter()

	r.Post("/transcribe", transcribe)

	if err := http.ListenAndServe(port, r); err != nil {
		log.Fatalln(err)
	}
}
