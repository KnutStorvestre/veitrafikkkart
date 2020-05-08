import React, { Component } from 'react';
import { GoogleMap, withScriptjs, withGoogleMap }  from "react-google-maps"
const firebaseConfig = require('../util/config');

function Map() {
    // @ts-ignore
    return (<GoogleMap defaultZoom={10} defaultCenter={{lat:60.397076, lng:5.324383}} zoom={12}/>)
}

const WrappedMap = withScriptjs(withGoogleMap<any>(Map));

export default function App() {
    return(
        <div>
            <WrappedMap
                googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${firebaseConfig.apiKey}&v=3.exp&libraries=geometry,drawing,places`}
                loadingElement={<div style={{ height: `100%` }}/>}
                containerElement={<div style={{ height: `800px` }} />}
                mapElement={<div style={{ height: `100%` }} />}
            />
        </div>
    );
}