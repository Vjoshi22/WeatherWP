export interface IWeatherData {
    alldata: any[];
    city: any;
    list: any;
    temp:any
    coord: IWeatherLocation;
    weather: [IWeatherDescription];
    main: IWeatherCondition;
    timezone: number;
    name: string;
    icon: string;
}

export interface IWeatherLocation {
    lon: number;
    lat: number;
}

export interface IWeatherDescription {
    main: string;
    description: string;
    icon: string;
}

export interface IWeatherCondition {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;

}
export interface IWeatherDetails{
    Location: string;
    Temp: any;
}