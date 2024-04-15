package main

import (
	"fmt"
	"io"
	"io/fs"
	"log"
	"net/http"
	"os"
	"server/TemplFS"
	"server/auth"
	"server/database"
	"server/logging"
	"server/owm"

	"github.com/joho/godotenv"
)

var owmApiKey string

func main() {
	router := http.NewServeMux()

	dist, _ := fs.Sub(TemplFS.TemplFS, "dist")

	database.InitDB()

	err := godotenv.Load()
	if err != nil {
		log.Fatalln("Error loading .env file")
	}
	owmApiKey = os.Getenv("OWM_API_KEY")

	stack := logging.CreateStack(
		logging.Logging,
	)

	router.Handle("/", logging.WrapHandler(http.FileServer(http.FS(dist))))
	router.HandleFunc("POST /jwt", auth.AuthJWT)
	router.HandleFunc("GET /refresh", auth.RefreshJWT)
	router.HandleFunc("GET /weather", owm.HandleReq)
	router.HandleFunc("GET /forecast", func(w http.ResponseWriter, r *http.Request) {
		query := r.URL.Query()
		longtitude, present := query["longtitude"]
		if !present || len(longtitude) == 0 {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		latitude := query["latitude"]
		if !present || len(latitude) == 0 {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		resp, err := http.Get(fmt.Sprintf("https://api.openweathermap.org/data/2.5/forecast?lat=%s&lon=%s&appid=%s&units=metric&lang=ru&cnt=5", latitude[0], longtitude[0], owmApiKey))
		if err != nil {
			log.Panicln(err)
		}
		defer resp.Body.Close()
		body, err := io.ReadAll(resp.Body)
		w.Header().Set("Content-Type", "application/json")
		w.Write(body)
	})

	server := http.Server{
		Addr:    ":8080",
		Handler: stack(router),
	}

	fmt.Println("Listening on localhost:8080")
	server.ListenAndServe()
}
