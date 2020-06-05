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
    const userId = this.props.user.id;
    return (
      <div>
        <div>
          <h2>Search for Friend</h2>
          <React.Fragment>
            <Form onSubmit={this.handleSubmit}>
              <Form.Input
                type="text"
                label="Friend's Name?"
                name="friendName"
                value={this.state.friendName}
                onChange={this.handleChange}
              />
              <Form.Input type="submit" value="Search" />
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
          <h2>Friends!</h2>
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
                    <div>{`${friend.userName}`} </div>
                    <Button
                      onClick={() => this.deleteFriend(userId, friend.id)}
                    >
                      - del
                    </Button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div>No friends</div>
          )}
        </div>
      </div>
    );
  }
}

export default Friends;
