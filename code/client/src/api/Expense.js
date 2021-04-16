const moment = require('moment');

class Expense{
    constructor(expense_id, date, price, category_id, category_name, category_icon, description, cash_or_card){
        if(expense_id) this.expense_id = expense_id;
        this.date = moment(date.toString()).format('YYYY-MM-DD').toString();
        this.price = price;
        this.category_id = category_id;
        this.category_name = category_name;
        if(category_name) this.category_name = category_name;
        if(category_icon) this.category_icon = category_icon;
        if(description) this.description = description;    
        this.cash_or_card = cash_or_card;
    }
}

export default Expense;