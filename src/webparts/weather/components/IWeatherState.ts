import { IWeatherLocation, IWeatherDescription, IWeatherCondition } from ".";
import { IWeatherData, IWeatherDetails } from "../../../../lib/webparts/weather/components";

/**
 * State for the weather information component
 */
export interface IWeatherState {
  /**
   * True if the component is loading its data, false otherwise
   */
  loading: boolean;
  citiesArr: any[];
  Location: string;
  Temp: any;
  /**
   * Weather information retrieved from the third party API.
   * Undefined, if no information has been loaded
   */
  // weatherInfo?: IWeatherQueryResults;
  alldata?: IWeatherData;
  coord?: IWeatherLocation;
  weather?: IWeatherDescription;
  main?: IWeatherCondition;
  timezone?: number;
  name?: string;
  icon?: string;
  cityNames?: any[];
}
