import React from "react";

import axios from "axios";
import { Map, Marker, TileLayer, Popup } from "react-leaflet";
import L from "leaflet";
import { geolocated } from "react-geolocated";
import icon from "../images/marker-3-4.png";
import iconShadow from "../images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
	iconUrl: icon,
	shadowUrl: iconShadow,
});

class MapLille extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			stations: [],
		};
	}

	componentDidMount() {
		axios
			.get(
				"https://opendata.lillemetropole.fr/api/records/1.0/search/?dataset=vlille-realtime&q=&rows=251&facet=libelle&facet=nom&facet=commune&facet=etat&facet=type&facet=etatconnexion"
			)
			.then(({ data }) => {
				this.setState({
					stations: data.records,
				});
			});
	}

	render() {
		const { stations } = this.state;

		const DEFAULT_LATITUDE = 50.6365654;
		const DEFAULT_LONGITUDE = 3.0635282;

		const longitude = this.props.coords
			? this.props.coords.longitude
			: DEFAULT_LONGITUDE;

		const latitude = this.props.coords
			? this.props.coords.latitude
			: DEFAULT_LATITUDE;

		return (
			<div>
				<Map center={[latitude, longitude]} zoom={14} minZoom={11}>
					<TileLayer
						url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
						attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
					/>

					{stations.map((station) => (
						<Marker
							key={station.fields.nom}
							position={[
								station.geometry.coordinates[1],
								station.geometry.coordinates[0],
							]}
						>
							<Popup>
								{station.fields.nom} {station.fields.etat}
								<br />
								{station.fields.adresse}
								<br />
								{"Vélos dispo "}
								{station.fields.nbvelosdispo}
								<br />
								{"Emplacements dispo "}
								{station.fields.nbplacesdispo}
							</Popup>
						</Marker>
					))}
				</Map>
			</div>
		);
	}
}

export default geolocated({
	positionOptions: {
		enableHighAccuracy: false,
	},
	userDecisionTimeout: 10000,
})(MapLille);
