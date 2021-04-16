class Category{
    constructor(category_id, name, icon){
        if(category_id) this.category_id = category_id;
        this.name = name;
        if(icon) this.icon = icon;
    }
}

export default Category;