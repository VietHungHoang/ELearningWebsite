{
  "openapi": "3.0.1",
  "info": {
    "title": "OpenAPI definition",
    "version": "v0"
  },
  "servers": [
    {
      "url": "http://localhost:8083",
      "description": "Generated server url"
    }
  ],
  "paths": {
    "/api/notifications": {
      "post": {
        "tags": [
          "notification-controller"
        ],
        "operationId": "createNotification",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/NotificationRequest"
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/ApiResponseNotificationResponse"
                }
              }
            }
          }
        }
      }
    },
    "/api/notifications/{notificationId}/user/{userId}/mark-read": {
      "post": {
        "tags": [
          "notification-controller"
        ],
        "operationId": "markAsRead",
        "parameters": [
          {
            "name": "notificationId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "userId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int64"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/ApiResponseNotificationResponse"
                }
              }
            }
          }
        }
      }
    },
    "/api/notifications/user/{userId}/mark-all-read": {
      "post": {
        "tags": [
          "notification-controller"
        ],
        "operationId": "markAllAsRead",
        "parameters": [
          {
            "name": "userId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int64"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/ApiResponseLong"
                }
              }
            }
          }
        }
      }
    },
    "/api/notifications/user/{userId}": {
      "get": {
        "tags": [
          "notification-controller"
        ],
        "operationId": "getUserNotifications",
        "parameters": [
          {
            "name": "userId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int64"
            }
          },
          {
            "name": "page",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "format": "int32",
              "default": 0
            }
          },
          {
            "name": "size",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "format": "int32",
              "default": 10
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/ApiResponseListNotificationResponse"
                }
              }
            }
          }
        }
      }
    },
    "/api/notifications/user/{userId}/unread-count": {
      "get": {
        "tags": [
          "notification-controller"
        ],
        "operationId": "getUnreadCount",
        "parameters": [
          {
            "name": "userId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int64"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/ApiResponseLong"
                }
              }
            }
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "NotificationRequest": {
        "required": [
          "message",
          "title",
          "type",
          "userId"
        ],
        "type": "object",
        "properties": {
          "userId": {
            "type": "integer",
            "format": "int64"
          },
          "type": {
            "type": "string"
          },
          "title": {
            "type": "string"
          },
          "message": {
            "type": "string"
          },
          "metadata": {
            "type": "object",
            "additionalProperties": {
              "type": "object"
            }
          }
        }
      },
      "ApiResponseNotificationResponse": {
        "type": "object",
        "properties": {
          "status": {
            "type": "integer",
            "format": "int32"
          },
          "message": {
            "type": "string"
          },
          "data": {
            "$ref": "#/components/schemas/NotificationResponse"
          }
        }
      },
      "NotificationResponse": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "userId": {
            "type": "integer",
            "format": "int64"
          },
          "type": {
            "type": "string"
          },
          "title": {
            "type": "string"
          },
          "message": {
            "type": "string"
          },
          "read": {
            "type": "boolean"
          },
          "createdAt": {
            "type": "string",
            "format": "date-time"
          },
          "metadata": {
            "type": "object",
            "additionalProperties": {
              "type": "object"
            }
          }
        }
      },
      "ApiResponseLong": {
        "type": "object",
        "properties": {
          "status": {
            "type": "integer",
            "format": "int32"
          },
          "message": {
            "type": "string"
          },
          "data": {
            "type": "integer",
            "format": "int64"
          }
        }
      },
      "ApiResponseListNotificationResponse": {
        "type": "object",
        "properties": {
          "status": {
            "type": "integer",
            "format": "int32"
          },
          "message": {
            "type": "string"
          },
          "data": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/NotificationResponse"
            }
          }
        }
      }
    }
  }
}