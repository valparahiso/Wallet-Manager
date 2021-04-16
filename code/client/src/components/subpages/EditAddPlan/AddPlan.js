// Essentials
import React from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

// Components
import PeriodSection from './PeriodSection';
import BudgetSection from './BudgetSection';
import CategoriesSection from './CategoriesSection';
import { SelectFeedbackRedirect } from '../../utils/Feedbacks';

// CSS import
import '../../../App.css';

// Modules
const moment = require('moment');


class AddPlan extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            categories: [],
            totalBudget: {},
            categoryBudgets: [],
            suggestedBudget: 0,
            budgetsSum: 0,
            periodSentence: "",
            saveFeedback: false,
            exceedFeedback: false,
            wrongDateFeedback: false,
            savable: true,
            loading: true,
            updateBudget: false,
            updateCategoryBudgets: false
        }
    }

    componentDidMount() {
        let categories = this.props.categories || [];
        let budgets = [];
        let total=0;

        if (this.props.categoryBudgets && this.props.totalBudget && this.props.categories) {
            budgets = this.props.categoryBudgets.slice();
            let usedCategories = [];
            budgets.forEach((el) => {
                total += el.budget;
                el.percentage = (el.budget / this.props.totalBudget.budget * 100);
                usedCategories.push(el.category_id);
            });
            categories = this.props.categories.filter((el) => {
                return !usedCategories.includes(el.category_id)
            })
        }

        this.setState({
            loading: false,
            categories: categories,
            totalBudget: Object.assign({}, this.props.totalBudget || {}),
            categoryBudgets: budgets || [],
            budgetsSum: total
        })
    }

    updateCategories = (categories, categoryBudgets) => {
        let usedCategories = [];
        categoryBudgets.forEach((el) => {
            usedCategories.push(el.category_id);
        });

        return categories.filter((el) => {
            return !usedCategories.includes(el.category_id)
        })
    }

    updatePlanDuration = (name, checked, start_date, end_date) => {
        let total = this.state.totalBudget;
        let wrongDate = false;

        let periodSentence = "";
        if (checked) {
            switch (name) {
                case 'weekly':
                    total.period = name;
                    total.start_date = moment().startOf('week').format('YYYY-MM-DD').toString();
                    total.end_date = moment().endOf('week').format('YYYY-MM-DD').toString();
					periodSentence = " the current week " + moment(total.start_date).format("YYYY");
                    break;
                case 'monthly':
                    total.period = name;
                    total.start_date = moment().startOf('month').format('YYYY-MM-DD').toString();
                    total.end_date = moment().endOf('month').format('YYYY-MM-DD').toString();
					periodSentence = " the current month of " + moment(total.start_date).format("MMMM");
                    break;
                case 'yearly':
                    total.period = name;
                    total.start_date = moment().startOf('year').format('YYYY-MM-DD').toString();
                    total.end_date = moment().endOf('year').format('YYYY-MM-DD').toString();
					periodSentence = " the current year " + moment(total.start_date).format("YYYY");
                    break;
                case 'custom':
                    total.period = name;
                    total.start_date = start_date || this.state.totalBudget.start_date;
                    total.end_date = end_date || this.state.totalBudget.end_date;
                    periodSentence = " a custom period";
                    break;
                default:
                    break;
            }
        }

        periodSentence += " (" + moment(start_date || this.state.totalBudget.start_date).format('DD/MM/YYYY').toString() + 
							"-" + moment(end_date || this.state.totalBudget.end_date).format('DD/MM/YYYY').toString() + ").";

        if((start_date || this.state.totalBudget.start_date) && 
            (end_date || this.state.totalBudget.end_date) && 
            moment(start_date || this.state.totalBudget.start_date).isAfter(end_date || this.state.totalBudget.end_date, 'day'))
            wrongDate = true;

        let suggestedBudget = 0;
		if( this.state.totalBudget.start_date && this.state.totalBudget.end_date && this.props.expenses.length > 0) {
			let totalSpent = 0;
			this.props.expenses.forEach( el => totalSpent += el.price );
			// console.log("Total spent " + totalSpent);

			let totalPeriod = moment(this.props.expenses[0].date)
				.diff(moment(this.props.expenses[this.props.expenses.length-1].date), 'days') + 1;
			// console.log("Total period " + totalPeriod);

			let selectedPeriod = moment(this.state.totalBudget.end_date)
				.diff(moment(this.state.totalBudget.start_date), 'days') + 1;
			// console.log("Selected period " + selectedPeriod);
			
			suggestedBudget = totalSpent / totalPeriod * selectedPeriod;
			// console.log("Suggested budget " + suggestedBudget);
		}

        this.setState({ totalBudget: total, updateBudget: true, suggestedBudget: suggestedBudget, periodSentence: periodSentence, wrongDateFeedback: wrongDate, savable:!wrongDate });
    }

    updateBudget = (value) => {
        this.setState((state) => {
            state.totalBudget.budget = parseFloat(value.replace(",",".") || 0);
            state.updateBudget = true;
        });

        let feedback = false;
        if (this.state.budgetsSum > parseFloat(value || 0)) {
            feedback = true;
        }
        this.setState({ exceedFeedback: feedback, savable: !feedback });

        this.setState(state => {
            state.categoryBudgets.forEach(el => {
                el.percentage = (el.budget / parseFloat(value || 0) * 100);
            });
        });
    }

    addCategoryBudget = (category_id, budget) => {
        const id = parseInt(category_id);
        const name = this.state.categories.find(el => el.category_id === id).name;
        let categoryBudget = { category_id: id, category_name: name, budget: parseFloat(budget.replace(",",".")) };
        categoryBudget.percentage = (budget.replace(",",".") / this.state.totalBudget.budget * 100);
        const total = this.state.budgetsSum + parseFloat(budget.replace(",","."));
           
        this.setState({
            categories: this.updateCategories(this.props.categories, this.state.categoryBudgets.concat(categoryBudget)),
            categoryBudgets: this.state.categoryBudgets.concat(categoryBudget),
            budgetsSum: total,
            updateCategoryBudgets: true
        });

        let feedback = false;
        if (total > this.state.totalBudget.budget) {
            feedback = true;
        }
        this.setState({ exceedFeedback: feedback, savable: !feedback });
    }

    editCategoryBudget = (category_id, budget) => {
        const index = this.state.categoryBudgets.findIndex(el => el.category_id === parseInt(category_id));
        const total = this.state.budgetsSum - this.state.categoryBudgets[index].budget + parseFloat(budget.replace(",","."));

        this.setState((state) => {
            state.categoryBudgets[index].budget = parseFloat(budget.replace(",","."));
            state.categoryBudgets[index].percentage = (budget.replace(",",".") / state.totalBudget.budget * 100);
            state.budgetsSum = total;
            state.updateCategoryBudgets = true;
        });

        let feedback = false;
        if (total > this.state.totalBudget.budget) {
            feedback = true;
        }
        this.setState({ exceedFeedback: feedback, savable: !feedback });
    }

    deleteCategoryBudget = (category_id) => {
        let budgets = this.state.categoryBudgets.slice();
        const index = budgets.findIndex(el => el.category_id === parseInt(category_id));
        const total = this.state.budgetsSum - this.state.categoryBudgets[index].budget;
        budgets.splice(index, 1);

        this.setState({
            categories: this.updateCategories(this.props.categories, budgets),
            categoryBudgets: budgets,
            budgetsSum: total,
            updateCategoryBudgets: true
        });

        let feedback = false;
        if (total > this.state.totalBudget.budget) {
            feedback = true;
        }
        this.setState({ exceedFeedback: feedback, savable: !feedback });
    }

    savePlan = () => {
        this.props.addPlan(this.state.totalBudget, this.state.categoryBudgets, '/plan');
        this.setState({ saveFeedback: true });
    }

    render() {
        if (this.state.loading) {
            // Spinner while waiting componentDidMount setting the new state
            return (
                <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner>
            );
        } else {
            return (
                <>
                    <div className="subpage">
                        <PeriodSection period={this.state.totalBudget.period} 
                            start_date={this.state.totalBudget.start_date}
                            end_date={this.state.totalBudget.end_date}
                            periodSentence={this.state.periodSentence}
                            updatePlanDuration={this.updatePlanDuration}
                            wrongDate={this.state.wrongDateFeedback}
                            tutorial={true} />
                        {(this.state.totalBudget.period && this.state.totalBudget.start_date
                        && this.state.totalBudget.end_date) && (
                            <BudgetSection budget={this.state.totalBudget.budget} 
                                suggestedBudget={this.state.suggestedBudget}
                                updateBudget={this.updateBudget}
                                exceeded={this.state.exceedFeedback} 
                                tutorial={true}/>
                        )}
                        {this.state.totalBudget.budget > 0 && (
                            <CategoriesSection categories={this.state.categories}
                                categoryBudgets={this.state.categoryBudgets} 
                                budget={this.state.totalBudget.budget}
                                addCategoryBudget={this.addCategoryBudget} 
                                editCategoryBudget={this.editCategoryBudget}
                                deleteCategoryBudget={this.deleteCategoryBudget}
                                exceeded={this.state.exceedFeedback}
                                tutorial={true} />
                        )}

                        <SelectFeedbackRedirect route={'/homepage'} 
                            timeInterval={3000}
                            type={'danger'}
                            show={this.props.deleteFeedback}
                            onClose={this.props.setDeleteFeedback}
                            title={'Do you really want to delete the plan?'}
                            undo={'No'}
                            setFeedback={this.props.setDeleteFeedback}
                            action={'Delete'}
                            handleAction={this.props.deletePlan} />
                    </div>
                    <div className="page_footer">
                        {this.state.wrongDateFeedback && (
                            <p style={{color: 'rgb(251, 100, 100)', fontSize: '14px', fontWeight: 'bold', 
                                        marginBottom: '5px', marginTop: '10px', marginLeft: '15px', marginRight: '15px'}}>
                                You selected the end date before the start date
                                <br/>
                                Change on of the two dates in order to save
                            </p>
                        )}
                        {this.state.exceedFeedback && (
                            <p style={{color: 'rgb(251, 100, 100)', fontSize: '14px', fontWeight: 'bold', 
                                        marginBottom: '5px', marginTop: '10px', marginLeft: '15px', marginRight: '15px'}}>
                                Total budget too low: you exceeded on € {this.state.budgetsSum-this.state.totalBudget.budget}
                                <br/>
                                Increase the total budget or edit/delete some category budget in order to save the plan
                            </p>
                        )}
                        <Button className="primary_button" onClick={this.savePlan} disabled={!this.state.savable}
                            style={{marginTop: '15px', marginBottom: '15px'}}>
                            Save Plan
                        </Button>
                    </div>
                </>
            )

        }
    }
}


export default withRouter(AddPlan);