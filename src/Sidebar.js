import React, {Component} from 'react';

class Sidebar extends Component {

    constructor() {
        super();

        this.state = {
            info: '',
            markers: [],
            query: ''
        };
    }

    componentDidMount() {
        this.setState({markers: this.props.virtualMarker});
    }

    search = (event) => {
        const query = event.target.value;
        const markers = this.props.virtualMarker;
        const newMarkers = [];

        // Search Function for bakeries names
        markers.forEach(function (marker) {
            if (marker.title.startsWith(query)) {
                // Display only specific  marker
                marker.setVisible(true);
                newMarkers.push(marker);
            } else {
                // Hide only specific  marker
                marker.setVisible(false);
            }
        });

        this.setState({markers: newMarkers});
    }

    // HTML part
    render() {

        return (
            <div>
                <div className="sideBarLines">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <div className="sideBar">
                    <div className="form" role="form">
                        <input type="text"
                               aria-labelledby="filter" placeholder="Search Bakary"
                               className="input" role="search"
                               onChange={this.search}/>
                    </div>
                    <ul>
                        {this.state.markers && this.state.markers.length && this.state.markers.map((marker, i) =>
                            <li key={i}>
                                <a onKeyPress={this.props.openInfo.bind(this, marker)}
                                   onClick={this.props.openInfo.bind(this, marker)}
                                tabIndex="0" role="button">{marker.title}</a>
                            </li>
                        )}

                    </ul>
                </div>
            </div>
        );
    }
}

export default Sidebar;