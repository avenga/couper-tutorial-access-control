server {
  api {
    base_path = "/api"
    endpoint "/**" {
      proxy {
        backend {
          origin = "http://localhost:3001"
        }
      }
    }
  }
}
