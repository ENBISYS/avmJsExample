import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import {
    ApiClient,
    DefaultApi,
    PropertyFeatures,
    RequiredFeatures,
    FloorLevel,
    NewOrResale,
    PropertyType,
    AdditionalFeatures,
    WallType,
    EnergyEfficiency
} from "avm-client"

class App extends Component {

    state = {
        price: null,
        valuation: null,
        // INSERT YOUR TOKEN HERE!
        token: null,
    };

    componentDidMount() {
        if (this.state.token === null) {
            return;
        }

        const defaultClient = ApiClient.instance;

        const ApiKeyAuth = defaultClient.authentications['ApiKeyAuth'];
        ApiKeyAuth.apiKey = this.state.token;

        const api = new DefaultApi();

        const requiredFeatures = new RequiredFeatures();
        requiredFeatures.floorLevel = FloorLevel.FLOOR_5;
        requiredFeatures.newOrResale = NewOrResale.RESALE;
        requiredFeatures.numberOfRooms = 3;
        requiredFeatures.postcode = "b1 1TB";
        requiredFeatures.propertyType = PropertyType.FLAT;
        requiredFeatures.totalFloorAreaInSqf = 160;

        const additionalFeatures = new AdditionalFeatures();
        additionalFeatures.wallType = WallType.COB;
        additionalFeatures.wallEnergyEfficiency = EnergyEfficiency.GOOD;

        const propertyFeatures = new PropertyFeatures();
        propertyFeatures.requiredFeatures = requiredFeatures;
        propertyFeatures.additionalFeatures = additionalFeatures;

        api.getValuation(propertyFeatures, this.ValuationCallback);
        api.getFastValuation(propertyFeatures, this.fastValuationCallback);
    };

    fastValuationCallback = (error, data, response) => {
        if (error) {
            console.error(error);
        } else {
            this.setState({
                price: data
            });
        }
    };

    ValuationCallback = (error, data, response) => {
        if (error) {
            console.error(error);
        } else {
            this.setState({
                valuation: data
            });
        }
    };

    render() {

        return this.state.token !== null ?
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    {this.state.price !== null ? this.state.price : null}
                    <p/>
                    {this.state.valuation !== null ?
                        "price range from " + this.state.valuation.priceRangeFrom +
                        " - "
                        + " price range to " + this.state.valuation.priceRangeTo :
                        null
                    }
                </header>
            </div>
            :
            <p>
                Please, set token to the state!
            </p>;
    }
}

export default App;
