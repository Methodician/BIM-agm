export class GmapRadarOverlay extends google.maps.OverlayView {

    public _nw: google.maps.LatLng;
    public _ne: google.maps.LatLng;
    public _se: google.maps.LatLng;
    public _sw: google.maps.LatLng;
    public _bounds: google.maps.LatLngBounds;

    constructor(
        // Initialize all properties.
        private _map: google.maps.Map,
        private _imageSrc: string,
        private _mapUnitInPixels: number, // lat lng for each pixel on the image which is 600w x 550h
        private _topLeftLat: number,
        private _topLeftLng: number,
        private _imgWidth: number,
        private _imgHeight: number,
        public _div?: HTMLDivElement
    ) {
        // for inheritance
        super();

        // Define a property to hold the image's div. We'll
        // actually create this div upon receipt of the onAdd()
        // method so we'll leave it null for now.
        this._div = null;

        // set 4 corners of the image in lat/lng units
        this.setNESW();

        // set the opposing corners for calculating
        this.setBounds();

        // Explicitly call setMap on this overlay.
        // get reference of map pass in
        this.setMap(this._map);

        this.onAdd = () => {
            // create the image div
            const div = document.createElement('div');
            div.style.position = 'absolute';
            div.style.opacity = '.75';

            // Create the img element and attach it to the div.
            const img = document.createElement('img');
            img.src = this._imageSrc;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.position = 'absolute';
            div.appendChild(img);

            this._div = div;

            // add the element to the overlayLayer pane
            const panes = this.getPanes();
            panes.overlayLayer.appendChild(div);
        };

        this.draw = () => {
            // We use the south-west and north-east
            // coordinates of the overlay to peg it to the correct position and size.
            // To do this, we need to retrieve the projection from the overlay.
            const overlayProjection = this.getProjection();

            // Retrieve the south-west and north-east coordinates of this overlay
            // in LatLngs and convert them to pixel coordinates.
            // We'll use these coordinates to resize the div.
            const sw = overlayProjection.fromLatLngToDivPixel(this._bounds.getSouthWest());
            const ne = overlayProjection.fromLatLngToDivPixel(this._bounds.getNorthEast());

            // Resize the image's div to fit the indicated dimensions.
            const div = this._div;
            div.style.left = sw.x + 'px';
            div.style.top = ne.y + 'px';
            div.style.width = (ne.x - sw.x) + 'px';
            div.style.height = (sw.y - ne.y) + 'px';
        };

        this.onRemove = () => {
            this._div.parentNode.removeChild(this._div);
            this._div = null;
        };
    }

    // draw method sets it to match the right projection
    private setBounds() {
        this._bounds = new google.maps.LatLngBounds(this._sw, this._ne);
    }

    // set each corner of the image in lat/lng units based on the amount of pixels in the image
    private setNESW() {
        this._nw = new google.maps.LatLng(this._topLeftLat, this._topLeftLng);
        this._ne = new google.maps.LatLng(this._topLeftLat, this._topLeftLng + (this._mapUnitInPixels * this._imgWidth));
        this._se = new google.maps.LatLng(this._topLeftLat - (this._mapUnitInPixels * this._imgHeight), this._topLeftLng + (this._mapUnitInPixels * this._imgWidth));
        this._sw = new google.maps.LatLng(this._topLeftLat - (this._mapUnitInPixels * this._imgHeight), this._topLeftLng);
    }
}
