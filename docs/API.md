# API

Base URL: `/api/v1`

## 인증

### `POST /auth/signup`

#### Request Body

```json
{
  "email": "john@email.com",
  "username": "John Doe",
  "password": "password"
}
```

### `POST /auth/signin`

#### Request Body

```json
{
  "email": "john@email.com",
  "password": "password"
}
```

### `POST /auth/signout`

## 사용자

### `GET /users/{userId}`

### `POST /users`

## 상품

### `GET /products`

### `GET /products/{productId}`