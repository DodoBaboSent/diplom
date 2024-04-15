package owm

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"strconv"

	owm "github.com/briandowns/openweathermap"
	"github.com/joho/godotenv"
)

var owmApiKey string

func getWeatherLongLat(longtitude, latitude float64) *owm.CurrentWeatherData {

	err := godotenv.Load()
	if err != nil {
		log.Fatalln("Error loading .env file")
	}
	owmApiKey = os.Getenv("OWM_API_KEY")

	w, err := owm.NewCurrent("C", "ru", owmApiKey)
	if err != nil {
		log.Fatalln(err)
	}
	w.CurrentByCoordinates(&owm.Coordinates{
		Longitude: longtitude,
		Latitude:  latitude,
	})
	return w
}

func HandleReq(w http.ResponseWriter, r *http.Request) {
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
	weather := getWeatherLongLat(longtitudeFloat, latitudeFloat)
	weather.Key = "redacted"
	w.Header().Set("Content-Type", "application/json")
	jsonResp, err := json.Marshal(weather)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.Write(jsonResp)
	return
}
