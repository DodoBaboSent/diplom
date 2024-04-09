package main

import (
	"fmt"
	"io/fs"
	"net/http"
	"server/TemplFS"
	"server/auth"
	"server/logging"
)

func main() {
	router := http.NewServeMux()

	dist, _ := fs.Sub(TemplFS.TemplFS, "dist")

	stack := logging.CreateStack(
		logging.Logging,
	)

	router.Handle("GET /{$}", logging.WrapHandler(http.FileServer(http.FS(dist))))
	router.HandleFunc("POST /jwt", auth.AuthJWT)
	router.HandleFunc("GET /refresh", auth.RefreshJWT)

	server := http.Server{
		Addr:    ":8080",
		Handler: stack(router),
	}

	fmt.Println("Listening on localhost:8080")
	server.ListenAndServe()
}
