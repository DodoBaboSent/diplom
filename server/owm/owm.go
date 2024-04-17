package owm

import (
	"log"
	"os"

	owm "github.com/briandowns/openweathermap"
	"github.com/joho/godotenv"
)

var owmApiKey string

func GetWeatherLongLat(longtitude, latitude float64) *owm.CurrentWeatherData {

	log.Println(os.Getenv("PRODUCTION"))
	if os.Getenv("PRODUCTION") == "false" {
		err := godotenv.Load()
		if err != nil {
			log.Fatalln("Error loading .env file")
		}
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

func GetWeatherName(name string) *owm.CurrentWeatherData {
	err := godotenv.Load()
	if err != nil {
		log.Fatalln("Error loading .env file")
	}
	owmApiKey = os.Getenv("OWM_API_KEY")

	w, err := owm.NewCurrent("C", "ru", owmApiKey)
	if err != nil {
		log.Fatalln(err)
	}
	w.CurrentByName(name)
	return w
}
