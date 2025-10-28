# Flow Website

## About

Flow is a complete hydration solution that aims to keep you refreshed through the day. With 5 essential salts and 10 vitamins your micronutrient needs are met. Scientifically crafted, Flow aims to provide you with exactly what is right for your body to remain in peak performance throughout the day.

## For the devs

### Techstack

- [NextJs](https://nextjs.org/docs)
- [PostgreSQL](https://www.postgresql.org/)
- [NextAuthJs](https://next-auth.js.org/)
- For UI - [ShadCN](https://ui.shadcn.com/)
- For Payments - [Zoho Pay](https://www.zoho.com/in/payments/api/v1/introduction/#account-id)

### Prerequisites

- `Building` and `Maintaining` **REST APIS**
- Building full scale **Full Stack Applications**
- Worked with `Relational Database Management Systems`**(RDBMS)**
- Experience with any **Payment Gateways**
- On local machine:
  - `Git` and `GitHub`
  - `NodeJs`
  - `PostgreSQL`, `psql` and if possible `pgAdmin 4`

### Project Init

```bash
# clone repo to local machine
git clone https://github.com/DarkModeSolutions/Flow-Main-Website.git

# enter project working dir
cd Flow-Main-Website/flow-main-website

# intsall deps
npm i
```

- *`Important: Please get the **.env** file from the devs before running the project`*

```bash
# after successful installation and loading the .env file
npm run dev
```

- The project will run on *`http://localhost:3000`*

### API Docs

- **Auth**: `/api/auth`
  - Since we are using `NextAuth`, we will only be creating custom *`register`* **APIs**.
  - For *sign in* and *sign out* functionalities, we can use the in built method of `NextAuth`.
  
  - Routes:
    - **Name**: `User Register`
      - **url**: `/register`
      - **Method**: `POST`
      - **Body**:

      ```json
        {
            "email": String,
            "password": String,
            "name": String,
            "address": {
                "addressLine1": String,
                "addressLine2": String,
                "pincode": String,
                "city": String,
                "state": String,
                "country": String,
            },
            "phone": String,
            "age": Number
        }
      ```

      - **Response**:

      ```json
        {
            "message": String,
            "user": {
                "email": String,
                "name": String,
                "phone": String,
                "age": Number,
                "address": {
                    "addressLine1": String,
                    "addressLine2": String,
                    "pincode": String,
                    "city": String,
                    "state": String,
                    "country": String,
                },
                "id": String,
                "isAdmin": Boolean,
                "buyingAsGuest": Boolean,
                "favourites": String[],
                "zohoAccessToken": String,
                "zohoRefreshToken": String,
                "zohoTokenExpiry": Date,
                "zohoRefreshTokenCounter": Number
            }
        }
      ```

    - **Name**: `Guest User Register`
      - **url**: `/registerAsGuest`
      - **Method**: `POST`
      - **Body**:

      ```json
        {
            "email": String,
            "name": String,
            "address": {
                "addressLine1": String,
                "addressLine2": String,
                "pincode": String,
                "city": String,
                "state": String,
                "country": String,
            },
            "phone": String,
            "age": Number
        }
      ```

      - **Response**:

      ```json
        {
            "message": String,
            "user": {
                "email": String,
                "name": String,
                "phone": String,
                "age": Number,
                "address": {
                    "addressLine1": String,
                    "addressLine2": String,
                    "pincode": String,
                    "city": String,
                    "state": String,
                    "country": String,
                },
                "id": String,
                "isAdmin": Boolean,
                "buyingAsGuest": Boolean,
                "favourites": String[],
                "zohoAccessToken": String,
                "zohoRefreshToken": String,
                "zohoTokenExpiry": Date,
                "zohoRefreshTokenCounter": Number
            }
        }
      ```

- **Products**: `/api/products`
  - This API is used to **retreive** all products, by its **ID**, and also completes payment.
  
  - Routes:
    - **Name**: `Get All Products`
      - **url**: `/getAllProducts`
      - **Method**: `GET`

      - **Response**:

      ```json
        {
            "message": String,
            "products": {
                "name": String,
                "id": String,
                "createdAt": Date,
                "updatedAt": Date,
                "description": String,
                "price": Number,
                "stock": Number,
                "imageUrl": String,
                "tags": String[],
                "searchTags": String[]
            }[]
        }
      ```

    - **Name**: `Get Product By ID`
      - **url**: `/getProductById/[productId]`
      - **Method**: `GET`

      - **Response**:

      ```json
        {
            "message": String,
            "products": {
                "name": String,
                "id": String,
                "createdAt": Date,
                "updatedAt": Date,
                "description": String,
                "price": Number,
                "stock": Number,
                "imageUrl": String,
                "tags": String[],
                "searchTags": String[]
            }
        }
      ```

    - **Name**: `Product Purchase`
      - **url**: `/productPurchase`
      - **Method**: `PATCH`
      - **Body**:

      ```json
        {
            "orderId": String,
            "paymentLink": String
        }
      ```

      - **Response**:

      ```json
        {
            "message": String,
            "orderFullfillmentStatus": String
        }
      ```

- **User**: `/api/user/[id]`
  - This API is used to **retreive** all user data and user related data.
  
  - Routes:
    - **Name**: `Create New Address`
      - **url**: `/createNewAddress`
      - **Method**: `POST`
      - **Authenticated**: `true`
      - **Body**:

      ```json
        {
            "addressLine1": String,
            "addressLine2": String,
            "pincode": String,
            "city": String,
            "state": String,
            "country": String,
            "addressName": String
        }
      ```

      - **Response**:

      ```json
        {
            "message": String,
            "address": {
                "id": String,
                "city": String,
                "pincode": String,
                "state": String,
                "country": String,
                "addressLine1": String,
                "addressLine2": String,
                "createdAt": Date,
                "updatedAt": Date,
                "userId": String,
                "addressName": String
            }
        }
      ```

    - **Name**: `Delete User Address`
      - **url**: `/deleteUserAddress/[addressId]`
      - **Authenticated**: `true`
      - **Method**: `DELETE`

      - **Response**:

      ```json
        {
            "message": String,
        }
      ```

    - **Name**: `Get User Address Details`
      - **url**: `/getUserAddressDetails`
      - **Authenticated**: `true`
      - **Method**: `GET`

      - **Response**:

      ```json
        {
            "message": String,
            "address": {
                "id": String,
                "city": String,
                "pincode": String,
                "state": String,
                "country": String,
                "addressLine1": String,
                "addressLine2": String,
                "createdAt": Date,
                "updatedAt": Date,
                "userId": String,
                "addressName": String
            }[]
        }
      ```

    - **Name**: `Order Details`
      - **url**: `/order-details`
      - **Authenticated**: `true`
      - **Method**: `GET`

      - **Response**:

      ```json
        {
            "message": String,
            "orders": {
                "id": String,
                "status": String,
                "userId": String,
                "total": Number,
                "orderUsername": String,
                "orderEmail": String,
                "orderPhone": String,
                "orderAddress": String,
                "orderedAt": Date
            }[]
        }
      ```

    - **Name**: `Update User Details`
      - **url**: `/updateDetails`
      - **Authenticated**: `true`
      - **Method**: `POST`
      - **Body**:

      ```json
        {
            "updatedAge": Number,
            "updatedEmail": String,
            "updatedPhone": String,
            "updatedName": String
        }
      ```

      - **Response**:

      ```json
        {
            "message": String,
            "user": {
                "email": String,
                "password": String,
                "name": String,
                "phone": String,
                "age": Number,
                "id": String,
                "isAdmin": Boolean,
                "buyingAsGuest": Boolean,
                "favourites": String[],
                "zohoAccessToken": String,
                "zohoRefreshToken": String,
                "zohoTokenExpiry": Date,
                "zohoRefreshTokenCounter": Number,
                "createAt": Date,
                "updatedAt": Date
            }
        }
      ```

    - **Name**: `Update User Address Details`
      - **url**: `/updateUserAddressDetails/[addressId]`
      - **Authenticated**: `true`
      - **Method**: `PATCH`
      - **Body**:

      ```json
        {
            "updatedAddressLine1": String,
            "updatedAddressLine2": String,
            "updatedPincode": String,
            "updatedCity": String,
            "updatedState": String,
            "updatedCountry": String,
            "updatedAddressName": String
        }
      ```

      - **Response**:

      ```json
        {
            "message": String,
            "address": {
                "id": String,
                "addressLine1": String,
                "addressLine2": String,
                "pincode": String,
                "city": String,
                "state": String,
                "country": String,
                "userId": String,
                "createdAt": Date,
                "updatedAt": Date
            }
        }
      ```

- **Zoho**: `/api/zoho`
  - This API is used to **complete** all payments.
  
  - Routes:
    - **Name**: `Payment Session`
      - **url**: `/payment-session`
      - **Method**: `POST`
      - **Authenticated**: `true`
      - **Authorization**: `true`
      - **Body**:

      ```json
        {
            "amount": Number,
            "currency": String,
            "email": String,
            "phone": String,
            "reference_id": String,
            "description": String,
            "expires_at": String,
            "notify_user": Boolean,
            "return_url": String,
        }
      ```

      - **Response**:

      ```json
        {
            "success": Boolean,
            "checkout_url": String,
            "orderId": String
        }
      ```
