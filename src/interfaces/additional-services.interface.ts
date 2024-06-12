export enum AdditionalServicesTypes {
    AMBULANCE="AMBULANCE",
    ADOPT="ADOPT"
}

export interface ICreateAdditionalServiceForm{
    type:AdditionalServicesTypes;
    dateTime:string;
}
