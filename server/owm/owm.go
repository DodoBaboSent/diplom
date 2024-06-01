package owm

import (
	"log"
	"os"

	owm "github.com/briandowns/openweathermap"
	"github.com/joho/godotenv"
)

var owmApiKey string

func GetWeatherLongLat(longtitude, latitude float64) *owm.CurrentWeatherData {

	// Получаем ключ от АПИ
	log.Println(os.Getenv("PRODUCTION"))
	if os.Getenv("PRODUCTION") != "true" {
		err := godotenv.Load()
		if err != nil {
			log.Fatalln("Error loading .env file")
		}
	}
	owmApiKey = os.Getenv("OWM_API_KEY")

	// Создаем структуру для погодных данных
	w, err := owm.NewCurrent("C", "ru", owmApiKey)
	if err != nil {
		log.Fatalln(err)
	}
	// Получаем погодные данные и возвращаемся
	w.CurrentByCoordinates(&owm.Coordinates{
		Longitude: longtitude,
		Latitude:  latitude,
	})
	return w
}

func GetWeatherName(name string) *owm.CurrentWeatherData {
	// Получаем ключ от АПИ
	if os.Getenv("PRODUCTION") != "true" {
		err := godotenv.Load()
		if err != nil {
			log.Fatalln("Error loading .env file")
		}
	}
	owmApiKey = os.Getenv("OWM_API_KEY")

	// Создаем новую структуру для погодных данных
	w, err := owm.NewCurrent("C", "ru", owmApiKey)
	if err != nil {
		log.Fatalln(err)
	}
	// Получаем и возвращаем данные
	w.CurrentByName(name)
	return w
}
