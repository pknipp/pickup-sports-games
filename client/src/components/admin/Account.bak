import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
//import { Button } from '@material-ui/core';

class Account extends Component {

  render() {
    let date = this.props.user.createdAt.split("T")[0].split("-");
    return (!this.props.user) ? <Redirect to="/login" /> : (
      <div className="simple">
      <ul>
        <li>email: {this.props.user.email}</li>
        <li>fullname: {this.props.user.firstName} {this.props.user.lastName}</li>
        <li>nickname: {this.props.user.nickName}</li>
        <li>cell: {this.props.user.cell}</li>
        <li>skill: {this.props.user.skill}</li>
        <li>photo: {this.props.user.photo}</li>
        <li>user since {`${date[1]}/${date[2]}/${date[0]}`}</li>
      </ul>
      </div>
    );
  }
}

const msp = state => ({ user: state.authentication });
export default connect(msp)(Account);
