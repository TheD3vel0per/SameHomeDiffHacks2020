import React from 'react';
import * as firebase from 'firebase';
import GameService from '../services/GameService';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { Subscription } from 'rxjs';
import './SessionPage.css';
import Timer from '../components/Timer';

class SessionPage extends React.Component {
    state = {
        id: '',
        game: {
            _id: '',
            objectToDraw: '',
            players: [],
            playerTurn: {
                displayName: '',
                uid: ''
            },
            topLeft: '',
            topRight: '',
            bottomLeft: '',
            bottomRight: ''
        },
        goToGame: false,
    };
    gameDocSub$: Subscription;
    id;

    constructor(props) {
        super(props);
        this.id = props.match.params.id;
        this.state.id = props.match.params.id;
    }

    componentDidMount() {
        // Does the game exist?
        const gs: GameService = new GameService(this.state.id);
        gs.init()
            .then((result) => {
                window['gs'] = gs;

                if (gs.doesGameExist()) {
                    gs.joinGame();
                } else {
                    gs.createGame();
                }

                this.setState({ game: gs.gameDoc });
                console.log(gs);
                this.gameDocSub$ = gs.gameDoc$.subscribe(data => {
                    console.log(data);
                    this.setState({
                        game: data,
                        goToGame: data.playerTurn.uid == firebase.auth().currentUser.uid
                    });
                });

            }).catch(console.error);


    }

    async componentWillUnmount() {
        this.gameDocSub$.unsubscribe();
    }

    quitGame = async () => {
        window['gs'].quitGame();
    };

    render() {

        return (
            <>
                <Header />
                <Timer />
                <ListGroup style={{ maxHeight: '300px', maxWidth: '600px', overflow: 'auto', padding: '10px 15px' }} className="center">

                    {this.state.game.players.map((player, index) => {

                        switch (index) {
                            case 1:
                                return (
                                    <ListGroup.Item action variant="primary" className="text-center" key={player.uid}>
                                        <span>{player.displayName}</span>
                                    </ListGroup.Item>
                                );

                            case 2:
                                return (
                                    <ListGroup.Item action variant="success" className="text-center" key={player.uid}>
                                        <span>{player.displayName}</span>
                                    </ListGroup.Item>
                                );

                            case 3:
                                return (
                                    <ListGroup.Item action variant="danger" className="text-center" key={player.uid}>
                                        <span>{player.displayName}</span>
                                    </ListGroup.Item>
                                );


                            default:
                                return (
                                    <ListGroup.Item action variant="warning" className="text-center" key={player.uid}>
                                        <span>{player.displayName}</span>
                                    </ListGroup.Item>
                                );

                        }
                    })}

                </ListGroup>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                    <div>
                        {this.state.game.players.length >= 4 ?
                            (this.state.goToGame ?
                                <Link to={"/game/" + this.state.game._id}>
                                    <Button className="btn btn-primary" size="lg" >
                                        Start Game
                                    </Button>
                                </Link> :
                                <Link to={"/waiting/" + this.state.game._id}>
                                    <Button className="btn btn-primary" size="lg" >
                                        Start Game
                                    </Button>
                                </Link>)
                            :
                            <Button style={{ cursor: 'not-allowed' }} className="btn btn-secondary" size="lg" >
                                Start Game
                            </Button>
                        }
                        <div>
                            <Link to={"/session/" + this.id}>
                                <Button className="btn btn-primary" size="lg" onClick={this.quitGame}>
                                    Quit Game
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default SessionPage;