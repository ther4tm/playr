import React from "react";
import style from './loginLogout.module.css';

const LoginLogoutButtons = (props) => {
    if (!props.userData) {
      return (
        <button
        className={style.button}
        onClick={props.login}>Log in with Spotify</button>
      )
    } else {
      return (
        <>
        <p>Logged in as {props.userData.id}</p>
        <button
        className={style.button}
        onClick={props.refresh}>Refresh credentials</button>

        <button
        className={style.button}
        onClick={props.logout}>Log out</button>
        </>
      )
    };
  };

  export default LoginLogoutButtons;