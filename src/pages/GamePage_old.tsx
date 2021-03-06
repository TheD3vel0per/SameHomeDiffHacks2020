import React from 'react';
import Header from '../components/Header';
import RightRenderer from '../components/RightRenderer';
import LeftRenderer from '../components/LeftRenderer';
import TopRenderer from '../components/TopRenderer';
import BottomRenderer from '../components/BottomRenderer';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import Drawer from '../components/Drawer';
import GameService from '../services/GameService';


class GamePage extends React.Component {
    state = {
        objectToDraw: '',
        myDrawingArea: ''
    };
    id = '';

    constructor(props) {
        super(props);
        this.id = this.props['match'].params.id;
    }

    endGame = () => window['gs'].endGame();

    onSubmitButtonClicked = () => window['gs'].nextTurn();

    getURL = () => {

        switch (this.state.myDrawingArea) {
            case 'topLeft':
                return "/assets/img/stages/player_1.png";
                break;

            case 'topRight':
                return "/assets/img/stages/player_2.png";
                break;

            case 'bottomLeft':
                return "/assets/img/stages/player_3.png";
                break;

            default:
                return "/assets/img/stages/player_4.png";
                break;
        }

    };

    async componentDidMount() {
        if (!window['gs']) {
            window['gs'] = new GameService(this.id);
            await window['gs'].init();
        }

        this.setState({
            objectToDraw: window['gs']['gameDoc']['objectToDraw'],
            myDrawingArea: window['gs']['myDrawingArea']
        })
    }

    render() {
        return (
            <>
                <Header />
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                    <h1>{this.state.objectToDraw}</h1>
                </div>
                <div>
                    <img style={{ width: '100px', height: '100px' }} className="center" src={this.getURL()} />
                    <div className="center">
                        <div style={{ width: 440, height: 20 }}><TopRenderer/></div>
                        <div style={{ height: 400 }}>
                            <LeftRenderer />
                            <Drawer />
                            <RightRenderer />
                        </div>
                        <div style={{ width: 440, height: 20 }}><BottomRenderer /></div>
                    </div>
                </div>
                <br />
                <br />
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                    <Link to={'/combined/' + this.id}>
                        <Button style={{ width: 440, height: 50 }} className="btn btn-primary" size="lg" onClick={this.state.myDrawingArea === 'bottomRight' ? this.endGame : this.onSubmitButtonClicked}>
                            {this.state.myDrawingArea === 'bottomRight' ? "Finish Game" : "Submit"}
                        </Button>
                    </Link>
                </div>
            </>
        );
    }
}

export default GamePage;