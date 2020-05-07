import React, { Component } from 'react';
import { GoogleMap, withScriptjs, withGoogleMap }  from "react-google-maps"

function Map() {
    // @ts-ignore
    return (<GoogleMap defaultZoom={10} defaultCenter={{lat:12, lng:12}}/>)
}

const WrappedMap = withScriptjs(withGoogleMap<any>(Map));

export default function App() {
    return(
        <div>
            <WrappedMap
                googleMapURL={"https://maps.googleapis.com/maps/api/js?key=AIzaSyDop8SvuITaKeWvxZK7fOiOLXWEPVU2uik&v=3.exp&libraries=geometry,drawing,places"}
                loadingElement={<div style={{ height: `100%` }}/>}
                containerElement={<div style={{ height: `400px` }} />}
                mapElement={<div style={{ height: `100%` }} />}
            />
        </div>
    );
}