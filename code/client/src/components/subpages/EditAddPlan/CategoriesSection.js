// Essentials
import React from 'react';
import { Row, Col, Form, InputGroup } from 'react-bootstrap';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';


// Components
import CategoryChooser from '../CategoryChooser';
import { TutorialLine } from '../../utils/Tutorial';

// CSS import
import '../../../App.css';


class CategoriesSection extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showModal: false
        }
    }

    openCategoryBudgetItemModal = () => {
        this.setState({ showModal: true });
    }

    closeCategoryBudgetItemModal = () => {
        this.setState({ showModal: false });
    }

    render() {
        return (
            <div className={"page_section " + (this.props.exceeded ? 'danger' : '')}>
                <div className="section_title">Category Budgets</div>
                {this.props.tutorial && <TutorialLine title={'If you want you can plan a part or the whole budget for the categories you prefer'} />}
                {this.props.categoryBudgets.map((el) =>
                    <CategoryBudgetItem key={"cb-" + el.category_id} categoryBudget={el}
                        editCategoryBudget={this.props.editCategoryBudget}
                        deleteCategoryBudget={this.props.deleteCategoryBudget} />
                )}
                {this.props.categories.length > 0 ? (
                    <p onClick={this.openCategoryBudgetItemModal}
                        style={{ textAlign: 'left', paddingTop: '8px' }}>
                        <i className="fas fa-plus fa-lg" style={{ paddingRight: '15px', paddingLeft: '15px' }}></i>
                        Add a new category to monitor
                    </p>
                ) : (
                    <p style={{ fontSize: '10pt', textAlign: 'left', paddingTop: '8px', paddingLeft: '15px' }}>
                        Budget set for all categories
                    </p>)}
                <AddCategoryBudgetItemModal showModal={this.state.showModal}
                    categories={this.props.categories}
                    closeCategoryBudgetItemModal={this.closeCategoryBudgetItemModal}
                    addCategoryBudget={this.props.addCategoryBudget} />
            </div>
        );
    }
}

class AddCategoryBudgetItemModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            category_id: -1,
            budget: 0,
            errorCategory: false,
            errorBudget: false
        }
    }

    updateField = (name, value) => {
        switch (name) {
            case "budget":
                this.setState({ budget: value, errorBudget: false });
                break;
            case "category":
                this.setState({ category_id: value, errorCategory: false });
                break;
            default:
                // error;
                break;
        }
    }

    selectCategory = (category_id) => {
        this.setState({ category_id: parseInt(category_id), errorCategory: false });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        let errorCategory = false;
        let errorBudget = false;
        if( !this.state.category_id || this.state.category_id === -1 ) {
            errorCategory = true;
        }
        if( !this.state.budget ) {
            errorBudget = true;
        }

        if( errorCategory || errorBudget ) {
            this.setState({ errorCategory: errorCategory,  errorBudget: errorBudget});
        } else {
            this.props.addCategoryBudget(this.state.category_id, this.state.budget);
            this.props.closeCategoryBudgetItemModal();
            this.setState({ category_id: -1, budget: 0 });
        }
    }

    render() {
        return (
            <Dialog className="dialog" open={this.props.showModal} onClose={this.props.closeCategoryBudgetItemModal} aria-labelledby='form-dialog-title'>
                <DialogTitle className='dialog-title' id='form-dialog-title'>
                    Plan a budget for a category
                </DialogTitle>
                <Form onSubmit={(ev) => this.handleSubmit(ev)}>
                    <DialogContent>
                        <Form.Group>
                            <Form.Label>Category*</Form.Label>
                            <CategoryChooser categories={this.props.categories} selected={this.state.category_id} 
                                onSelect={this.selectCategory} />
                            {this.state.errorCategory && <p style={{color: 'rgb(255, 59, 48)'}}>Select a category</p>}
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Budget*</Form.Label>
                            <InputGroup>
                                <InputGroup.Prepend>
                                    <InputGroup.Text>€</InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control type="number" name="budget" value={this.state.budget || ""}
                                    inputMode="decimal" min="0.01" step="0.01"
                                    onChange={(ev) => this.updateField(ev.target.name, ev.target.value)} />
                            </InputGroup>
                            {this.state.errorBudget && <p style={{color: 'rgb(255, 59, 48)'}}>Choose a category</p>}
                        </Form.Group>
                    </DialogContent>
                    <DialogActions style={{ padding: '0px', borderTop: 'solid 0.5px gray' }}> 
                        <button color='primary' style={{ borderRight: 'solid 0.5px gray' }}
                            onClick={this.props.closeCategoryBudgetItemModal} type="button">
                            Close
                        </button>
                        <button style={{ margin: '0px', color: 'rgba(12, 70, 157, 1.0)' }} color='primary' type="submit">
                            Confirm
                        </button>
                    </DialogActions>
                </Form>
            </Dialog>
        );
    }
}

class CategoryBudgetItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showModal: false,
        }
    }

    openCategoryBudgetItemModal = () => {
        this.setState({ showModal: true });
    }

    closeCategoryBudgetItemModal = () => {
        this.setState({ showModal: false })
    }

    render() {
        return (
            <Row style={{ marginLeft: '0px', marginRight: '0px', paddingBottom: '8px', paddingTop: '8px', borderBottom: '1px solid rgba(169, 169, 169, 0.639)' }}>
                <Col xs={2} style={{
                    paddingLeft: '15px', paddingRight: '0px',
                    display: 'flex', justifyContent: 'left', alignItems: 'center'
                }}
                    onClick={() => this.props.deleteCategoryBudget(this.props.categoryBudget.category_id)}>
                    <i className="fas fa-minus-circle fa-lg"
                        style={{ top: '50%', color: 'rgb(251, 100, 100)' }} />
                </Col>
                <Col>
                    <Row>
                        <Col xs={6} style={{ paddingLeft: '0px', textAlign: 'left', fontWeight: 'bold' }}>
                            {this.props.categoryBudget.category_name}
                        </Col>
                        <Col xs={6} style={{ textAlign: 'left' }}>
                            {"€ " + this.props.categoryBudget.budget.toFixed(2)}
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} style={{ textAlign: 'left', paddingLeft: '0px', paddingRight: '0px' }}>
                            {parseFloat(this.props.categoryBudget.percentage).toPrecision(3) + " % of the total budget"}
                        </Col>
                    </Row>
                </Col>
                <Col xs={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    onClick={this.openCategoryBudgetItemModal}>
                    <i className="fas fa-pen-square fa-lg" ></i>
                </Col>
                <EditCategoryBudgetItemModal showModal={this.state.showModal}
                    category_id={this.props.categoryBudget.category_id}
                    category_name={this.props.categoryBudget.category_name}
                    budget={this.props.categoryBudget.budget}
                    closeCategoryBudgetItemModal={this.closeCategoryBudgetItemModal}
                    editCategoryBudget={this.props.editCategoryBudget} />
            </Row>
        );
    }
}

class EditCategoryBudgetItemModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            budget: 0, 
        }
    }

    componentDidMount() {
        this.setState({ budget: "" + this.props.budget });
    }

    updateField = (name, value) => {
        switch (name) {
            case "budget":
                this.setState({ budget: value });
                break;
            default:
                // error;
                break;
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.props.editCategoryBudget(this.props.category_id, this.state.budget);
        this.props.closeCategoryBudgetItemModal();
    }

    render() {
        return (
            <Dialog className="dialog" open={this.props.showModal} onClose={this.props.closeCategoryBudgetItemModal} aria-labelledby='form-dialog-title'>
                <DialogTitle className='dialog-title' id='form-dialog-title'>
                    Change the budget for {this.props.category_name}
                </DialogTitle>
                <Form onSubmit={(ev) => this.handleSubmit(ev)}>
                    <DialogContent>
                        <Form.Group>
                            <Form.Label>Budget*</Form.Label>
                            <InputGroup>
                                <InputGroup.Prepend>
                                    <InputGroup.Text>€</InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control type="number" value={this.state.budget}
                                    name="budget" required inputMode="decimal" min="0.01" step="0.01"
                                    onChange={(ev) => this.updateField(ev.target.name, ev.target.value)} />
                            </InputGroup>
                        </Form.Group>
                    </DialogContent>
                    <DialogActions style={{ padding: '0px', borderTop: 'solid 0.5px gray' }}>
                        <button style={{ borderRight: 'solid 0.5px gray' }}
                            onClick={this.props.closeCategoryBudgetItemModal} type="button">
                            Close
                        </button>
                        <button style={{ margin: '0px', color: 'rgba(12, 70, 157, 1.0)' }} color='primary' type="submit">
                            Change
                        </button>
                    </DialogActions>
                </Form>
            </Dialog>
        );
    }
}

export default CategoriesSection;