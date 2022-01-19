server {
  api {
    base_path = "/api"
    access_control = ["user_token"]
    endpoint "/**" {
      beta_scope = {
        post   = "write"
        delete = "delete"
        get    = "read"
      }
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
      access_control = ["user_token"]
      request {
        url = "https://demo-idp.couper.io/userinfo"
        headers = {
          Authorization = request.headers.authorization
        }
      }
      response {
        json_body = merge(
          backend_responses.default.json_body,
          {
            scopes = request.context.scopes
          }
        )
      }
    }
  }
}

definitions {
  jwt "user_token" {
    jwks_url = "https://demo-idp.couper.io/jwks.json"
    beta_roles_claim = "role"
    beta_roles_map = {
      admin = ["read", "write", "delete"]
      user  = ["read"]
    }
  }
}
