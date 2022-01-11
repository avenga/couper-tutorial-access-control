server {
  api {
    base_path = "/api"
    access_control = ["user_token"]
    endpoint "/**" {
      proxy {
        backend {
          origin = "http://localhost:3001"
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
