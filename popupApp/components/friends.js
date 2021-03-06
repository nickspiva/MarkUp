import React from "react";
import axios from "axios";
import SearchResults from "./searchResults";
import { Form, Button } from "semantic-ui-react";
const ngrokUrl = require("./ngrok");
const md5 = require("md5");

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
    if (!this.props.loggedIn) return <h3>Not Logged In...</h3>;
    const userId = this.props.user.id;
    return (
      <div>
        <div>
          <h2>Search for Friends</h2>
          <div className="inputField">
            <div>
              <div className="inputLabel">Friend's Name</div>
              <input
                type="text"
                label="Friend's Name?"
                className="searchLabel"
                name="friendName"
                value={this.state.friendName}
                onChange={this.handleChange}
              ></input>
            </div>
            <button className="newSticker" onClick={this.handleSubmit}>
              {this.state.friendName.length ? "Search" : "See All Users"}
            </button>
          </div>
        </div>
        <SearchResults
          results={this.state.searchResults}
          searched={this.state.hasSearched}
          userId={this.props.user.id}
          addFriend={this.addFriend}
          yourFriends={this.state.friends}
        />
        <div className="friendList">
          <h2>Your Friends!</h2>
          {this.state.friends.length ? (
            <ul className="resultList">
              {/* Add in delete icon next to each friend */}
              {this.state.friends.map((friend) => {
                return (
                  <li key={friend.id} className="resultItem">
                    <div className="columnWrap start">
                      {" "}
                      <div className="friendName">{`${friend.userName}`} </div>
                    </div>
                    <div className="columnWrap">
                      <div className="imageWrapper">
                        <div className="tightWrapper">
                          <img
                            src={`https://www.gravatar.com/avatar/${md5(
                              friend.email
                            )}?s=65`}
                            className="profilePic"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="columnWrap end">
                      {" "}
                      <Button
                        onClick={() => this.deleteFriend(userId, friend.id)}
                        className="newSticker"
                      >
                        Remove Friend
                      </Button>
                    </div>
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
