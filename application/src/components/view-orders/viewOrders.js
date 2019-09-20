import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Template } from '../../components';
import { SERVER_IP } from '../../private';
import './viewOrders.css';

const mapStateToProps = (state) => ({
    auth: state.auth
})

class ViewOrders extends Component {
    state = {
        orders: []
    }

    componentDidMount() {
        fetch(`${SERVER_IP}/api/current-orders`)
            .then(response => response.json())
            .then(response => {
                if(response.success) {
                    //TODO: On the initial load, the component isn't mounted (and thus the state can't be set), a warning is generated, 
                    //      and this fails.  Subsequent calls seem to work.  Not sure why this is happening.
                    this.setState({ orders: response.orders });
                } else {
                    console.log('Error getting orders');
                }
            });
    }

    render() {
        let { token } = this.props.auth;
        if (token === null) {
             return (
                <Redirect to = {
                    {pathname: "/login"}
                }
                />
             );
        }

        return (
            <Template>
                <div className="container-fluid">
                    {this.state.orders.map(order => {
                        const createdDate = new Date(order.createdAt);
                        return (
                            <div className="row view-order-container" key={order._id}>
                                <div className="col-md-4 view-order-left-col p-3">
                                    <h2>{order.order_item}</h2>
                                    <p>Ordered by: {order.ordered_by || ''}</p>
                                </div>
                                <div className="col-md-4 d-flex view-order-middle-col">
                                    <p>Order placed at {`${createdDate.getHours()}:${createdDate.getMinutes()}:${createdDate.getSeconds()}`}</p>
                                    <p>Quantity: {order.quantity}</p>
                                 </div>
                                 <div className="col-md-4 view-order-right-col">
                                     <button className="btn btn-success">Edit</button>
                                     <button className="btn btn-danger">Delete</button>
                                 </div>
                            </div>
                        );
                    })}
                </div>
            </Template>
        );
    }
}

export default connect(mapStateToProps, null)(ViewOrders);
//export default ViewOrders;
