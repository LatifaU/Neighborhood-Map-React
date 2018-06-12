import React, {Component} from 'react';
import Sidebar from "./Sidebar";

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            map: '',
            info: '',
            // Storing bakeries' locations
            markers: [
                {
                    lat: 24.7353053,
                    long: 46.64712009999994,
                    name: 'Chunk'
                },
                {
                    lat: 24.6942469,
                    long: 46.72260440000002,
                    name: 'Wooden Bakery',
                },
                {
                    lat: 24.718427,
                    long: 46.65792329999999,
                    name: 'Dactylifera'
                },
                {
                    lat: 24.732039,
                    long: 46.67819199999997,
                    name: 'Delish'
                },
                {
                    lat: 24.6980917,
                    long: 46.69420919999993,
                    name: 'Choowy Goowy'
                },
                {
                    lat: 24.7011869,
                    long: 46.6920566,
                    name: 'Munch'
                },
                {
                    lat: 24.721094,
                    long: 46.6495089,
                    name: 'Shilz'
                },
                {
                    lat: 24.7526414,
                    long: 46.625169599999936,
                    name: 'The Hummingbird'
                },
                {
                    lat: 24.7252513,
                    long: 46.65288480000004,
                    name: 'May Snack'
                },
                {
                    lat: 24.7146502,
                    long: 46.66084360000002,
                    name: 'Anoosh'
                },
                {
                    lat: 24.7100658,
                    long: 46.66847110000003,
                    name: 'AANI & DANI'
                },
                {
                    lat: 24.725016,
                    long: 46.65380349999998,
                    name: 'Joy'
                }
            ],
            virtualMarkers: []
        };


        this.initMap = this.initMap.bind(this);
        this.addMarkers = this.addMarkers.bind(this);
        this.viewMarkerInfo = this.viewMarkerInfo.bind(this);
    }


    componentDidMount() {
        window.initMap = this.initMap;
        // Function for Google Maps API
        createMapLink('https://maps.googleapis.com/maps/api/js?key=AIzaSyBZTbZoZIhkQ8PtLJeKHB8LgSNBrk5-b_Q&libraries=places&callback=initMap');
    }

    initMap() {
        let map;
        map = new window.google.maps.Map(document.getElementById('map'), {
            // Zooming to current location which would be in Riaydh
            zoom: 13,
            center: {lat: 24.7129093, lng: 46.6340406}
        });

        let infowindow = new window.google.maps.InfoWindow({});

        this.setState({map: map, info: infowindow});
        // Adding Bakeries markers on map
        this.addMarkers(map);
    }

    addMarkers(map) {
        let self = this;

        this.state.markers.forEach(marker => {
            let loc = {lat: marker.lat, lng: marker.long}

            let mark = new window.google.maps.Marker({
                position: loc,
                map: map,
                title: marker.name
            });

            // Function to load marker information into dailog/window and view it
            mark.addListener('click', function () {
                self.viewMarkerInfo(mark);
            });

            let virtMarker = this.state.virtualMarkers;
            virtMarker.push(mark);

            this.setState({virtualMarkers: virtMarker});
        });
    } 

    // Function to load marker information into dailog/window and view it
    viewMarkerInfo(marker = '') {
        // Foursquare API, using marker latitude and longitude to get all places within these coordinates
        let clientId = "Q5MK2XFDK3FVTDQLOQKSFTKS1CI1XEWZSO2TIPP5DU2PWICK";
        let clientSecret = "MQ3CZLR5KY1F04FUAX5YWXOLYRRJSYFWCHZANZZ23M4WI05L";
        let url = "https://api.foursquare.com/v2/venues/search?client_id=" + clientId 
        + "&client_secret=" + clientSecret 
        + "&v=20130815&ll=" 
        + marker.getPosition().lat() 
        + "," + marker.getPosition().lng() 
        + "&limit=10";

        if (this.state.info.marker !== marker) {
            this.state.info.marker = marker;
            this.state.info.open(this.state.map, marker);
            marker.setAnimation(window.google.maps.Animation.DROP);

            // Function to close marker information dailog/window
            this.state.info.addListener('closeClick', function () {
                this.state.info.setMarker(null);
            });

            // Loading marker information
            this.markerInfo(url);
        }
    }

    // Loading marker information
    markerInfo(url) {
        let self = this.state.info;

        fetch(url)
            .then(function (resp) {
                if (resp.status !== 200) {
                    const err = "Error loading data from Foursquare.";
                 this.state.info.setContent(err);
                }
                resp.json().then(function (data) {
                    let name = '';
                    let address = '';
                    let phone = '';
                    let category = '';
                    let readMore = '';
                
                data.response.venues.some(function (place) {
                    // Making sure this is the exact place
                    if (place.name.startsWith(self.marker.title)) {
                        console.log(place);
                        console.log(place.name);
                        name = "<h2>" + place.name + "</h2>";
                    if (place.location) {
                        address = '<p><b>Address: </b>' +
                        place.location.address + ', ' + place.location.city  + ', ' + place.location.country +
                        '</p>';
                        console.log(address);
                    }

                    if (place.contact.formattedPhone) {
                        phone = "<p><b>Phone:</b> "+ place.contact.formattedPhone +"</p>";
                        console.log(phone);
                    }

                    place.categories.forEach(function (singleCategory) {
                        category = "<p><b>Category:</b> "+ singleCategory.name +"</p>";
                        console.log(category);
                    });

                    if (place.id) {
                        readMore = '<p><b>Read More on: </b>' +
                        '<a href="https://foursquare.com/v/' +
                        place.id +
                        '" target="_blank"><b>Foursquare Website</b></a></p>';
                        console.log(readMore);
                    }
                    }
                    return place.name.startsWith(self.marker.title);
                });
                   
                    let info =
                        "<div id='marker'>" +
                            name +
                            phone +
                            address +
                            category +
                            readMore +
                        "</div>";
                        self.setContent(info);
                });
            })
            .catch(function (err) {
                let error = "Error loading from Foursquare response.";
                self.setContent(error);
            });
    }


    // HTML part
    render() {
        return (
            <div>
                <header>
                    <Sidebar
                        infoWindow={this.state.info}
                        openInfo={this.viewMarkerInfo}
                        virtualMarker={this.state.virtualMarkers}>
                    </Sidebar>
                    <h1 id="title">Neighborhood Map (React) - Riyadh Bakeries</h1>
                </header>
                <div id="map-container">
                <div id="map" role="application">
                </div>
            </div>
            </div>
        );
    }
}

function createMapLink(url) {
    let tag = window.document.getElementsByTagName('script')[0];
    let script = window.document.createElement('script');

    script.src = url;
    script.async = true;
    script.onerror = function () {
        document.write("Error loading Google Maps.");
    };
    tag.parentNode.insertBefore(script, tag);
}

export default App;
