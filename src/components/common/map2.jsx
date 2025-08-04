import {
    Autocomplete,
    Button,
    CircularProgress,
    TextField,
} from "@mui/material";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
    Fragment,
    useCallback,
    useEffect,
    useLayoutEffect,
    useState,
} from "react";
import { MapContainer, Marker, Popup, TileLayer, useMapEvent } from "react-leaflet";
import { useSelector } from "react-redux";
  
  import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIconShadow from "leaflet/dist/images/marker-shadow.png";
  
  const DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerIconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
  
  L.Marker.prototype.options.icon = DefaultIcon;
  
  const MapInput = ({
    FindAuto = false,
    onLocationSelect,
    longitude,
    latitude,
    loadingMap,
  }) => {
    const [position, setPosition] = useState([
      35.73356434056531, 51.375433528216654,
    ]);
    const [value, setValue] = useState();
    const width = 550;
    const { companyInfo } = useSelector((state) => state.relationals);
  
    const [open, setOpen] = useState(false);
    const [lastAddress, setLastAddress] = useState({});
    const [searchQuery, setSearchQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
  
    useLayoutEffect(() => {
      if (longitude && latitude) {
        setPosition([latitude, longitude]);
      }
    }, [longitude, latitude]);
  
    const handleMarkerDragEnd = useCallback((event) => {
      const newLatLng = event.target.getLatLng();
      setPosition([newLatLng.lat, newLatLng.lng]);
      fetchAddress(newLatLng.lng, newLatLng.lat);
    }, []);
  
    const fetchAddress = async (longitude, latitude) => {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
      fetch(url)
        .then((response) => response.json())
        .then((data) => setLastAddress(data));
    };
  
    const search = (params) => {
      return fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${params.text}`
      );
    };
  
    useEffect(() => {
      if (searchQuery.length > 1) {
        setLoading(true);
        const params = { text: searchQuery };
        search(params)
          .then((response) => response.json())
          .then((data) => {
            setLoading(false);
            if (data.length > 0) {
              setResults(data);
            }
          });
      } else if (searchQuery.length === 0) {
        setResults([]);
      }
    }, [searchQuery]);
  
    useEffect(() => {
      if (FindAuto) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setPosition([latitude, longitude]);
            fetchAddress(longitude, latitude);
          },
          (error) => {
            console.error("Error fetching geolocation:", error);
          }
        );
      }
    }, [FindAuto]);
  
    function clearSearch() {
      setResults([]);
      setSearchQuery("");
    }
  
    // Component to handle map movement events
    const MapEvents = () => {
      useMapEvent("moveend", () => {
        const mapCenter = map.getCenter();
        setPosition([mapCenter.lat, mapCenter.lng]);
        fetchAddress(mapCenter.lng, mapCenter.lat);
      });
  
      return null;
    };
  
    if (!companyInfo.showMapInFront) {
      return <></>;
    }
  
    return (
      <div className="flex flex-col justify-center items-center">
        <Autocomplete
          id="asynchronous-demo"
          className="rightLabel customeInput"
          fullWidth
          inputValue={searchQuery}
          value={value}
          onChange={(event, newValue) => {
            if (newValue) {
              setSearchQuery(newValue.display_name);
              setPosition([newValue.lat, newValue.lon]);
            }
          }}
          getOptionLabel={(option) => option.display_name}
          options={results}
          loading={loading}
          noOptionsText="مورد یافت نشد"
          loadingText="در حال جست و جو ..."
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              onChange={(e) => setSearchQuery(e.target.value)}
              onBlur={() => setOpen(true)}
              variant="standard"
              placeholder="جست و جو ..."
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <Fragment>
                    {loading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </Fragment>
                ),
              }}
            />
          )}
        />
        <div className="flex justify-center items-center rounded-xl overflow-hidden mt-4">
          <MapContainer
            center={position}
            zoom={13}
            scrollWheelZoom={false}
            style={{ height: "400px", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position} draggable={true} eventHandlers={{ dragend: handleMarkerDragEnd }}>
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker>
            <MapEvents />
          </MapContainer>
        </div>
        <Button
          className="!w-full !mt-4 max-w-[500px] mx-auto"
          variant="outlined"
          disabled={loadingMap}
          color="primary"
          onClick={() => {
            onLocationSelect({
              address: lastAddress?.display_name,
              longitude: position[1],
              latitude: position[0],
            });
          }}
        >
          {loadingMap ? <CircularProgress /> : "ثبت موقعیت"}
        </Button>
      </div>
    );
  };
  
  export default MapInput;