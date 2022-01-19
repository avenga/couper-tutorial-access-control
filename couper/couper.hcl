server {
  api {
    base_path = "/api"
    access_control = ["user_credentials"]
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
  basic_auth "user_credentials" {
    user = "joe"
    password = "asdf"
  }
}
