package main

import (
	"fmt"
	"io/fs"
	"net/http"
	"server/TemplFS"
	"server/auth"
	"server/database"
	"server/logging"
	"server/owm"
)

func main() {
	router := http.NewServeMux()

	dist, _ := fs.Sub(TemplFS.TemplFS, "dist")

	database.InitDB()

	stack := logging.CreateStack(
		logging.Logging,
	)

	router.Handle("/", logging.WrapHandler(http.FileServer(http.FS(dist))))
	router.HandleFunc("POST /jwt", auth.AuthJWT)
	router.HandleFunc("GET /refresh", auth.RefreshJWT)
	router.HandleFunc("GET /weather", owm.HandleReq)

	server := http.Server{
		Addr:    ":8080",
		Handler: stack(router),
	}

	fmt.Println("Listening on localhost:8080")
	server.ListenAndServe()
}
