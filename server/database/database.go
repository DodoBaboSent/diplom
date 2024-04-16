package database

import (
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Username string `gorm:"unique"`
	Password string
	Lon      string
	Lat      string
	Cities   []City
}

type City struct {
	gorm.Model
	Name   string
	UserID uint
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
	Database.Create(&User{Username: "admin", Password: "password", Lon: "135.0551", Lat: "48.4627"})
}
