import * as React from 'react';
import styles from './Weather.module.scss';
import { escape } from '@microsoft/sp-lodash-subset';

import { Placeholder } from "@pnp/spfx-controls-react/lib/Placeholder";
import {
  Spinner,
  SpinnerSize
} from 'office-ui-fabric-react/lib/Spinner';
import { HttpClientResponse, HttpClient } from '@microsoft/sp-http';
import {
  IWeatherState,
  IWeatherData,
  IWeatherProps,
  IWeatherCondition,
  IWeatherLocation,
  IWeatherDescription,
  IWeatherDetails
} from '.';
import * as strings from 'WeatherWebPartStrings';
var Cities = new Array();
var weatherArray = new Array();



export default class Weather extends React.Component < IWeatherProps, IWeatherState > {
  constructor() {
  super();

  this.state = {
    loading: false,
    citiesArr: [],
    Location: '',
    Temp:''
  };
}

/**
 * Loads weather information for the specified location from a third party API
 * @param location Location for which to load weather information
 * @param unit Unit to display the current temperature.
 * @param apikey API key to authenticate the API call
 */
private _loadWeatherInfo(location: string, unit: string, apikey: string): void {
  weatherArray.splice(0,weatherArray.length);
  Cities.splice(0,Cities.length);
  // notify the user that the component will load its data
  this.setState({
    loading: true
  });
  let alldata: IWeatherData;
  let coord: IWeatherLocation;
  let weather: IWeatherDescription;
  let main: IWeatherCondition;
  let timezone: number;
  let name: string;
  let icon: string;
  let temp: any;
  let cities: IWeatherDetails;



  // retrieve weather information from the OpenWeatherMap weather API
  this.props.httpClient
    .get(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apikey}`,
     HttpClient.configurations.v1)
    .then((response: HttpClientResponse): Promise<IWeatherData> => {
      return response.json();
    })
    .then((data: IWeatherData): void => {
      if (data) {
        alldata = data;
        coord = data.city.coord;
        temp =  data.list[0].main.temp;
        main = data.list[0].main;
        timezone = data.list[0].main.timezone;
        name = data.city.name;
        icon = data.list[0].weather[0].icon
        
        weatherArray.push({
          Location: name,
          Temp: (temp - 273.16)
        });
      
        this.setState({
          loading: false,
          Location: name,
          Temp: temp,
          coord: coord,
          weather: temp,
          main: main,
          timezone: timezone,
          name: name
        });
      }
      else {
        // No weather information for the specified location has been found.
        // Notify the user that loading the data is finished.
        this.setState({
          loading: false,
          coord: null,
          weather: null,
          main: null,
          timezone: null,
          name: null
        });
        // Return an error message stating that no weather information has been found
        this.props.errorHandler(`${strings.NoWeatherInformationFoundMessage}${location}`);
      }
    }, (error: any): void => {
      // An error has occurred when calling the weather API.
      // Notify the user that loading the data is finished
      this.setState({
        loading: false,
        coord: null,
        weather: null,
        main: null,
        timezone: null,
        name: null,
        icon: null
      });
      // Return the error message
      this.props.errorHandler(error);
    })
    .catch((error: any): void => {
      // An exception has occurred when calling the weather API.
      // Notify the user that loading the data is finished
      this.setState({
        loading: false,
        coord: null,
        weather: null,
        main: null,
        timezone: null,
        name: null,
        icon: null
      });
      // Return the exception message
      this.props.errorHandler(error);
    });
}

public componentDidMount(): void {
  // weatherArray.splice(0,weatherArray.length);
  // Cities.splice(0,Cities.length);
  if (!this.props.needsConfiguration && this.props.collectionData ) {
    // The web part has been configured. Load the weather information
    // for the specified location.
    //this._loadWeatherInfo(this.props.location, this.props.unit, this.props.apikey);
    this.props.collectionData.map((val) => {  
      // this.setState({
      //   cityNames:val.Location
      // })
      
      Cities.push({
        Location: val.Location
      })
      this._loadWeatherInfo(val.Location, this.props.unit, this.props.apikey);
    })  
  }
  
}

public componentWillReceiveProps(nextProps: IWeatherProps): void {
  // If the location or the temperature unit have changed,
  // refresh the weather information
  if (nextProps.location && nextProps.unit) {
    // Cities.map((city) => {
      this._loadWeatherInfo(nextProps.location, nextProps.unit, nextProps.apikey);
    // })
    
  }
}

public render(): React.ReactElement<IWeatherProps> {
  let contents: JSX.Element;
  // Check if the web part has been configured. Also check,
  // if the weather information has been initiated. This is
  // necessary, because the first time the component renders,
  // it's not loading its data but there is also no weather
  // information available yet
  if (this.props.needsConfiguration === false && this.state.weather) {
    if (this.state.loading) {
      // Component is loading its data. Show spinner to communicate this to the user
      contents = <Spinner size={SpinnerSize.large} label={strings.LoadingSpinnerLabel} />;
    }
    else {

      // render the retrieved weather information
      const alldata: IWeatherData = this.state.alldata;
      const weather: IWeatherDescription = this.state.weather;
      const location: IWeatherLocation = this.state.coord;
      const main: IWeatherCondition = this.state.main;
      const name: string = this.state.name;
      const icon: string = this.state.icon
      const image: any = 'http://openweathermap.org/img/w/' + icon + '.png';

      const tempUnit: string = this.props.unit.toUpperCase();
      let tempValue: number = 0;

      // Convert temperature to selected unit scale
      if(tempUnit === 'C') {
        tempValue = main.temp - 273.16;
      }
      else {
        tempValue = (main.temp * 1.8) - 459.67;
      }

      contents = (
        <div className={styles.weather + " row"}>
          {weatherArray.map((city)=>{
            return (
            <div className={styles.temp + " col-4"}>
                {/* <img src={image} /> */}
                {Math.round(city.Temp)}&deg;{tempUnit}
                <div className={styles.location}>{city.Location}</div>
                </div>  
            )
          })}
        </div>
      );
    }
  }

  //API Key: 4f682f8bf62bc935dc824dd407d7ef0f
  return (
    <div className={styles.weatherInformation}>
      <h3 className={styles.h3title}>Weather</h3>
      {this.props.needsConfiguration &&
        // The web part hasn't been configured yet.
        // Show a placeholder to have the user configure the web part
        <Placeholder
          iconName='Edit'
          iconText={strings.PlaceholderIconText}
          description={strings.PropertyPaneDescription}
          buttonLabel={strings.PlaceholderButtonLabel}
          onConfigure={this.props.configureHandler} />
      }
      {contents}
    </div>
  );
}
}
