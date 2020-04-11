import Head from 'next/head'
import Style from '../components/Style';
import axios from 'axios';
import Typist from 'react-typist';
import React, {useState} from "react";
import nookies from "nookies";
import Router from 'next/router'

const Game = props => {
    if (props.player === "No Auth") {
        return Router.push("/")
    }
    const [name, setName] = useState(props.player.Player.name);
    const [message, setMessage] = useState([]);
    const [input, setInput] = useState("");

    const setField = e => {
        setInput(e.currentTarget.value);
    };

    const sendLine = async e => {
        e.preventDefault();

        const inputs = {
            action: input,
            playerId: "player_hash",
            enhanced: false,
        };
        const req = await axios.post(
            'https://aiexd2xz1m.execute-api.us-east-1.amazonaws.com/dev/route',
            inputs
        );
        const output = await req.data;
        setMessage(output.message);
        setName(output.Player.name);
        setInput("")
    };

    const logout = () => {
        nookies.destroy({}, "auth");
        nookies.destroy({}, "username")

        Router.push("/");
    };

    return (
        <div className="container">
            <Head>
                <title>World's Worst Game</title>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <Style/>
            <main>
                <button type="submit" onClick={logout}>
                    Logout
                </button>
                <Typist
                    className="description"
                    avgTypingDelay={40}
                    startDelay={200}
                    cursor={{hideWhenDone: true}}
                >
                    You'll be able to do anything here. But not yet.
                </Typist>

                <div className="description">
                    You are {name}
                </div>

                <form onSubmit={sendLine}>
                    <input
                        className="input"
                        type="input"
                        name="input"
                        value={input}
                        placeholder="Type something"
                        onChange={setField}
                        autoComplete="off"
                    />
                </form>

                {message.map((item, i) => (
                    <div className="actions" key={i}>
                        {item}
                    </div>
                ))}
            </main>
        </div>
    )
};

Game.getInitialProps = async ctx => {
    const cookies = nookies.get(ctx);

    const {res} = ctx;

    if (!cookies.auth) {
        if (res) {
            res.writeHead(302, {
                Location: "/"
            });
            return res.end();
        } else {
            return Router.push("/");
        }
    }

    const inputs = {
        action: "get player info",
        playerId: "player_hash",
        enhanced: false,
    };
    const response = await axios.post('https://aiexd2xz1m.execute-api.us-east-1.amazonaws.com/dev/route', inputs);
    const output = await response.data;

    return {
        player: output
    }
};

export default Game;
