package main

import (
	"embed"
	"fmt"
	"html/template"
	"log"
	"net/http"
	"server/logging"
)

//go:embed templs
var templFS embed.FS

func main() {
	router := http.NewServeMux()

	index, err := template.ParseFS(templFS, "templs/index.html")
	if (err != nil) {
		log.Fatalln("Err: ", err)
	}

	router.HandleFunc("GET /", func(w http.ResponseWriter, r *http.Request) {
		index.Execute(w, "")
	})

	server := http.Server{
		Addr:    ":8080",
		Handler: logging.Logging(router),
	}

	fmt.Println("Listening on localhost:8080")
	server.ListenAndServe()
}
