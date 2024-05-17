package main

import (
	"bytes"
	"crypto/sha256"
	"encoding/json"
	"fmt"
	"html/template"
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
	"time"

	openweather "github.com/briandowns/openweathermap"
	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
	gomail "gopkg.in/gomail.v2"
)

var owmApiKey string

type TmplData struct {
	URL string
}

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
	tmpls, _ := fs.Sub(TemplFS.TemplFS, "mail")

	database.InitDB()

	log.Println(os.Getenv("PRODUCTION"))
	if os.Getenv("PRODUCTION") != "true" {
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

	adminRouter := http.NewServeMux()
	router.Handle("/", logging.WrapHandler(http.FileServer(http.FS(dist))))
	router.HandleFunc("POST /jwt", auth.AuthJWT)
	router.HandleFunc("GET /refresh", auth.RefreshJWT)
	protectedRouter := http.NewServeMux()
	protectedRouter.HandleFunc("PATCH /defaultCity", func(w http.ResponseWriter, r *http.Request) {
		var city struct {
			Name string `json:"city"`
		}
		err := json.NewDecoder(r.Body).Decode(&city)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		log.Println(city)
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
		log.Println(name)
		if database.Database.Model(&database.User{}).Where("username = ?", name).Update("CityName", city.Name).Error != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		weather := owm.GetWeatherName(city.Name)

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
	protectedRouter.HandleFunc("DELETE /star", func(w http.ResponseWriter, r *http.Request) {
		var city struct {
			Name string `json:"city"`
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
		if checkRes {

			database.Database.Model(&database.City{}).Delete(&database.City{}, "user_id = ? AND name = ?", result.ID, city.Name)

			var resp struct {
				Status string `json:"status"`
			}
			resp.Status = "OK"
			jsonResp, err := json.Marshal(resp)
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
			w.Header().Set("Content-Type", "application/json")
			w.Write(jsonResp)
			return
		}
		w.WriteHeader(http.StatusBadRequest)
		return
	})
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
		} else {
			var resp struct {
				Message string `json:"message"`
			}
			resp.Message = "Уже отслеживается"
			jsonResp, err := json.Marshal(resp)
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
			}
			w.WriteHeader(http.StatusBadRequest)
			w.Header().Set("Content-Type", "application/json")
			w.Write(jsonResp)
			return
		}
		w.WriteHeader(http.StatusTeapot)

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
	router.HandleFunc("GET /token/activate/{id}", func(w http.ResponseWriter, r *http.Request) {
		id := r.PathValue("id")
		database.Database.Model(&database.User{}).Where("id = ?", id).Update("active", true)
		http.Redirect(w, r, "/", http.StatusFound)

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
		database.Database.Model(&database.User{}).Where("username = ?", name).First(&result)
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
	router.HandleFunc("GET /token/logout", func(w http.ResponseWriter, r *http.Request) {
		http.SetCookie(w, &http.Cookie{
			Name:    "token",
			Value:   "",
			Path:    "/",
			Expires: time.Now(),
		})
		return
	})
	router.HandleFunc("GET /user/checkAdmin", func(w http.ResponseWriter, r *http.Request) {
		c, err := r.Cookie("token")
		if err != nil {
			if err == http.ErrNoCookie {
				w.WriteHeader(http.StatusBadRequest)
				return
			}
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		tknStr := c.Value
		claims := &auth.Claims{}
		tkn, err := jwt.ParseWithClaims(tknStr, claims, func(token *jwt.Token) (any, error) {
			return auth.JWTKey, nil
		})
		if err != nil {
			if err == jwt.ErrSignatureInvalid {
				http.SetCookie(w, &http.Cookie{
					Name:    "token",
					Value:   "",
					Path:    "/",
					Expires: time.Now(),
				})
				w.WriteHeader(http.StatusUnauthorized)
				return
			}
			http.SetCookie(w, &http.Cookie{
				Name:    "token",
				Value:   "",
				Path:    "/",
				Expires: time.Now(),
			})
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		if !tkn.Valid {
			http.SetCookie(w, &http.Cookie{
				Name:    "token",
				Value:   "",
				Path:    "/",
				Expires: time.Now(),
			})
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		claimsDec := tkn.Claims.(*auth.Claims)
		var result database.User
		database.Database.Model(&database.User{}).Where("username = ?", claimsDec.Username).First(&result)
		if result.Active != true {
			var warning struct {
				Message string `json:"warning"`
				Cod     int    `json:"cod"`
			}
			warning.Message = "Активируйте свой аккаунт"
			warning.Cod = 10
			jsonResp, err := json.Marshal(warning)
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
			w.Header().Set("Content-Type", "application/json")
			w.Write(jsonResp)
			return
		}
		if claimsDec.Admin != true {
			var resp struct {
				Admin bool `json:"admin"`
			}
			resp.Admin = false
			jsonResp, err := json.Marshal(resp)
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
			}
			w.Header().Set("Content-Type", "application/json")
			w.Write(jsonResp)
			return
		}
		expirTime := time.Now().Add(24 * 5 * time.Hour)
		claimsDec.ExpiresAt = jwt.NewNumericDate(expirTime)
		claimsDec.Activation = true
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, claimsDec)
		tokenString, err := token.SignedString(auth.JWTKey)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		http.SetCookie(w, &http.Cookie{
			Name:    "token",
			Value:   tokenString,
			Path:    "/",
			Expires: expirTime,
		})
		var resp struct {
			Admin bool `json:"admin"`
		}
		resp.Admin = claimsDec.Admin
		jsonResp, err := json.Marshal(resp)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
		}
		w.Header().Set("Content-Type", "application/json")
		w.Write(jsonResp)
		return
	})
	router.Handle("/user/", http.StripPrefix("/user", auth.RefreshTokenMiddleware(protectedRouter)))
	adminRouter.HandleFunc("GET /users", func(w http.ResponseWriter, r *http.Request) {
		var users []database.User
		database.Database.Find(&users)
		jsonResp, err := json.Marshal(users)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.Write(jsonResp)
		return
	})
	adminRouter.HandleFunc("/activate/{id}", func(w http.ResponseWriter, r *http.Request) {
		id, err := strconv.Atoi(r.PathValue("id"))
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		database.Database.Model(&database.User{}).Where("id = ?", id).Update("active", true)
		http.Redirect(w, r, "/admin_panel", 302)
		return
	})
	adminRouter.HandleFunc("/deactivate/{id}", func(w http.ResponseWriter, r *http.Request) {
		id, err := strconv.Atoi(r.PathValue("id"))
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		database.Database.Model(&database.User{}).Where("id = ?", id).Update("active", false)
		http.Redirect(w, r, "/admin_panel", 302)
		return
	})
	adminRouter.HandleFunc("/makeadm/{id}", func(w http.ResponseWriter, r *http.Request) {
		id, err := strconv.Atoi(r.PathValue("id"))
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		database.Database.Model(&database.User{}).Where("id = ?", id).Update("admin", true)
		http.Redirect(w, r, "/admin_panel", 302)
		return
	})
	adminRouter.HandleFunc("/remadm/{id}", func(w http.ResponseWriter, r *http.Request) {
		id, err := strconv.Atoi(r.PathValue("id"))
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		database.Database.Model(&database.User{}).Where("id = ?", id).Update("admin", false)
		http.Redirect(w, r, "/admin_panel", 302)
		return
	})
	adminRouter.HandleFunc("/userdel/{id}", func(w http.ResponseWriter, r *http.Request) {
		id, err := strconv.Atoi(r.PathValue("id"))
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		database.Database.Model(&database.User{}).Delete(&database.User{}, "id = ?", id)
		http.Redirect(w, r, "/admin_panel", 302)
		return
	})
	adminRouter.HandleFunc("/delrep/{id}", func(w http.ResponseWriter, r *http.Request) {
		id, err := strconv.Atoi(r.PathValue("id"))
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		database.Database.Model(&database.Reply{}).Delete(&database.Reply{}, "id = ?", id)
		w.WriteHeader(http.StatusOK)
		return
	})
	adminRouter.HandleFunc("/articledel/{id}", func(w http.ResponseWriter, r *http.Request) {
		id, err := strconv.Atoi(r.PathValue("id"))
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		database.Database.Model(&database.News{}).Delete(&database.News{}, "id = ?", id)
		http.Redirect(w, r, "/admin_panel", 302)
		return
	})
	adminRouter.HandleFunc("POST /new_article", func(w http.ResponseWriter, r *http.Request) {
		var article struct {
			Name string `json:"name"`
			Body string `json:"body"`
		}
		err := json.NewDecoder(r.Body).Decode(&article)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		result := database.Database.Model(&database.News{}).Create(&database.News{Name: article.Name, Body: article.Body})
		if result.Error != nil {
			w.WriteHeader(http.StatusInternalServerError)
		}
		w.WriteHeader(http.StatusOK)
		return
	})
	router.HandleFunc("GET /news", func(w http.ResponseWriter, r *http.Request) {
		var news []database.News
		database.Database.Preload("Replies").Find(&news)
		jsonResp, err := json.Marshal(news)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
		}
		w.Header().Set("Content-Type", "application/json")
		w.Write(jsonResp)
		return
	})
	router.HandleFunc("GET /airpollution", func(w http.ResponseWriter, r *http.Request) {
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
		resp, err := http.Get(fmt.Sprintf("https://api.openweathermap.org/data/2.5/air_pollution?lat=%s&lon=%s&appid=%s", latitude[0], longtitude[0], owmApiKey))
		if err != nil {
			log.Panicln(err)
		}
		defer resp.Body.Close()
		body, err := io.ReadAll(resp.Body)
		w.Header().Set("Content-Type", "application/json")
		w.Write(body)
		return
	})
	router.HandleFunc("GET /map/{layer}/{z}/{x}/{y}", func(w http.ResponseWriter, r *http.Request) {
		layer := r.PathValue("layer")
		z := r.PathValue("z")
		x := r.PathValue("x")
		y := r.PathValue("y")
		resp, err := http.Get(fmt.Sprintf("https://tile.openweathermap.org/map/%s/%s/%s/%s.png?appid=%s", layer, z, x, y, owmApiKey))
		if err != nil {
			log.Panicln(err)
		}
		defer resp.Body.Close()
		body, err := io.ReadAll(resp.Body)
		w.Header().Set("Content-Type", "image/png")
		w.Write(body)
		return
	})
	router.HandleFunc("POST /newcomment", func(w http.ResponseWriter, r *http.Request) {
		var comment struct {
			ID   string `json:"article"`
			Text string `json:"text"`
		}
		err := json.NewDecoder(r.Body).Decode(&comment)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		c, err := r.Cookie("token")
		if err != nil {
			if err == http.ErrNoCookie {
				w.WriteHeader(http.StatusBadRequest)
				return
			}
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		tknStr := c.Value
		claims := &auth.Claims{}
		tkn, err := jwt.ParseWithClaims(tknStr, claims, func(token *jwt.Token) (any, error) {
			return auth.JWTKey, nil
		})
		if err != nil {
			if err == jwt.ErrSignatureInvalid {
				http.SetCookie(w, &http.Cookie{
					Name:    "token",
					Value:   "",
					Path:    "/",
					Expires: time.Now(),
				})
				w.WriteHeader(http.StatusUnauthorized)
				return
			}
			http.SetCookie(w, &http.Cookie{
				Name:    "token",
				Value:   "",
				Path:    "/",
				Expires: time.Now(),
			})
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		if !tkn.Valid {
			http.SetCookie(w, &http.Cookie{
				Name:    "token",
				Value:   "",
				Path:    "/",
				Expires: time.Now(),
			})
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		claimsDec := tkn.Claims.(*auth.Claims)
		var result database.User
		database.Database.Model(&database.User{}).Where("username = ?", claimsDec.Username).First(&result)
		nwsID, err := strconv.Atoi(comment.ID)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		newRep := database.Reply{
			User:     result,
			Text:     comment.Text,
			NewsID:   nwsID,
			Username: result.Username,
		}
		log.Println(newRep)
		log.Println("posting")
		log.Println(newRep.Text)
		res := database.Database.Model(&database.Reply{}).Create(&newRep)
		log.Println(res.Error)
		w.WriteHeader(http.StatusOK)
		return
	})
	router.HandleFunc("GET /getart/{id}", func(w http.ResponseWriter, r *http.Request) {
		id, err := strconv.Atoi(r.PathValue("id"))
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		var article database.News
		database.Database.Model(&database.News{}).Preload("Replies").First(&article, "id = ?", id)
		jsonResp, err := json.Marshal(article)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.Write(jsonResp)
		return

	})
	router.Handle("/admin/", http.StripPrefix("/admin", auth.AdminMiddleware(adminRouter)))
	router.HandleFunc("POST /register", func(w http.ResponseWriter, r *http.Request) {
		var user struct {
			Username string `json:"username"`
			Mail     string `json:"mail"`
			Password string `json:"password"`
		}
		err := json.NewDecoder(r.Body).Decode(&user)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		var result database.User
		if database.Database.Unscoped().Model(&database.User{}).First(&result, "username = ?", user.Username).Error != nil {
			if result.Username == user.Username {
				log.Println(result.DeletedAt.Time.IsZero())
				if result.DeletedAt.Time.IsZero() {
					w.WriteHeader(http.StatusBadRequest)
					w.Write([]byte("Такой пользователь уже существует"))
					return
				} else {
					database.Database.Unscoped().Model(&database.User{}).Delete(&database.User{}, "id = ?", result.ID)
				}
			}
		}
		if result.Username == user.Username {
			if result.Username == user.Username {
				log.Println(result.DeletedAt.Time.IsZero())
				if result.DeletedAt.Time.IsZero() {
					w.WriteHeader(http.StatusBadRequest)
					w.Write([]byte("Такой пользователь уже существует"))
					return
				} else {
					database.Database.Unscoped().Model(&database.User{}).Delete(&database.User{}, "id = ?", result.ID)
				}
			}
		}
		h := sha256.New()
		h.Write([]byte(user.Password))
		newUser := database.User{Password: string(h.Sum(nil)), Username: user.Username, Active: false, Email: user.Mail}
		database.Database.Create(&newUser)

		expirTime := time.Now().Add(24 * 5 * time.Hour)
		claims := &auth.Claims{
			Username:   user.Username,
			Activation: false,
			RegisteredClaims: jwt.RegisteredClaims{
				ExpiresAt: jwt.NewNumericDate(expirTime),
			},
		}
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
		tokenString, err := token.SignedString(auth.JWTKey)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		hostname := os.Getenv("HOST")
		tmplData := TmplData{
			URL: fmt.Sprintf(`%s/token/activate/%s`, hostname, strconv.FormatUint(uint64(newUser.ID), 10)),
		}
		tmpl, err := template.ParseFS(tmpls, "mail.tmpl")
		if err != nil {
			log.Println(err)
		}

		http.SetCookie(w, &http.Cookie{
			Name:    "token",
			Value:   tokenString,
			Expires: expirTime,
		})
		var tpl bytes.Buffer
		if err := tmpl.Execute(&tpl, tmplData); err != nil {
			log.Println(err)
		}
		m := gomail.NewMessage()
		m.SetHeader("From", os.Getenv("EMAIL_USER"))
		m.SetHeader("To", user.Mail)
		m.SetHeader("Subject", "Активация аккаунта")
		m.SetBody("text/html", tpl.String())
		port, _ := strconv.Atoi(os.Getenv("EMAIL_PORT"))
		d := gomail.NewDialer(os.Getenv("EMAIL_HOST"), port, os.Getenv("EMAIL_USER"), os.Getenv("EMAIL_PASSWORD"))
		if err := d.DialAndSend(m); err != nil {
			log.Println(err)
		}
		return
	})
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
				log.Println("no city")
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
