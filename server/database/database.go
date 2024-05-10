package database

import (
	"crypto/sha256"
	"time"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Username string `gorm:"unique"`
	Password string `json:"-"`
	Email    string `gorm:"unique"`
	Active   bool   `json:"-"`
	Admin    bool   `json:"-"`
	CityName string `json:"-"`
	Cities   []City `json:"-"`
}

type City struct {
	gorm.Model `json:"-"`
	Name       string `json:"name"`
	UserID     uint   `json:"-"`
}

type News struct {
	ID        uint           `gorm:"primarykey" json:"id"`
	CreatedAt time.Time      `json:"created"`
	UpdatedAt time.Time      `json:"updated"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
	Name      string         `json:"name"`
	Body      string         `json:"body"`
	Replies   []Reply        `json:"rep"`
}
type Reply struct {
	ID        uint           `gorm:"primarykey" json:"id"`
	CreatedAt time.Time      `json:"created"`
	UpdatedAt time.Time      `json:"updated"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
	Text      string         `json:"text"`
	User      User           `json:"user"`
	UserID    int
	NewsID    int
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
	Database.AutoMigrate(&News{})
	Database.AutoMigrate(&Reply{})
	h := sha256.New()
	h.Write([]byte("password"))
	Database.Create(&User{Username: "admin", Password: string(h.Sum(nil)), Email: "example@example.com", Admin: true, Active: true, CityName: "Хабаровск", Cities: []City{{Name: "Детройт"}, {Name: "Лондон"}, {Name: "Москва"}}})
}
