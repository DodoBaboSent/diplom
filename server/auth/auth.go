package auth

import (
	"crypto/sha256"
	"database/sql"
	"encoding/json"
	"net/http"
	"server/database"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var JWTKey = []byte("my_secret_key")

type Credentials struct {
	Password string `json:"password"`
	Username string `json:"username"`
}

type Claims struct {
	Username   string `json:"username"`
	Activation bool   `json:"active"`
	Admin      bool   `json:"adm"`
	jwt.RegisteredClaims
}

func AuthJWT(w http.ResponseWriter, r *http.Request) {
	// Чтение реквизитов аккаунта
	var creds Credentials
	err := json.NewDecoder(r.Body).Decode(&creds)
	if err != nil {
		// В случае отсутствия реквизитов в теле, возвращаем
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	// Чтение из базы данных
	var result database.User
	if err := database.Database.Model(&database.User{}).Where("username = @name OR email = @name", sql.Named("name", creds.Username)).First(&result).Error; err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}
	// Сравниваем хэши
	expectedPass := result.Password
	credsHash := sha256.New()
	credsHash.Write([]byte(creds.Password))
	if expectedPass != string(credsHash.Sum(nil)) {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	// Составляем токен
	expirTime := time.Now().Add(24 * 5 * time.Hour)
	claims := &Claims{
		Username:   result.Username,
		Activation: result.Active,
		Admin:      result.Admin,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirTime),
		},
	}
	// Подписываем токен
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(JWTKey)
	if err != nil {
		// В случае ошибки подписи, возвращаем
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	// Отвечаем, одновременно устанавливая токен пользователя
	http.SetCookie(w, &http.Cookie{
		Name:    "token",
		Value:   tokenString,
		Expires: expirTime,
	})
	return
}

func RefreshTokenMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
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
		claims := &Claims{}
		tkn, err := jwt.ParseWithClaims(tknStr, claims, func(token *jwt.Token) (any, error) {
			return JWTKey, nil
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

		claimsDec := tkn.Claims.(*Claims)
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
		expirTime := time.Now().Add(24 * 5 * time.Hour)
		claimsDec.ExpiresAt = jwt.NewNumericDate(expirTime)
		claimsDec.Activation = true
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, claimsDec)
		tokenString, err := token.SignedString(JWTKey)
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
		next.ServeHTTP(w, r)
	})
}
func AdminMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
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
		claims := &Claims{}
		tkn, err := jwt.ParseWithClaims(tknStr, claims, func(token *jwt.Token) (any, error) {
			return JWTKey, nil
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

		claimsDec := tkn.Claims.(*Claims)
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
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		expirTime := time.Now().Add(24 * 5 * time.Hour)
		claimsDec.ExpiresAt = jwt.NewNumericDate(expirTime)
		claimsDec.Activation = true
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, claimsDec)
		tokenString, err := token.SignedString(JWTKey)
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
		next.ServeHTTP(w, r)
	})
}

func RefreshJWT(w http.ResponseWriter, r *http.Request) {
	// Чтение токена из куки, возвращаемся в случае отсутсвия куки или другой, непредвиденной
	// ошибки
	c, err := r.Cookie("token")
	if err != nil {
		if err == http.ErrNoCookie {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	// Извлекаем информацию из токена, проверяем сигнатуру, возвращаемся если сигнатура невалидна
	// или произошла непредвиденная ошибка
	tknStr := c.Value
	claims := &Claims{}
	tkn, err := jwt.ParseWithClaims(tknStr, claims, func(token *jwt.Token) (any, error) {
		return JWTKey, nil
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

	// Извлекаем и проверяем "заявления" токена, возвращаемся если аккаунт не активирован
	claimsDec := tkn.Claims.(*Claims)
	if claimsDec.Activation != true {
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
	}
	// обновляем срок истечения действия токена и конструируем новый токен, подписываем или
	// возвращаемся при непредвиденной ошибке
	expirTime := time.Now().Add(24 * 5 * time.Hour)
	claims.ExpiresAt = jwt.NewNumericDate(expirTime)
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(JWTKey)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	// устанавливаем куки
	http.SetCookie(w, &http.Cookie{
		Name:    "token",
		Value:   tokenString,
		Expires: expirTime,
	})
	return
}
