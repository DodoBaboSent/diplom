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
	Email    string `gorm:"unique"`
	Active   bool   `json:"-"`
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
	Database.Create(&User{Username: "admin", Password: string(h.Sum(nil)), Email: "example@example.com", Active: true, CityName: "Хабаровск", Cities: []City{{Name: "Детройт"}, {Name: "Лондон"}, {Name: "Москва"}}})
}
