package main

import (
	"embed"
	"fmt"
	"io/fs"
	"net/http"
	"server/logging"
)

//go:embed templs
//go:embed dist
var templFS embed.FS

func main() {
	router := http.NewServeMux()

	dist, _ := fs.Sub(templFS, "dist")

	router.Handle("GET /", http.FileServer(http.FS(dist)))

	server := http.Server{
		Addr:    ":8080",
		Handler: logging.Logging(router),
	}

	fmt.Println("Listening on localhost:8080")
	server.ListenAndServe()
}
