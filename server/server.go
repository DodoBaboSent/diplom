package main

import (
	"fmt"
	"io/fs"
	"net/http"
	"server/TemplFS"
	"server/logging"
)

func main() {
	router := http.NewServeMux()

	dist, _ := fs.Sub(TemplFS.TemplFS, "dist")

	stack := logging.CreateStack(
		logging.Logging,
		logging.WrapHandler,
	)

	router.Handle("GET /", http.FileServer(http.FS(dist)))

	server := http.Server{
		Addr:    ":8080",
		Handler: stack(router),
	}

	fmt.Println("Listening on localhost:8080")
	server.ListenAndServe()
}
