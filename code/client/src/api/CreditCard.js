class CreditCard {
	constructor(credit_card_id, owner_name, number, expire_date, color) {
		if (credit_card_id) this.credit_card_id = credit_card_id;
		this.owner_name = owner_name;
		this.number = number;
		this.expire_date = expire_date;
		this.color = color;
	}
}

export default CreditCard;
