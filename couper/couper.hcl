server {
  files {
    document_root = "../frontend/public/"
  }

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
          origin = env.BACKEND
          add_request_headers = {
            User = request.context.user_token.sub
          }
        }
      }
    }
  }

  api {
    endpoint "/login" {
      response {
        body =<<-END
          <html><script>
            localStorage.setItem("token", ${json_encode(default(request.form_body.token[0], ""))})
            location.href = "/" + location.hash
          </script></html>
        END
        headers = {
          Content-Type = "text/html"
        }
      }
    }

    endpoint "/userinfo" {
      access_control = ["user_token"]
      request {
        url = "${env.IDP}/userinfo"
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
    jwks_url = "${env.IDP}/jwks.json"
    beta_roles_claim = "role"
    beta_roles_map = {
      admin = ["read", "write", "delete"]
      user  = ["read"]
    }
    required_claims = ["role", "sub", "exp"]
    claims = {
      aud = env.GATEWAY
      iss = "${env.IDP}/"
    }
  }
}

defaults {
  environment_variables = {
    BACKEND = "http://localhost:3001"
    GATEWAY = "http://localhost:8080"
    IDP     = "https://demo-idp.couper.io"
  }
}
