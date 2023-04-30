
# HrdWeb

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.1.5.


## Development server

Run `npm install && ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.


## Docker Development server

Run `docker-compose up` for a dev server using docker. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.


## Login Credentials
1. username: **admin** ; password: **admin**
2. username: **Bryan111** ; password: **ba123**
3. username: **livliv** ; password: **livyY123**,


## General Notes
### Employee List
1. Click on table header to **sort** the list *(username, name, email, group)*
2. Click on any table's row gonna redirect to **employee detail page** 
3. Pagination gonna **return to first page** if filter is changed *(except sorting)*
4. I don't know the purpose of **description** in **employee object** from the requirement,
but i still keep it there just in case it was needed.

### Employee Upsert (Update and insert)
1. Form is using **required validators**
2. **Duplicate email** is checked on submit
3. Email is using **email format validators**
4. **Basic salary input** gonna be styled automatically with **rupiah currency formats**
5. On update page, **username** form control is **uneditable**
6. IMPORTANT MISS!!! i forgot to add **username duplicate checker**.... my bad :(((
it was easy though, just copy paste the logic from *duplicate email checking* on **EmployeeService**

### Employee Detail
1. Using **Rupiah Currency Format** e.g. *Rp. 100,000,005.012*
2. Date styled using default Angular Date Pipe values

### Login
1. User login credentials from above to login
2. After login, system gonna **save the login data to localStorage**. this is for checking if user already logged in or not.
3. Yes, the login data has no token on it, and i store it directly without any encryption, 
so of course the security sucks and the login data can be edited and manipulated
(we not gonna create an entire fullstack app here, so... yeah).
