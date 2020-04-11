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

const Register = props => {
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [register_disabled, setRegisterDisabled] = useState(true);

    const setFieldEmail = e => {
        checkDisableRegister()
        setEmail(e.currentTarget.value);
    };
    const setFieldUsername = e => {
        checkDisableRegister()
        setUsername(e.currentTarget.value);
    };
    const setFieldPassword = e => {
        checkDisableRegister()
        setPassword(e.currentTarget.value);
    };

    const checkDisableRegister = e => {
        const input_username = document.getElementsByClassName('username')[0].value
        const input_password = document.getElementsByClassName('password')[0].value
        const input_email = document.getElementsByClassName('email')[0].value
        if (input_username === null || input_username === '' ||
            input_password === null || input_password === '' ||
            input_email === null || input_email === '') {
            setRegisterDisabled(true);
        } else {
            setRegisterDisabled(false);
        }
    }

    const handleRegister = async e => {
        if (e) e.preventDefault();

        if (password.length < 8){
            setMessage("Password must be more than 8 characters in length")
        }
        else if (!/\S+@\S+\.\S+/.test(email)){
            setMessage("Please enter a valid email address")
        }
        else {
            Auth.signUp({
                username,
                password,
                attributes: {
                    email,
                },
            })
                .then(data => {
                    nookies.set(
                        {},
                        "username",
                        data["user"]["username"]
                    );
                    nookies.set(
                        {},
                        "registering",
                        true
                    )
                })
                .catch(err => {
                    setMessage(err.message);
                });

            await Router.push("/verify")
        }
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
                    startDelay={1200}
                    cursor={{hideWhenDone: true}}
                >
                    Enter a valid email address, your desired username, and a password.
                </Typist>

                <form onSubmit={handleRegister}>
                    <input
                        className="email"
                        type="input"
                        name="email"
                        value={email}
                        placeholder="Email"
                        onChange={setFieldEmail}
                        autoComplete="off"
                    />
                    <input
                        className="username"
                        type="input"
                        name="username"
                        value={username}
                        placeholder="User Name"
                        onChange={setFieldUsername}
                        autoComplete="off"
                    />
                    <input
                        className="password"
                        type="password"
                        name="password"
                        value={password}
                        placeholder="Password"
                        onChange={setFieldPassword}
                        autoComplete="off"
                    />
                    <br/>
                    <button type="submit" onClick={handleRegister} disabled={register_disabled}>
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

Register.getInitialProps = async ctx => {
    const cookies = nookies.get(ctx);

    const {res} = ctx;

    // If the user authenticated, go to the game
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
    return Register
}

export default Register