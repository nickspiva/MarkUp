import React from "react";
import axios from "axios";
import SearchResults from "./searchResults";
import { Form, Button } from "semantic-ui-react";
const ngrokUrl = require("./ngrok");

class Friends extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      friends: [],
      friendName: "",
      searchResults: [],
      hasSearched: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.deleteFriend = this.deleteFriend.bind(this);
    this.addFriend = this.addFriend.bind(this);
  }

  async componentDidMount() {
    if (!this.props.loggedIn) return;
    const { id } = this.props.user;
    const response = await axios.get(`${ngrokUrl}api/friends/${id}`);
    this.setState((prevState) => {
      return { friends: response.data };
    });
  }

  async deleteFriend(userId, friendId) {
    await axios.delete(`${ngrokUrl}api/friends/`, {
      data: {
        userId,
        friendId,
      },
    });
    this.setState((prevState) => {
      const updatedFriends = prevState.friends.filter(
        (elem) => elem.id !== friendId
      );
      return { ...prevState, friends: updatedFriends };
    });
  }

  async addFriend(usersId, friendId) {
    const response = await axios.post(`${ngrokUrl}api/friends/`, {
      userId: usersId,
      friendId,
    });
    const friend = response.data;
    //if the friend isn't already in the state
    if (!this.state.friends.filter((elem) => elem.id === friend.id).length) {
      this.setState((prevState) => {
        return { ...prevState, friends: [...prevState.friends, friend] };
      });
    }
  }

  async handleSubmit() {
    const response = await axios.post(`${ngrokUrl}api/users/friendSearch/`, {
      query: this.state.friendName,
    });
    this.setState((prevState) => {
      return { ...prevState, searchResults: response.data, hasSearched: true };
    });
  }

  handleChange() {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  render() {
    console.log("this.props.loggedIn: ", this.props.loggedIn);
    console.log("rendering");
    if (!this.props.loggedIn) return <h3>Not Logged In...</h3>;
    const userId = this.props.user.id;
    return (
      <div>
        <div>
          <h2>Search for Friends</h2>
          <React.Fragment>
            <Form onSubmit={this.handleSubmit} className="searchForm">
              <Form.Input
                type="text"
                label="Friend's Name?"
                className="searchLabel"
                name="friendName"
                value={this.state.friendName}
                onChange={this.handleChange}
              />
              <Button type="submit" value="Search" className="newSticker">
                Search
              </Button>
            </Form>
          </React.Fragment>
        </div>
        <SearchResults
          results={this.state.searchResults}
          searched={this.state.hasSearched}
          userId={this.props.user.id}
          addFriend={this.addFriend}
        />
        <div className="friendList">
          <h2>Your Friends!</h2>
          {this.state.friends.length ? (
            <ul>
              {/* Add in delete icon next to each friend */}
              {this.state.friends.map((friend) => {
                return (
                  <li
                    key={friend.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "5px",
                      margin: "5px",
                    }}
                  >
                    <div className="friendName">{`${friend.userName}`} </div>
                    <Button
                      onClick={() => this.deleteFriend(userId, friend.id)}
                      className="newSticker"
                    >
                      Remove Friend
                    </Button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="sadText">No friends</div>
          )}
        </div>
      </div>
    );
  }
}

export default Friends;
