class CategoryBudget {
	constructor(total_budget_id, category_id, category_name, category_icon, budget, spent) {
		this.total_budget_id = total_budget_id;
		this.category_id = category_id;
		this.category_name = category_name;
		this.category_icon = category_icon;
		this.budget = budget;
		this.spent = spent || 0;
	}
}

export default CategoryBudget;
