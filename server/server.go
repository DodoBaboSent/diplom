package main

import (
	"embed"
	"fmt"
	"io/fs"
	"log"
	"net/http"
	"server/logging"
)

//go:embed templs
//go:embed dist
var templFS embed.FS

type NotFoundRedirectRespWr struct {
	http.ResponseWriter // We embed http.ResponseWriter
	status              int
}

func (w *NotFoundRedirectRespWr) WriteHeader(status int) {
	w.status = status // Store the status for our own use
	if status != http.StatusNotFound {
		w.ResponseWriter.WriteHeader(status)
	}
}

func (w *NotFoundRedirectRespWr) Write(p []byte) (int, error) {
	if w.status != http.StatusNotFound {
		return w.ResponseWriter.Write(p)
	}
	return len(p), nil // Lie that we successfully written it
}

func wrapHandler(h http.Handler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		nfrw := &NotFoundRedirectRespWr{ResponseWriter: w}
		h.ServeHTTP(nfrw, r)
		if nfrw.status == 404 {
			log.Printf("Redirecting %s to index.html.", r.RequestURI)
			http.Redirect(w, r, "/index.html", http.StatusFound)
		}
	}
}

func main() {
	router := http.NewServeMux()

	dist, _ := fs.Sub(templFS, "dist")

	router.Handle("GET /", wrapHandler(http.FileServer(http.FS(dist))))

	server := http.Server{
		Addr:    ":8080",
		Handler: logging.Logging(router),
	}

	fmt.Println("Listening on localhost:8080")
	server.ListenAndServe()
}
