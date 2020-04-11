import React, {useState} from "react";
import Router from 'next/router'

// Amplify AWS Congnito
import Amplify, {Auth} from 'aws-amplify';
import CognitoConfig from '../components/Config'
import Head from "next/head";
import Style from "../components/Style";
import Typist from "react-typist";
import nookies from "nookies";

Amplify.configure(CognitoConfig);

const Login = props => {
    const [message, setMessage] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [login_disabled, setLoginDisabled] = useState(true);

    const checkDisableLogin = e => {
        const input_username = document.getElementsByClassName('username')[0].value
        const input_password = document.getElementsByClassName('password')[0].value
        if (input_username === null || input_username === '' ||
            input_password === null || input_password === '') {
            setLoginDisabled(true);
        } else {
            setLoginDisabled(false);
        }
    }

    const setFieldUsername = e => {
        setUsername(e.currentTarget.value);
        checkDisableLogin();
    };
    const setFieldPassword = e => {
        setPassword(e.currentTarget.value);
        checkDisableLogin();
    };

    const userLoggedIn = async e => {
        if (e) e.preventDefault();

        // If user is logged in, go to the game page
        await Auth.currentAuthenticatedUser()
            .then(data => {
                nookies.set(
                    {},
                    "auth",
                    data["signInUserSession"]["idToken"]["jwtToken"]
                );
                nookies.set({}, "username", data["username"]);
                Router.push('/game')
            }).catch(err => {
                setMessage(err.message)
            })
    };

    const handleLogin = async e => {
        if (e) e.preventDefault();

        setLoginDisabled(true);

        await Auth.signIn(username, password)
            .then(() =>
                userLoggedIn()
            ).catch(err => {
                setMessage(err.message);
            })
    };

    const handleRegister = async e => {
        if (e) e.preventDefault();

        setLoginDisabled(true);
        await Router.push("/register")
    };

    return (
        <div className="container">
            <Head>
                <title>World's Worst Game</title>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <Style/>
            <main>
                <Typist
                    className="title"
                    avgTypingDelay={40}
                    startDelay={200}
                    cursor={{hideWhenDone: true}}
                >
                    Welcome to the World's Worst Game
                </Typist>

                <Typist
                    className="description"
                    avgTypingDelay={40}
                    startDelay={1800}
                    cursor={{hideWhenDone: true}}
                >
                    Log in, or click Register to create a new account
                </Typist>

                <form onSubmit={handleLogin}>
                    <input
                        className="username"
                        type="input"
                        name="username"
                        value={username}
                        placeholder="User Name"
                        onChange={setFieldUsername}
                        autoComplete="off"
                        required
                    />
                    <input
                        className="password"
                        type="password"
                        name="password"
                        value={password}
                        placeholder="Password"
                        onChange={setFieldPassword}
                        autoComplete="off"
                        required
                    />
                    <br/>
                    <button type="submit" id="loginButton" onClick={handleLogin}
                            disabled={login_disabled}>
                        Login
                    </button>
                    <button type="submit" id="registerButton" onClick={handleRegister}>
                        Register
                    </button>
                </form>
                <div className="message">
                    {message}
                </div>
            </main>
        </div>
    )
};

Login.getInitialProps = async ctx => {
    const cookies = nookies.get(ctx);

    const {res} = ctx;

    // If user authenticated, go to the game
    if (cookies.auth) {
        if (res) {
            res.writeHead(302, {
                Location: "/game"
            });
            return res.end();
        } else {
            return Router.push("/game");
        }
    }
    // If user registering, go to verification page
    else if (cookies.registering) {
        if (res) {
            res.writeHead(302, {
                Location: "/verify"
            });
            return res.end();
        } else {
            return Router.push("/verify");
        }
    }
    return Login
}

export default Login