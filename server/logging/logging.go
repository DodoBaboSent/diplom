package logging

import (
	"log"
	"net/http"
	"server/TemplFS"
	"time"
)

type wrappedWriter struct {
	http.ResponseWriter
	statusCode int
}

func (w *wrappedWriter) WriteHeader(status int) {
	w.statusCode = status // Store the status for our own use
	if status != http.StatusNotFound {
		w.ResponseWriter.WriteHeader(status)
	}
}

func (w *wrappedWriter) Write(p []byte) (int, error) {
	if w.statusCode != http.StatusNotFound {
		return w.ResponseWriter.Write(p)
	}
	return len(p), nil // Lie that we successfully written it
}

func WrapHandler(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		nfrw := &wrappedWriter{ResponseWriter: w}
		next.ServeHTTP(nfrw, r)
		if nfrw.statusCode == 404 {
			nfrw.Header().Add("Content-Type", "text/html")
			http.ServeFileFS(nfrw, r, TemplFS.TemplFS, "dist/index.html")
		}
	})
}

func Logging(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		wrapped := &wrappedWriter{
			ResponseWriter: w,
			statusCode:     http.StatusOK,
		}

		next.ServeHTTP(wrapped, r)
		log.Println(wrapped.statusCode, r.Method, r.URL.Path, time.Since(start), r.RemoteAddr)
	})
}

type Middleware func(http.Handler) http.Handler

func CreateStack(xs ...Middleware) Middleware {
	return func(next http.Handler) http.Handler {
		for i := len(xs) - 1; i >= 0; i-- {
			x := xs[i]
			next = x(next)
		}
		return next
	}
}
