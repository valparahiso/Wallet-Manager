const moment = require('moment');

class TotalBudget{
    constructor(total_budget_id, start_date, end_date, budget, period, spent){
        if(total_budget_id) this.total_budget_id = total_budget_id;
        this.start_date = moment(start_date.toString()).format('YYYY-MM-DD').toString();
        this.end_date = moment(end_date.toString()).format('YYYY-MM-DD').toString();
        this.budget = budget;
        this.period = period;
        this.spent = spent || 0;
    }
}

export default TotalBudget; 
  
