# API Documentation

## Base API URL

`http://localhost:5555/api`

## Required Headers

Public endpoints:

```http
Content-Type: application/json
```

Protected endpoints:

```http
Authorization: Bearer <token>
Content-Type: application/json
```

## Auth Endpoints

### POST `/api/auth/login`

Authenticates a user and returns a JWT token.

Example request:

```http
POST /api/auth/login
Content-Type: application/json
```

```json
{
  "username": "admin",
  "password": "123456"
}
```

Example response:

```json
{
  "_id": "6823f5292d4c4cbf52874911",
  "username": "admin",
  "role": "admin",
  "token": "jwt token"
}
```

### GET `/api/auth/me`

Returns the currently authenticated user.

Permissions: any authenticated user

Example request:

```http
GET /api/auth/me
Authorization: Bearer <token>
```

Example response:

```json
{
  "_id": "6823f5292d4c4cbf52874911",
  "username": "admin",
  "role": "admin",
  "isActive": true,
  "createdAt": "2026-05-14T08:15:00.000Z",
  "updatedAt": "2026-05-14T08:15:00.000Z"
}
```

## User Endpoints

### POST `/api/users`

Creates a new user.

Permissions: `admin`

Example request:

```http
POST /api/users
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "username": "worker1",
  "password": "123456",
  "role": "worker"
}
```

Example response:

```json
{
  "_id": "6823f60b2d4c4cbf52874921",
  "username": "worker1",
  "role": "worker",
  "isActive": true,
  "createdAt": "2026-05-14T08:18:51.000Z",
  "updatedAt": "2026-05-14T08:18:51.000Z"
}
```

### GET `/api/users`

Returns all users without password fields.

Permissions: `admin`

Example request:

```http
GET /api/users
Authorization: Bearer <token>
```

Example response:

```json
[
  {
    "_id": "6823f5292d4c4cbf52874911",
    "username": "admin",
    "role": "admin",
    "isActive": true,
    "createdAt": "2026-05-14T08:15:00.000Z",
    "updatedAt": "2026-05-14T08:15:00.000Z"
  },
  {
    "_id": "6823f60b2d4c4cbf52874921",
    "username": "worker1",
    "role": "worker",
    "isActive": true,
    "createdAt": "2026-05-14T08:18:51.000Z",
    "updatedAt": "2026-05-14T08:18:51.000Z"
  }
]
```

### GET `/api/users/:id`

Returns one user by id without the password field.

Permissions: `admin`

Example request:

```http
GET /api/users/6823f60b2d4c4cbf52874921
Authorization: Bearer <token>
```

Example response:

```json
{
  "_id": "6823f60b2d4c4cbf52874921",
  "username": "worker1",
  "role": "worker",
  "isActive": true,
  "createdAt": "2026-05-14T08:18:51.000Z",
  "updatedAt": "2026-05-14T08:18:51.000Z"
}
```

### PUT `/api/users/:id`

Updates a user. If `password` is included, it is hashed before saving.

Permissions: `admin`

Example request:

```http
PUT /api/users/6823f60b2d4c4cbf52874921
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "username": "worker2",
  "password": "new-password",
  "role": "worker",
  "isActive": true
}
```

Example response:

```json
{
  "_id": "6823f60b2d4c4cbf52874921",
  "username": "worker2",
  "role": "worker",
  "isActive": true,
  "createdAt": "2026-05-14T08:18:51.000Z",
  "updatedAt": "2026-05-14T08:22:10.000Z"
}
```

### DELETE `/api/users/:id`

Soft deletes a user by setting `isActive` to `false`.

Permissions: `admin`

Example request:

```http
DELETE /api/users/6823f60b2d4c4cbf52874921
Authorization: Bearer <token>
```

Example response:

```json
{
  "message": "User deactivated successfully"
}
```

## Product Endpoints

Base route: `/api/products`

### Product Pricing Rules

- A product must use exactly one pricing strategy: `price` or `variants`.
- A product cannot have both `price` and `variants`.
- Burgers can use variants.
- Sides, sauces, and drinks must use direct `price`.

### Sample Product JSON

Burger with variants:

```json
{
  "name": "Classic Burger",
  "description": "Beef patty, cheese, lettuce and house sauce.",
  "category": "burger",
  "variants": [
    { "name": "Single", "price": 8.5 },
    { "name": "Double", "price": 11.0 }
  ],
  "image": "https://example.com/images/classic-burger.jpg",
  "displayOrder": 1
}
```

Side with direct price:

```json
{
  "name": "Fries",
  "description": "Crispy salted fries.",
  "category": "side",
  "price": 3.5,
  "image": "https://example.com/images/fries.jpg",
  "displayOrder": 2
}
```

Sauce with direct price:

```json
{
  "name": "Garlic Sauce",
  "description": "Creamy garlic dipping sauce.",
  "category": "sauce",
  "price": 1.0,
  "image": "https://example.com/images/garlic-sauce.jpg",
  "displayOrder": 3
}
```

### POST `/api/products`

Creates a new product.

Permissions: `admin`

Example request:

```http
POST /api/products
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "name": "Classic Burger",
  "description": "Beef patty, cheese, lettuce and house sauce.",
  "category": "burger",
  "variants": [
    { "name": "Single", "price": 8.5 },
    { "name": "Double", "price": 11.0 }
  ],
  "image": "https://example.com/images/classic-burger.jpg",
  "displayOrder": 1
}
```

Example response:

```json
{
  "_id": "68247d4f1c84df8fc6e6a101",
  "name": "Classic Burger",
  "description": "Beef patty, cheese, lettuce and house sauce.",
  "category": "burger",
  "price": null,
  "variants": [
    { "name": "Single", "price": 8.5 },
    { "name": "Double", "price": 11.0 }
  ],
  "image": "https://example.com/images/classic-burger.jpg",
  "isAvailable": true,
  "displayOrder": 1,
  "createdBy": {
    "_id": "6823f5292d4c4cbf52874911",
    "username": "admin",
    "role": "admin"
  },
  "updatedBy": {
    "_id": "6823f5292d4c4cbf52874911",
    "username": "admin",
    "role": "admin"
  },
  "createdAt": "2026-05-14T10:00:00.000Z",
  "updatedAt": "2026-05-14T10:00:00.000Z"
}
```

### GET `/api/products`

Returns products sorted by `displayOrder` ascending, then `createdAt` ascending.

Permissions: `admin`, `worker`

Optional query filters:

- `category`
- `isAvailable`

Examples:

```http
GET /api/products
GET /api/products?category=burger
GET /api/products?category=sauce&isAvailable=true
```

Example response:

```json
[
  {
    "_id": "68247d4f1c84df8fc6e6a101",
    "name": "Classic Burger",
    "description": "Beef patty, cheese, lettuce and house sauce.",
    "category": "burger",
    "price": null,
    "variants": [
      { "name": "Single", "price": 8.5 },
      { "name": "Double", "price": 11.0 }
    ],
    "image": "https://example.com/images/classic-burger.jpg",
    "isAvailable": true,
    "displayOrder": 1,
    "createdBy": {
      "_id": "6823f5292d4c4cbf52874911",
      "username": "admin",
      "role": "admin"
    },
    "updatedBy": {
      "_id": "6823f5292d4c4cbf52874911",
      "username": "admin",
      "role": "admin"
    },
    "createdAt": "2026-05-14T10:00:00.000Z",
    "updatedAt": "2026-05-14T10:00:00.000Z"
  },
  {
    "_id": "68247dbf1c84df8fc6e6a102",
    "name": "Fries",
    "description": "Crispy salted fries.",
    "category": "side",
    "price": 3.5,
    "variants": [],
    "image": "https://example.com/images/fries.jpg",
    "isAvailable": true,
    "displayOrder": 2,
    "createdBy": {
      "_id": "6823f5292d4c4cbf52874911",
      "username": "admin",
      "role": "admin"
    },
    "updatedBy": {
      "_id": "6823f5292d4c4cbf52874911",
      "username": "admin",
      "role": "admin"
    },
    "createdAt": "2026-05-14T10:01:00.000Z",
    "updatedAt": "2026-05-14T10:01:00.000Z"
  }
]
```

### GET `/api/products/:id`

Returns one product by id.

Permissions: `admin`, `worker`

Example request:

```http
GET /api/products/68247d4f1c84df8fc6e6a101
Authorization: Bearer <token>
```

Example response:

```json
{
  "_id": "68247d4f1c84df8fc6e6a101",
  "name": "Classic Burger",
  "description": "Beef patty, cheese, lettuce and house sauce.",
  "category": "burger",
  "price": null,
  "variants": [
    { "name": "Single", "price": 8.5 },
    { "name": "Double", "price": 11.0 }
  ],
  "image": "https://example.com/images/classic-burger.jpg",
  "isAvailable": true,
  "displayOrder": 1,
  "createdBy": {
    "_id": "6823f5292d4c4cbf52874911",
    "username": "admin",
    "role": "admin"
  },
  "updatedBy": {
    "_id": "6823f5292d4c4cbf52874911",
    "username": "admin",
    "role": "admin"
  },
  "createdAt": "2026-05-14T10:00:00.000Z",
  "updatedAt": "2026-05-14T10:00:00.000Z"
}
```

### PUT `/api/products/:id`

Updates an existing product.

Permissions: `admin`

Example request:

```http
PUT /api/products/68247d4f1c84df8fc6e6a101
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "name": "Classic Burger Deluxe",
  "description": "Beef patty, cheddar, lettuce, tomato and house sauce.",
  "category": "burger",
  "variants": [
    { "name": "Single", "price": 9.0 },
    { "name": "Double", "price": 11.5 }
  ],
  "displayOrder": 1,
  "isAvailable": true
}
```

Example response:

```json
{
  "_id": "68247d4f1c84df8fc6e6a101",
  "name": "Classic Burger Deluxe",
  "description": "Beef patty, cheddar, lettuce, tomato and house sauce.",
  "category": "burger",
  "price": null,
  "variants": [
    { "name": "Single", "price": 9.0 },
    { "name": "Double", "price": 11.5 }
  ],
  "image": "https://example.com/images/classic-burger.jpg",
  "isAvailable": true,
  "displayOrder": 1,
  "createdBy": {
    "_id": "6823f5292d4c4cbf52874911",
    "username": "admin",
    "role": "admin"
  },
  "updatedBy": {
    "_id": "6823f5292d4c4cbf52874911",
    "username": "admin",
    "role": "admin"
  },
  "createdAt": "2026-05-14T10:00:00.000Z",
  "updatedAt": "2026-05-14T10:10:00.000Z"
}
```

### DELETE `/api/products/:id`

Soft deletes a product by setting `isAvailable` to `false`.

Permissions: `admin`

Example request:

```http
DELETE /api/products/68247d4f1c84df8fc6e6a101
Authorization: Bearer <token>
```

Example response:

```json
{
  "message": "Product marked as unavailable"
}
```

## Order Endpoints

Base route: `/api/orders`

### Order Status Values

- `in_progress`
- `done`

### POST `/api/orders`

Creates a new order. Prices and `totalAmount` are calculated on the backend.

Permissions: `admin`, `worker`

Example request:

```http
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "items": [
    {
      "product": "PRODUCT_ID_HERE",
      "variantName": "Double",
      "quantity": 1,
      "removedIngredients": ["kiseli krastavci", "ljubičasti luk"],
      "addedIngredients": [],
      "note": "bez luka"
    },
    {
      "product": "PRODUCT_ID_HERE",
      "quantity": 2,
      "note": ""
    }
  ],
  "note": "Narudžba za sto 3"
}
```

Example response:

```json
{
  "_id": "6824a1511c84df8fc6e6a201",
  "orderNumber": 1,
  "items": [
    {
      "product": {
        "_id": "68247d4f1c84df8fc6e6a101",
        "name": "Classic Burger",
        "category": "burger",
        "price": null,
        "variants": [
          { "name": "Single", "price": 8.5 },
          { "name": "Double", "price": 11.0 }
        ],
        "isAvailable": true
      },
      "productName": "Classic Burger",
      "variantName": "Double",
      "quantity": 1,
      "unitPrice": 11,
      "totalPrice": 11,
      "removedIngredients": ["kiseli krastavci", "ljubičasti luk"],
      "addedIngredients": [],
      "note": "bez luka"
    },
    {
      "product": {
        "_id": "68247dbf1c84df8fc6e6a102",
        "name": "Fries",
        "category": "side",
        "price": 3.5,
        "variants": [],
        "isAvailable": true
      },
      "productName": "Fries",
      "variantName": "",
      "quantity": 2,
      "unitPrice": 3.5,
      "totalPrice": 7,
      "removedIngredients": [],
      "addedIngredients": [],
      "note": ""
    }
  ],
  "totalAmount": 18,
  "status": "in_progress",
  "createdBy": {
    "_id": "6823f5292d4c4cbf52874911",
    "username": "admin",
    "role": "admin"
  },
  "note": "Narudžba za sto 3",
  "createdAt": "2026-05-14T11:00:00.000Z",
  "updatedAt": "2026-05-14T11:00:00.000Z"
}
```

### GET `/api/orders`

Returns orders sorted by newest first.

Permissions: `admin`, `worker`

Optional query filters:

- `status`
- `createdBy`
- `dateFrom`
- `dateTo`

Examples:

```http
GET /api/orders
GET /api/orders?status=in_progress
GET /api/orders?status=done
GET /api/orders?dateFrom=2026-05-14&dateTo=2026-05-14
```

Example response:

```json
[
  {
    "_id": "6824a1511c84df8fc6e6a201",
    "orderNumber": 1,
    "items": [
      {
        "product": {
          "_id": "68247d4f1c84df8fc6e6a101",
          "name": "Classic Burger",
          "category": "burger",
          "price": null,
          "variants": [
            { "name": "Single", "price": 8.5 },
            { "name": "Double", "price": 11.0 }
          ],
          "isAvailable": true
        },
        "productName": "Classic Burger",
        "variantName": "Double",
        "quantity": 1,
        "unitPrice": 11,
        "totalPrice": 11,
        "removedIngredients": ["kiseli krastavci", "ljubičasti luk"],
        "addedIngredients": [],
        "note": "bez luka"
      }
    ],
    "totalAmount": 11,
    "status": "in_progress",
    "createdBy": {
      "_id": "6823f5292d4c4cbf52874911",
      "username": "admin",
      "role": "admin"
    },
    "note": "Narudžba za sto 3",
    "createdAt": "2026-05-14T11:00:00.000Z",
    "updatedAt": "2026-05-14T11:00:00.000Z"
  }
]
```

### GET `/api/orders/:id`

Returns one order by id.

Permissions: `admin`, `worker`

Example request:

```http
GET /api/orders/6824a1511c84df8fc6e6a201
Authorization: Bearer <token>
```

Example response:

```json
{
  "_id": "6824a1511c84df8fc6e6a201",
  "orderNumber": 1,
  "items": [
    {
      "product": {
        "_id": "68247d4f1c84df8fc6e6a101",
        "name": "Classic Burger",
        "category": "burger",
        "price": null,
        "variants": [
          { "name": "Single", "price": 8.5 },
          { "name": "Double", "price": 11.0 }
        ],
        "isAvailable": true
      },
      "productName": "Classic Burger",
      "variantName": "Double",
      "quantity": 1,
      "unitPrice": 11,
      "totalPrice": 11,
      "removedIngredients": ["kiseli krastavci", "ljubičasti luk"],
      "addedIngredients": [],
      "note": "bez luka"
    }
  ],
  "totalAmount": 11,
  "status": "in_progress",
  "createdBy": {
    "_id": "6823f5292d4c4cbf52874911",
    "username": "admin",
    "role": "admin"
  },
  "note": "Narudžba za sto 3",
  "createdAt": "2026-05-14T11:00:00.000Z",
  "updatedAt": "2026-05-14T11:00:00.000Z"
}
```

### PUT `/api/orders/:id/status`

Updates order status.

Permissions: `admin`, `worker`

Example request:

```http
PUT /api/orders/6824a1511c84df8fc6e6a201/status
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "status": "done"
}
```

Example response:

```json
{
  "_id": "6824a1511c84df8fc6e6a201",
  "orderNumber": 1,
  "items": [
    {
      "product": {
        "_id": "68247d4f1c84df8fc6e6a101",
        "name": "Classic Burger",
        "category": "burger",
        "price": null,
        "variants": [
          { "name": "Single", "price": 8.5 },
          { "name": "Double", "price": 11.0 }
        ],
        "isAvailable": true
      },
      "productName": "Classic Burger",
      "variantName": "Double",
      "quantity": 1,
      "unitPrice": 11,
      "totalPrice": 11,
      "removedIngredients": ["kiseli krastavci", "ljubičasti luk"],
      "addedIngredients": [],
      "note": "bez luka"
    }
  ],
  "totalAmount": 11,
  "status": "done",
  "createdBy": {
    "_id": "6823f5292d4c4cbf52874911",
    "username": "admin",
    "role": "admin"
  },
  "note": "Narudžba za sto 3",
  "createdAt": "2026-05-14T11:00:00.000Z",
  "updatedAt": "2026-05-14T11:05:00.000Z"
}
```

## Role Permissions

- `admin`: full access to auth, users, and products
- `worker`: can access authenticated routes and read products and orders

## Protected Route Notes

- Protected backend endpoints require `Authorization: Bearer <token>`.
- The frontend stores the JWT in `localStorage` under `authToken`.
- The frontend stores the logged-in user in `localStorage` under `authUser`.
- Requests without a valid token return `401 Not authorized, token failed`.

## Frontend POS Note

- The POS page uses `GET /api/products` to load available menu items.
- The POS page uses `POST /api/orders` to submit the current order.
- The frontend sends only order items and note; pricing and total calculation stay on the backend.
