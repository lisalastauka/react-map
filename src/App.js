import React, { Component } from 'react';
import Search from './Search';
import Map from './Map';
import GMaps from 'gmaps';
import CurrentLocation from './CurrentLocation';
import LocationList from './LocationList'
import './App.css';

export default class App extends Component {

    constructor(props){
        super(props);
        let favorites = [];

        if(localStorage.favorites){
            favorites = JSON.parse(localStorage.favorites);
        }

        this.state = {
            favorites: favorites,
            currentAddress: 'Paris, France',
            mapCoordinates: {
                lat: 48.856614,
                lng: 2.3522219
            }
        };
    }


    toggleFavorite = (address) => {

        if(this.isAddressInFavorites(address)){
            this.removeFromFavorites(address);
        }
        else{
            this.addToFavorites(address);
        }

    }

    addToFavorites(address){

        const favorites = this.state.favorites;

        favorites.push({
            address: address,
            timestamp: Date.now()
        });

        this.setState({
            favorites: favorites
        });

        localStorage.favorites = JSON.stringify(favorites);
    }

    removeFromFavorites(address){

        const favorites = this.state.favorites;
        let index = -1;

        for(let i = 0; i < favorites.length; i++){

            if(favorites[i].address === address){
                index = i;
                break;
            }

        }

        // If it was found, remove it from the favorites array

        if(index !== -1){

            favorites.splice(index, 1);

            this.setState({
                favorites: favorites
            });

            localStorage.favorites = JSON.stringify(favorites);
        }

    }

    isAddressInFavorites(address){

        const favorites = this.state.favorites;

        for(let i = 0; i < favorites.length; i++){

            if(favorites[i].address === address){
                return true;
            }

        }

        return false;
    }

    searchForAddress = (address) => {

        GMaps.geocode({
            address: address,
            callback: (results, status) => {

                if (status !== 'OK') return;

                let latlng = results[0].geometry.location;

                this.setState({
                    currentAddress: results[0].formatted_address,
                    mapCoordinates: {
                        lat: latlng.lat(),
                        lng: latlng.lng()
                    }
                });

            }
        });

    }

    render(){

        return (

            <div>
                <h1>Your Google Maps Locations</h1>

                <Search onSearch={this.searchForAddress} />

                <Map lat={this.state.mapCoordinates.lat} lng={this.state.mapCoordinates.lng} />

                <CurrentLocation address={this.state.currentAddress}
                                 favorite={this.isAddressInFavorites(this.state.currentAddress)}
                                 onFavoriteToggle={this.toggleFavorite} />

                <LocationList locations={this.state.favorites} activeLocationAddress={this.state.currentAddress}
                              onClick={this.searchForAddress} />

            </div>

        );
    }
}

