server {
  api {
    base_path = "/api"
    access_control = ["user_token"]
    endpoint "/**" {
      proxy {
        backend {
          origin = "http://localhost:3001"
          add_request_headers = {
            User = request.context.user_token.sub
          }
        }
      }
    }
  }

  api {
    endpoint "/userinfo" {
      request {
        url = "https://demo-idp.couper.io/userinfo"
        headers = {
          Authorization = request.headers.authorization
        }
      }
    }
  }
}

definitions {
  jwt "user_token" {
    jwks_url = "https://demo-idp.couper.io/jwks.json"
  }
}
