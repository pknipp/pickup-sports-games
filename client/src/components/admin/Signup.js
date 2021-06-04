import React, { Component } from 'react';
import { Redirect, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { signup, editUser, resetMessage, deleteUser } from './store/authentication';
// import { Input, Button } from '@material-ui/core';

class Signup extends Component {
  constructor(props) { super(props);
    this.state = {
      email: this.props.update ? this.props.currentUserEmail : "",
      firstName: this.props.update ? this.props.currentUserFirstName : "",
      lastName: this.props.update ? this.props.currentUserLastName : "",
      nickName: this.props.update ? this.props.currentUserNickName : "",
      cell: this.props.update ? this.props.currentUserCell : "",
      skill: this.props.update ? this.props.currentUserSkill : "",
      photo: this.props.update ? this.props.currentUserPhoto : "",
      password: "",
      password2: "" };
  }

  componentDidMount() {this.props.resetMessage()};

  handleSubmit = e => {
    e.preventDefault();
    let { email, password, firstName, lastName, nickName, cell, skill, photo } = this.state;
    let message = !email ? "Email address is needed." :
                  !password?"Password is needed." :
                  password !== this.state.password2 ? "Passwords must match" : "";
    if (message) return this.setState({ message });
    this.setState({ message: "" }, () => {
      this.props.update ? this.props.editUser(email, password, firstName, lastName, nickName, cell, skill, photo, this.props.currentUserId) : this.props.signup(email, password, firstName, lastName, nickName, cell, skill, photo)})
  }

  handleDelete = e => {
    e.preventDefault();
    this.props.deleteUser(this.props.currentUserId);
  }

  updateInput = e => this.setState({ [e.target.name]: e.target.value });

  render() {
    let { state, props, updateInput, handleSubmit, handleDelete } = this;
    let { update, currentUserId } = props;
    let { email, firstName, lastName, nickName, cell, skill, photo, password, password2 } = state;
    return (currentUserId && !update) ? <Redirect to="/" /> : (
      <main className="centered middled">
        <form className="auth" onSubmit={handleSubmit}>
        <h1>{update ? null : "Welcome to volleyball meetup!"}</h1>
        <h4>{update ? "Change your email and/or password?" : "We hope that you will either login or signup."}</h4>
          <span>Email address:</span>
          <input type="text" placeholder="Email" name="email" value={email} onChange={updateInput} />

          <span>First name:</span>
          <input type="text" placeholder="First name" name="firstName" value={firstName} onChange={updateInput} />

          <span>Last name:</span>
          <input type="text" placeholder="Last name" name="lastName" value={lastName} onChange={updateInput} />

          <span>Nickname:</span>
          <input type="text" placeholder="Nickname" name="nickName" value={nickName} onChange={updateInput} />

          <span>Cell number (10 digits):</span>
          <input type="number" placeholder="Cell" name="cell" value={cell} onChange={updateInput} />

          <span>Skill (integer?):</span>
          <input type="number" placeholder="Skill" name="skill" value={skill} onChange={updateInput} />

          <span>Photo url:</span>
          <input type="text" placeholder="Photo url" name="photo" value={photo} onChange={updateInput} />

          <span>Password:</span>
          <input type="password" placeholder="" name="password" value={password} onChange={updateInput} />
          <span>Confirm password:</span>
          <input type="password" placeholder="" name="password2" value={password2} onChange={updateInput} />
          <button color="primary" variant="outlined" type="submit">{update ? "Submit changes" : "Signup"}</button>
          <span style={{color: "red", paddingLeft:"10px"}}>{ state.message || props.message }</span>
          {update ? null : <span><NavLink className="nav" to="/login"      activeClassName="active">Login</NavLink></span>}
        </form>
        {!update ? null : <form className="auth" onSubmit={handleDelete}>
          <button color="primary" variant="outlined" type="submit">{"Delete account?"}</button>
        </form>}

      </main>
    );
  }
}

const msp = state => ({
  currentUserId: state.authentication.id,
  currentUserEmail: state.authentication.email,
  currentUserFirstName: state.authentication.firstName,
  currentUserLastName: state.authentication.lastName,
  currentUserNickName: state.authentication.nickName,
  currentUserPhoto: state.authentication.photo,
  currentUserCell: state.authentication.cell,
  currentUserSkill: state.authentication.skill,
  message: state.authentication.message
});
const mdp = dispatch => ({
  signup: (email, password, firstName, lastName, nickName, cell, skill, photo) => dispatch(signup(email, password, firstName, lastName, nickName, cell, skill, photo)),
  editUser:(email, password, firstName, lastName, nickName, cell, skill, photo, id) => dispatch(editUser(email, password, firstName, lastName, nickName, cell, skill, photo, id)),
  resetMessage: _ => dispatch(resetMessage()),
  deleteUser: id => dispatch(deleteUser(id)),
})
export default connect(msp, mdp)(Signup);
