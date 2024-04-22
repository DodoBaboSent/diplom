package database

import (
	"crypto/sha256"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Username string `gorm:"unique"`
	Password string
	Active   bool `json:"-"`
	CityName string
	Cities   []City
}

type City struct {
	gorm.Model `json:"-"`
	Name       string `json:"name"`
	UserID     uint   `json:"-"`
}

var Database *gorm.DB

func InitDB() {
	var err error
	Database, err = gorm.Open(sqlite.Open("test.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}
	Database.AutoMigrate(&User{})
	Database.AutoMigrate(&City{})
	h := sha256.New()
	h.Write([]byte("password"))
	Database.Create(&User{Username: "admin", Password: string(h.Sum(nil)), CityName: "Хабаровск", Cities: []City{{Name: "Детройт"}, {Name: "Лондон"}, {Name: "Москва"}}})
}
