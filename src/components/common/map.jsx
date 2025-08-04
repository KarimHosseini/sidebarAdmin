import {
  Autocomplete,
  Button,
  CircularProgress,
  TextField,
} from "@mui/material";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  Fragment,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import Map, {
  FullscreenControl,
  GeolocateControl,
  Marker,
  NavigationControl,
  ScaleControl,
} from "react-map-gl";
import { useSelector } from "react-redux";

const TOKEN = process.env.REACT_APP_MAP_TOKEN || "";

const MapInput = ({
  FindAuto = false,
  onLocationSelect,
  longitude,
  latitude,
  loadingMap,
}) => {
  const [viewState, setViewState] = useState({
    longitude: 51.375433528216654,
    latitude: 35.73356434056531,
    zoom: 11,
  });
  const [value, setValue] = useState();
  const width = 550;
  const { companyInfo } = useSelector((state) => state.relationals);

  const [open, setOpen] = useState(false);
  const [lastAddress, setLastAddress] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const mapRef = null;
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  useLayoutEffect(() => {
    if (longitude && latitude) {
      setViewState((prevState) => ({
        ...prevState,
        longitude: longitude,
        latitude: latitude,
      }));
    }
  }, [longitude, latitude]);

  const handleMarkerDragEnd = useCallback((event) => {
    const newLongitude = event.lngLat.lng;
    const newLatitude = event.lngLat.lat;

    setViewState((prevState) => ({
      ...prevState,
      longitude: newLongitude,
      latitude: newLatitude,
    }));
    // Fetch the new address based on the new marker position
    fetchAddress(newLongitude, newLatitude);
  }, []);

  const handleMapMove = useCallback((event) => {
    setViewState((prevState) => ({
      ...prevState,
      longitude: event.viewState.longitude,
      latitude: event.viewState.latitude,
      zoom: event.viewState.zoom,
    }));
  }, []);
  const handleSeach = () => {
    fetchAddress(viewState.longitude, viewState.latitude);
  };
  const fetchAddress = async (longitude, latitude) => {
    var url = `https://map.ir/reverse/no?lat=${viewState.latitude}&lon=${viewState.longitude}`;
    fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": TOKEN,
      },
    })
      .then((response) => response.json())
      .then((data) => setLastAddress(data));
  };
  const search = (params) => {
    return fetch(`https://map.ir/search/v2/`, {
      method: "POST",
      headers: {
        "x-api-key": TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });
  };
  useEffect(() => {
    if (searchQuery.length > 1) {
      setLoading(true);
      const params = {};
      const options = { text: searchQuery };
      for (let key in options) {
        if (options[key] !== null && options[key] !== "") {
          params[key] = options[key];
        }
      }
      search(params)
        .then((data) => data.json())
        .then((data) => {
          setLoading(false);
          if (data["odata.count"] > 0) {
            setResults(data.value);
          } else {
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
          setViewState((prevState) => ({
            ...prevState,
            latitude,
            longitude,
            zoom: 13,
          }));

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
  if (!companyInfo.showMapInFront) {
    return <></>;
  }
  return (
    <div className="flex flex-col justify-center items-center">
      <Autocomplete
        id="asynchronous-demo"
        className="rightLabel customeInput"
        fullWidth
        inputValue={
          searchQuery && searchQuery !== "undefined" ? searchQuery : ""
        }
        value={value && value !== "undefined" ? value : ""}
        onChange={(event, newValue) => {
          if (newValue && newValue !== "undefined") {
            setSearchQuery(newValue.title);
            setViewState((prevState) => ({
              ...prevState,
              longitude: newValue.geom.coordinates[0],
              latitude: newValue.geom.coordinates[1],
            }));
          }
        }}
        getOptionLabel={(option) =>
          `${option.city ? option.city + "، " : ""}${option.title}`
        }
        options={results}
        loading={loading}
        noOptionsText="مورد یافت نشد"
        loadingText="در حال جست و جو ..."
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            onChange={(e) => setSearchQuery(e.target.value)}
            onBlur={() => {
              setOpen(true);
            }}
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
      <div className="flex justify-center  items-center rounded-xl overflow-hidden mt-4">
        <Map
          ref={mapRef}
          {...viewState}
          onMove={handleMapMove}
          onMouseUp={handleSeach}
          style={{ width: width > 510 ? 710 : width - 10, height: 300 }}
          mapStyle="https://map.ir/vector/styles/main/mapir-xyz-style.json"
          transformRequest={(url) => {
            return {
              url,
              headers: {
                "x-api-key": TOKEN,
              },
            };
          }}
        >
          {" "}
          <NavigationControl position="top-left" showCompass={false} />
          <GeolocateControl position="top-left" />
          <FullscreenControl position="top-left" />
          <ScaleControl />
          <Marker
            longitude={viewState.longitude}
            latitude={viewState.latitude}
            draggable
            onDragEnd={handleMarkerDragEnd} // Trigger when marker is dragged
          />
        </Map>
      </div>
      <Button
        className="!w-full !mt-4 max-w-[500px] mx-auto"
        variant="outlined"
        disabled={loadingMap}
        color="primary"
        onClick={() => {
          onLocationSelect({
            address: lastAddress?.address_compact,
            longitude: viewState.longitude,
            latitude: viewState.latitude,
          });
        }}
      >
        {loadingMap ? <CircularProgress /> : "  ثبت موقعیت"}
      </Button>
    </div>
  );
};
export default MapInput;
