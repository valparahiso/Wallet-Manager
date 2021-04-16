## REST API server

- GET       `/api/expenses`
    - Description: get the list of expenses
    - Query Params: category[], min_price, max_price, start_date, end_date
    - Request body: empty
    - Response body: list of expenses [{expense_id, date, price, category_id, category_name, category_icon, description, cash_or_card}, ...] 

- POST      `/api/expenses`
    - Description: create a new expense record 
    - Query Params: none
    - Request body: expense {date, price, category_id, description}
    - Response body: expense_id 

- PUT       `/api/expenses/:expense_id`
    - Description: update an expense record 
    - Query Params: none
    - Request body: {date, price, category_id, description} at least one of them
    - Response body: expense_id

- DELETE    `/api/expenses/:expense_id`
    - Description: delete an expense record
    - Query Params: none
    - Request body: empty 
    - Response body: null

<br>

- GET       `/api/categories`
    - Description: get the list of categories
    - Query Params: none 
    - Request body: empty
    - Response body: list of categories [{category_id, name, icon}, ...]

- POST      `/api/categories`
    - Description: create a new category record
    - Query Params: none
    - Request body: category {name, icon}
    - Response body: category_id

- PUT       `/api/categories/:category_id`
    - Description: update a category record
    - Query Params: none
    - Request body: {name, icon} at least one of them
    - Response body: category_id

- DELETE     `/api/categories/:category_id`
    - Description: delete a category record
    - Query Params: none
    - Request body: empty
    - Response body: null

<br>

- GET       `/api/budgets/total`
    - Description: get the total budget with the total spent in the budget period
    - Query Params: none
    - Request body: empty
    - Response body: total budget {total_budget_id, start_date, end_date, budget, period, spent}

- POST      `/api/budgets/total`
    - Description: create a new total budget but first you have to delete the existing one
    - Query Params: none
    - Request body: {start_date, end_date, budget, period}
    - Response body: total_budget_id

- PUT       `/api/budgets/total/:total_budget_id`
    - Description: update a total budget record
    - Query Params: none
    - Request body: {start_date, end_date, budget, period} at least one of them
    - Response body: total_budget_id

- DELETE     `/api/budgets/total/:total_budget_id`
    - Description: delete a total budget record
    - Query Params: none
    - Request body: empty
    - Response body: null

<br>

- GET       `/api/budgets/categories`
    - Description: get the list of budgets for every category with the total spent for every category
    - Query Params: none
    - Request body: empty 
    - Response body: list of category budgets [{total_budget_id, category_id, category_name, budget, spent}]

- POST      `/api/budgets/categories`
    - Description: create a new category budget
    - Query Params: none 
    - Request body: {total_budget_id, category_id, budget}
    - Response body: category_budget_id

- PUT       `/api/budgets/categories/:category_budget_id`
    - Description: modify a category budget record
    - Query Params: none
    - Request body: {category_id, budget} at least one of them
    - Response body: category_budget_id

- GET       `/api/budgets/categories/:category_budget_id`
    - Description: delete a category budget record
    - Query Params: none
    - Request body: empty
    - Response body: null

<br>

- GET       `/api/creditcards`
    - Description: get the list of credit cards
    - Query Params: none
    - Request body: empty 
    - Response body: list of credit cards[{credit_card_id, owner_name, number, expire_date}]

- POST      `/api/creditcards`
    - Description: create a new credit card
    - Query Params: none 
    - Request body: {owner_name, number, expire_date}
    - Response body: credit_card_id

- PUT       `/api/creditcards/:credit_card_id`
    - Description: modify a category budget record
    - Query Params: none
    - Request body: {owner_name, number, expire_date} at least one of them
    - Response body: credit_card_id

- GET       `/api/creditcards/:credit_card_id`
    - Description: delete a category budget record
    - Query Params: none
    - Request body: empty
    - Response body: null

<br>

## Server Database

- Table **`categories`**: category_id, name, icon
    - Primary keys: category_id
    - Foreign keys: none
    - Description: contains the categories with their name and icon name (if category has no icon will be stored the category color)

- Table **`expenses`**: expense_id, date, price, category_id, description, cash_or_card
    - Primary keys: expense_id
    - Foreign keys: category_id references `categories`(category_id)
    - Description: contains the expenses with their informations

- Table **`total_budgets`**: total_budget_id, start_date, end_date, budget, period
    - Primary keys: total_budget_id
    - Foreign keys: none
    - Description: contains the total budget, it has a constraint that leads to have only one row

- Table **`category_budgets`**: total_budget_id, category_id, budget
    - Primary keys: category_id
    - Foreign keys: category_id references `categories`(category_id); total_budget_id references `total_budgets`(total_budget_id)
    - Description: contains the budgets for the categories, the planning period is deducted from total_budgets table

- Table **`credit_cards`**: credit_card_id, owner_name, number, expire_date
    - Primary keys: credit_card_id
    - Foreign keys: none
    - Description: contains the credit cards registered by the user
