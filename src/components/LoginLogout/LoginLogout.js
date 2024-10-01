import React from "react";

const LoginLogoutButtons = (props) => {
    if (!props.userData) {
      return (
        <button onClick={props.login}>Log in with Spotify</button>
      )
    } else {
      return (
        <>
        <p>Logged in as {props.userData.id}</p>
        <button onClick={props.refresh}>Refresh credentials</button>
        <button onClick={props.logout}>Log out</button>
        </>
      )
    };
  };

  export default LoginLogoutButtons;