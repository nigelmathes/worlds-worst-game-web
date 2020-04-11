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

const Verify = props => {
    const [message, setMessage] = useState('');
    const [verification_code, setVerificationCode] = useState('');

    const setFieldVerificationCode = e => {
        setVerificationCode(e.currentTarget.value);
    };

    const handleVerify = async e => {
        if (e) e.preventDefault();

        const cookies = nookies.get(e);
        const username = cookies["username"];

        Auth.confirmSignUp(username, verification_code)
            .then(() => {
                setMessage("Email verified");
                nookies.destroy({}, "registering");
                Router.push("/")
            }).catch(e => {
            setMessage("Incorrect verification code. Try again.");
        });
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
                    You should have received a verification code via email.
                </Typist>

                <form onSubmit={handleVerify}>
                    <input
                        className="verification"
                        type="input"
                        name="verification"
                        value={verification_code}
                        placeholder="Enter that code."
                        onChange={setFieldVerificationCode}
                        autoComplete="off"
                    />
                    <br/>
                    <button type="submit" onClick={handleVerify}>
                        Verify
                    </button>
                </form>
                <div className="message">
                    {message}
                </div>
            </main>
        </div>
    )
};

Verify.getInitialProps = async ctx => {
    const cookies = nookies.get(ctx);
    const {res} = ctx;

    if (cookies.registering) {
        return Verify
    }
    else {
        if (res) {
            res.writeHead(302, {
                Location: "/"
            });
            return res.end();
        } else {
            return Router.push("/");
        }
    }
}

export default Verify