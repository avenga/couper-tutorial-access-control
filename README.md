# Workshop Zugriffskontrolle

## Installation

	$ npm install

## Start

	$ npm start


## Aufgaben

Referenz: https://github.com/avenga/couper/blob/master/docs/REFERENCE.md#reference



### Warm-up

Starte Couper, z.B. per `npm run couper`!
Öffne Deinen Editor und wir spielen gemeinsam ein wenig!

Branch: `master`
Kontrolle z.B. per

    curl -i localhost:8080/hello
    curl -i localhost:8080/hello/Joe
    curl -i localhost:8080/hi --header Name:Joe
    curl -i localhost:8080/proxy/hi --header Name:Joe



### Benutzer-ID

Schicke die Benutzer-ID (Claim `sub`) als `User`-Header ans Backend damit
sie dort ins Log geschrieben wird!

Branch: `login`
Hinweise:

* Claim eines Tokens: Variable `request.context.…`:

    request.context.⟨AccessControl⟩.⟨Claim⟩

* Request-Header hinzufügen: `add_request_headers`:

    add_request_headers = {
      ⟨HeaderName⟩ = ⟨Wert⟩
    }

Kontrolle durch Beobachten des Logs und Aufruf von z.B.

    curl -i localhost:8080/api/countries --header "Authorization: Bearer eyJhbGciOiJS… ⟨Bobs Token⟩ …"



### User-Info

Lade `/userinfo` über Couper, um die CORS-Problematik zu umgehen!

Branch: `header`
Kontrolle z.B. per

    curl -i localhost:8080/userinfo --header "Authorization: Bearer eyJhbGciOiJS… ⟨Bobs Token⟩ …"

Hinweise:

* Verwende folgende Blöcke und Attribute: `headers`, `request`, `endpoint`, `url`

    server {
      api { ⟨bisherige Proxy-Konfiguration⟩ }

      api {
        …………………… "/userinfo" {
          ………………… {
            ……… = "https://demo-idp.couper.io/userinfo"
            ………………… = {
              …………………………………‌ = request.headers.authorization
            }
          }
        }
      }
    }



### Härten

Sperre Bob aus! Nur Alice darf sich anmelden.

Branch: `launch`
Kontrolle z.B. per

    curl -i localhost:8080/userinfo --header "Authorization: Bearer eyJhbGciOiJS… ⟨Bobs Token⟩ …"
