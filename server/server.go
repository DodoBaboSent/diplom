package main

import (
	"encoding/json"
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
	"strconv"

	openweather "github.com/briandowns/openweathermap"
	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
)

var owmApiKey string

func contains(s []database.City, e string) bool {
	for _, a := range s {
		if a.Name == e {
			return true
		}
	}
	return false
}

func main() {
	router := http.NewServeMux()

	dist, _ := fs.Sub(TemplFS.TemplFS, "dist")

	database.InitDB()

	log.Println(os.Getenv("PRODUCTION"))
	if os.Getenv("PRODUCTION") == "false" {
		err := godotenv.Load()
		if err != nil {
			log.Fatalln("Error loading .env file")
		}
	}
	owmApiKey = os.Getenv("OWM_API_KEY")
	log.Println(os.Getenv("OWM_API_KEY"))

	stack := logging.CreateStack(
		logging.Logging,
	)

	router.Handle("/", logging.WrapHandler(http.FileServer(http.FS(dist))))
	router.HandleFunc("POST /jwt", auth.AuthJWT)
	router.HandleFunc("GET /refresh", auth.RefreshJWT)
	protectedRouter := http.NewServeMux()
	protectedRouter.HandleFunc("PUT /star", func(w http.ResponseWriter, r *http.Request) {
		var city struct {
			Name string `json:"name"`
		}
		err := json.NewDecoder(r.Body).Decode(&city)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		cookie, err := r.Cookie("token")
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
		}
		tknStr := cookie.Value
		claims := &auth.Claims{}
		tkn, err := jwt.ParseWithClaims(tknStr, claims, func(token *jwt.Token) (any, error) {
			return auth.JWTKey, nil
		})
		if err != nil {
			if err == jwt.ErrSignatureInvalid {
				w.WriteHeader(http.StatusUnauthorized)
				return
			}
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		if !tkn.Valid {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		var name string
		claimss := tkn.Claims.(*auth.Claims)
		name = fmt.Sprint(claimss.Username)
		var result database.User
		database.Database.Model(&database.User{}).Where("username = ?", name).Preload("Cities").First(&result)
		checkRes := contains(result.Cities, city.Name)
		if !checkRes {
			cit := database.City{
				Name:   city.Name,
				UserID: result.ID,
			}
			database.Database.Model(&database.City{}).Create(&cit)
			return
		}
		w.WriteHeader(http.StatusBadRequest)
		return

	})
	protectedRouter.HandleFunc("GET /star", func(w http.ResponseWriter, r *http.Request) {

		cookie, err := r.Cookie("token")
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
		}
		tknStr := cookie.Value
		claims := &auth.Claims{}
		tkn, err := jwt.ParseWithClaims(tknStr, claims, func(token *jwt.Token) (any, error) {
			return auth.JWTKey, nil
		})
		if err != nil {
			if err == jwt.ErrSignatureInvalid {
				w.WriteHeader(http.StatusUnauthorized)
				return
			}
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		if !tkn.Valid {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		var name string
		claimss := tkn.Claims.(*auth.Claims)
		name = fmt.Sprint(claimss.Username)
		var result database.User
		database.Database.Model(&database.User{}).Where("username = ?", name).Preload("Cities").First(&result)
		var res struct {
			Cities []database.City `json:"cities"`
		}
		res.Cities = result.Cities
		jsonResp, err := json.Marshal(res)
		if err != nil {
			log.Fatalln(err)
		}
		w.Header().Set("Content-Type", "application/json")
		w.Write(jsonResp)
		return

	})
	protectedRouter.HandleFunc("GET /get", func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("token")
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
		}
		tknStr := cookie.Value
		claims := &auth.Claims{}
		tkn, err := jwt.ParseWithClaims(tknStr, claims, func(token *jwt.Token) (any, error) {
			return auth.JWTKey, nil
		})
		if err != nil {
			if err == jwt.ErrSignatureInvalid {
				w.WriteHeader(http.StatusUnauthorized)
				return
			}
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		if !tkn.Valid {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		var name string
		claimss := tkn.Claims.(*auth.Claims)
		name = fmt.Sprint(claimss.Username)
		var result database.User
		database.Database.Model(database.User{Username: name}).First(&result)
		var resp struct {
			Name string `json:"city"`
		}
		resp.Name = result.CityName
		jsonResp, err := json.Marshal(resp)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
		}
		w.Header().Set("Content-Type", "application/json")
		w.Write(jsonResp)
		return
	})
	router.Handle("/user/", http.StripPrefix("/user", auth.RefreshTokenMiddleware(protectedRouter)))
	router.HandleFunc("GET /weather", func(w http.ResponseWriter, r *http.Request) {
		query := r.URL.Query()
		var weather *openweather.CurrentWeatherData
		longtitude, present := query["longtitude"]
		if present || len(longtitude) > 0 {
			latitude := query["latitude"]
			if !present || len(latitude) == 0 {
				w.WriteHeader(http.StatusBadRequest)
				return
			}
			longtitudeFloat, err := strconv.ParseFloat(longtitude[0], 64)
			if err != nil {
				log.Println("Couldnt convert longtitude to float")
				w.WriteHeader(http.StatusBadRequest)
				return
			}
			latitudeFloat, err := strconv.ParseFloat(latitude[0], 64)
			if err != nil {
				log.Println("Couldnt convert latitude to float")
				w.WriteHeader(http.StatusBadRequest)
				return
			}
			weather = owm.GetWeatherLongLat(longtitudeFloat, latitudeFloat)
		} else {
			name, present := query["city"]
			if !present || len(name) == 0 {
				w.WriteHeader(http.StatusBadRequest)
				return
			}
			weather = owm.GetWeatherName(name[0])
		}

		weather.Key = "redacted"
		w.Header().Set("Content-Type", "application/json")
		jsonResp, err := json.Marshal(weather)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		w.Write(jsonResp)
		return
	})
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
